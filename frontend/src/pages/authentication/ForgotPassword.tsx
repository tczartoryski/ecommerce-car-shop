import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, OutlinedInput, DialogActions, Button } from '@mui/material';


interface ForgotPasswordProps {
 open: boolean;
 handleClose: () => void;
}
const apiUrl = 'http://127.0.0.1:8000/api/password_reset/';

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ open, handleClose }) => {
 const [email, setEmail] = React.useState('');

 const handleResetSubmit = async () => {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
 
    const data = await response.json();
 
    if (response.ok) {
      handleClose();
    } else {
      console.error(data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
 };

 return (
   <Dialog
     open={open}
     onClose={handleClose}
   >
     <DialogTitle>Reset password</DialogTitle>
     <DialogContent
       sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
     >
       <DialogContentText>
         Enter your account&apos;s email address, and we&apos;ll send you a link to
         reset your password.
       </DialogContentText>
       <OutlinedInput
         autoFocus
         required
         margin="dense"
         id="email"
         name="email"
         label="Email address"
         placeholder="Email address"
         type="email"
         fullWidth
         value={email}
         onChange={(e) => setEmail(e.target.value)}
       />
     </DialogContent>
     <DialogActions sx={{ pb: 3, px: 3 }}>
       <Button onClick={handleClose}>Cancel</Button>
       <Button variant="contained" onClick={() => handleResetSubmit()}>
         Continue
       </Button>
     </DialogActions>
   </Dialog>
 );
};

export default ForgotPassword;
