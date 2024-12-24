import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CarCard from '../car/CarCard';
import { Button, Card, Divider, Stack } from '@mui/material';
import { Car } from '../car/MyCars';
import { request } from '../../../../hooks/authentication/authentication';
import Search from '../Search';


export default function Market() {
  const [cars, setCars] = React.useState<Car[]>([]); // Use the Car type for the state


  React.useEffect(() => {
    const fetchCars = async () => {
      console.log('fetching cars');
      try {
        const response = await request('api/my-cars/', {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch cars');
        }
        const data: Car[] = await response.json(); // Use the Car type for the response data
        setCars(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };
    fetchCars();
  }, []);
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
     <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" mb={4} mt={2} >
       <Typography component="h2" variant="h6">
         Market
       </Typography>
        <Search />
     </Stack>
      <Grid
        container
        spacing={2}
        columns={16}
        sx={{ mb: '30px' }}
      >
       {cars.map((car) => (
          <Grid item xs={16} sm={8} lg={4} key={car.id}>
            <CarCard car={car} /> {/* Pass the car prop */}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
