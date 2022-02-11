import * as React from "react";
import CardContainer from "./CardContainer";
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

const filters = ["cpu", "gpu", "ram", "brand", "type"];

export default function SimpleContainer() {
  const mobile = useMediaQuery("(max-width: 768px)");

  return (
    <React.Fragment>
      <CssBaseline />

      <Container
        maxWidth='xl'
        sx={[
          {
            display: "flex",
            flexDirection: "column",
            mt: "2rem",
            px: 0,
          },
        ]}
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
          addEndListener={() => {
            if (!open1) {
              setComputers(computersB);
              setCheckedN(defaultFilters);
            }
          }}
          unmountOnExit
        >
          <List
            sx={[
              {
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
                      primary={
                        label !== "brand" && label !== "type"
                          ? label.toUpperCase()
                          : label === "brand"
                          ? "MARCA"
                          : "TIPO"
                      }
                    />
                    {openN[filters.indexOf(label)] ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </ListItemButton>
                  <Collapse in={openN[filters.indexOf(label)]} timeout='auto'>
                    <div>
                      <List
                        component='div'
                        sx={[
                          {
                            maxHeight: "15rem",
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
                    </div>
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

const InnerFilterList = ({ components, setCheckedN, checked, label }) => {
  const { computers, setComputers } = React.useContext(ComputerContext);
  const { computersB, setComputersB } = React.useContext(ComputerBackup);

  const handle = (key, el) => {
    let tmpCheck = checked;
    let tmpComputers = computersB;

    if (tmpCheck[key].includes(el)) {
      tmpCheck[key] = tmpCheck[key].filter((item) => item !== el);
    } else {
      tmpCheck[key] = [...tmpCheck[key], el];
    }

    for (const [comp, val] of Object.entries(tmpCheck)) {
      tmpComputers = tmpComputers.filter((pc) => {
        if (val.length === 0) {
          return true;
        } else if (comp === "type") {
          return pc[comp].some((k) => val.includes(k));
        } else {
          return val.includes(pc[comp]);
        }
      });
    }

    tmpComputers = [...new Set(tmpComputers)];
    setComputers(tmpComputers);
    setCheckedN(tmpCheck);
  };

  return (
    <>
      {components[label]?.map((el) => {
        return (
          <ListItem disablePadding>
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
