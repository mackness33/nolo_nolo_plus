import * as React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { identity, checkLogged } from "../comms";

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

import useMediaQuery from "@mui/material/useMediaQuery";
import { NetworkContext } from "../NetworkContext";
import { SiSitepoint } from "react-icons/si";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import CommentIcon from "@mui/icons-material/Comment";

import Tooltip from "@mui/material/Tooltip";

import "animate.css";
import { display } from "@mui/system";

const userSchema = {
  name: "",
  surname: "",
  birth: "",
  oldMail: "",
  mail: "",
  role: 2,
};

const es = {
  _id: "61c11e49c5fa076a8980e4d3",
  status: 1,
  feedback: [],
  birth: "2021-12-02T00:00:00.000Z",
  __v: 12,
  points: 990,
  name: "primo",
  surname: "levi",
  mail: "primo@levi",
  password: "aa",
  role: 2,
  picture: "foto",
};

const Profile = () => {
  const [editable, setEditable] = React.useState(false);
  const [showMsg, setShowMsg] = React.useState(false);
  const [msg, setMsg] = React.useState("wow");
  const [color, setColor] = React.useState("red");
  const [showPsw, setShowPsw] = React.useState(false);
  const { globalUser, setGlobalUser } = React.useContext(NetworkContext);
  const navigate = useNavigate();

  const [user, setUser] = React.useState();
  const [name, setName] = React.useState("");
  const [surname, setSurname] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [birth, setBirth] = React.useState(new Date());
  const [mail, setMail] = React.useState("");
  const [points, setPoints] = React.useState("");
  const [proPic, setProPic] = React.useState("");

  const handleEditButton = () => {
    setEditable(true);
  };

  const handleProPicChange = async (e) => {
    const base64 = await getdataUrl(e.target.files[0]);
    setProPic(base64);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    await userLogged();
    let tmpUser = {
      name: "",
      surname: "",
      mail: "",
      password: "",
      picture: "",
      birth: "",
    };
    tmpUser.name = name;
    tmpUser.surname = surname;
    tmpUser.password = password;
    tmpUser.mail = mail;
    tmpUser.picture = proPic;
    tmpUser.birth = birth;

    const res = await axios.post("http://localhost:8000/front/user/update", {
      ...tmpUser,
    });
    console.log(res.data);
    if (res.data.success) {
      if (tmpUser.mail !== user.mail) {
        alert("Avverra' un Logout, si prega di accedere con la nuova mail.");
        logoutHandler();
      }
      const wow = user;
      wow.name = name;
      wow.surname = surname;
      wow.password = password;
      wow.mail = mail;
      wow.picture = proPic;
      wow.birth = birth;
      setGlobalUser(user);
      showMessage("Dati aggiornati", true);
    } else {
      setProfileState(user);
      showMessage("Aggiornamento fallito", false);
    }
    setEditable(false);
  };

  const handleCancelEdit = (e) => {
    e.preventDefault();
    setEditable(false);
    setProfileState(user);
  };

  React.useEffect(async () => {
    await userLogged();
  }, []);

  const userLogged = async () => {
    const res = await identity();
    if (res.success) {
      setGlobalUser(res.payload);
      setUser(res.payload);
      setProfileState(res.payload);
    } else {
      setGlobalUser(null);
      navigate("/");
      return;
    }
    console.log(res);
  };

  const setProfileState = (data) => {
    console.log(data);
    setName(data.name);
    setSurname(data.surname);
    setPassword(data.password);
    setBirth(data.birth);
    setMail(data.mail);
    setPoints(data.points);
    setProPic(data.picture);
  };

  const showMessage = (msg, happy) => {
    setMsg(msg);
    const col = happy ? "green" : "red";
    setColor(col);
    setShowMsg(true);
    setTimeout(() => {
      setShowMsg(false);
    }, 3000);
  };

  const logoutHandler = async () => {
    const res = await axios.get("http://localhost:8000/front/auth/logout");
    if (res.data.success) {
      setGlobalUser(null);
    }
    console.log(res);
    navigate("/");
  };

  const getdataUrl = (img) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(img);
    });
  };

  return (
    <Container maxWidth='xl'>
      <Paper sx={{ height: "55vh", display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "40%", display: "flex", justifyContent: "center" }}>
          <Avatar
            onClick={() => {
              console.log(globalUser);
            }}
            src={proPic}
            sx={{ height: "20rem", width: "20rem" }}
          />
        </Box>
        <form style={{ height: "100%" }} onSubmit={handleSaveEdit}>
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
              value={name}
              size='small'
              label='Nome'
              required
              disabled={!editable}
              onChange={(e) => {
                setName(e.target.value);
              }}
            >
              {user?.name}
            </TextField>
            <TextField
              sx={{ my: "0.5rem" }}
              inputProps={{ style: { textTransform: "capitalize" } }}
              value={surname}
              size='small'
              label='Cognome'
              required
              disabled={!editable}
              onChange={(e) => {
                setSurname(e.target.value);
              }}
            ></TextField>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                disabled={!editable}
                clearable
                value={birth}
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
                onChange={(date) => {
                  setBirth(date.toISOString().split("T")[0]);
                }}
              />
            </LocalizationProvider>
            <Tooltip
              placement='right'
              title="Per questioni di sicurezza, se si modifica la mail si verra' scollegati."
            >
              <TextField
                sx={{ my: "0.5rem" }}
                value={mail}
                size='small'
                label='E-mail'
                required
                disabled={!editable}
                type='email'
                onChange={(e) => {
                  setMail(e.target.value);
                }}
              ></TextField>
            </Tooltip>
            <Box display={"flex"}>
              <TextField
                sx={{ my: "0.5rem" }}
                value={password}
                size='small'
                label='Password'
                required
                disabled={!editable}
                type={showPsw ? "text" : "password"}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              ></TextField>
              <IconButton
                onClick={() => {
                  setShowPsw(!showPsw);
                }}
              >
                {!showPsw ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </Box>
            <TextField
              sx={{ my: "0.5rem" }}
              value={points}
              size='small'
              label='Punti'
              disabled
              type='text'
            ></TextField>
            {!editable ? (
              <>
                <Button
                  onClick={handleEditButton}
                  sx={{ width: "7rem" }}
                  variant='outlined'
                  size='small'
                >
                  modifica
                </Button>
                {showMsg && (
                  <Typography
                    sx={{
                      mt: "0.5rem",
                      fontWeight: "bold",
                      fontSize: 20,
                      color: { color },
                    }}
                    className='animate__animated animate__bounceIn'
                  >
                    {msg}
                  </Typography>
                )}
              </>
            ) : (
              <>
                <Box>
                  <Button
                    type='submit'
                    sx={{ width: "7rem", mr: "0.5rem" }}
                    variant='contained'
                    size='small'
                  >
                    salva
                  </Button>

                  <Button
                    onClick={handleCancelEdit}
                    sx={{ width: "7rem" }}
                    variant='outlined'
                    size='small'
                  >
                    annulla
                  </Button>
                </Box>
                <input
                  onChange={handleProPicChange}
                  type='file'
                  hidden
                  id='fileUpload'
                />
                <label htmlFor='fileUpload'>
                  <Button
                    component='span'
                    sx={{ width: "8rem", mt: "0.5rem" }}
                    variant='contained'
                    size='small'
                  >
                    cambia avatar
                  </Button>
                </label>
              </>
            )}
          </Container>
        </form>
      </Paper>
      <BookingContainer />
    </Container>
  );
};

const BookingContainer = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = React.useState();

  React.useEffect(async () => {
    const res = await axios.get("http://localhost:8000/front/user/getBookings");

    setBookings(res.data);
  }, []);

  const tmp = () => {
    console.log(bookings);
  };

  return (
    <Paper
      sx={{
        mt: "1rem",
        height: "50vh",
        display: "flex",
        justifyContent: "center",
        p: "2rem",
      }}
    >
      <Card sx={{ height: "22rem" }}>
        <CardContent>cazzo</CardContent>
        <CardActions>
          <Button onClick={tmp}>fanculo</Button>
        </CardActions>
      </Card>
    </Paper>
  );
};

export default Profile;
