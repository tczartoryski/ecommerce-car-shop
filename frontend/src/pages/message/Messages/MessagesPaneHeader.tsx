import { IconButton, Avatar, Typography, Chip, Button } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { Stack } from '@mui/system';
import * as React from 'react';
import { UserProps } from '../types';
import { toggleMessagesPane } from '../utils';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import PhoneInTalkRoundedIcon from '@mui/icons-material/PhoneInTalkRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import OptionsMenu from '../../dashboard/components/OptionsMenu';
import MessagesOptionsMenu from './MessagesOptionsMenu';
type MessagesPaneHeaderProps = {
  sender: UserProps;
};

export default function MessagesPaneHeader(props: MessagesPaneHeaderProps) {
  const { sender } = props;
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
        <Avatar src={sender.avatar} />
        <div>
        <Stack direction="row" sx={{ alignItems: 'flex-end' }}>
        <Typography
            component="h2"
            noWrap
            sx={{ fontWeight: 'lg', fontSize: 'lg' }}
          >{sender.name}</Typography>
          {sender.online ? (
            <Stack direction="row" sx={{ alignItems: 'center', paddingLeft: '16px' }}>
               <Chip
                  variant="outlined"
                  size="small"
                  color="primary"
                  label="Online"
                  sx={{ borderRadius: 'sm' }}
                />
            </Stack>
              ) : undefined}
        </Stack>
          
        </div>
      </Stack>
      <Stack spacing={1} direction="row" sx={{ alignItems: 'center' }}>
        
       
        <MessagesOptionsMenu sender={sender}></MessagesOptionsMenu>
      </Stack>
    </Stack>
  );
}
