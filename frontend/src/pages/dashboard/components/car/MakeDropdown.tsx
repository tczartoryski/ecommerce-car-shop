import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Typography } from '@mui/material';


const possibleMakes = [
    'Alfa Romeo', 'Audi',   'BMW',
    'Chevrolet',  'Chrysler', 
    'Dodge', 'Fiat', 'Ford', 'Honda',
    'Hummer', 'Hyundai', 'Infiniti',
    'Jaguar', 'Jeep', 'Kia',
    'Land Rover', 'Lexus',    'Mazda',
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
      <FormControl variant="standard" sx={{width: '100%'}}>
        <InputLabel id="demo-simple-select-standard-label">Make</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={make}
          onChange={handleChange}
          label="Make"
          displayEmpty
          sx={{width: '100%',  height: '38.125px', paddingTop: '8px', paddingBottom: '8px', paddingRight: '12px', paddingLeft: '12px' }}
          startAdornment={make === '' ? <Typography sx={{ width: '100%' }}>Enter a make</Typography> : null}        >
          {possibleMakes.map((make) => (
        <MenuItem key={make} value={make}>
          {make}
        </MenuItem>
      ))}
        </Select>
      </FormControl>
    </div>
  );
}