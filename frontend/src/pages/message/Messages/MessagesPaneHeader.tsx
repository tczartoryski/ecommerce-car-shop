import * as React from 'react';
import { IconButton, Avatar, Typography, Stack, Button } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { useMessages } from '../../../hooks/messages/MessagesContext';
import { EccomerceUserWithoutCars } from '../types';
import MessagesOptionsMenu from './MessagesOptionsMenu';

type MessagesPaneHeaderProps = {
  sender: EccomerceUserWithoutCars;
};

const MessagesPaneHeader: React.FC<MessagesPaneHeaderProps> = ({ sender }) => {
  const { handleViewCar } = useMessages();
  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: 'space-between',
        py: { xs: 2, md: 2 },
        px: { xs: 1, md: 2 },
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.body',
      }}
    >
      <Stack
        direction="row"
        spacing={{ xs: 1, md: 2 }}
        sx={{ alignItems: 'center' }}
      >
        <IconButton
          color="primary"
          size="small"
          sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
        >
          <ArrowBackIosNewRoundedIcon />
        </IconButton>
        <Avatar alt={sender.first_name} src="/static/images/avatar/7.jpg" />
        <div>
          <Stack direction="row" sx={{ alignItems: 'flex-end' }}>
            <Typography
              component="h2"
              noWrap
              sx={{ fontWeight: 'lg', fontSize: 'lg' }}
            >
              {sender.first_name} {sender.last_name}
            </Typography>
          </Stack>
        </div>
      </Stack>
      <Stack spacing={1} direction="row" sx={{ alignItems: 'center' }}>
        <Button variant="contained" onClick={handleViewCar}>
          View Car
        </Button>
        <MessagesOptionsMenu></MessagesOptionsMenu>
      </Stack>
    </Stack>
  );
};

export default MessagesPaneHeader;
