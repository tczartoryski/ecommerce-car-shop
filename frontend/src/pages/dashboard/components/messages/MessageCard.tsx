import * as React from 'react';
import { Card, CardContent, CardMedia, Stack, Typography, Link, useTheme, IconButton, Box } from "@mui/material";
import panameraImage from './../car/panamera.jpg'
import panamera2Image from './../car/panamera2.png';
import panamera3Image from './../car/panamera3.jpg';

export default function MessageCard() {
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
          <Stack direction="column" justifyContent="space-between" sx={{ height: '100%' }}>
            <Stack direction="row" justifyContent="space-between">
                <Typography component="h2" variant="subtitle2" sx={{ fontWeight: '600' }}>Katherine Moss</Typography>
                <Typography sx={{ fontWeight: '400', fontSize: '14px' }}>5 mins ago</Typography>
            </Stack>
              <Typography sx={{ fontWeight: '400', fontSize: '14px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', }} >
              Thanks Olivia! Almost there. I'll work on making those changes you suggested and will shoot it over.
              </Typography>
           
          </Stack>
        </CardContent>
      </Card>
    </Link>
   );
   
}
