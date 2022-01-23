import * as React from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';

const SearchButton = ({xs = 'none', md = 'none'}) => {
  const [small, setSmall] = React.useState(xs);
  const [medium, setMedium] = React.useState(md);

  return (
    <FormControl sx={{ flexGrow: 5, display: {xs: small, md: medium} }}>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" >
          Search
        </Button>
      </Stack>
    </FormControl>
  );
}

export default SearchButton;
