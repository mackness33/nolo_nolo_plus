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

import Tooltip from "@mui/material/Tooltip";

import { BsCpu } from "react-icons/bs";
import { GiProcessor } from "react-icons/gi";
import { FaMemory } from "react-icons/fa";
import { GoChecklist } from "react-icons/go";

import useMediaQuery from "@mui/material/useMediaQuery";

import TextField from "@mui/material/TextField";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

export default function ComputerContent() {
  let params = useParams();
  const [computer, setComputer] = useState();
  const [orientation, setOrientation] = useState();
  const mobile = useMediaQuery("(max-width: 768px)");
  const tablet = useMediaQuery("(max-width: 1024px)");

  useEffect(async () => {
    let mounted = true;
    axios
      .get("http://localhost:8000/front/item/getOne", {
        params: { id: params.id },
      })
      .then((res) => {
        console.log(res.data);
        if (mounted) {
          setComputer(res.data);
        }
      });
  }, []);

  const [value, setValue] = React.useState(new Date("2014-08-18T21:11:54"));

  const handleChange = (newValue) => {
    setValue(newValue);
  };
  const cane = (date) => {
    return false;
  };

  useEffect(() => {
    if (tablet) {
      setOrientation("horizontal");
    } else {
      setOrientation("vertical");
    }
  }, [tablet]);

  return (
    <Container maxWidth='xl' sx={{ mt: "0rem" }} disableGutters>
      <Card sx={[{ display: "flex" }, tablet && { flexDirection: "column" }]}>
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
          component='img'
          image={computer?.image}
          alt='green iguana'
        />
        <Divider orientation={orientation} flexItem />
        <CardContent
          sx={[
            {
              width: "80%",
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
              {/* {computer?.discount !== 0 ? (
                <Typography
                  sx={{ fontSize: 20, mr: "0.5rem", color: "text.secondary" }}
                >
                  <del>{computer?.price.toFixed(2)} $</del>
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
                  computer?.price -
                  (computer?.discount / 100) * computer?.price
                ).toFixed(2)}
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    ml: "0.3rem",
                    pt: "1rem",
                  }}
                >
                  $ / giorno
                </Typography>
              </Typography> */}
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
          {/* <Container
            sx={[
              {
                height: "2.5rem",
                display: "flex",
                justifyContent: "center",
                my: "0.5rem",
              },
              mobile && {
                flexDirection: "column",
                mb: "1rem",
              },
            ]}
          >
            {computer?.discount !== 0 ? (
              <Typography
                sx={{ fontSize: 20, mr: "0.5rem", color: "text.secondary" }}
              >
                <del>{computer?.price.toFixed(2)} $</del>
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
                computer?.price -
                (computer?.discount / 100) * computer?.price
              ).toFixed(2)}
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  ml: "0.3rem",
                  pt: "1rem",
                }}
              >
                $ / giorno
              </Typography>
            </Typography>
          </Container> */}
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
                label='Inizio'
                inputFormat='dd/MM/yyyy'
                value={value}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
                shouldDisableDate={cane}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDatePicker
                label='secondo'
                inputFormat='dd/MM/yyyy'
                value={value}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
                shouldDisableDate={cane}
              />
            </LocalizationProvider>
          </Container>
        </CardActions>
      </Card>
    </Container>
  );
}
