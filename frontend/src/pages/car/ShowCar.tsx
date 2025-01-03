import * as React from 'react';
import useCityByZipcode from '../../hooks/getCityByZipcode';
import MessageInput from '../message/messages/MessageInput';
import { request } from '../../hooks/authentication/authUtils';
import { useSelectedChat } from '../../hooks/messages/SelectedChatContext';
import { useNavigate } from 'react-router-dom';
import { Conversation } from '../message/types';
import {
  Dialog,
  DialogTitle,
  Button,
  DialogContent,
  Typography,
  DialogActions,
  CircularProgress,
  Stack,
} from '@mui/material';
import { Car } from './types';

interface ShowCarProps {
  car: Car;
  open: boolean;
  canMessage?: boolean;
  handleClose: () => void;
}

const ShowCar: React.FC<ShowCarProps> = ({
  car,
  open,
  handleClose,
  canMessage = true,
}) => {
  const { location, getCityByZipcode } = useCityByZipcode();
  const [loading, setLoading] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [messageSent, setMessageSent] = React.useState(false);
  const { setSelectedChat } = useSelectedChat();
  const navigate = useNavigate();

  const [message, setMessage] = React.useState('');
  React.useEffect(() => {
    getCityByZipcode(car.zipcode);
  }, [car.zipcode, getCityByZipcode]);

  const handleSendMessage = async () => {
    setLoading(true);
    const newMessage = {
      car_id: car.id,
      content: message,
    };
    try {
      const response = await request('api/message-owner/', {
        method: 'POST',
        body: JSON.stringify(newMessage),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: Conversation = await response.json();
      setSelectedChat(data);
      setMessageSent(true);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToConversation = () => {
    navigate('/inbox');
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleClose,
        sx: { backgroundImage: 'none' },
      }}
    >
      <DialogTitle>
        {car.year} {car.make} {car.model}
      </DialogTitle>
      <Button
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        X
      </Button>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            gap: 2,
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <Typography sx={{ fontSize: '16px', fontWeight: 400 }}>
            Make: {car.make}
          </Typography>
          <Typography sx={{ fontSize: '16px', fontWeight: 400 }}>
            Model: {car.model.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            gap: 2,
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <Typography sx={{ fontSize: '16px', fontWeight: 400 }}>
            Year: {car.year}
          </Typography>
          <Typography sx={{ fontSize: '16px', fontWeight: 400 }}>
            Mileage:{' '}
            {car.mileage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            gap: 2,
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <Typography sx={{ fontSize: '16px', fontWeight: 400 }}>
            Color: {car.color}
          </Typography>
          <Typography sx={{ fontSize: '16px', fontWeight: 400 }}>
            Price: ${car.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </Typography>
        </Stack>
        <Typography sx={{ fontSize: '16px', fontWeight: 400 }}>
          Description: {car.description}
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          sx={{ width: '100%', alignItems: 'center' }}
        >
          {location && (
            <Typography variant="body2" color="textSecondary">
              Location: {location}
            </Typography>
          )}
        </Stack>
        {car.images.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '400px',
                height: '240px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              <img
                src={car.images[selectedImageIndex].image_url}
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
                disabled={selectedImageIndex === car.images.length - 1}
                onClick={() => setSelectedImageIndex(selectedImageIndex + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
      {canMessage && (
        <DialogActions>
          {loading ? (
            <CircularProgress />
          ) : messageSent ? (
            <Button onClick={handleNavigateToConversation}>
              View Conversation
            </Button>
          ) : (
            <MessageInput
              textAreaValue={message}
              setTextAreaValue={setMessage}
              onSubmit={handleSendMessage}
              sx={{ width: '100%' }}
              placeholder={'Message owner...'}
            />
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ShowCar;
