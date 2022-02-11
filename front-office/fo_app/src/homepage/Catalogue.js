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
import { ComputerContext, ComputerBackup } from "./HomeContext";

import { BsCpu } from "react-icons/bs";
import { GiProcessor } from "react-icons/gi";
import { FaMemory } from "react-icons/fa";
import { SiBrandfolder } from "react-icons/si";
import { GrNetwork } from "react-icons/gr";
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
  const defaultFilters = {
    cpu: [],
    gpu: [],
    ram: [],
    brand: [],
    type: [],
  };
  const filters = ["cpu", "gpu", "ram", "brand", "type"];

  const [checkedN, setCheckedN] = React.useState(defaultFilters);
  const [openN, setOpenN] = React.useState([false, false, false, false, false]);
  const [open1, setOpen1] = React.useState(false);
  const [components, setComponents] = React.useState(defaultFilters);
  const mobile = useMediaQuery("(max-width: 768px)");

  const { computers, setComputers } = React.useContext(ComputerContext);
  const { computersB, setComputersB } = React.useContext(ComputerBackup);

  const getShownComponents = () => {
    const tmpComponents = defaultFilters;
    for (let i = 0; i < computersB.length; i++) {
      for (const [key, value] of Object.entries(computersB[i])) {
        if (filters.includes(key)) {
          if (key !== "type") {
            tmpComponents[key].push(computersB[i][key]);
          } else {
            tmpComponents[key] = [...tmpComponents[key], ...computersB[i][key]];
          }
          tmpComponents[key] = [...new Set(tmpComponents[key])];
        }
      }
    }
    console.log(tmpComponents);
    setComponents(tmpComponents);
    console.log(components);
  };

  const handleClickN = (i) => {
    let tmp = [...openN];
    tmp[i] = !tmp[i];
    setOpenN(tmp);
  };

  return (
    <Box
      component={"div"}
      sx={[
        {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        },
        mobile && {
          alignItems: "center",
        },
      ]}
    >
      <form>
        <Box>
          <Button
            sx={mobile && { width: "100%" }}
            onClick={() => {
              setOpen1(!open1);
              getShownComponents();
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
          <Button
            sx={[
              { ml: "1rem" },
              mobile && { ml: "0", my: "0.5rem", width: "100%" },
            ]}
            onClick={(e) => {
              setComputers(computersB);
              setCheckedN(defaultFilters);
              setOpen1(false);
            }}
            variant='contained'
          >
            Pulisci Filtri
          </Button>
        </Box>
        <Collapse
          in={open1}
          sx={mobile && { width: "100%" }}
          timeout='auto'
          unmountOnExit
        >
          <List
            sx={[
              {
                width: "100%",
                bgcolor: "background.paper",
                boxShadow: 3,
                borderRadius: "0.2rem",
                display: "flex",
                flexWrap: "wrap",
              },
              mobile && {
                flexWrap: "nowrap",
                flexDirection: "column",
              },
            ]}
            dense
          >
            {filters.map((label) => {
              return (
                <div>
                  <ListItemButton
                    onClick={() => {
                      handleClickN(filters.indexOf(label));
                    }}
                  >
                    <ListItemIcon>
                      {(label === "cpu" && <BsCpu />) ||
                        (label === "ram" && <FaMemory />) ||
                        (label === "type" && <GrNetwork />) ||
                        (label === "brand" && <SiBrandfolder />) ||
                        (label === "gpu" && <GiProcessor />)}
                    </ListItemIcon>
                    <ListItemText
                      id={`${label}Select`}
                      primary={label.toUpperCase()}
                    />
                    {openN[filters.indexOf(label)] ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </ListItemButton>
                  <Collapse in={openN[filters.indexOf(label)]} timeout='auto'>
                    <List
                      component='div'
                      dense
                      sx={[
                        {
                          maxHeight: "10rem",
                          overflowY: "scroll",
                          maxWidth: "15rem",
                          overflowX: "auto",
                        },
                        mobile && {
                          maxWidth: "none",
                        },
                      ]}
                    >
                      <InnerFilterList
                        components={components}
                        setCheckedN={setCheckedN}
                        checked={checkedN}
                        label={label}
                      />
                    </List>
                  </Collapse>
                </div>
              );
            })}
          </List>
        </Collapse>
      </form>
    </Box>
  );
};

const InnerFilterList = ({
  components,
  setCheckedN,
  checked,
  label,
  globalCheck,
}) => {
  const { computers, setComputers } = React.useContext(ComputerContext);
  const { computersB, setComputersB } = React.useContext(ComputerBackup);

  const handle = (key, el) => {
    let tmpCheck = checked;
    let tmpComputers = computers;

    if (tmpCheck[key].includes(el)) {
      tmpCheck[key] = tmpCheck[key].filter((item) => item !== el);
      let missing = computersB.filter((pc) => {
        return pc[key] !== el;
      });
      tmpComputers = [...tmpComputers, ...missing];
    } else {
      tmpCheck[key] = [...tmpCheck[key], el];
      tmpComputers = tmpComputers.filter((pc) => {
        return pc[key] === el;
      });
    }
    tmpComputers = [...new Set(tmpComputers)];
    console.log(tmpComputers);
    setComputers(tmpComputers);
    setCheckedN(tmpCheck);
  };

  return (
    <>
      {components[label]?.map((el) => {
        return (
          <ListItem>
            <ListItemButton>
              <ListItemIcon>
                <Checkbox
                  edge='start'
                  disableRipple
                  tabIndex={-1}
                  onChange={() => {
                    handle(label, el);
                  }}
                />
              </ListItemIcon>
              <ListItemText sx={{ textTransform: "uppercase" }} primary={el} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </>
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

  return (
    <Card
      sx={{
        minWidth: "22rem",
        maxWidth: "22rem",
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
      <CardContent
        sx={{
          height: "80%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Container>
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
                <ListItemIcon
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <BsCpu />
                </ListItemIcon>
                <ListItemText
                  sx={{ textTransform: "uppercase" }}
                  primary={computer.cpu}
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <GiProcessor />
                </ListItemIcon>
                <ListItemText
                  sx={{ textTransform: "uppercase" }}
                  primary={computer.gpu}
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <FaMemory />
                </ListItemIcon>
                <ListItemText
                  sx={{ textTransform: "uppercase" }}
                  primary={computer.ram}
                />
              </ListItem>
            </List>
          </Typography>
        </Container>
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
              $ / giorno
            </Typography>
          </Typography>
        </Container>
      </CardContent>
      <Divider />
      <CardActions
        sx={{ display: "flex", justifyContent: "center", flexGrow: 1 }}
      >
        <Button size='large' variant='contained'>
          Prenota
        </Button>
      </CardActions>
    </Card>
  );
};
