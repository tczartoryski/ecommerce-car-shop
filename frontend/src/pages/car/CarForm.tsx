import * as React from 'react';
import {
  Typography,
  Stack,
  InputAdornment,
  OutlinedInput,
} from '@mui/material';
import MakeDropdown from './MakeDropdown';
import ModelDropdown from './ModelDropdown';
import ColorDropdown from './ColorDropdown';

interface CarFormProps {
  make: string;
  setMake: (make: string) => void;
  model: string;
  setModel: (model: string) => void;
  year: string;
  setYear: (year: string) => void;
  color: string;
  setColor: (color: string) => void;
  description: string;
  setDescription: (description: string) => void;
  mileage: string;
  setMileage: (mileage: string) => void;
  price: string;
  setPrice: (price: string) => void;
  zipcode: string;
  setZipcode: (zipcode: string) => void;
  city: string;
  error: string | null;
}

const CarForm: React.FC<CarFormProps> = ({
  make,
  setMake,
  model,
  setModel,
  year,
  setYear,
  color,
  setColor,
  description,
  setDescription,
  mileage,
  setMileage,
  price,
  setPrice,
  zipcode,
  setZipcode,
  city,
  error,
}) => {
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
  return (
    <>
      {error && <Typography color="error">{error}</Typography>}
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: 'space-between' }}
      >
        <MakeDropdown make={make} setMake={setMake} />
        <ModelDropdown make={make} model={model} setModel={setModel} />
      </Stack>

      <Stack
        direction="row"
        spacing={2}
        sx={{ gap: 2, alignItems: 'flex-end', justifyContent: 'space-between' }}
      >
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
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: 'space-between' }}
      >
        <Stack
          direction="column"
          spacing={1}
          sx={{ width: 150, alignItems: 'flex-start' }}
        >
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
        <Stack
          direction="column"
          spacing={1}
          sx={{ width: 150, alignItems: 'flex-start' }}
        >
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
      <Stack
        direction="row"
        spacing={1}
        sx={{ width: '100%', alignItems: 'center' }}
      >
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
            }}
          />
        </Stack>
        {city && (
          <Typography variant="body2" color="textSecondary" paddingTop="30px">
            Location: {city}
          </Typography>
        )}
      </Stack>
    </>
  );
};

export default CarForm;
