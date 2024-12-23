import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CarCard from './CarCard';
import { Button, Stack } from '@mui/material';
import AddCar from './AddCar';


export default function MyCars() {
    const [open, setOpen] = React.useState(false);

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
    </Box>
  );
}
