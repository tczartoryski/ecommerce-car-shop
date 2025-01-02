import * as React from 'react';
import { Card, CardContent, Stack, Typography, Link, useTheme, IconButton, Box } from "@mui/material";import { Conversation } from '../../../message/types';
import { formatDistanceToNow, parseISO } from 'date-fns';
import UserContext from '../../../../hooks/user/UserContext';
import { EccomerceUserWithoutCars } from '../Header';
import { useSelectedChat } from '../../../../hooks/messages/SelectedChatContext';
import { useNavigate } from 'react-router-dom';


interface MessagesCardProps {
  conversation: Conversation;
};

export default function MessageCard({conversation}: MessagesCardProps) {
  const theme = useTheme();
  const { user } = React.useContext(UserContext);
  const { setSelectedChat } = useSelectedChat();
  const navigate = useNavigate();
  const [sender, setSender] = React.useState<EccomerceUserWithoutCars | null>(null);
  
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
     return null; // or a loading spinner
   }
 const handleClick = () => {
   setSelectedChat(conversation);
   navigate('/inbox');
 };

 const timestamp = conversation.most_recent_message.timestamp;
 const formattedTimestamp = formatDistanceToNow(parseISO(timestamp), { addSuffix: true });


 return (
    <Link onClick={handleClick} underline="none">
      <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { bgcolor: theme.palette.action.hover } }}>
        <CardContent>
          <Stack direction="column" justifyContent="space-between" sx={{ height: '100%' }}>
            <Stack direction="row" justifyContent="space-between">
                <Typography component="h2" variant="subtitle2" sx={{ fontWeight: '600' }}>{sender.first_name} {sender.last_name}</Typography>
                <Typography sx={{ fontWeight: '400', fontSize: '14px' }}>{formattedTimestamp}</Typography>
            </Stack>
              <Typography sx={{ fontWeight: '400', fontSize: '14px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', }} >
              {conversation.most_recent_message.sender.email === user.email ? 'You: ' : `${conversation.most_recent_message.sender.first_name}: `} {conversation.most_recent_message.content}
              </Typography>
           
          </Stack>
        </CardContent>
      </Card>
    </Link>
   );
   
}
