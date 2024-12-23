import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Typography } from '@mui/material';


const popularCarColors = [
    'White',
    'Black',
    'Gray',
    'Silver',
    'Red',
    'Blue',
    'Brown',
    'Green',
    'Beige',
    'Yellow',
    'Orange',
    'Purple',
    'Gold',
    'Burgundy',
    'Champagne'
];


interface ColorDropdownProps {
color: string;
setColor: (value: string) => void;
}

export const ColorDropdown: React.FC<ColorDropdownProps> = ({ color, setColor }) => {
  const handleChange = async (event: SelectChangeEvent) => {
    setColor(event.target.value);
  };

  return (
    <div>
      <FormControl variant="standard" sx={{width: '100%'}}>
        <InputLabel id="demo-simple-select-standard-label">Color</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={color}
          onChange={handleChange}
          label="Color"
          displayEmpty
          sx={{width: '100%',  height: '38.125px', paddingTop: '8px', paddingBottom: '8px', paddingRight: '12px', paddingLeft: '12px' }}
          startAdornment={color === '' ? <Typography sx={{ width: '100%' }}>Enter a color</Typography> : null}        >
          {popularCarColors.map((color) => (
        <MenuItem key={color} value={color}>
          {color}
        </MenuItem>
      ))}
        </Select>
      </FormControl>
    </div>
  );
}