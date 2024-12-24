import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CarCard from '../car/CarCard';
import { Button, Card, Divider, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MessageCard from '../messages/MessageCard';
import { Car } from '../car/MyCars';
import { request } from '../../../../hooks/authentication/authentication';


export default function MainGrid() {
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
  const navigate = useNavigate();
  const handleSeeAllClick = (route: string) => {
    navigate(route);
  };
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" mb={4} mt={2} >
       <Typography component="h2" variant="h6">
         Market
       </Typography>
       <Button variant="contained" onClick={() => handleSeeAllClick('/my-cars')} >See All</Button>
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
      <Divider sx={{marginBottom: '15px'}}/>
      <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" mb={4} mt={2} >
       <Typography component="h2" variant="h6">
         My Cars
       </Typography>
       <Button variant="contained" onClick={() => handleSeeAllClick('/my-cars')}>See All</Button>
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
      <Divider sx={{marginBottom: '15px'}}/>
      <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" mb={4} mt={2} >
       <Typography component="h2" variant="h6" onClick={() => handleSeeAllClick('/inbox')}>
         Messages
       </Typography>
       <Button variant="contained" onClick={() => handleSeeAllClick('/inbox')}>See All</Button>
     </Stack>
      <Grid
        container
        spacing={2}
        columns={16}
      >
       
          <Grid item xs={16} sm={8} lg={4}>
            <MessageCard ></MessageCard>
          </Grid>
          <Grid item xs={16} sm={8} lg={4}>
            <MessageCard ></MessageCard>
          </Grid>
          <Grid item xs={16} sm={8} lg={4}>
            <MessageCard ></MessageCard>
          </Grid>
          <Grid item xs={16} sm={8} lg={4}>
            <MessageCard ></MessageCard>
          </Grid>
      </Grid>
      
    </Box>
  );
}
