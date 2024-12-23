import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CarCard from '../car/CarCard';
import { Button, Card, Divider, Stack } from '@mui/material';


export default function Market() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
     <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" mb={4} mt={2} >
       <Typography component="h2" variant="h6">
         Market
       </Typography>
       <Button variant="contained">List A Car</Button>
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
