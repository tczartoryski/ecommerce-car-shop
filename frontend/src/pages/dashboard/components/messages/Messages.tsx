import * as React from 'react';
import ChatsPane from '../../../message/Sidebar/ChatsPane';
import { Conversation } from '../../../message/types';
import { Box } from '@mui/material';
import MessagesPane from '../../../message/Messages/MessagesPane';
import useWebSocket from '../../../../hooks/useWebsocket';

export default function Messages() {
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [selectedChat, setSelectedChat] = React.useState<Conversation | undefined>(undefined);
  const { messages } = useWebSocket('ws://localhost:8000/ws/conversations/');

  React.useEffect(() => {
    const newConversations = [...conversations];
    messages.forEach((message) => {
     
    console.log("Here is the data in messages", message);
    if (message.type === 'initial_conversations') {
      setConversations(message.conversations);
      setSelectedChat(message.conversations[0]);
    } else if (message.type === 'conversation_update') {
      const index = newConversations.findIndex((conv) => conv.id === message.conversation.id);
      if (index !== -1) {
        newConversations[index] = message.conversation;
      } else {
        newConversations.push(message.conversation);
      }
      setConversations(newConversations);
    }
      
    });
  }, [messages]);


  return (
    <Box
      sx={{
        flex: 1,
        width: '100%',
        mx: 'auto',
        pt: { xs: 'var(--Header-height)', md: 0 },
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: '300px 1fr',
        },
      }}
    >
      <ChatsPane
        chats={conversations}
        selectedChatId={selectedChat ? selectedChat.id.toString() : ''}
        setSelectedChat={setSelectedChat}
      />
      {selectedChat && <MessagesPane chat={selectedChat} />}
    </Box>
  );
}
