import * as React from 'react';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { FormControl, Button, TextField } from '@mui/material';
import { Box, Stack } from '@mui/system';

export type MessageInputProps = {
  textAreaValue: string;
  setTextAreaValue: (value: string) => void;
  onSubmit: () => void;
  sx?: object;
  placeholder?: string;
};

export default function MessageInput(props: MessageInputProps) {
  const { textAreaValue, setTextAreaValue, onSubmit, sx, placeholder="Type a message here" } = props;
  const textAreaRef = React.useRef<HTMLDivElement>(null);
  const handleClick = () => {
    if (textAreaValue.trim() !== '') {
      onSubmit();
      setTextAreaValue('');
    }
  };
  return (
    <Box sx={{ px: 2, pb: 3,  ...sx }}>
      <FormControl sx={{width: '100%'}}>
        <Stack direction="row" sx={{ alignItems: 'center', gap: '8px' }}>
          <TextField
            placeholder={placeholder}
            aria-label="Message"
            ref={textAreaRef}
            onChange={(event) => {
              setTextAreaValue(event.target.value);
            }}
            value={textAreaValue}
            minRows={3}
            maxRows={10}
            onKeyDown={(event: { key: string; metaKey: any; ctrlKey: any; }) => {
              if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                handleClick();
              }
            }}
            sx={{
              '& textarea:first-of-type': {
                minHeight: 72,
              },
              flexGrow: 1,
            }}
          />
          <Stack
            direction="row"
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 1,
              pr: 1,
            }}
          >
            <Stack direction="row" sx={{ alignItems: 'flex-end' }}>
              <Button
                size="small"
                color="primary"
                sx={{ alignSelf: 'center', borderRadius: 'sm' }}
                onClick={handleClick}
                endIcon={<SendRoundedIcon />}
                >
                Send
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </FormControl>
    </Box>
   );
  }