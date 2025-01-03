import * as React from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  Typography,
  SelectChangeEvent,
} from '@mui/material';

const possibleColors = [
  'Red',
  'Blue',
  'Green',
  'Black',
  'White',
  'Silver',
  'Gray',
  'Yellow',
  'Orange',
  'Brown',
  'Purple',
];

interface ColorDropdownProps {
  color: string;
  setColor: (value: string) => void;
}

const ColorDropdown: React.FC<ColorDropdownProps> = ({ color, setColor }) => {
  const handleChange = async (event: SelectChangeEvent) => {
    setColor(event.target.value);
  };

  return (
    <div>
      <FormControl variant="standard" sx={{ width: '100%' }}>
        <Typography variant="body1">Color</Typography>
        <Select
          labelId="color-select-label"
          id="color-select"
          value={color}
          onChange={handleChange}
          displayEmpty
          sx={{ width: '100%', minWidth: 150 }}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return (
                <Typography sx={{ color: 'text.secondary', paddingLeft: 2 }}>
                  Enter a Color
                </Typography>
              );
            }
            return (
              <Typography sx={{ color: 'text.secondary', paddingLeft: 2 }}>
                {selected}
              </Typography>
            );
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
