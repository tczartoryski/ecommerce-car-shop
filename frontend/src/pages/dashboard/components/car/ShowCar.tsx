import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {Stack, Typography } from '@mui/material';
import { Car } from './MyCars';
import useCityByZipcode from '../../../../hooks/cityByZipcode';

interface ShowCarProps {
 car: Car;
 open: boolean;
 edit?: boolean
 handleClose: () => void;
}

export default function ShowCar({ car, open, handleClose, edit }: ShowCarProps) {
    const { location, getCityByZipcode } = useCityByZipcode();
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
    React.useEffect(() => {
        getCityByZipcode(car.zipcode);
      }, [car.zipcode, getCityByZipcode]);
    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? car.images.length - 1 : prevIndex - 1));
      };
     
    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === car.images.length - 1 ? 0 : prevIndex + 1));
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
     <DialogTitle>Create A Car Listing</DialogTitle>
    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
        <Typography>{car.make}</Typography>
        <Typography>{car.model}</Typography>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ gap: 2, alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <Stack direction="column" spacing={1} sx={{ width: 150, alignItems: 'flex-start' }}>
          <Typography>{car.year}</Typography>
        </Stack>
        <Typography>{car.color}</Typography>
      </Stack>
     <Typography>{car.description}</Typography>
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
        <Stack direction="column" spacing={1} sx={{ width: 150, alignItems: 'flex-start' }}>
          <Typography>{car.mileage}</Typography>
        </Stack>
        <Stack direction="column" spacing={1} sx={{ width: 150, alignItems: 'flex-start' }}>
            <Typography>${car.price.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Typography>
        </Stack>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ width: '100%', alignItems: 'center' }}>
        {location && (
          <Typography variant="body2" color="textSecondary">
            Location: {location}
          </Typography>
        )}
      </Stack>
      {car.images.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '400px', height: '240px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
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

     <DialogActions sx={{ pb: 3, px: 3 }}>
       <Button onClick={handleClose}>Cancel</Button>
       <Button variant="contained" type="submit">
         Create Listing
       </Button>
     </DialogActions>
   </Dialog>
 );
}
