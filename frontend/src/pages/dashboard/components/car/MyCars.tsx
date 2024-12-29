import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CarCard from './CarCard';
import { Button, Stack } from '@mui/material';
import AddCar from './AddCar';
import { request } from '../../../../hooks/authentication/authentication';
import EditCar from './EditCar';


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
    const [addOpen, setAddOpen] = React.useState(false);
    const [editOpen, setEditOpen] = React.useState(false);
    const [cars, setCars] = React.useState<Car[]>([]);
    const [editCar, setEditCar] = React.useState<Car | undefined>(undefined);
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
    React.useEffect(() => {
      fetchCars();
    }, []);


      const handleCarClick = (car: Car) => {
        setEditCar(car);
        setEditOpen(true);
        // Handle the car click event here
      };

      const handleSuccess = () => {
        fetchCars();
        setAddOpen(false);
        setEditOpen(false);

        setEditCar(undefined);
      };


  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        {editCar && <EditCar car={editCar} open={editOpen} handleClose={() => {
          setEditOpen(false)
           setEditCar(undefined)}}
           onSuccess={handleSuccess}
            />}
        {addOpen && <AddCar onSuccess={handleSuccess} open={addOpen} handleClose={() => {setAddOpen(false)}} />}
      {/* cards */}
     <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" mb={4} mt={2} >
       <Typography component="h2" variant="h6">
         My Cars
       </Typography>
       <Button variant="contained" onClick={() => setAddOpen(true)}>List A Car</Button>
     </Stack>
      <Grid
        container
        spacing={2}
        columns={16}
        sx={{ mb: '30px' }}
      >
       
       {cars.map((car) => (
          <Grid item xs={16} sm={8} lg={4} key={car.id}>
            <CarCard car={car} onClick={handleCarClick} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
