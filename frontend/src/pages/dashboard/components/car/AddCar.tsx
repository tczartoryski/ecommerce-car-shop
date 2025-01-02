import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import { InputAdornment, Stack, Typography } from '@mui/material';
import { MakeDropdown } from './MakeDropdown';
import { ModelDropdown } from './ModelDropdown';
import { ColorDropdown } from './ColorDropdown';
import { request } from '../../../../hooks/authentication/authentication';
import useCityByZipcode from '../../../../hooks/getCityByZipcode';

interface AddCarProps {
 open: boolean;
 handleClose: () => void;
 onSuccess: () => void;
}

export default function AddCar({ open, handleClose, onSuccess }: AddCarProps) {
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

    const handleYearChange = (value: any) => {
      const parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue)) {
        setYear('');
      } else if (parsedValue < 1970 || parsedValue > 2025) {
        setYear(value);
      } else {
        setYear(value);
      }
     };
     React.useEffect(() => {
      if (zipcode.length === 5) {
        const fetchCity = async () => {
          await getCityByZipcode(zipcode);
          setCity(location);
          console.log("New location is: ", location);
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
      if (!make || !model || !year || !color || !mileage || !price || !zipcode  || images.length === 0) {
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
      images.forEach((image, index) => {
        formData.append('image_files', image); // Correct field name
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
    }
       };

 return (
   <Dialog
     open={open}
     onClose={() => {resetFormFields(); handleClose();}}
     PaperProps={{
       component: 'form',
       onSubmit: handleSubmit,
       sx: { backgroundImage: 'none' },
     }}
   >
     <DialogTitle>Create A Car Listing</DialogTitle>
    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%' }}>
      {error && <Typography color="error">{error}</Typography>}
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
        <MakeDropdown make={make} setMake={setMake} />
        <ModelDropdown make={make} model={model} setModel={setModel} />
      </Stack>

      <Stack direction="row" spacing={2} sx={{ gap: 2, alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <Stack direction="column" sx={{ width: 150, alignItems: 'flex-start' }}>
          <Typography variant="body1">Year</Typography>
          <OutlinedInput
            required
            margin="dense"
            id="year"
            name="year"
            label="Year"
            placeholder="Enter the year"
            type="number"
            sx={{ height: '40px' }}
            value={year}
            onChange={(e) => handleYearChange(e.target.value)}
          />
        </Stack>
        <ColorDropdown color={color} setColor={setColor} />
      </Stack>
      <Typography variant="body1">Description</Typography>
      <OutlinedInput
        margin="dense"
        id="description"
        name="description"
        label="Description"
        placeholder="Enter the description"
        multiline
        rows={4}
        fullWidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
        <Stack direction="column" spacing={1} sx={{ width: 150, alignItems: 'flex-start' }}>
          <Typography variant="body1">Mileage</Typography>
          <OutlinedInput
            required
            margin="dense"
            id="mileage"
            name="mileage"
            placeholder="Enter the mileage"
            type="text"
            value={mileage}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              setMileage(value.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
            }}
          />
        </Stack>
        <Stack direction="column" spacing={1} sx={{ width: 150, alignItems: 'flex-start' }}>
          <Typography variant="body1">Price</Typography>
          <OutlinedInput
            required
            margin="dense"
            id="price"
            name="price"
            placeholder="Enter the price"
            type="text"
            value={price}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              setPrice(value.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
            }}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
          />
        </Stack>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ width: '100%', alignItems: 'center' }}>
        <Stack direction="column">
        <Typography variant="body1">Zipcode</Typography>
        <OutlinedInput
          required
          margin="dense"
          id="zipcode"
          name="zipcode"
          placeholder="Enter the zipcode"
          type="text"
          value={zipcode}
          sx={{ width: 150 }}
          onChange={async (e) => {
            const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 5);
            setZipcode(value);
            console.log("This is the value: ", value);
          }}
        />
        </Stack>
        {city && (
          <Typography variant="body2" color="textSecondary" paddingTop="30px">
            Location: {city}
          </Typography>
        )}
      </Stack>

      <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          component="label"
          sx={{ flex: 1 }}
        >
          Add Image
          <input
        type="file"
        hidden
        multiple
        onChange={(e) => {
          setImages([...images, ...Array.from(e.target.files || [])]);
          setSelectedImageIndex(0); // Reset the selected image index when new images are uploaded
        }}
          />
        </Button>
        <Button
          sx={{ flex: 1 }}
          onClick={() => {
        const newImages = [...images];
        newImages.splice(selectedImageIndex, 1);
        setImages(newImages);
        setSelectedImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
          }}
        >
          Remove Image
        </Button>
      </Stack>
      {images.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '400px', height: '240px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
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
       <Button variant="contained" type="submit">
         Create Listing
       </Button>
     </DialogActions>
   </Dialog>
 );
}
