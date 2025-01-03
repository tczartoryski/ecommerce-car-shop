import * as React from 'react';
import ChatsPane from './sidebar/ChatsPane';
import { Conversation } from './types';
import { Box } from '@mui/material';
import MessagesPane from './messages/MessagesPane';
import useWebSocket from '../../hooks/useWebsocket';
import { MessagesProvider } from '../../hooks/messages/MessagesContext';
import ShowCar from '../car/ShowCar';
import { request } from '../../hooks/authentication/authUtils';
import { useSelectedChat } from '../../hooks/messages/SelectedChatContext';
import { Car } from '../car/types';

const Messages: React.FC = () => {
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const { selectedChat, setSelectedChat } = useSelectedChat();
  const { messages, sendMessage } = useWebSocket(
    'ws://localhost:8000/ws/conversations/'
  );
  const [displayedCar, setDisplayedCar] = React.useState<Car | undefined>(
    undefined
  );
  const [open, setOpen] = React.useState(false);
  const carCache = React.useRef<Map<number, Car>>(new Map());

  React.useEffect(() => {
    const newConversations = [...conversations];
    messages.forEach((message) => {
      if (message.type === 'initial_conversations') {
        setConversations(message.conversations);
        setSelectedChat(message.conversations[0]);
      } else if (message.type === 'conversation_update') {
        const index = newConversations.findIndex(
          (conv) => conv.id === message.conversation.id
        );
        if (index !== -1) {
          newConversations[index] = message.conversation;
        } else {
          newConversations.push(message.conversation);
        }
        setConversations(newConversations);
      }
    });
  }, [messages]);

  const handleDeleteConversation = () => {
    const message = {
      type: 'delete_conversation',
      conversation_id: selectedChat.id,
    };
    sendMessage(message);
  };

  const handleViewCar = async () => {
    if (selectedChat && selectedChat.car) {
      const carId = selectedChat.car;
      if (carCache.current.has(carId)) {
        setDisplayedCar(carCache.current.get(carId));
        setOpen(true);
      } else {
        try {
          const response = await request(`api/car/${carId}/`, {
            method: 'GET',
          });
          if (!response.ok) {
            throw new Error('Failed to fetch car');
          }
          const data: Car = await response.json();
          carCache.current.set(carId, data);
          setDisplayedCar(data);
          setOpen(true);
        } catch (error) {
          console.error('Error fetching car:', error);
        }
      }
    }
  };
  const handleCloseDialog = () => {
    setDisplayedCar(undefined);
    setOpen(false);
  };

  return (
    <MessagesProvider
      handleDeleteConversation={handleDeleteConversation}
      handleViewCar={handleViewCar}
    >
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
        {displayedCar && (
          <ShowCar
            car={displayedCar}
            open={open}
            handleClose={handleCloseDialog}
            canMessage={false}
          />
        )}
        <ChatsPane
          chats={conversations}
          selectedChatId={selectedChat ? selectedChat.id.toString() : ''}
          setSelectedChat={setSelectedChat}
        />
        {selectedChat && <MessagesPane chat={selectedChat} />}
      </Box>
    </MessagesProvider>
  );
};

export default Messages;
