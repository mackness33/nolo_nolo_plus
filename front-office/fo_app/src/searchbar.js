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
import SearchButton from './searchButton';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import MultiSelectChip from './multiSelectChip';
import DatePicker from './datePicker';

// const Container = tw.div`rounded-full bg-white p-6 shadow-xl flex justify-between flex-col md:flex-row md:space-x-2 md:space-y-0 space-y-2`

const Searchbar = () => {
  return (
      <Container >
        { /* EXTRA SMALL SIZE */ }
        <FormControl fullWidth sx={{ m: 10, flexGrow: 5, display: {xs: 'flex', md: 'flex'} }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-evenly"
            alignItems="center"
            spacing={1}
          >
            <MultiSelectChip>
            </MultiSelectChip>
            <MultiSelectChip>
            </MultiSelectChip>
            <DatePicker xs={'flex'} md={'flex'}>
            </DatePicker>
            <DatePicker xs={'flex'} md={'flex'}>
            </DatePicker>
            <SearchButton variant="contained" xs={'flex'} md={'flex'}>
              SEARCH
            </SearchButton>
          </Stack>
        </FormControl>
      </Container>
  );
};

export default Searchbar;
