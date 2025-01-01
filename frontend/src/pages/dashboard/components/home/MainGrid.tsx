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
import ShowCar from '../car/ShowCar';
import EditCar from '../car/EditCar';


export default function MainGrid() {
  const [myCars, setMyCars] = React.useState<Car[]>([]);
  const [marketCars, setMarketCars] = React.useState<Car[]>([]);
  const [displayedMarketCar, setDisplayedMarketCar] = React.useState<Car | undefined>(undefined);
  const [displayedMyCar, setDisplayedMyCar] = React.useState<Car | undefined>(undefined);
  const [openShow, setOpenShow] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const fetchMyCars = async () => {
    try {
      const response = await request('api/my-cars/', {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch cars');
      }
      const data: Car[] = await response.json();
      setMyCars(data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };
      React.useEffect(() => {
       
        const fetchMarketCars = async () => {
          try {
            const response = await request('api/market-cars/', {
              method: 'GET',
            });
            if (!response.ok) {
              throw new Error('Failed to fetch cars');
            }
            const data: Car[] = await response.json();
            setMarketCars(data);
          } catch (error) {
            console.error('Error fetching cars:', error);
          }
        };
    
        fetchMyCars();
        fetchMarketCars();
      }, []);
  const navigate = useNavigate();
  const handleSeeAllClick = (route: string) => {
    navigate(route);
  };
   const handleMarketCarClick = (car: Car) => {
          setDisplayedMarketCar(car);
          setOpenShow(true);
    };
    const handleMyCarClick = (car: Car) => {
      setDisplayedMyCar(car);
      setOpenEdit(true);
    };
    const handleShowClose = () => {
      setDisplayedMarketCar(undefined);
      setOpenShow(false);
    }
    const handleEditClose = () => {
      setDisplayedMyCar(undefined);
      setOpenEdit(false);
    }
    const handleSuccess = () => {
      fetchMyCars();
      setOpenEdit(false);
      setDisplayedMyCar(undefined);
    };
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        {displayedMarketCar && <ShowCar car={displayedMarketCar} open={openShow} handleClose={handleShowClose}/>}
        {displayedMyCar && <EditCar car={displayedMyCar} open={openEdit} handleClose={handleEditClose} onSuccess={handleSuccess}/>}
      {/* cards */}
      <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" mb={4} mt={2} >
       <Typography component="h2" variant="h6">
         Market
       </Typography>
       <Button variant="contained" onClick={() => handleSeeAllClick('/market')} >See All</Button>
     </Stack>
      <Grid
        container
        spacing={2}
        columns={16}
        sx={{ mb: '30px' }}
      >
       {marketCars.map((car) => (
          <Grid item xs={16} sm={8} lg={4} key={car.id}>
            <CarCard car={car} onClick={handleMarketCarClick}/>
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
       
       {myCars.map((car) => (
          <Grid item xs={16} sm={8} lg={4} key={car.id}>
            <CarCard car={car} onClick={handleMyCarClick} /> {/* Pass the car prop */}
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
