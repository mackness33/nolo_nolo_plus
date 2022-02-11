import * as React from "react";
import axios from "axios";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";

import InboxIcon from "@mui/icons-material/MoveToInbox";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import StarBorder from "@mui/icons-material/StarBorder";

import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import FilterListIcon from "@mui/icons-material/FilterList";
import Button from "@mui/material/Button";

import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import Tab from "@mui/material/Tab";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import useMediaQuery from "@mui/material/useMediaQuery";

const vars = React.createContext({domain: 'http://localhost:8000/front', url: 'cicca'});
const pics = React.createContext(null);

const theme = createTheme({
  palette: {
    background: {
      paper: '#fff',
    },
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#52b202',
      main: '#76ff03',
      dark: '#91ff35',
      contrastText: '#000',
    },
  },
})

export default function SimpleContainer() {
  const [tmp, setTmp] = React.useState('ciao');


  return (
    <React.Fragment>
      <CssBaseline />

      <Container
        maxWidth='xl'
        sx={{
          display: "flex",
          flexDirection: "column",
          mt: "2rem",
        }}
      >
      <pics.Provider value={{tmp, setTmp}}>
        <ProfilePicture />
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="baseline"
          spacing={8}
        >
          <OptionsTabs />
          <Description />
        </Stack>
      </pics.Provider>
      </Container>
    </React.Fragment>
  );
}

const ProfilePicture = (props) => {
  const [isPicture, setIsPicture] = React.useState(false);
  const [full_name, setFullName] = React.useState("name");
  const [picture, setPicture] = React.useState(null);

  const var_ = React.useContext(vars);
  const {tmp, setTmp} = React.useContext(pics);

  const handleIsPicture = () => {
    setIsPicture(!isPicture);
  };

  const handleFullName = (name) => {
    setFullName(name);
  };

  const handlePicture = (url) => {
    setPicture(url);
  };

  /**
  * This call
  */
  React.useEffect(async () => {
    const res = await axios(`${var_.domain}/getOne`, {params: {mail: 'd@d'}});
    console.log(res.data);
    handleFullName(`${res.data.name} ${res.data.surname}` );
    handlePicture(res.data.picture);

  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: 300,
        minHeight: 300,
      }}
    >
      <Avatar
          alt={full_name}
          src={picture}
          sx={{ width: 300, height: 300 }}
        />
      <div>{full_name}</div>
    </Box>
  );
}

const Description = (props) => {
  const [user, setUser] = React.useState(null);

  const var_ = React.useContext(vars);
  const {tmp, setTmp} = React.useContext(pics);

  const handleUser = (user) => {
    setUser(user);
  };
  /**
  * This call
  */
  React.useEffect(async () => {
    const res = await axios(`${var_.domain}/getOne`, {params: {mail: 'd@d'}});
    console.log("In Description");
    console.log(`user: ${JSON.stringify(res.data)}`);
    handleUser(res.data);
  }, []);

  return (
    <Box
      sx={{
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: 300,
        minHeight: 300,
        color: 'secondary',
        border: '1px dashed grey',
      }}
    >
    <Text text={user?.full_name} variant='h3'/>
    </Box>
  );
}

const Text = ({text, variants}) => {
  // [text, setText] = React.useState('');
  //
  // React.useEffect(async () => {
  //   const res = await axios(`${var_.domain}/getOne`, {params: {mail: 'd@d'}});
  //   console.log("In Description");
  //   console.log(`user: ${JSON.stringify(res.data)}`);
  //   handleUser(res.data);
  // }, []);

  return <Typography
    sx={{
      textTransform: 'capitalize',
      display: 'flex',
      fontSize: "2rem",
      lineHeight: 10,
      fontFamily: 'Monospace',
    }}
    variant={variants} gutterBottom component="div"
  >
  {text}
  </Typography>
}

const OptionsTabs = () => {
  const [checked, setChecked] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [value, setValue] = React.useState('1');

  const handleToggle = (value) => () => {
    const newChecked = [...checked];
    if (checked.indexOf(value) !== -1) {
      newChecked.splice(checked.indexOf(value), 1);
    } else {
      newChecked.push(value);
    }

    setChecked(newChecked);
    console.log(checked);
  };

  const handleClick = () => {
    setOpen(!open);
  };


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      component={"div"}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mr: "2rem",
        borderRadius: 2,
        alignItems: 'center',
        minWidth: 300,
        minHeight: 300,
        border: '1px dashed grey',
        color: 'primary',
      }}
    >
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Item One" value="1" />
            <Tab label="Item Two" value="2" />
            <Tab label="Item Three" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">Item One</TabPanel>
        <TabPanel value="2">Item Two</TabPanel>
        <TabPanel value="3">Item Three</TabPanel>
      </TabContext>
    </Box>
  );
};

const FilterAccordion = () => {
  const [checked, setChecked] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);

  const handleToggle = (value) => () => {
    const newChecked = [...checked];
    if (checked.indexOf(value) !== -1) {
      newChecked.splice(checked.indexOf(value), 1);
    } else {
      newChecked.push(value);
    }

    setChecked(newChecked);
    console.log(checked);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Box
      component={"div"}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        mr: "2rem",
      }}
    >
      <Button
        onClick={() => {
          setOpen1(!open1);
        }}
        variant='contained'
        endIcon={
          open1 ? (
            <FilterListOffIcon sx={{ ml: "1rem" }} />
          ) : (
            <FilterListIcon sx={{ ml: "1rem" }} />
          )
        }
      >
        Filtri
      </Button>
      <Collapse in={open1} timeout='auto' unmountOnExit>
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            display: "flex",
            flexWrap: "wrap",
            boxShadow: 3,
            borderRadius: "0.2rem",
          }}
        >
          {[0, 1, 2, 3].map((value) => {
            const labelId = `checkbox-list-label-${value}`;
            return (
              <div>
                <ListItemButton role={undefined} onClick={handleClick} dense>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText
                    id={labelId}
                    primary={`Line item ${value + 1}`}
                  />
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout='auto' unmountOnExit>
                  <List component='div' disablePadding>
                    <ListItemButton
                      sx={{ pl: 4 }}
                      onClick={handleToggle(value)}
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge='start'
                          checked={checked.indexOf(value) !== -1}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText primary='Starred' />
                    </ListItemButton>
                    <ListItemButton
                      sx={{ pl: 4 }}
                      onClick={handleToggle(value)}
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge='start'
                          checked={checked.indexOf(value) !== -1}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText primary='Starred' />
                    </ListItemButton>
                  </List>
                </Collapse>
              </div>
            );
          })}
        </List>
      </Collapse>
    </Box>
  );
};

const CardContainer = () => {
  const mobile = useMediaQuery("(max-width: 768px)");
  return (
    <Box>
      <Container
        sx={[
          {
            display: "flex",
            flexWrap: "wrap",
            ml: "0rem",
            mr: "0rem",
            minWidth: "100%",
          },
          mobile && {
            justifyContent: "center",
          },
        ]}
        disableGutters
      >
        <Computercard />
        <Computercard />
        <Computercard />
        <Computercard />
        <Computercard />
        <Computercard />
        <Computercard />
      </Container>
    </Box>
  );
};

const Computercard = () => {
  const res = useMediaQuery("(max-width: 768px)");

  return (
    <Card
      sx={{
        maxWidth: "15rem",
        margin: "1rem",
      }}
    >
      <CardMedia
        component='img'
        height='140'
        image='https://www.gettyimages.it/gi-resources/images/500px/983794168.jpg'
        alt='green iguana'
      />
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          Lizard
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </Typography>
      </CardContent>
      <CardActions>
        <Button size='small'>Share</Button>
        <Button size='small'>Learn More</Button>
      </CardActions>
    </Card>
  );
};
