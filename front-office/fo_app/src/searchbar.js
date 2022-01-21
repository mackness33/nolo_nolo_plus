import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import MultiSelectChip from './multiSelectChip';
import DatePicker from './datePicker';

// const Container = tw.div`rounded-full bg-white p-6 shadow-xl flex justify-between flex-col md:flex-row md:space-x-2 md:space-y-0 space-y-2`

const Searchbar = () => {
  return (
      <Container maxWidth="xl">
        <FormControl>
          <Stack spacing={2} direction="row">
            <MultiSelectChip>
            </MultiSelectChip>
            <MultiSelectChip>
            </MultiSelectChip>
            <DatePicker>
            </DatePicker>
            <DatePicker>
            </DatePicker>
            <Button variant="contained">
              SEARCH
            </Button>
          </Stack>
        </FormControl>
      </Container>
  );
};

export default Searchbar;
