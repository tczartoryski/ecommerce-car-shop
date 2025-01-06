import * as React from 'react';
import CarCard from '../car/CarCard';
import { useNavigate } from 'react-router-dom';
import MessageCard from './components/MessageCard';
import ShowCar from '../car/ShowCar';
import EditCar from '../car/EditCar';
import useFetchCars from '../../hooks/cars/useFetchCars';
import { Conversation } from '../message/types';
import useWebSocket from '../../hooks/useWebsocket';
import { Typography, Button, Divider, Box, Stack, Grid } from '@mui/material';
import { Car } from '../car/types';

const MainGrid: React.FC = () => {
  const { cars: myCars, refetch: fetchMyCars } = useFetchCars('api/my-cars/');
  const { cars: marketCars } = useFetchCars('api/market-cars/');
  const [displayedMarketCar, setDisplayedMarketCar] = React.useState<
    Car | undefined
  >(undefined);
  const [displayedMyCar, setDisplayedMyCar] = React.useState<Car | undefined>(
    undefined
  );
  const [openShow, setOpenShow] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const { messages } = useWebSocket(
    'ws://178.156.150.202:8000/ws/conversations/'
  );

  React.useEffect(() => {
    const newConversations = [...conversations];
    messages.forEach((message) => {
      if (message.type === 'initial_conversations') {
        setConversations(message.conversations);
      } else if (message.type === 'conversation_update') {
        const index = newConversations.findIndex(
          (conv) => conv.id === message.conversation.id
        );
        if (index !== -1) {
          newConversations[index] = message.conversation;
        } else {
          newConversations.push(message.conversation);
        }
        setConversations(newConversations);
      }
    });
  }, [messages]);

  const navigate = useNavigate();

  const handleMarketCarClick = (car: Car) => {
    setDisplayedMarketCar(car);
    setOpenShow(true);
  };
  const handleMyCarClick = (car: Car) => {
    setDisplayedMyCar(car);
    setOpenEdit(true);
  };

  const handleSuccess = () => {
    fetchMyCars();
    setOpenEdit(false);
    setDisplayedMyCar(undefined);
  };
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {displayedMarketCar && (
        <ShowCar
          car={displayedMarketCar}
          open={openShow}
          handleClose={() => {
            setDisplayedMarketCar(undefined);
            setOpenShow(false);
          }}
        />
      )}
      {displayedMyCar && (
        <EditCar
          car={displayedMyCar}
          open={openEdit}
          handleClose={() => {
            setDisplayedMyCar(undefined);
            setOpenEdit(false);
          }}
          onSuccess={handleSuccess}
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
        <Button variant="contained" onClick={() => navigate('/market')}>
          See All
        </Button>
      </Stack>
      <Grid container spacing={2} columns={16} sx={{ mb: '30px' }}>
        {marketCars.map((car) => (
          <Grid item xs={16} sm={8} lg={4} key={car.id}>
            <CarCard car={car} onClick={handleMarketCarClick} />
          </Grid>
        ))}
      </Grid>
      <Divider sx={{ marginBottom: '15px' }} />
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        justifyContent="space-between"
        mb={4}
        mt={2}
      >
        <Typography component="h2" variant="h6">
          My Cars
        </Typography>
        <Button variant="contained" onClick={() => navigate('/my-cars')}>
          See All
        </Button>
      </Stack>
      <Grid container spacing={2} columns={16} sx={{ mb: '30px' }}>
        {myCars.map((car) => (
          <Grid item xs={16} sm={8} lg={4} key={car.id}>
            <CarCard car={car} onClick={handleMyCarClick} />{' '}
            {/* Pass the car prop */}
          </Grid>
        ))}
      </Grid>
      <Divider sx={{ marginBottom: '15px' }} />
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        justifyContent="space-between"
        mb={4}
        mt={2}
      >
        <Typography
          component="h2"
          variant="h6"
          onClick={() => navigate('/inbox')}
        >
          Messages
        </Typography>
        <Button variant="contained" onClick={() => navigate('/inbox')}>
          See All
        </Button>
      </Stack>
      <Grid container spacing={2} columns={16}>
        {conversations.map((conversation) => (
          <Grid item xs={16} sm={8} lg={4} key={conversation.id}>
            <MessageCard conversation={conversation} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MainGrid;
