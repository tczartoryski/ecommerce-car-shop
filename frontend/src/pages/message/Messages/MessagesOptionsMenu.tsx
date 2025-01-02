import * as React from 'react';
import { styled } from '@mui/material/styles';
import { dividerClasses } from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import { paperClasses } from '@mui/material/Paper';
import { listClasses } from '@mui/material/List';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import MenuButton from '../../dashboard/components/MenuButton';
import { useMessages } from '../../../hooks/messages/MessagesContext';
import { EccomerceUserWithoutCars } from '../types';


const MenuItem = styled(MuiMenuItem)({
  margin: '2px 0',
});
type MessagesOptionsMenuProps = {
    sender: EccomerceUserWithoutCars;
  };

export default function MessagesOptionsMenu(props: MessagesOptionsMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { handleDeleteConversation } = useMessages();

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <MenuButton
        aria-label="Open menu"
        onClick={handleClick}
        sx={{ borderColor: 'transparent' }}
      >
        <MoreVertRoundedIcon />
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: '4px',
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
          },
          [`& .${dividerClasses.root}`]: {
            margin: '4px -4px',
          },
        }}
      >
        <MenuItem onClick={() => {handleClose(); handleDeleteConversation();}}>End Conversation</MenuItem>
      </Menu>
    </React.Fragment>
  );
}
