import * as React from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import FormControl from '@mui/material/FormControl';
import DatePicker from '@mui/lab/DatePicker';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import Stack from '@mui/material/Stack';
// import Stack from './ResponsiveComponent';

const ResponsiveDatePickers = ({xs = 'none', sm = 'none', md = 'none'}) => {
  const [extra_small, setExtraSmall] = React.useState(xs);
  const [small, setSmall] = React.useState(sm);
  const [medium, setMedium] = React.useState(md);
  const [value, setValue] = React.useState(new Date());

  return (
    <div>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            disableFuture
            label="Responsive"
            openTo="year"
            views={['year', 'month', 'day']}
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
    </div>
  );
}

const ResponsiveComponent = ({xs = 'none', sm = 'none', md = 'none'}) => {
  const [extra_small, setExtraSmall] = React.useState(xs);
  const [small, setSmall] = React.useState(sm);
  const [medium, setMedium] = React.useState(md);

  return (
    <div>
      <FormControl sx={{display: {xs: extra_small, sm: small, md: medium} }}>

      </FormControl>
    </div>
  );
}

export default ResponsiveDatePickers;
