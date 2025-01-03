import * as React from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Conversation } from '../types';
import { toggleMessagesPane } from '../utils';
import { Typography, Box, Stack, IconButton, List, Chip } from '@mui/material';
import ChatListItem from './ChatListItem';

type ChatsPaneProps = {
  chats: Conversation[];
  setSelectedChat: (chat: Conversation) => void;
  selectedChatId: string;
};

const ChatsPane: React.FC<ChatsPaneProps> = ({
  chats,
  selectedChatId,
  setSelectedChat,
}) => {
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
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          pb: 1.5,
        }}
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
            sx={{
              fontSize: { xs: 'md', md: 'lg' },
              fontWeight: 'lg',
              mr: 'auto',
            }}
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
};

export default ChatsPane;
