import * as React from 'react';
import { Card, CardContent, CardMedia, Stack, Typography, Link, useTheme, IconButton, Box } from "@mui/material";;

export default function MessageCard() {
 const theme = useTheme();

 const handleClick = () => {
   console.log('Card clicked');
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
