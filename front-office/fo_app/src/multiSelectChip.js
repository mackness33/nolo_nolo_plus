import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "David",
  "Fabio",
  "Alessandro",
  "Ludovico",
  "Michelangelo",
  "Giovanni",
  "a",
  "b",
  "c",
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

// const Logo = ({first = 'none', second = 'none', attr}) => {
//   const [small, setSmall] = React.useState(first);
//   const [medium, setMedium] = React.useState(second);
//   attr.display.xs = first
//   attr.display.md = second
//
//   // TODO: replace the logo with a real image
//   return <Typography
//     variant="h6"
//     noWrap
//     component="div"
//     sx={{ ...attr }}
//   >
//     LOGO
//   </Typography>;
// }

const MultipleSelectChip = ({xs = 'none', md = 'none'}) => {
  const [small, setSmall] = React.useState(xs);
  const [medium, setMedium] = React.useState(md);
  const [personName, setPersonName] = React.useState([]);
  const theme = useTheme();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div>
      <FormControl sx={{minWidth:100, maxWidth:300}}>
        <InputLabel id="search-multiple-chip-label">Chip</InputLabel>
        <Select
          labelId="search-multiple-chip-label"
          id="search-multiple-chip"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, personName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default MultipleSelectChip;
