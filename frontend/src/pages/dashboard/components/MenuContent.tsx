import * as React from 'react';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ForumIcon from '@mui/icons-material/Forum';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { To, useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material';

const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon />, path: '/home' },
  { text: 'Market', icon: <StorefrontIcon />, path: '/market' },
  { text: 'Inbox', icon: <ForumIcon />, path: '/inbox' },
  { text: 'My Cars', icon: <DirectionsCarIcon />, path: '/my-cars' },
 ];
 
const MenuContent: React.FC = () => {
  const navigate = useNavigate();
 
  const handleListItemClick = (path: To) => {
    navigate(path);
  };
 
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={() => handleListItemClick(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
 };

 export default MenuContent;