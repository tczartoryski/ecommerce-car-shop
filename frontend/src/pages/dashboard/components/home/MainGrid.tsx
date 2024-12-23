import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CarCard from '../car/CarCard';
import { Button, Card, Divider, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MessageCard from '../messages/MessageCard';


export default function MainGrid() {
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
       
          <Grid size={{ xs: 16, sm: 8, lg: 4 }}>
            <CarCard ></CarCard>
          </Grid>
          <Grid size={{ xs: 16, sm: 8, lg: 4 }}>
            <CarCard ></CarCard>
          </Grid>
          <Grid size={{ xs: 16, sm: 8, lg: 4 }}>
            <CarCard ></CarCard>
          </Grid>
          <Grid size={{ xs: 16, sm: 8, lg: 4 }}>
            <CarCard ></CarCard>
          </Grid>
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
       
          <Grid size={{ xs: 16, sm: 8, lg: 4 }}>
            <CarCard ></CarCard>
          </Grid>
          <Grid size={{ xs: 16, sm: 8, lg: 4 }}>
            <CarCard ></CarCard>
          </Grid>
          <Grid size={{ xs: 16, sm: 8, lg: 4 }}>
            <CarCard ></CarCard>
          </Grid>
          <Grid size={{ xs: 16, sm: 8, lg: 4 }}>
            <CarCard ></CarCard>
          </Grid>
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
       
          <Grid size={{ xs: 16, sm: 8, lg: 4 }}>
            <MessageCard ></MessageCard>
          </Grid>
          <Grid size={{ xs: 16, sm: 8, lg: 4 }}>
            <MessageCard ></MessageCard>
          </Grid>
          <Grid size={{ xs: 16, sm: 8, lg: 4 }}>
            <MessageCard ></MessageCard>
          </Grid>
          <Grid size={{ xs: 16, sm: 8, lg: 4 }}>
            <MessageCard ></MessageCard>
          </Grid>
      </Grid>
      
    </Box>
  );
}
