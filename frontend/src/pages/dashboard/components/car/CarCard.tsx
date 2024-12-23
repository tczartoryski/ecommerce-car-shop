import * as React from 'react';
import { Card, CardContent, CardMedia, Stack, Typography, Link, useTheme, IconButton, Box } from "@mui/material";
import panameraImage from './panamera.jpg';
import panamera2Image from './panamera2.png';
import panamera3Image from './panamera3.jpg';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function CarCard() {
 const theme = useTheme();
 const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
 const images = [panameraImage, panamera2Image, panamera3Image];

 const handleClick = () => {
   console.log('Card clicked');
 };

 const handlePrevImage = () => {
   setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
 };

 const handleNextImage = () => {
   setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
 };

 return (
   <Link onClick={handleClick} underline="none">
     <Card sx={{ height: '100%', '&:hover': { bgcolor: theme.palette.action.hover } }}>
       <CardContent>
         <Stack direction="row" justifyContent="center" alignItems="center" >
           <IconButton onClick={handlePrevImage} sx={{border: 'none', color: 'darkgray', cursor: 'pointer', bgcolor: 'rgba(0, 0, 0, 0.0)'}}>
             <ArrowBackIosIcon />
           </IconButton>
           <Box sx={{ width: '200px', height: '120px', overflow: 'hidden' }}>
             <CardMedia
               component="img"
               image={images[currentImageIndex]}
               alt="Car Image"
               sx={{
                 width: '100%',
                 height: '100%',
                 objectFit: 'contain',
               }}
             />
           </Box>
           <IconButton onClick={handleNextImage} sx={{border: 'none', color: 'darkgray', cursor: 'pointer', bgcolor: 'rgba(0, 0, 0, 0.0)'}} >
             <ArrowForwardIosIcon />
           </IconButton>
         </Stack>
         <Typography component="h2" variant="subtitle2" sx={{ fontWeight: '600' }}>
           2018 Hyundai Sonata
         </Typography>
         <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ paddingTop: '10px' }}>
           <Typography sx={{ fontWeight: '400', fontSize: '14px' }}>
             $10,000
           </Typography>
           <Typography sx={{ fontWeight: '400', fontSize: '14px' }}>
             Fremont, CA
           </Typography>
         </Stack>
       </CardContent>
     </Card>
   </Link>
 );
}
