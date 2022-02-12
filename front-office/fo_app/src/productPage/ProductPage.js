import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import { useParams } from "react-router-dom";
import axios from "axios";

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

export default function ComputerContent() {
  let params = useParams();
  const [computer, setComputer] = useState();
  const [bookings, setBookings] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showCal, setShowCalc] = useState(false);
  const [showUnavail, setShowUnavail] = useState(true);
  const [finalPrice, setFinalPrice] = useState(0);
  const [orientation, setOrientation] = useState();

  const [similarComputer, setSimilarComputer] = useState([]);
  const mobile = useMediaQuery("(max-width: 768px)");
  const tablet = useMediaQuery("(max-width: 1024px)");

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
  }, [params.id]);

  useEffect(() => {
    if (startDate && endDate) {
      setShowCalc(true);
      setShowUnavail(false);
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
      evalFinalPrice();
    } else {
      setShowCalc(false);
    }
  }, [startDate, endDate]);

  const tmp = () => {
    console.log(computer);
  };

  const evalFinalPrice = () => {
    let days = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    setFinalPrice(
      (
        (days + 1) *
        (computer.price - (computer.price * computer.discount) / 100)
      ).toFixed(2)
    );
  };

  const handleDisable = (date) => {
    date.setHours(0, 0, 0, 0);

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

  useEffect(() => {
    if (tablet) {
      setOrientation("horizontal");
    } else {
      setOrientation("vertical");
    }
  }, [tablet]);

  return (
    <Container maxWidth="xl" sx={{ mt: "0rem" }} disableGutters>
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
          component="img"
          image={computer?.image}
          alt="green iguana"
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
              variant="h5"
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
              <Typography sx={{ pl: "1rem", fontSize: 40, fontWeight: "bold" }}>
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

            <Typography sx={{ fontSize: "large" }} color="text.primary">
              <Typography variant="subtitle2" color="text.secondary">
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
                    secondary="Processore"
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
                    secondary="Scheda Grafica"
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
                    secondary="Memoria"
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
                    secondary="Tipo"
                  />
                </ListItem>

                <Tooltip
                  placement="bottom-start"
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
                      secondary="Condizione"
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
                height: "8rem",
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
                label="Inizio noleggio"
                inputFormat="dd/MM/yyyy"
                value={startDate}
                onChange={handleStartChange}
                renderInput={(params) => <TextField {...params} />}
                shouldDisableDate={handleDisable}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDatePicker
                label="Fine noleggio"
                inputFormat="dd/MM/yyyy"
                value={endDate}
                onChange={handleEndChange}
                renderInput={(params) => <TextField {...params} />}
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
                  Date non disponibili
                </Typography>
              ) : (
                <>
                  <FormControl sx={{ mt: "1rem", width: "15rem" }}>
                    <InputLabel id="pointsSelectLabel">
                      Usa i tuoi punti
                    </InputLabel>
                    <Select
                      labelId="pointsSelectLabel"
                      label="Usa i tuoi punti"
                    >
                      <MenuItem value={0}>0</MenuItem>
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
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
                  <TextField
                    sx={{ mt: "1rem" }}
                    id="outlined-read-only-input"
                    value={`${finalPrice} $`}
                    label="Prezzo Finale"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Button
                    fullWidth
                    sx={{ mt: "2rem" }}
                    variant="contained"
                    size="large"
                  >
                    prenota
                  </Button>
                </>
              )}
            </>
          )}
        </CardActions>
      </Card>
      <Card sx={{ mt: "0.5rem" }}>
        <CardContent>
          <Typography variant="h6" color="text.secondary">
            Descrizione
          </Typography>
          <Divider sx={{ mb: "0.4rem" }} />
          <Typography>{computer?.description}</Typography>
        </CardContent>
      </Card>
      <Card sx={{ mt: "0.5rem" }}>
        <CardContent>
          <Typography variant="h6" color="text.secondary">
            Consigliati per te
          </Typography>
          <Divider sx={{ mb: "0.4rem" }} />
          <Container sx={{ display: "flex", overflowX: "scroll" }}>
            {similarComputer?.map((pc) => {
              return <Computercard computer={pc} />;
            })}
          </Container>
        </CardContent>
      </Card>
    </Container>
  );
}
