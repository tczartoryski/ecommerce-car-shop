import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  CircularProgress,
} from '@mui/material';
import { request } from '../../hooks/authentication/authUtils';
import useCityByZipcode from '../../hooks/getCityByZipcode';
import CarForm from './CarForm';

interface AddCarProps {
  open: boolean;
  handleClose: () => void;
  onSuccess: () => void;
}

const AddCar: React.FC<AddCarProps> = ({ open, handleClose, onSuccess }) => {
  const [make, setMake] = React.useState('');
  const [model, setModel] = React.useState('');
  const [year, setYear] = React.useState('');
  const [color, setColor] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [mileage, setMileage] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [images, setImages] = React.useState<File[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [zipcode, setZipcode] = React.useState('');
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

  const resetFormFields = () => {
    setMake('');
    setModel('');
    setYear('');
    setColor('');
    setDescription('');
    setMileage('');
    setPrice('');
    setZipcode('');
    setCity('');
    setImages([]);
  };

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
      images.length === 0
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
    images.forEach((image) => {
      formData.append('image_files', image);
    });

    try {
      const response = await request('api/car/create/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create car listing');
      }

      resetFormFields();
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to create car listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        resetFormFields();
        handleClose();
      }}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
        sx: { backgroundImage: 'none' },
      }}
    >
      <DialogTitle>Create A Car Listing</DialogTitle>
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
            <input
              type="file"
              hidden
              multiple
              onChange={(e) => {
                setImages([...images, ...Array.from(e.target.files || [])]);
                setSelectedImageIndex(0);
              }}
            />
          </Button>
          <Button
            sx={{ flex: 1 }}
            onClick={() => {
              const newImages = [...images];
              newImages.splice(selectedImageIndex, 1);
              setImages(newImages);
              setSelectedImageIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : 0
              );
            }}
          >
            Remove Image
          </Button>
        </Stack>
        {images.length > 0 && (
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
                src={URL.createObjectURL(images[selectedImageIndex])}
                alt="Selected Car Image"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <Button
                disabled={selectedImageIndex === 0}
                onClick={() => setSelectedImageIndex(selectedImageIndex - 1)}
              >
                Previous
              </Button>
              <Button
                disabled={selectedImageIndex === images.length - 1}
                onClick={() => setSelectedImageIndex(selectedImageIndex + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </DialogContent>

      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Create Listing'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCar;
