import * as React from 'react';
import { Typography, Box, Stack } from '@mui/material';
import { Message } from '../types';
import UserContext from '../../../hooks/user/UserContext';
import { formatDistanceToNow, parseISO } from 'date-fns';
import exp from 'constants';


type ChatBubbleProps = {
  variant: 'sent' | 'received';
  message: Message;
};

const ChatBubble: React.FC<ChatBubbleProps> = ({ variant, message }) => {
  const isSent = variant === 'sent';
  const { user } = React.useContext(UserContext);
  const formattedTimestamp = formatDistanceToNow(parseISO(message.timestamp), { addSuffix: true });
  return (
    <Box sx={{ maxWidth: '60%', minWidth: 'auto', border: '1px solid grey', borderRadius: '8px', padding: '8px' }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: 'space-between', mb: 0.25 }}

      >
        <Typography >
          {message.sender.email === user.email ? 'You' : `${message.sender.first_name} ${message.sender.last_name}`}
        </Typography>
        <Typography >{formattedTimestamp}</Typography>
      </Stack>
      
        <Box
          sx={{ position: 'relative' }}
        >
          <Box
            color={isSent ? 'primary' : 'neutral'}
            sx={[
              {
                p: 1.25,
                borderRadius: 'lg',
              },
              isSent
                ? {
                    borderTopRightRadius: 0,
                  }
                : {
                    borderTopRightRadius: 'lg',
                  },
              isSent
                ? {
                    borderTopLeftRadius: 'lg',
                  }
                : {
                    borderTopLeftRadius: 0,
                  },
              isSent
                ? {
                    backgroundColor: 'var(--joy-palette-primary-solidBg)',
                  }
                : {
                    backgroundColor: 'background.body',
                  },
            ]}
          >
            <Typography
              sx={[
                isSent
                  ? {
                      color: 'var(--joy-palette-common-white)',
                    }
                  : {
                      color: 'var(--joy-palette-text-primary)',
                    },
              ]}
            >
              {message.content}
            </Typography>
          </Box>
        </Box>
    </Box>
  );
};

export default ChatBubble;
