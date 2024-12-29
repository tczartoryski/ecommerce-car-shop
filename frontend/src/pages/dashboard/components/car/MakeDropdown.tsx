import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

const possibleMakes = [
  'Alfa Romeo', 'Audi', 'BMW',
  'Chevrolet', 'Chrysler',
  'Dodge', 'Fiat', 'Ford', 'Honda',
  'Hummer', 'Hyundai', 'Infiniti',
  'Jaguar', 'Jeep', 'Kia',
  'Land Rover', 'Lexus', 'Mazda',
  'Mercedes-Benz', 'MINI', 'Mitsubishi', 'Nissan',
  'Porsche', 'Rover',
  'Subaru', 'Toyota',
  'Volkswagen', 'Volvo'
];

interface MakeDropdownProps {
  make: string;
  setMake: (value: string) => void;
}

export const MakeDropdown: React.FC<MakeDropdownProps> = ({ make, setMake }) => {
  const handleChange = async (event: SelectChangeEvent) => {
    setMake(event.target.value);
  };
  
  return (
    <div>
      <FormControl variant="standard" sx={{ width: '100%' }}>
        <Typography variant="body1">Make</Typography>
        <Select
          labelId="make-select-label"
          id="make-select"
          value={make}
          onChange={handleChange}
          displayEmpty
          sx={{ width: '100%', minWidth: 150 }}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <Typography sx={{ color: 'text.secondary', paddingLeft: 2 }}>Enter a Make</Typography>;
            }
            return <Typography sx={{ color: 'text.secondary', paddingLeft: 2 }}>{selected}</Typography>;;
          }}
        >
          {possibleMakes.map((make) => (
            <MenuItem key={make} value={make}>
              {make}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default MakeDropdown;