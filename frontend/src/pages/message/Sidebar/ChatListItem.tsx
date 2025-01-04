import * as React from 'react';
import { Conversation, EccomerceUserWithoutCars } from '../types';
import {
  Typography,
  Box,
  Stack,
  ListItem,
  ListItemButton,
  Divider,
  Avatar,
} from '@mui/material';
import UserContext from '../../../hooks/user/UserContext';
import { formatDistanceToNow, parseISO } from 'date-fns';

type ChatListItemProps = {
  conversation: Conversation;
  selectedChatId?: string;
  setSelectedChat: (conversation: Conversation) => void;
};

const ChatListItem: React.FC<ChatListItemProps> = ({
  conversation,
  selectedChatId,
  setSelectedChat,
}) => {
  const selected = selectedChatId === conversation.id.toString();
  const { user } = React.useContext(UserContext);
  const [sender, setSender] = React.useState<EccomerceUserWithoutCars | null>(
    null
  );

  React.useEffect(() => {
    if (user && conversation) {
      if (conversation.buyer.email === user.email) {
        setSender(conversation.seller);
      } else {
        setSender(conversation.buyer);
      }
    }
  }, [user, conversation]);

  if (!user || !sender) {
    return null;
  }

  const timestamp = conversation.most_recent_message.timestamp;
  const formattedTimestamp = formatDistanceToNow(parseISO(timestamp), {
    addSuffix: true,
  });

  return (
    <React.Fragment>
      <ListItem>
        <ListItemButton
          onClick={() => {
            setSelectedChat(conversation);
          }}
          selected={selected}
          color="neutral"
          sx={{ flexDirection: 'column', alignItems: 'initial', gap: 1 }}
        >
          <Stack direction="row" spacing={1.5}>
            <Avatar alt={sender.first_name} src="/static/images/avatar/7.jpg" />
            <Box sx={{ flex: 1 }}>
              <Typography>
                {sender.first_name} {sender.last_name}
              </Typography>
            </Box>
            <Box
              sx={{
                lineHeight: 1.5,
                textAlign: 'right',
                wordBreak: 'break-word',
                whiteSpace: 'normal',
              }}
            >
              <Typography
                sx={{
                  display: { xs: 'none', md: 'block' },
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                }}
              >
                {formattedTimestamp}
              </Typography>
            </Box>
          </Stack>
          <Typography
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {conversation.most_recent_message.sender.email === user.email
              ? 'You: '
              : `${conversation.most_recent_message.sender.first_name}: `}{' '}
            {conversation.most_recent_message.content}
          </Typography>
        </ListItemButton>
      </ListItem>
      <Divider sx={{ margin: 0 }} />
    </React.Fragment>
  );
};

export default ChatListItem;
