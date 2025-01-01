import * as React from 'react';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ChatListItem from './ChatListItem';
import { Conversation } from '../types';
import { toggleMessagesPane } from '../utils';
import { Typography, Box, Stack, IconButton, Input, List, Chip } from '@mui/material';

type ChatsPaneProps = {
  chats: Conversation[];
  setSelectedChat: (chat: Conversation) => void;
  selectedChatId: string;
};

export default function ChatsPane(props: ChatsPaneProps) {
  const { chats, setSelectedChat, selectedChatId } = props;
  return (
    <Box
      sx={{
        borderRight: '1px solid',
        borderColor: 'divider',
        height: { sm: 'calc(100vh - var(--Header-height))', md: '100vh' },
        overflowY: 'auto',
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2, pb: 1.5 }}
      >
        <Stack direction="row" sx={{ alignItems: 'center', gap: '16px' }}>
            <Chip
              variant="filled"
              color="primary"
              size="medium"
              label={chats.length}
            />
            <Typography
              component="h1"
              sx={{ fontSize: { xs: 'md', md: 'lg' }, fontWeight: 'lg', mr: 'auto' }}
            >
              {chats.length == 1 ? 'Message' : 'Messages'}
            </Typography>
        </Stack>
       
        <IconButton
          
          aria-label="edit"
          color="primary"
          size="small"
          onClick={() => {
            toggleMessagesPane();
          }}
          sx={{ display: { sm: 'none' } }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Stack>
      <List
        sx={{
          py: 0,
          '--ListItem-paddingY': '0.75rem',
          '--ListItem-paddingX': '1rem',
        }}
      >
        {chats.map((chat) => (
          <ChatListItem
            key={chat.id.toString()}
            conversation={chat}
            selectedChatId={selectedChatId}
            setSelectedChat={setSelectedChat}
          />
        ))}
      </List>
    </Box>
  );
}
