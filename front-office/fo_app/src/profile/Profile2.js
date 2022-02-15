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

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import Tooltip from "@mui/material/Tooltip";

import "animate.css";
import { display, maxWidth, width } from "@mui/system";
import { set } from "mongoose";

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

  const tablet = useMediaQuery("(max-width: 1024px)");

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
      //navigate("/");
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
      <Paper
        sx={[
          { display: "flex", alignItems: "center", py: "2rem" },
          tablet && { flexDirection: "column" },
        ]}
      >
        <Box sx={[{ width: "40%", display: "flex", justifyContent: "center" }]}>
          <Avatar
            onClick={() => {
              console.log(globalUser);
            }}
            src={proPic}
            sx={[
              { height: "20rem", width: "20rem" },
              tablet && { height: "5rem", width: "5rem" },
            ]}
          />
        </Box>
        <form style={{ height: "100%" }} onSubmit={handleSaveEdit}>
          <Container
            sx={[
              {
                ml: "0rem",
                display: "flex",
                flexDirection: "column",
              },
              tablet && { mt: "2rem" },
            ]}
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
                    sx={{ my: "0.5rem", maxWidth: "275px" }}
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
  const [trigger, setTrigger] = React.useState(false);
  const tablet = useMediaQuery("(max-width: 1024px)");

  const { globalUser, setGlobalUser } = React.useContext(NetworkContext);

  const [filter, setFilter] = React.useState(null);

  const fireTrigger = () => {
    console.log("sonqui");
    console.log(trigger);
    setTrigger(!trigger);
  };

  React.useEffect(async () => {
    const user = await identity();
    const res = await axios.get(
      "http://localhost:8000/front/user/getBookings",
      { params: { mail: "primo@levi" } }
    );
    // console.log(res);
    if (!res.data.success) {
      setGlobalUser(null);
      navigate("/");
      return;
    }
    let tmp = res.data.payload;
    tmp.sort(function (a, b) {
      return new Date(b.begin) - new Date(a.begin);
    });
    setBookings(tmp);
  }, [trigger]);

  const tmp = () => {
    console.log(bookings);
  };

  const compareDates = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    return d1 < d2;
  };

  return (
    <Paper
      onClick={() => {}}
      sx={{
        mt: "1rem",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        p: "2rem",
      }}
    >
      <Typography
        onClick={() => {
          console.log(filter);
        }}
        variant='h5'
      >
        Noleggi
      </Typography>
      <Divider flex />
      <ToggleButtonGroup
        sx={[
          { mt: "2rem", display: "flex", justifyContent: "center" },
          tablet && { width: "100%" },
        ]}
        color='secondary'
        value={filter}
        exclusive
        orientation={tablet ? "vertical" : "horizontal"}
        onChange={(e, val) => {
          setFilter(val);
        }}
        size='small'
        fullWidth
      >
        <ToggleButton value='0'>revocati</ToggleButton>
        <ToggleButton value='1'>indisponibili</ToggleButton>
        <ToggleButton value='2'>futuri</ToggleButton>
        <ToggleButton value='3'>attivi</ToggleButton>
        <ToggleButton value='4'>problemi</ToggleButton>
        <ToggleButton value='5'>conclusi</ToggleButton>
      </ToggleButtonGroup>
      <List dense sx={{ width: "100%" }}>
        {bookings?.map((el) => {
          return (
            <BookingItem
              booking={el}
              filter={filter}
              fireTrigger={fireTrigger}
            />
          );
        })}
      </List>
    </Paper>
  );
};

function init(booking) {
  return booking;
}

function reducer(state, action) {
  switch (action.type) {
    case "updateStart":
      return { ...state, begin: action.payload };
    case "updateEnd":
      return { ...state, end: action.payload };
    case "setPrice":
      return { ...state, final_price: action.payload };
    case "reset":
      return init(action.payload);
    default:
      throw new Error();
  }
}

const BookingItem = ({ booking, filter, fireTrigger }) => {
  const tablet = useMediaQuery("(max-width: 1024px)");
  const navigate = useNavigate();
  const { globalUser, setGlobalUser } = React.useContext(NetworkContext);
  const [localTrigger, setLocalTrigger] = React.useState(true);
  const [showThis, setShowThis] = React.useState(true);
  const [openReceipt, setOpenReceipt] = React.useState(false);
  const [bookDates, setBookDates] = React.useState();
  const [edit, setEdit] = React.useState(false);
  const [days, setDays] = React.useState(0);
  const [onlyReceipt, setOnlyReceipt] = React.useState(false);
  const [bookingState, bookingDispatch] = React.useReducer(
    reducer,
    booking,
    init
  );

  React.useEffect(() => {
    if (filter === null || filter == booking.status) {
      setShowThis(true);
    } else {
      setShowThis(false);
    }
  }, [filter]);

  const setColor = () => {
    switch (booking.status) {
      case 0:
        return "rgba(0, 0, 0, 1)";
        break;
      case 1:
        return "rgba(123, 123, 123, 1)";
        break;
      case 2:
        return "rgba(51, 161, 37, 1)";
        break;
      case 3:
        return "rgba(161, 134, 37, 1)";
        break;
      case 4:
        return "rgba(161, 37, 37, 1)";
        break;
      case 5:
        return "rgba(62, 37, 161, 1)";
        break;
    }
  };

  const handleDisable = (date) => {
    date.setHours(0, 0, 0, 0);

    for (let i = 0; i < bookDates?.length; i++) {
      const begin = new Date(bookDates[i].begin);
      begin.setHours(0, 0, 0, 0);
      const end = new Date(bookDates[i].end);
      end.setHours(0, 0, 0, 0);

      if (begin <= date && date <= end) {
        return true;
      }
    }
    return false;
  };

  const sendEdit = async () => {
    const res = await axios.post(
      "http://localhost:8000/front/user/updateBooking",
      { data: bookingState, id: booking._id }
    );
    if (res.data.success) {
      fireTrigger();
    } else {
      setGlobalUser(null);
      navigate("/");
      return;
    }
  };

  const deleteBooking = async () => {
    const res = await axios.post(
      "http://localhost:8000/front/user/deleteBooking",
      { id: booking._id }
    );
    if (res.data.success) {
      fireTrigger();
    } else {
      setGlobalUser(null);
      navigate("/");
      return;
    }
  };

  const formatDate = (date, h = 0) => {
    const d = new Date(date);
    d.setHours(h, 0, 0, 0);
    return d;
  };

  const getDays = (date1, date2) => {
    const d1 = formatDate(date1);
    const d2 = formatDate(date2);

    var difference = d2.getTime() - d1.getTime();
    var days = Math.ceil(difference / (1000 * 3600 * 24));

    return days + 1;
  };

  const compareDates = (date1, date2) => {
    const d1 = formatDate(date1);
    const d2 = formatDate(date2);
    return d1 < d2;
  };

  /**
   * initialize the state for the editable data and
   * retreives all the boking for the current computer,
   * saves them all except for the current booking
   */

  React.useEffect(async () => {
    bookingDispatch({
      type: "reset",
      payload: {
        begin: booking.begin,
        end: booking.end,
        final_price: booking.final_price,
      },
    });

    const dates = await axios.get(
      "http://localhost:8000/front/item/getBookingsByItem",
      {
        params: { id: booking.computer._id },
      }
    );
    const tmp = dates.data.filter(
      (el) => el.computer._id == booking.computer._id && el._id !== booking._id
    );
    setBookDates(tmp);
  }, [booking]);

  React.useEffect(() => {
    if (bookDates && bookingState.begin && bookingState.end) {
      console.log(bookDates);
      for (let i = 0; i < bookDates.length; i++) {
        if (
          compareDates(bookingState.begin, bookDates[i].begin) &&
          compareDates(bookDates[i].end, bookingState.end)
        ) {
          bookingDispatch({
            type: "reset",
            payload: {
              begin: booking.begin,
              end: booking.end,
              final_price: booking.final_price,
            },
          });
          alert("Date non disonibili!");
          return;
        }
      }
      if (compareDates(bookingState.end, bookingState.begin)) {
        bookingDispatch({ type: "updateStart", payload: bookingState.end });
      }
      setDays(getDays(bookingState.begin, bookingState.end));
    }
  }, [bookingState.begin, bookingState.end]);

  React.useEffect(() => {
    if (days) {
      let price = days * booking.computer.price;
      for (let i = 0; i < booking.discounts.length; i++) {
        price = price - booking.discounts[i].amount;
      }
      if (price <= booking.computer.price) {
        price = days * booking.computer.price;
      }

      bookingDispatch({ type: "setPrice", payload: price.toFixed(2) });
    }
  }, [days]);

  return (
    showThis && (
      <Paper
        sx={{ bgcolor: setColor, color: "white" }}
        onClick={() => {
          console.log(bookingState);
        }}
      >
        <ListItem
          sx={[
            { minHeight: "10rem", my: "1rem", display: "flex" },
            tablet && {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            },
          ]}
        >
          <Container
            sx={[{ width: "75vw", p: 0 }, tablet && { width: "auto" }]}
          >
            <Box
              sx={[
                { display: "flex" },
                tablet && { flexDirection: "column", alignItems: "center" },
              ]}
            >
              <Box
                width='40%'
                sx={[
                  tablet && {
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    mb: "2rem",
                  },
                ]}
              >
                <Typography
                  sx={{ fontWeight: "bold", textTransform: "capitalize" }}
                >
                  Computer: {booking.computer.model}
                </Typography>
                <Typography>
                  Prezzo finale: {bookingState?.final_price}$
                </Typography>
                {booking.discounts.map((el) => {
                  return (
                    <Typography sx={{ textTransform: "capitalize" }}>
                      {el.reason}: {el.amount}$
                    </Typography>
                  );
                })}
              </Box>
              <Paper
                elevation={6}
                sx={[
                  {
                    display: "flex",
                    flexDirection: "column",
                    px: "0.5rem",
                  },
                ]}
              >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    minDate={new Date()}
                    disabled={!edit}
                    clearable
                    value={bookingState?.begin}
                    label='Inizio'
                    // minDate={new Date()}
                    renderInput={(props) => (
                      <TextField
                        variant='filled'
                        size='small'
                        sx={{
                          my: "0.5rem",
                          color: "white",
                        }}
                        {...props}
                      />
                    )}
                    onChange={(date) => {
                      const d = formatDate(date, 1).toISOString().split("T")[0];
                      bookingDispatch({ type: "updateStart", payload: d });
                    }}
                    shouldDisableDate={handleDisable}
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    minDate={new Date()}
                    disabled={!edit}
                    clearable
                    value={bookingState?.end}
                    label='Fine'
                    // minDate={new Date()}
                    renderInput={(props) => (
                      <TextField
                        variant='filled'
                        size='small'
                        sx={{
                          my: "0.5rem",
                          color: "white",
                        }}
                        {...props}
                      />
                    )}
                    onChange={(date) => {
                      const d = formatDate(date, 1).toISOString().split("T")[0];
                      bookingDispatch({ type: "updateEnd", payload: d });
                    }}
                    shouldDisableDate={handleDisable}
                  />
                </LocalizationProvider>
              </Paper>
            </Box>
          </Container>
          <Container
            sx={[
              {
                minHeight: "6rem",
                width: "25vw",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
              },
              tablet && { width: "auto", mt: "1rem" },
            ]}
          >
            {booking.status != 5 ? (
              <>
                {booking.status == 2 ? (
                  <>
                    {!edit ? (
                      <Button
                        onClick={() => {
                          setEdit(true);
                        }}
                        variant='contained'
                      >
                        modifica
                      </Button>
                    ) : (
                      <Box
                        sx={{ display: "flex", justifyContent: "space-around" }}
                      >
                        <Button
                          onClick={() => {
                            setEdit(false);
                            sendEdit();
                          }}
                          variant='contained'
                        >
                          salva
                        </Button>
                        <Button
                          onClick={() => {
                            setEdit(false);
                            bookingDispatch({
                              type: "updateStart",
                              payload: booking.begin,
                            });
                            bookingDispatch({
                              type: "updateEnd",
                              payload: booking.end,
                            });
                          }}
                          variant='contained'
                        >
                          annulla
                        </Button>
                      </Box>
                    )}
                  </>
                ) : (
                  <></>
                )}

                {booking.status == 2 || booking.status == 1 ? (
                  <Button
                    variant='contained'
                    onClick={deleteBooking}
                    color='error'
                  >
                    elimina
                  </Button>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <Button
                onClick={() => {
                  setOpenReceipt(true);
                }}
                variant='contained'
              >
                mostra ricevuta
              </Button>
            )}
          </Container>
        </ListItem>
        <Receipt
          booking={booking}
          openReceipt={openReceipt}
          setOpenReceipt={setOpenReceipt}
          getDays={getDays}
          totalDiscounts={booking.discounts.reduce(
            (a, b) => a + (b.amount || 0),
            0
          )}
        />
      </Paper>
    )
  );
};

const Receipt = ({
  booking,
  openReceipt,
  setOpenReceipt,
  getDays,
  totalDiscounts,
}) => {
  return (
    <Dialog
      open={openReceipt}
      onClose={() => {
        setOpenReceipt(false);
      }}
      scroll='paper'
      aria-labelledby='scroll-dialog-title'
      aria-describedby='scroll-dialog-description'
      fullWidth
    >
      <DialogTitle id='scroll-dialog-title'>Ricevuta</DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText id='scroll-dialog-description' tabIndex={-1}>
          <Container>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: "0.5rem",
              }}
            >
              <Typography sx={{ fontWeight: "bold" }}>Inizio</Typography>
              <Typography sx={{ textTransform: "capitalize" }}>
                {booking.begin.split("T")[0]}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: "0.5rem",
              }}
            >
              <Typography sx={{ fontWeight: "bold" }}>Fine</Typography>
              <Typography sx={{ textTransform: "capitalize" }}>
                {booking.end.split("T")[0]}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: 1,
                mb: "1rem",
              }}
            >
              <Typography sx={{ fontWeight: "bold" }}>Computer</Typography>
              <Typography sx={{ textTransform: "capitalize" }}>
                {booking.computer.brand} {booking.computer.model}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: "0.5rem",
              }}
            >
              <Typography sx={{ fontWeight: "bold" }}>
                Prezzo giornaliero
              </Typography>
              <Typography sx={{ textTransform: "capitalize" }}>
                {booking.computer.price}$
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: "0.5rem",
              }}
            >
              <Typography sx={{ fontWeight: "bold" }}>Giorni</Typography>
              <Typography sx={{ textTransform: "capitalize" }}>
                {getDays(booking.begin, booking.end)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: 1,
                mb: "1rem",
              }}
            >
              <Typography sx={{ fontWeight: "bold" }}>
                Prezzo iniziale
              </Typography>
              <Typography sx={{ textTransform: "capitalize" }}>
                {getDays(booking.begin, booking.end) * booking.computer.price}$
              </Typography>
            </Box>
            {booking.discounts.map((disc) => {
              return (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: "0.5rem",
                  }}
                >
                  <Typography
                    sx={{ fontWeight: "bold", textTransform: "capitalize" }}
                  >
                    {disc.reason}
                  </Typography>
                  <Typography sx={{ textTransform: "capitalize" }}>
                    -{disc.amount}$
                  </Typography>
                </Box>
              );
            })}
            {getDays(booking.begin, booking.end) * booking.computer.price -
              totalDiscounts !=
            booking.final_price ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: "0.5rem",
                }}
              >
                <Typography
                  sx={{ fontWeight: "bold", textTransform: "capitalize" }}
                >
                  Altri Sconti
                </Typography>
                <Typography sx={{ textTransform: "capitalize" }}>
                  -
                  {getDays(booking.begin, booking.end) *
                    booking.computer.price -
                    booking.final_price -
                    totalDiscounts}
                  $
                </Typography>
              </Box>
            ) : (
              <></>
            )}
            <Box
              sx={{
                mt: "0.5rem",
                display: "flex",
                justifyContent: "space-between",
                mb: "0.5rem",
                borderBottom: 2,
              }}
            >
              <Typography
                sx={{ fontWeight: "bold", textTransform: "capitalize" }}
              >
                Prezzo finale
              </Typography>
              <Typography sx={{ textTransform: "capitalize" }}>
                {booking.final_price}$
              </Typography>
            </Box>
          </Container>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpenReceipt(false);
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Profile;
