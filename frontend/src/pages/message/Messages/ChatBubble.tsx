import * as React from 'react';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import { Typography, Avatar, IconButton } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { MessageProps } from '../types';

type ChatBubbleProps = MessageProps & {
  variant: 'sent' | 'received';
};

export default function ChatBubble(props: ChatBubbleProps) {
  const { content, variant, timestamp, attachment = undefined, sender } = props;
  const isSent = variant === 'sent';
  return (
    <Box sx={{ maxWidth: '60%', minWidth: 'auto', border: '1px solid grey', borderRadius: '8px', padding: '8px' }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: 'space-between', mb: 0.25 }}

      >
        <Typography >
          {sender === 'You' ? sender : sender.name}
        </Typography>
        <Typography >{timestamp}</Typography>
      </Stack>
      {attachment ? (
        <Box
          sx={[
            {
              px: 1.75,
              py: 1.25,
              borderRadius: 'lg',
            },
            isSent ? { borderTopRightRadius: 0 } : { borderTopRightRadius: 'lg' },
            isSent ? { borderTopLeftRadius: 'lg' } : { borderTopLeftRadius: 0 },
          ]}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Avatar color="primary">
              <InsertDriveFileRoundedIcon />
            </Avatar>
            <div>
              <Typography sx={{ fontSize: 'sm' }}>{attachment.fileName}</Typography>
              <Typography >{attachment.size}</Typography>
            </div>
          </Stack>
        </Box>
      ) : (
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
              {content}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
