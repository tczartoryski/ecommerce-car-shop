import * as React from 'react';
import { Menu, MenuItem, Badge, IconButton, Typography } from '@mui/material';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import { Message } from './Header';


interface NotificationsDropdownProps {
  notifications: Message[];
  onClearNotifications: () => void;
}

export default function NotificationsDropdown({ notifications, onClearNotifications }: NotificationsDropdownProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    onClearNotifications();
  };

  const handleSelect = (id: number, conversation: number) => {
    console.log('Message clicked:', id, conversation);
  }
  
  const truncateContent = (content: string, wordLimit: number) => {
    const words = content.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return content;
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={notifications.length}>
          <NotificationsRoundedIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            maxWidth: '40ch',
          },
        }}
      >
        {notifications.length === 0 ? (
          <MenuItem>No new messages</MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem  onClick={() => handleSelect(notification.id, notification.conversation)} style={{ whiteSpace: 'normal', wordBreak: 'break-word' }} key={notification.id}><Typography variant="body2">
            {truncateContent(notification.content, 10)}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {notification.sender.email}
          </Typography></MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}