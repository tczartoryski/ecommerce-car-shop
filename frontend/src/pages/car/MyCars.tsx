import * as React from 'react';
import CarCard from './CarCard';
import AddCar from './AddCar';
import EditCar from './EditCar';
import useFetchCars from '../../hooks/cars/useFetchCars';
import { Typography, Button, Grid, Box, Stack } from '@mui/material';
import { Car } from './types';



const MyCars: React.FC = () => {
    const [addOpen, setAddOpen] = React.useState(false);
    const { cars: myCars, refetch: fetchMyCars } = useFetchCars('api/my-cars/');
    const [editOpen, setEditOpen] = React.useState(false);
    const [editCar, setEditCar] = React.useState<Car | undefined>(undefined);


      const handleCarClick = (car: Car) => {
        setEditCar(car);
        setEditOpen(true);
      };

      const handleSuccess = () => {
        fetchMyCars();
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
       
       {myCars.map((car) => (
          <Grid item xs={16} sm={8} lg={4} key={car.id}>
            <CarCard car={car} onClick={handleCarClick} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MyCars;
