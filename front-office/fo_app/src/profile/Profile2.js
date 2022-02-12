import * as React from "react";
import axios from "axios";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import useMediaQuery from "@mui/material/useMediaQuery";
import { width } from "@mui/system";

const user = {
  status: 1,
  feedback: [],
  person: {
    name: "primo",
    surname: "levi",
    mail: "primo@levi",
    password: "aa",
    role: 2,
    _id: {
      $oid: "61cb1ed649fee89085be8ca1",
    },
  },
  birth: {
    $date: "2021-12-02T00:00:00.000Z",
  },
  __v: 12,
  points: 1887,
};

const Profile = () => {
  return (
    <Container maxWidth='xl'>
      <Paper sx={{ height: "50vh", display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "25%", display: "flex", justifyContent: "center" }}>
          <Avatar sx={{ height: "20rem", width: "20rem" }} />
        </Box>
        <form style={{ height: "100%" }}>
          <Container
            sx={{
              ml: "0rem",
              pt: "3rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography sx={{ mb: "1rem" }} variant='h5'>
              I tuoi dati:
            </Typography>

            <TextField
              sx={{ my: "0.5rem" }}
              inputProps={{ style: { textTransform: "capitalize" } }}
              value={user.person.name}
              size='small'
              label='Nome'
              required
              disabled
            ></TextField>
            <TextField
              sx={{ my: "0.5rem" }}
              inputProps={{ style: { textTransform: "capitalize" } }}
              value={user.person.surname}
              size='small'
              label='Cognome'
              required
              disabled
            ></TextField>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                disabled
                clearable
                value={user.birth.$date}
                label='Data di Nascita'
                maxDate={new Date()}
                renderInput={(props) => (
                  <TextField
                    required
                    size='small'
                    sx={{ my: "0.5rem", width: "275px" }}
                    {...props}
                  />
                )}
              />
            </LocalizationProvider>
            <TextField
              sx={{ my: "0.5rem" }}
              value={user.person.mail}
              size='small'
              label='E-mail'
              required
              disabled
              type='email'
            ></TextField>
            <Box display={"flex"}>
              <TextField
                sx={{ my: "0.5rem" }}
                value={user.person.password}
                size='small'
                label='Password'
                required
                disabled
                type='email'
              ></TextField>
              <IconButton>
                <Visibility />
              </IconButton>
            </Box>
            <TextField
              sx={{ my: "0.5rem" }}
              value={user.points}
              size='small'
              label='Punti'
              disabled
              type='text'
            ></TextField>
          </Container>
        </form>
      </Paper>
    </Container>
  );
};

export default Profile;
