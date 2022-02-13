import * as React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

import { NetworkContext } from "../NetworkContext";
import useMediaQuery from "@mui/material/useMediaQuery";

import Grow from "@mui/material/Fade";

import "animate.css";

const userSchema = {
  name: "",
  surname: "",
  password: "",
  birth: "",
  mail: "",
  status: 0,
  points: 0,
  picture: null,
  role: 3,
};
const userSchemaB = {
  name: "",
  surname: "",
  password: "",
  birth: "",
  mail: "",
  status: 0,
  points: 0,
  picture: null,
  role: 3,
};

const loginSchema = {
  mail: "",
  password: "",
};

export default function RegisterLogin() {
  const [user, setUser] = React.useState(userSchema);
  const [login, setLogin] = React.useState(loginSchema);

  const [birthDate, setBirthDate] = React.useState(null);
  const [proPic, setProPic] = React.useState(null);

  const [loginError, setLoginError] = React.useState(false);
  const [subscribeError, setSubscribeError] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  const tablet = useMediaQuery("(max-width: 1024px)");
  const { globalUser, setGlobalUser } = React.useContext(NetworkContext);
  const navigate = useNavigate();

  const handleRegistrationChange = (e, key) => {
    let tmpUser = user;
    tmpUser[key] = e.target.value;
    setUser(tmpUser);
  };

  const handleLoginChange = (e, key) => {
    let tmpLogin = login;
    tmpLogin[key] = e.target.value;
    setLogin(tmpLogin);
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();

    const regis = await axios.post(
      "http://localhost:8000/front/user/subscribe",
      user
    );
    console.log(user);
    if (regis.data.success) {
      const res = await axios.post("http://localhost:8000/front/auth/login", {
        user: user.mail,
        psw: user.password,
      });

      if (res.data.success) {
        setGlobalUser(res.data.user);
        navigate("/");
      }
      setMsg("Registrazione avvenuta ma login fallito");
      setSubscribeError(true);
      setTimeout(() => {
        setSubscribeError(false);
      }, 3000);
    } else {
      setMsg(regis.data.error);
      setSubscribeError(true);
      setTimeout(() => {
        setSubscribeError(false);
      }, 3000);
    }

    e.target.reset();
    setProPic(null);
  };

  const handleLoginSubmit = async (e = null) => {
    if (e != null) {
      e.preventDefault();
    }
    const res = await axios.post("http://localhost:8000/front/auth/login", {
      user: login.mail,
      psw: login.password,
    });

    if (!res.data.success) {
      setLoginError(true);
      setTimeout(() => {
        setLoginError(false);
      }, 3000);
      return;
    }
    setGlobalUser(res.data.user);
    navigate("/");
  };

  const handleImageUpload = async (e) => {
    const base64 = await getdataUrl(e.target.files[0]);
    const tmpUser = user;
    tmpUser.picture = base64;
    setUser(tmpUser);
    setProPic(base64);
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
    <Grow timeout={500} in={true}>
      <Container maxWidth='xl'>
        <Paper
          sx={[
            {
              height: "80vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
            tablet && { height: "auto", py: "1rem" },
          ]}
        >
          <Container
            sx={[
              {
                height: "80%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
              tablet && {
                flexDirection: "column",
              },
            ]}
          >
            <form style={{ width: "100%" }} onSubmit={handleRegistrationSubmit}>
              <Container
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Typography variant='h5'>Registrati adesso!</Typography>

                <Avatar
                  onClick={() => {
                    console.log(login);
                  }}
                  src={proPic}
                  sx={{ mt: "2rem", height: "4rem", width: "4rem" }}
                />
                <input
                  onChange={handleImageUpload}
                  type='file'
                  hidden
                  id='fileUpload'
                />
                <label htmlFor='fileUpload'>
                  <Button
                    component='span'
                    variant='outlined'
                    size='small'
                    aria-label="Scegli l'immagine profilo"
                    sx={{
                      mt: "0.5rem",
                    }}
                  >
                    Scegli immagine di profilo
                  </Button>
                </label>
                <TextField
                  sx={{ mt: "1.5rem" }}
                  size='small'
                  label='Inserisci il nome'
                  onChange={(e) => {
                    handleRegistrationChange(e, "name");
                  }}
                  required
                ></TextField>
                <TextField
                  sx={{ mt: "1rem" }}
                  size='small'
                  label='Inserisci il Cognome'
                  onChange={(e) => {
                    handleRegistrationChange(e, "surname");
                  }}
                  required
                ></TextField>
                <TextField
                  type='password'
                  sx={{ mt: "1rem" }}
                  size='small'
                  label='Inserisci la password'
                  onChange={(e) => {
                    handleRegistrationChange(e, "password");
                  }}
                  required
                ></TextField>
                <TextField
                  type='email'
                  sx={{ mt: "1rem" }}
                  size='small'
                  label="Inserisci l'e-mail"
                  onChange={(e) => {
                    handleRegistrationChange(e, "mail");
                  }}
                  required
                  autoComplete
                ></TextField>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    clearable
                    value={birthDate}
                    onChange={(date) => {
                      setBirthDate(date);
                      handleRegistrationChange(
                        { target: { value: date.toISOString().split("T")[0] } },
                        "birth"
                      );
                    }}
                    label='Data di Nascita'
                    maxDate={new Date()}
                    renderInput={(props) => (
                      <TextField
                        required
                        size='small'
                        sx={{ mt: "1rem", width: "235px" }}
                        {...props}
                      />
                    )}
                  />
                </LocalizationProvider>
                {subscribeError && (
                  <Typography
                    sx={{
                      mt: "1rem",
                      fontWeight: "bold",
                      fontSize: 20,
                      color: "red",
                    }}
                    className='animate__animated animate__bounceIn'
                  >
                    {msg}
                  </Typography>
                )}
                <Button
                  size='large'
                  sx={{ mt: "2rem" }}
                  variant='contained'
                  type='submit'
                >
                  registrati
                </Button>
              </Container>
            </form>
            <Divider
              sx={tablet && { my: "2rem" }}
              orientation={tablet ? "horizontal" : "vertical"}
              flexItem
            >
              <Typography color='text.secondary'>oppure</Typography>
            </Divider>
            <form style={{ width: "100%" }} onSubmit={handleLoginSubmit}>
              <Container
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Typography variant='h5'>
                  Sei gia' registrato? Accedi ora!
                </Typography>

                <TextField
                  type='email'
                  autoComplete
                  sx={{ mt: "2rem" }}
                  size='small'
                  label='Inserisci la tua mail'
                  onChange={(e) => {
                    handleLoginChange(e, "mail");
                  }}
                  required
                ></TextField>
                <TextField
                  type='password'
                  sx={{ mt: "1rem" }}
                  size='small'
                  label='Inserisci la tua password'
                  onChange={(e) => {
                    handleLoginChange(e, "password");
                  }}
                  required
                ></TextField>
                {loginError && (
                  <Typography
                    sx={{
                      mt: "1rem",
                      fontWeight: "bold",
                      fontSize: 20,
                      color: "red",
                    }}
                    className='animate__animated animate__bounceIn'
                  >
                    Login Fallito
                  </Typography>
                )}
                <Button
                  size='large'
                  sx={{ mt: "2rem" }}
                  variant='contained'
                  type='submit'
                >
                  accedi
                </Button>
              </Container>
            </form>
          </Container>
        </Paper>
      </Container>
    </Grow>
  );
}
