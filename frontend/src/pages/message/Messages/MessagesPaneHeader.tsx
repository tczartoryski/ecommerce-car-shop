import { IconButton, Avatar, Typography, Chip, Button } from '@mui/material';
import { Stack } from '@mui/system';
import * as React from 'react';
import { toggleMessagesPane } from '../utils';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import MessagesOptionsMenu from './MessagesOptionsMenu';
import { useMessages } from '../../../hooks/messages/MessagesContext';
import { EccomerceUserWithoutCars } from '../types';

type MessagesPaneHeaderProps = {
  sender: EccomerceUserWithoutCars;
};

export default function MessagesPaneHeader(props: MessagesPaneHeaderProps) {
  const { sender } = props;
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
          onClick={() => toggleMessagesPane()}
        >
          <ArrowBackIosNewRoundedIcon />
        </IconButton>
        <Avatar alt={sender.first_name}  src="/static/images/avatar/7.jpg" />
        <div>
        <Stack direction="row" sx={{ alignItems: 'flex-end' }}>
        <Typography
            component="h2"
            noWrap
            sx={{ fontWeight: 'lg', fontSize: 'lg' }}
          >{sender.first_name} {sender.last_name}</Typography>
        </Stack>
          
        </div>
      </Stack>
      <Stack spacing={1} direction="row" sx={{ alignItems: 'center' }}>
        
        <Button variant='contained' onClick={handleViewCar}>View Car</Button>
        <MessagesOptionsMenu sender={sender}></MessagesOptionsMenu>
      </Stack>
    </Stack>
  );
}
