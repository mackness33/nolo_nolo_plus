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

import Divider from "@mui/material/Divider";

import useMediaQuery from "@mui/material/useMediaQuery";
import { ComputerContext } from "./HomeContext";

import { BsCpu } from "react-icons/bs";
import { GiProcessor } from "react-icons/gi";
import { FaMemory } from "react-icons/fa";
import { fontSize, textTransform } from "@mui/system";

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
  const [checkedN, setCheckedN] = React.useState({ cpu: [], gpu: [], ram: [] });
  const [open, setOpen] = React.useState(false);
  const [openN, setOpenN] = React.useState([false, false, false]);
  const [open1, setOpen1] = React.useState(false);
  const { computers, setComputers } = React.useContext(ComputerContext);

  const filters = ["cpu", "gpu", "ram"];

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

  const handleToggleN = (label) => () => {
    // const newChecked = [...checked];
    // if (checked.indexOf(value) !== -1) {
    //   newChecked.splice(checked.indexOf(value), 1);
    // } else {
    //   newChecked.push(value);
    // }

    // setChecked(newChecked);
    // console.log(checked);
    console.log(checkedN[label]);
  };

  const handleClickN = (i) => {
    let tmp = [...openN];
    tmp[i] = !tmp[i];
    setOpenN(tmp);
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
            boxShadow: 3,
            borderRadius: "0.2rem",
            display: "flex",
          }}
          dense
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
                  <List component='div' dense>
                    <ListItem>
                      <ListItemButton onClick={handleToggle(value)}>
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
                    </ListItem>
                    <ListItem>
                      <ListItemButton onClick={handleToggle(value)}>
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
                    </ListItem>
                  </List>
                </Collapse>
              </div>
            );
          })}
          {filters.map((label) => {
            return (
              <div>
                <ListItemButton
                  onClick={() => {
                    handleClickN(filters.indexOf(label));
                  }}
                >
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText id='cpuSelect' primary={label} />
                  {openN[filters.indexOf(label)] ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </ListItemButton>
                <Collapse
                  in={openN[filters.indexOf(label)]}
                  timeout='auto'
                  unmountOnExit
                >
                  <List component='div' dense>
                    <ListItem>
                      <ListItemButton
                        onClick={handleToggleN(label)}
                      ></ListItemButton>
                    </ListItem>
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
  const { computers, setComputers } = React.useContext(ComputerContext);

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
            justifyContent: "center",
          },
        ]}
        disableGutters
      >
        {computers?.map((computer) => {
          // console.log(computer);
          return <Computercard computer={computer} />;
        })}
      </Container>
    </Box>
  );
};

const Computercard = ({ computer }) => {
  const res = useMediaQuery("(max-width: 768px)");

  console.log(computer);

  return (
    <Card
      sx={{
        minWidth: "18rem",
        minHeight: "35rem",
        margin: "1rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardMedia
        sx={[
          {
            height: "15rem",
            objectFit: "contain",
          },
        ]}
        component='img'
        src={computer.image}
        alt={`${computer.brand} ${computer.model}`}
      />
      <Divider />
      <CardContent>
        <Typography
          sx={{
            color: "text.secondary",
            fontWeight: "bold",
            textTransform: "capitalize",
          }}
          variant='h7'
        >
          {computer.brand}
        </Typography>
        <Typography
          sx={{ fontWeight: "bold", textTransform: "capitalize" }}
          gutterBottom
          variant='h5'
          component='div'
        >
          {computer.model}
        </Typography>
        <Typography variant='subtitle1' color='text.secondary'>
          <List disablePadding dense>
            <ListItem disablePadding>
              <ListItemIcon sx={{ display: "flex", justifyContent: "center" }}>
                <BsCpu />
              </ListItemIcon>
              <ListItemText primary={computer.cpu} />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon sx={{ display: "flex", justifyContent: "center" }}>
                <GiProcessor />
              </ListItemIcon>
              <ListItemText primary={computer.gpu} />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon sx={{ display: "flex", justifyContent: "center" }}>
                <FaMemory />
              </ListItemIcon>
              <ListItemText primary={computer.ram} />
            </ListItem>
          </List>
        </Typography>
        <Container
          sx={{
            height: "2.5rem",
            display: "flex",
            justifyContent: "center",
            my: "0.5rem",
          }}
        >
          {computer.discount !== 0 ? (
            <Typography
              sx={{ fontSize: 20, mr: "0.5rem", color: "text.secondary" }}
            >
              <del>{computer.price.toFixed(2)} $</del>
            </Typography>
          ) : (
            <></>
          )}
          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              fontSize: 45,
              fontWeight: "bold",
              fontStyle: "italic",
            }}
          >
            {(
              computer.price -
              (computer.discount / 100) * computer.price
            ).toFixed(2)}
            <Typography
              sx={{ display: "flex", alignItems: "flex-end", ml: "0.3rem" }}
            >
              $
            </Typography>
          </Typography>
        </Container>
      </CardContent>
      <Divider />
      <CardActions
        sx={{ display: "flex", justifyContent: "center", flexGrow: 2 }}
      >
        <Button size='large' variant='contained'>
          Prenota
        </Button>
      </CardActions>
    </Card>
  );
};
