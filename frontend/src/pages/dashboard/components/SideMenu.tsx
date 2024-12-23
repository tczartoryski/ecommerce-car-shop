import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuContent from './MenuContent';
import OptionsMenu from './OptionsMenu';
import { Avatar } from '@mui/material';
import UserContext from '../../../hooks/user/UserContext';
import { request } from '../../../hooks/authentication/authentication';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu() {
  const { user, updateUser } = React.useContext(UserContext);

  React.useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await request('api/user/details/');
        if (response.ok) {
          const data = await response.json();
          const { first_name, last_name, email } = data;
          updateUser({ firstName: first_name, lastName: last_name, email });
        } else {
          console.error('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    if (user === null) {
      fetchUserDetails();
    }
  }, [user, updateUser]);
  

  return (
    <Drawer
 variant="permanent"
 sx={{
   display: { xs: 'none', md: 'block' },
   [`& .${drawerClasses.paper}`]: {
     backgroundColor: 'background.paper',
     width: drawerWidth, // Set the desired fixed width
   },
 }}
>
 <Box
   sx={{
     display: 'flex',
     flexDirection: 'column',
     height: '100%',
     mt: 'calc(var(--template-frame-height, 0px) + 4px)',
     p: 1.5,
   }}
 >
   <Typography component="h1" variant="h6">
     Ecommerce Car Shop
   </Typography>
   <Divider sx={{ my: 1 }} />
   <MenuContent />
   <Box
     sx={{
       mt: 'auto',
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'space-between',
       p: 2,
       paddingLeft: '0px',
       paddingBottom: '0px',
       borderTop: '1px solid',
       borderColor: 'divider',
     }}
   >
     <Stack direction="row" alignItems="center" spacing={1}>
       <Avatar
         sizes="small"
         alt={user?.firstName}
         src="/static/images/avatar/7.jpg"
         sx={{ width: 36, height: 36 }}
       />
       <Box sx={{ maxWidth: `calc(${drawerWidth}px - 100px)` }}>
         <Typography
           variant="body2"
           sx={{
             fontWeight: 500,
             lineHeight: '16px',
             whiteSpace: 'nowrap',
             overflow: 'hidden',
             textOverflow: 'ellipsis',
           }}
         >
           {user?.firstName} {user?.lastName}
         </Typography>
         <Box
           sx={{
             width: '140px', // Set the desired width
             whiteSpace: 'nowrap',
             overflow: 'hidden',
             textOverflow: 'ellipsis',
             fontSize: '0.60rem',
           }}
         >
           <Typography variant="caption" sx={{ color: 'text.secondary' }}>
             {user?.email}
           </Typography>
         </Box>
       </Box>
     </Stack>
     <OptionsMenu />
   </Box>
 </Box>
</Drawer>

   
  );
}
