import * as React from "react";
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

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

import useMediaQuery from "@mui/material/useMediaQuery";

export default function SimpleContainer() {
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
        <FilterAccordion />
        <CardContainer />
      </Container>
    </React.Fragment>
  );
}

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
