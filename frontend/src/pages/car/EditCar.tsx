import * as React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import { request } from '../../hooks/authentication/authUtils';
import useCityByZipcode from '../../hooks/getCityByZipcode';
import CarForm from './CarForm';
import { Car, CarImage } from './types';

interface EditCarProps {
  car: Car;
  open: boolean;
  onSuccess: () => void;
  handleClose: () => void;
}

const EditCar: React.FC<EditCarProps> = ({
  open,
  handleClose,
  car,
  onSuccess,
}) => {
  const [make, setMake] = React.useState(car.make);
  const [model, setModel] = React.useState(car.model);
  const [year, setYear] = React.useState(car.year);
  const [color, setColor] = React.useState(car.color);
  const [description, setDescription] = React.useState(car.description);
  const [mileage, setMileage] = React.useState(
    car.mileage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  );
  const [price, setPrice] = React.useState(
    car.price.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  );
  const [existingImages, setExistingImages] = React.useState<string[]>(
    car.images.map((img: CarImage) => img.image_url)
  );
  const [newImages, setNewImages] = React.useState<File[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [zipcode, setZipcode] = React.useState(car.zipcode);
  const { location, getCityByZipcode } = useCityByZipcode();
  const [error, setError] = React.useState('');
  const [city, setCity] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (zipcode.length === 5) {
      const fetchCity = async () => {
        await getCityByZipcode(zipcode);
        setCity(location);
      };
      fetchCity();
    } else {
      setCity('');
    }
  }, [zipcode, location]);

  const handleAddImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newImagesArray = Array.from(event.target.files);
      setNewImages((prevImages) => [...prevImages, ...newImagesArray]);
    }
  };

  const handleRemoveImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingImages((prevImages) =>
        prevImages.filter((_, i) => i !== index)
      );
    } else {
      setNewImages((prevImages) => prevImages.filter((_, i) => i !== index));
    }
  };
  const handleNextImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex + 1) % (existingImages.length + newImages.length)
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + existingImages.length + newImages.length) %
        (existingImages.length + newImages.length)
    );
  };

  const handleDelete = () => {
    request(`api/car/${car.id}/`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        handleClose();
        onSuccess();
      })
      .catch((error) => {
        console.error('Error deleting car:', error);
        setError('Error deleting');
      });
  };

  const combinedImages = [...existingImages, ...newImages];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    if (
      !make ||
      !model ||
      !year ||
      !color ||
      !mileage ||
      !price ||
      !zipcode ||
      (existingImages.length === 0 && newImages.length === 0)
    ) {
      setError('Please fill in all fields and upload at least one image.');
      return;
    }
    const mileageInt = parseInt(mileage.replace(/,/g, ''), 10);
    const priceFloat = parseFloat(price.replace(/,/g, ''));
    const formData = new FormData();
    formData.append('make', make);
    formData.append('model', model);
    formData.append('year', year);
    formData.append('color', color);
    formData.append('description', description);
    formData.append('mileage', mileageInt.toString());
    formData.append('price', priceFloat.toString());
    formData.append('zipcode', zipcode);

    existingImages.forEach((image) => {
      formData.append(`existing_images`, image);
    });

    newImages.forEach((image) => {
      formData.append('image_files', image);
    });

    try {
      const response = await request(`api/car/${car.id}/update/`, {
        method: 'PATCH',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      handleClose();
      onSuccess();
    } catch (error) {
      console.error('Error updating car:', error);
      setError('Error updating car');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
        sx: { backgroundImage: 'none' },
      }}
    >
      <DialogTitle>Edit Car Listing</DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          width: '100%',
        }}
      >
        <CarForm
          make={make}
          setMake={setMake}
          model={model}
          setModel={setModel}
          year={year}
          setYear={setYear}
          color={color}
          setColor={setColor}
          description={description}
          setDescription={setDescription}
          mileage={mileage}
          setMileage={setMileage}
          price={price}
          setPrice={setPrice}
          zipcode={zipcode}
          setZipcode={setZipcode}
          city={city}
          error={error}
        />

        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Button component="label" sx={{ flex: 1 }}>
            Add Image
            <input type="file" hidden multiple onChange={handleAddImage} />
          </Button>
          <Button
            sx={{ flex: 1 }}
            onClick={() =>
              handleRemoveImage(
                currentImageIndex,
                currentImageIndex < existingImages.length
              )
            }
          >
            Remove Image
          </Button>
        </Stack>
        {combinedImages.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '400px',
                height: '240px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              <img
                src={
                  typeof combinedImages[currentImageIndex] === 'string'
                    ? (combinedImages[currentImageIndex] as string)
                    : URL.createObjectURL(
                        combinedImages[currentImageIndex] as File
                      )
                }
                alt="Selected Car Image"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <Button
                disabled={currentImageIndex === 0}
                onClick={handlePrevImage}
              >
                Previous
              </Button>
              <Button
                disabled={currentImageIndex === combinedImages.length - 1}
                onClick={handleNextImage}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </DialogContent>

      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ width: '100%' }}
        >
          <Button variant="contained" onClick={handleDelete}>
            Delete
          </Button>
          <Box>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Edit Car'}
            </Button>
          </Box>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default EditCar;
