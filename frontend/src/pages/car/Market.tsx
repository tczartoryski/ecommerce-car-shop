import * as React from 'react';
import CarCard from './CarCard';
import ShowCar from './ShowCar';
import useFetchCars from '../../hooks/cars/useFetchCars';
import { Typography, Box, Stack, Grid } from '@mui/material';
import { Car } from './types';

const Market: React.FC = () => {
  const { cars: marketCars } = useFetchCars('api/market-cars/');
  const [open, setOpen] = React.useState(false);
  const [displayedCar, setDisplayedCar] = React.useState<Car | undefined>(
    undefined
  );

  const handleCarClick = (car: Car) => {
    setDisplayedCar(car);
    setOpen(true);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {displayedCar && (
        <ShowCar
          car={displayedCar}
          open={open}
          handleClose={() => {
            setOpen(false);
            setDisplayedCar(undefined);
          }}
        />
      )}
      {/* cards */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        justifyContent="space-between"
        mb={4}
        mt={2}
      >
        <Typography component="h2" variant="h6">
          Market
        </Typography>
      </Stack>
      <Grid container spacing={2} columns={16} sx={{ mb: '30px' }}>
        {marketCars.map((car) => (
          <Grid item xs={16} sm={8} lg={4} key={car.id}>
            <CarCard car={car} onClick={handleCarClick} />{' '}
            {/* Pass the car prop */}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Market;
