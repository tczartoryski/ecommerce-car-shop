import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CarCard from './CarCard';
import { Button, Stack } from '@mui/material';
import AddCar from './AddCar';
import { request } from '../../../../hooks/authentication/authentication';


export interface CarImage {
  image_url: string;
}

export interface Car {
  id: number;
  make: string;
  model: string;
  year: string;
  color: string;
  description: string;
  mileage: number;
  price: string;
  zipcode: string;
  images: CarImage[];
}

export default function MyCars() {
    const [open, setOpen] = React.useState(false);
    const [cars, setCars] = React.useState<Car[]>([]);
    React.useEffect(() => {
      const fetchCars = async () => {
        try {
          const response = await request('api/my-cars/', {
            method: 'GET',
          });
          if (!response.ok) {
            throw new Error('Failed to fetch cars');
          }
          const data: Car[] = await response.json();
          setCars(data);
        } catch (error) {
          console.error('Error fetching cars:', error);
        }
      };
  
      fetchCars();
    }, []);


    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <AddCar open={open} handleClose={handleClose} />
      {/* cards */}
     <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" mb={4} mt={2} >
       <Typography component="h2" variant="h6">
         My Cars
       </Typography>
       <Button variant="contained" onClick={() => {handleClickOpen()}}>List A Car</Button>
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
