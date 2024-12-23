import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import { FormHelperText, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import { MakeDropdown } from './MakeDropdown';
import { ModelDropdown } from './ModelDropdown';
import { ColorDropdown } from './ColorDropdown';

interface AddCarProps {
 open: boolean;
 handleClose: () => void;
}


export default function AddCar({ open, handleClose }: AddCarProps) {
    const [make, setMake] = React.useState('');
    const [model, setModel] = React.useState('');
    const [year, setYear] = React.useState('');
    const [color, setColor] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [mileage, setMileage] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [images, setImages] = React.useState<File[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
    const [yearError, setYearError] = React.useState(''); 
    
    const handleYearChange = (value: any) => {
      const parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue)) {
        setYear('');
        setYearError('Please enter a valid year');
      } else if (parsedValue < 1970 || parsedValue > 2025) {
        setYear(value);
        setYearError('Year must be between 1970 and 2025');
      } else {
        setYear(value);
        setYearError('');
      }
     };

    const handleExit = () => {
      setMake('');
      setModel('');
      setYear('');
      setColor('');
      setDescription('');
      setMileage('');
      setImages([]);
      handleClose();
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Do something with the form data
        console.log({ make, model, year, color, description, mileage, images });
        // Reset the form fields
        setMake('');
        setModel('');
        setYear('');
        setColor('');
        setDescription('');
        setMileage('');
        setImages([]);
        handleClose();
       };
       

 return (
   <Dialog
     open={open}
     onClose={handleExit}
     PaperProps={{
       component: 'form',
       onSubmit: handleSubmit,
       sx: { backgroundImage: 'none' },
     }}
   >
     <DialogTitle>Create Car Listing</DialogTitle>
     <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
    <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
      <MakeDropdown make={make} setMake={setMake} />
      <ModelDropdown make={make} model={model} setModel={setModel} />
       </Stack>

      <Stack direction="row" spacing={2} sx={{ gap: 2, alignItems: 'flex-end' }}>
        <Stack direction="column" spacing={1} sx={{ width: 150, alignItems: 'flex-start' }}>
          <OutlinedInput
            required
            margin="dense"
            id="year"
            name="year"
            label="Year"
            placeholder="Enter the year"
            type="number"
            sx={{ height: '40px', marginTop: '8px' }}
            value={year}
            onChange={(e) => handleYearChange(e.target.value)}
            error={yearError !== ''}
          />
          {yearError && <FormHelperText error>{yearError}</FormHelperText>}
        </Stack>
        <ColorDropdown color={color} setColor={setColor} />
      </Stack>
 <OutlinedInput
   required
   margin="dense"
   id="description"
   name="description"
   label="Description"
   placeholder="Enter the description"
   multiline
   rows={4}
   fullWidth
   value={description}
   onChange={(e) => setDescription(e.target.value)}
 />
    <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
      <OutlinedInput
        required
        margin="dense"
        id="mileage"
        name="mileage"
        label="Mileage"
        placeholder="Enter the mileage"
        type="number"
        sx={{ width: 150 }}
        value={mileage}
        onChange={(e) => setMileage(e.target.value)}
      />
      <OutlinedInput
        required
        margin="dense"
        id="price"
        name="price"
        label="Price"
        placeholder="Enter the price"
        type="number"
        sx={{ width: 150 }}
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
    </Stack>


 <input
 type="file"
 multiple
 onChange={(e) => {
   setImages(Array.from(e.target.files || []));
   setSelectedImageIndex(0); // Reset the selected image index when new images are uploaded
 }}
/>
{images.length > 0 && (
   <div>
     <img
       src={URL.createObjectURL(images[selectedImageIndex])}
       alt="Selected Car Image"
       style={{ maxWidth: '100%' }}
     />
     <div>
       <Button
         disabled={selectedImageIndex === 0}
         onClick={() => setSelectedImageIndex(selectedImageIndex - 1)}
       >
         Previous
       </Button>
       <Button
         disabled={selectedImageIndex === images.length - 1}
         onClick={() => setSelectedImageIndex(selectedImageIndex + 1)}
       >
         Next
       </Button>
     </div>
   </div>
 )}
</DialogContent>

     <DialogActions sx={{ pb: 3, px: 3 }}>
       <Button onClick={handleClose}>Cancel</Button>
       <Button variant="contained" type="submit">
         Create Listing
       </Button>
     </DialogActions>
   </Dialog>
 );
}
