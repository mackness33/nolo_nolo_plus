import * as React from "react";
import axios from "axios";
import Box from "@mui/material/Box";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import FormGroup from "@mui/material/FormGroup";
import { Container } from "@mui/material";

import Paper from "@mui/material/Paper";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import Chip from "@mui/material/Chip";

import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

import Button from "@mui/material/Button";
import { ComputerContext } from "./HomeContext";

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

function getStyles(name, typeName, theme) {
  return {
    fontWeight:
      typeName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function Searchbar2() {
  const [brand, setBrand] = React.useState([]);
  const [components, setComponents] = React.useState();
  const mobile = useMediaQuery("(max-width: 768px)");
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);

  const theme = useTheme();
  const [typeName, settypeName] = React.useState([]);

  const { computers, setComputers } = React.useContext(ComputerContext);

  const handleBrandChange = (event) => {
    const {
      target: { value },
    } = event;
    setBrand(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleTypeChange = (event) => {
    const {
      target: { value },
    } = event;
    settypeName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    if (startDate === null) {
      setStartDate("");
      return;
    }
    if (endDate === null) {
      setEndDate("");
      return;
    }

    const res = await axios.get("http://localhost:8000/front/home/search", {
      params: {
        ...(brand.length ? { brand } : {}),
        ...(typeName.length ? { type: typeName } : {}),
        begin: new Date(startDate).toISOString().split("T")[0],
        end: new Date(endDate).toISOString().split("T")[0],
      },
    });
    console.log(res.data);
    setComputers(res.data);
  };

  React.useEffect(async () => {
    let computers = await axios.get("http://localhost:8000/front/home/getAll");
    setComputers(computers.data);
    let res = await axios.get(
      "http://localhost:8000/front/home/getAllComponents"
    );
    setComponents(res.data);
  }, []);

  return (
    <>
      <form>
        <Container maxWidth='xl' sx={{ mt: "1rem" }}>
          <Paper
            elevation={5}
            sx={[
              {
                bgcolor: "white",
                color: "white",
                minHeight: "3rem",
              },
            ]}
          >
            <Container
              component='div'
              sx={{ color: "info.main", pt: "0.5rem" }}
            >
              Compila i campi per cercare i prodotti:
            </Container>

            <Container
              sx={[
                {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  py: "1rem",
                },
                mobile && {
                  flexDirection: "column",
                },
              ]}
            >
              {/* brand selector box */}
              <Box
                sx={[
                  { minWidth: "10rem", mx: "0.5rem" },
                  mobile && {
                    width: "90%",
                    my: "0.5rem",
                  },
                ]}
              >
                <FormControl fullWidth>
                  <InputLabel id='brandLabel'>Marca</InputLabel>
                  <Select
                    labelId='brandLabel'
                    id='brandSelect'
                    value={brand}
                    multiple
                    label='Marca'
                    onChange={handleBrandChange}
                    input={
                      <OutlinedInput
                        id='select-multiple-chip'
                        label='Categoria'
                      />
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {/* {components?.brand.map((val) => {
                      return <MenuItem value={val}>{val}</MenuItem>;
                    })} */}
                    {components?.brand.map((val) => (
                      <MenuItem
                        key={val}
                        value={val}
                        style={getStyles(val, typeName, theme)}
                      >
                        {val}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box
                sx={[
                  { width: "15rem", mx: "0.5rem" },
                  mobile && {
                    width: "90%",
                    my: "0.5rem",
                  },
                ]}
              >
                <FormControl fullWidth>
                  <InputLabel id='typeLabel'>Categoria</InputLabel>
                  <Select
                    labelId='typeLabel'
                    id='typeSelect'
                    multiple
                    value={typeName}
                    onChange={handleTypeChange}
                    input={
                      <OutlinedInput
                        id='select-multiple-chip'
                        label='Categoria'
                      />
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {components?.type.map((val) => (
                      <MenuItem
                        key={val}
                        value={val}
                        style={getStyles(val, typeName, theme)}
                      >
                        {val}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box
                sx={[
                  {
                    display: "flex",
                    justifyContent: "center",
                    minWidth: "6rem",
                    mx: "0.5rem",
                  },
                  mobile && {
                    width: "90%",
                    my: "0.5rem",
                  },
                ]}
              >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    clearable
                    label='Data ritiro'
                    value={startDate}
                    onChange={(newValue) => {
                      setStartDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Box>
              <Box
                sx={[
                  {
                    display: "flex",
                    justifyContent: "center",
                    minWidth: "6rem",
                    mx: "0.5rem",
                  },
                  mobile && {
                    width: "90%",
                    my: "0.5rem",
                  },
                ]}
              >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label='Data consegna'
                    value={endDate}
                    onChange={(newValue) => {
                      setEndDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Box>
              <Button
                size='large'
                type='submit'
                sx={{ mx: "0.5rem" }}
                onClick={handleSearch}
                variant='contained'
              >
                Cerca
              </Button>
            </Container>
          </Paper>
        </Container>
      </form>
    </>
  );
}
