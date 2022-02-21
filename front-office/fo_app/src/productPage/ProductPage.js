import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { checkLogged, identity } from "../comms";
import { NetworkContext } from "../NetworkContext";

import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import Divider from "@mui/material/Divider";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import Tooltip from "@mui/material/Tooltip";

import { BsCpu } from "react-icons/bs";
import { GiProcessor } from "react-icons/gi";
import { FaMemory } from "react-icons/fa";
import { GoChecklist } from "react-icons/go";
import { MdOutlineCategory } from "react-icons/md";

import useMediaQuery from "@mui/material/useMediaQuery";

import TextField from "@mui/material/TextField";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

import Computercard from "../homepage/ComputerCard";

import Grow from "@mui/material/Fade";

import "animate.css";

export default function ComputerContent() {
  let params = useParams();
  const navigate = useNavigate();
  const [computer, setComputer] = useState();
  const [bookings, setBookings] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showCal, setShowCalc] = useState(false);
  const [showUnavail, setShowUnavail] = useState(true);
  const [points, setPoints] = useState(0);
  const [userDiscount, setUserDiscount] = useState(0);
  const [discountArray, setDiscountArray] = useState();
  const [days, setDays] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [orientation, setOrientation] = useState();

  const [trigger, setTrigger] = useState(false);
  const [trigger2, setTrigger2] = useState(false);

  const [user, setUser] = useState();
  const [isLogged, setIsLogged] = useState();

  const [showMsg, setShowMsg] = useState(false);
  const [positive, setPositive] = useState(true);

  const [similarComputer, setSimilarComputer] = useState([]);
  const mobile = useMediaQuery("(max-width: 768px)");
  const tablet = useMediaQuery("(max-width: 1024px)");

  const { globalUser, setGlobalUser } = useContext(NetworkContext);

  /**
   * use effect that checks at each product page change
   * if user is logged, in which case it makes the points selection available
   */

  useEffect(async () => {
    const res = await checkLogged();
    setIsLogged(res);

    if (res) {
      const user = await identity();
      setUser(user.payload);
      setGlobalUser(user.payload);
    } else {
      setUser(null);
    }
  }, [params.id]);

  /**
   * at each page change, gets the item, its booking and
   * some similar computers and sets them in their react states
   */

  useEffect(async () => {
    const comp = await axios.get("http://localhost:8000/front/item/getOne", {
      params: { id: params.id },
    });
    setComputer(comp.data);

    const tmp = await axios.get(
      "http://localhost:8000/front/item/findSimilar",
      { params: { id: comp.data._id } }
    );
    setSimilarComputer(tmp.data);

    const dates = await axios.get(
      "http://localhost:8000/front/item/getBookingsByItem",
      {
        params: { id: params.id },
      }
    );

    setBookings(dates.data);
  }, [params.id, trigger2]);

  /**
   * triggers at each date change, calculates and shows
   * the final price and sets the corresponding states
   * for final price and days
   */

  useEffect(async () => {
    if (startDate && endDate) {
      let days1 =
        (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
      days1++;
      setDays(days1);
      let tmpUserDiscount = 0;

      if (isLogged) {
        const res = await axios.get(
          "http://localhost:8000/front/item/getDiscounts",
          {
            params: { userId: user._id, computerId: params.id, days },
          }
        );
        console.log(res.data);
        setDiscountArray(res.data);
        if (
          res.data.discounts.length > 0 &&
          res.data.discounts.some((el) => el.reason === "sconto buona condotta")
        ) {
          const disc = res.data.discounts.find(
            (el) => el.reason === "sconto buona condotta"
          );
          console.log(disc);
          tmpUserDiscount = parseFloat(disc.amount).toFixed(2);
        } else {
          tmpUserDiscount = 0;
        }
      }

      // setUserDiscount(2 * days);

      // setShowCalc(true);
      setShowUnavail(false);
      if (isLogged) {
        for (let i = 0; i < bookings.length; i++) {
          const begin = new Date(bookings[i].begin);
          begin.setHours(0, 0, 0, 0);
          const end = new Date(bookings[i].end);
          end.setHours(0, 0, 0, 0);

          if (startDate <= begin && end <= endDate) {
            setShowUnavail(true);
            return;
          }
        }
      }
      // evalFinalPrice();
      setUserDiscount(tmpUserDiscount);
      setTrigger(!trigger);
    } else {
      setShowCalc(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    evalFinalPrice();
  }, [userDiscount, trigger, points]);

  const tmp = () => {
    console.log(startDate);
  };

  /**
   * calculates the final price based on daily price
   * computer discount, user discount and number of days
   */

  const evalFinalPrice = () => {
    if (computer) {
      const val = (
        days * (computer.price - (computer.price * computer.discount) / 100) -
        userDiscount -
        points / 10
      ).toFixed(2);
      if (val > 0) {
        setFinalPrice(val);
      } else {
        setFinalPrice(0);
      }
    }
  };

  const handleDisable = (date) => {
    date.setHours(0, 0, 0, 0);

    if (!isLogged) {
      return false;
    }

    for (let i = 0; i < bookings.length; i++) {
      const begin = new Date(bookings[i].begin);
      begin.setHours(0, 0, 0, 0);
      const end = new Date(bookings[i].end);
      end.setHours(0, 0, 0, 0);

      if (begin <= date && date <= end) {
        return true;
      }
    }
    return false;
  };

  const handleStartChange = (date) => {
    if (date) {
      date.setHours(0, 0, 0, 0);
      if (!endDate || endDate < date) {
        setStartDate(date);
        setEndDate(date);
      } else {
        setStartDate(date);
      }
    }
  };

  const handleEndChange = (date) => {
    if (date) {
      date.setHours(0, 0, 0, 0);
      if (!startDate || startDate > date) {
        setStartDate(date);
        setEndDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  const showResponse = (happy) => {
    setPositive(happy);
    setShowMsg(true);
    setTimeout(() => {
      setShowMsg(false);
      setShowCalc(false);
      setStartDate(null);
      setEndDate(null);
      setTrigger2(!trigger2);
    }, 3000);
  };

  useEffect(() => {
    if (tablet) {
      setOrientation("horizontal");
    } else {
      setOrientation("vertical");
    }
  }, [tablet]);

  /**
   *
   * NEW BOOKING HANDLE
   *
   *
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 













   * 
   *
   */

  const handleBooking = async () => {
    if (!isLogged) {
      showResponse(false);
      return;
    }

    const t1 = new Date(startDate);
    t1.setHours(1, 0, 0, 0);
    const t2 = new Date(endDate);
    t2.setHours(1, 0, 0, 0);

    const booking = {
      user: user._id,
      computer: params.id,
      begin: t1.toISOString().split("T")[0],
      end: t2.toISOString().split("T")[0],
      discounts: discountArray.discounts,
      starting_price: computer.price * days,
      final_price: finalPrice,
      points: user.points - (user.points - points),
    };

    console.log(booking);

    console.log(booking);
    const res = await axios.post("http://localhost:8000/front/item/addOne", {
      ...booking,
    });

    if (res.data.success) {
      showResponse(true);
    } else {
      showResponse(false);
      console.error("Logged but booking failed");
    }

    // const user = await identity();
    // const booking = {
    //   user: user._id,
    //   computer: params.id,
    //   begin: startDate,
    //   end: endDate,
    //   discounts: discountList,
    //   starting_price: computer.price * days,
    //   final_price: price,
    //   note: $("#addNote").val(),
    //   points: usedPoints,
    // };
  };

  /**
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   */

  return (
    <Container maxWidth='xl' sx={{ mt: "1rem" }} disableGutters>
      <Grow timeout={500} in={true}>
        <Card
          sx={[
            { display: "flex", minHeight: "30rem" },
            tablet && { flexDirection: "column" },
          ]}
        >
          <CardMedia
            sx={[
              {
                height: "25rem",
                width: "20rem",
                objectFit: "contain",
              },
              tablet && {
                display: "flex",
                justifyContent: "center",
                width: "auto",
              },
            ]}
            onClick={tmp}
            component='img'
            image={computer?.image}
            alt='green iguana'
          />
          <CardContent
            sx={[
              {
                width: "60%",
                display: "flex",
                flexDirection: "column",
              },
            ]}
          >
            <Container>
              <Typography
                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                variant='h5'
                gutterBottom
              >
                {computer?.brand} {computer?.model}
              </Typography>

              <Container
                sx={[
                  {
                    my: "0.5rem",
                  },
                ]}
                disableGutters
              >
                <Typography>Prezzo giornaliero:</Typography>
                <Typography
                  sx={{ pl: "1rem", fontSize: 40, fontWeight: "bold" }}
                >
                  {`${(
                    computer?.price -
                    (computer?.discount / 100) * computer?.price
                  ).toFixed(2)} $`}
                </Typography>
                <Typography sx={{ pl: "1rem", display: "flex" }}>
                  {computer?.discount !== 0 ? (
                    <>
                      <Typography
                        sx={{
                          fontSize: 20,
                          mr: "0.5rem",
                          color: "text.secondary",
                        }}
                      >
                        <del>{computer?.price.toFixed(2)} $</del>
                      </Typography>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "flex-end",
                          color: "error.main",
                        }}
                      >
                        {`Scontato del ${computer?.discount}%!`}
                      </Typography>
                    </>
                  ) : (
                    <></>
                  )}
                </Typography>
              </Container>

              <Typography sx={{ fontSize: "large" }} color='text.primary'>
                <Typography variant='subtitle2' color='text.secondary'>
                  Specifiche:
                </Typography>
                <List disablePadding dense>
                  <ListItem>
                    <ListItemIcon
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <BsCpu size={30} />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        textTransform: "uppercase",
                        fontSize: "medium",
                      }}
                      primary={computer?.cpu}
                      secondary='Processore'
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <GiProcessor size={30} />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        textTransform: "uppercase",
                        fontSize: "medium",
                      }}
                      primary={computer?.gpu}
                      secondary='Scheda Grafica'
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <FaMemory size={30} />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        textTransform: "uppercase",
                        fontSize: "medium",
                      }}
                      primary={computer?.ram}
                      secondary='Memoria'
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <MdOutlineCategory size={30} />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        textTransform: "uppercase",
                        fontSize: "medium",
                      }}
                      primary={computer?.type.toString().replaceAll(",", "  ")}
                      secondary='Tipo'
                    />
                  </ListItem>

                  <Tooltip
                    placement='bottom-start'
                    title="Valutazione del prodotto eseguita dai nostri tecnici al termine dell'ultimo noleggio"
                  >
                    <ListItem>
                      <ListItemIcon
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <GoChecklist size={30} />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{
                          textTransform: "uppercase",
                          fontSize: "medium",
                        }}
                        primary={`${computer?.condition} / 10`}
                        secondary='Condizione'
                      />
                    </ListItem>
                  </Tooltip>
                </List>
              </Typography>
            </Container>
          </CardContent>
          <Divider orientation={orientation} flexItem />
          <CardActions
            sx={[
              {
                width: "30%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                m: "0.5rem",
              },
              tablet && {
                width: "auto",
              },
            ]}
            disableSpacing
          >
            <Typography sx={{ my: "0.8rem", fontSize: "medium" }}>
              Seleziona tra le date disponibili per vedere il prezzo
            </Typography>
            <Container
              sx={[
                {
                  height: "6rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                },
                {
                  width: "15rem",
                },
              ]}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDatePicker
                  minDate={new Date()}
                  label='Inizio noleggio'
                  inputFormat='dd/MM/yyyy'
                  value={startDate}
                  onOpen={() => {
                    setShowCalc(false);
                  }}
                  onChange={handleStartChange}
                  onAccept={() => {
                    if (startDate) {
                      setShowCalc(true);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField size='small' {...params} />
                  )}
                  shouldDisableDate={handleDisable}
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDatePicker
                  minDate={new Date()}
                  label='Fine noleggio'
                  inputFormat='dd/MM/yyyy'
                  value={endDate}
                  onOpen={() => {
                    setShowCalc(false);
                  }}
                  onChange={handleEndChange}
                  onAccept={() => {
                    if (endDate) {
                      setShowCalc(true);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField size='small' {...params} />
                  )}
                  shouldDisableDate={handleDisable}
                />
              </LocalizationProvider>
            </Container>
            {showCal && (
              <>
                {showUnavail ? (
                  <Typography
                    sx={{ mt: "2rem", color: "error.main", fontWeight: "bold" }}
                  >
                    Periodo non disponibile
                  </Typography>
                ) : (
                  <>
                    <FormControl sx={{ mt: "1rem", width: "15rem" }}>
                      <InputLabel id='pointsSelectLabel'>
                        Usa i tuoi punti
                      </InputLabel>
                      <Select
                        onChange={(e) => {
                          setPoints(e.target.value);
                        }}
                        value={points}
                        disabled={!user?.points}
                        labelId='pointsSelectLabel'
                        label='Usa i tuoi punti'
                      >
                        {user &&
                          [...Array(user.points)].map((el, i) => {
                            return <MenuItem value={i + 1}>{i + 1}</MenuItem>;
                          })}
                      </Select>
                    </FormControl>
                    {/* <Typography
                    variant="h3"
                    sx={{
                      mt: "1rem",
                      border: "3px solid #0288d1",
                      color: "primary.main",
                      px: "1rem",
                      py: "0.1rem",
                      borderRadius: "0.5rem",
                      boxShadow: 5,
                    }}
                  >
                    {`${finalPrice} $`}
                  </Typography> */}
                    {userDiscount > 0 && (
                      <Typography
                        sx={{
                          fontSize: "small",
                          fontWeight: "bold",
                          mt: "0.3rem",
                          textAlign: "center",
                        }}
                      >
                        In base alla tua condotta, hai diritto ad uno sconto di{" "}
                        {userDiscount}$ sul prezzo finale!
                      </Typography>
                    )}
                    <TextField
                      sx={{ mt: "1rem" }}
                      id='outlined-read-only-input'
                      value={`${finalPrice} $`}
                      label='Prezzo Finale'
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <Button
                      fullWidth
                      sx={{ mt: "2rem" }}
                      variant='contained'
                      size='large'
                      onClick={handleBooking}
                    >
                      prenota
                    </Button>
                  </>
                )}
                {showMsg && (
                  <>
                    {positive ? (
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          mt: "0.5rem",
                          color: "green",
                        }}
                        className='animate__animated animate__bounceIn'
                      >
                        Prenotazione effettuata con successo!
                      </Typography>
                    ) : (
                      <Typography
                        sx={{ fontWeight: "bold", mt: "0.5rem", color: "red" }}
                        className='animate__animated animate__bounceIn'
                      >
                        Devi effettuare l'accesso per prenotare!
                      </Typography>
                    )}
                  </>
                )}
              </>
            )}
          </CardActions>
        </Card>
      </Grow>

      <Grow timeout={500} in={true}>
        <Card sx={{ mt: "0.5rem" }}>
          <CardContent>
            <Typography variant='h6' color='text.secondary'>
              Descrizione
            </Typography>
            <Divider sx={{ mb: "0.4rem" }} />
            <Typography>{computer?.description}</Typography>
          </CardContent>
        </Card>
      </Grow>
      <Grow timeout={500} in={true}>
        <Card sx={{ mt: "0.5rem" }}>
          <CardContent>
            <Typography variant='h6' color='text.secondary'>
              Ti potrebbe anche interessare
            </Typography>
            <Divider sx={{ mb: "0.4rem" }} />
            <Container
              sx={[
                { display: "flex", overflowX: "scroll" },
                tablet && { flexDirection: "column" },
              ]}
            >
              {similarComputer?.map((pc) => {
                return <Computercard computer={pc} />;
              })}
            </Container>
          </CardContent>
        </Card>
      </Grow>
    </Container>
  );
}
