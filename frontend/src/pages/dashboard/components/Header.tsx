import * as React from 'react';
import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import MenuButton from './MenuButton';
import Search from './Search';
import ColorModeIconDropdown from '../../../shared-theme/ColorModeIconDropdown';
import NotificationsDropdown from './NotificationsDropdown';
import useWebSocket from '../../../hooks/useWebsocket';

export type EccomerceUserWithoutCars = {
  email: string;
  first_name: string;
  last_name: string;
}

export type Message = {
  content: string;
  conversation: number;
  id: number;
  read: boolean;
  reciever: EccomerceUserWithoutCars;
  sender: EccomerceUserWithoutCars;
  timestamp: string;
}

export type Notification = {
  notifications: Message[];
}

export default function Header() {
  const { messages } = useWebSocket('ws://localhost:8000/ws/notifications/');
  const [notifications, setNotifications] = React.useState<Message[]>([]);


  React.useEffect(() => {
    messages.forEach((message) => {
      if (message.type === 'new_notifications') {
        setNotifications((prevNotifications) => [...prevNotifications, ...message.notifications]);
      } 
    });
  }, [messages]);

  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1.5,
      }}
      spacing={2}
    >
      <NavbarBreadcrumbs />
      <Stack direction="row" sx={{ gap: 1 }}>
        <MenuButton showBadge aria-label="Open notifications">
          <NotificationsDropdown notifications={notifications} onClearNotifications={() => {}} />
        </MenuButton>
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}
