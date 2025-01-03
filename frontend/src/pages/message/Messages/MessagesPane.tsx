import * as React from 'react';
import { Conversation, EccomerceUserWithoutCars, Message } from '../types';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import UserContext from '../../../hooks/user/UserContext';
import { request } from '../../../hooks/authentication/authUtils';
import useWebSocket from '../../../hooks/useWebsocket';
import MessagesPaneHeader from './MessagesPaneHeader';
import ChatBubble from './ChatBubble';
import MessageInput from './MessageInput';

type MessagesPaneProps = {
  chat: Conversation;
};

export default function MessagesPane(props: MessagesPaneProps) {
  const { chat } = props;
  const [chatMessages, setChatMessages] = React.useState<Message[]>([chat.most_recent_message]);
  const [textAreaValue, setTextAreaValue] = React.useState('');
  const { user } = React.useContext(UserContext);
  const [sender, setSender] = React.useState<EccomerceUserWithoutCars | null>(null);
  const { messages, sendMessage } = useWebSocket(`ws://localhost:8000/ws/conversations/${chat.id}/`);

    
  React.useEffect(() => {
    if (user && chat) {
      if (chat.buyer.email === user.email) {
        setSender(chat.seller);
      } else {
        setSender(chat.buyer);
      }
    }
  }, [user, chat]);

    
    React.useEffect(() => {
      if (!user || !sender) {
        return;
      }});
  
    const handleNewMessage = () => {
      const message = {
        type: 'new_message',
        message: textAreaValue,
        sender_id: user.id,
      };
      sendMessage(message);
      setTextAreaValue('');
      }
  
  
  React.useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await request(`api/conversations/${chat.id}/messages/`);
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        setChatMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();


    return () => {
    };
  }, [chat.id]);

  React.useEffect(() => {
    if (messages.length > 0) {
      setChatMessages((prevMessages) => [...prevMessages, ...messages]);
    }
  }, [messages]);
  
  if (!user || !sender) {
    return <Typography>Loading...</Typography>;
  }
  

  return (
    <Box
      sx={{
        height: { xs: 'calc(100dvh - var(--Header-height))', md: '100dvh' },
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        backgroundColor: 'background.level1',
      }}
    >
      {sender && <MessagesPaneHeader sender={sender} />}
      <Box
        id="messages-container"
        sx={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          px: 2,
          py: 3,
          overflowY: 'scroll',
          flexDirection: 'column-reverse',
        }}
      >
        <Stack spacing={2} sx={{ justifyContent: 'flex-end' }}>
          {chatMessages.map((message: Message, index: number) => {
            const isYou = message.sender.email === user.email;
            return (
              <Stack
                key={index}
                direction="row"
                spacing={2}
                sx={{ flexDirection: isYou ? 'row-reverse' : 'row' }}
              >
                {message.sender.email !== user.email && (
                  <Avatar
                    src={"/static/images/avatar/7.jpg"}
                    alt={sender.first_name}
                  />
                )}
                <ChatBubble variant={isYou ? 'sent' : 'received'} message={message} />
              </Stack>
            );
          })}
        </Stack>
      </Box>
      <MessageInput
        textAreaValue={textAreaValue}
        setTextAreaValue={setTextAreaValue}
        onSubmit={handleNewMessage}
      />
    </Box>
  );
}
