import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

const possibleColors = [
  'Red', 'Blue', 'Green', 'Black', 'White', 'Silver', 'Gray', 'Yellow', 'Orange', 'Brown', 'Purple'
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
      <FormControl variant="standard" sx={{ width: '100%' }}>
        <InputLabel id="color-select-label" shrink={color !== ''}>Color</InputLabel>
        <Select
          labelId="color-select-label"
          id="color-select"
          value={color}
          onChange={handleChange}
          displayEmpty
          sx={{ width: '100%', minWidth: 150 }}  // Set the minimum width here
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <Typography sx={{ color: 'text.secondary', paddingLeft: 2 }}>Enter a Color</Typography>;
            }
            return <Typography sx={{ color: 'text.secondary', paddingLeft: 2 }}>{selected}</Typography>;
          }}
        >
          {possibleColors.map((color) => (
            <MenuItem key={color} value={color}>
              {color}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default ColorDropdown;