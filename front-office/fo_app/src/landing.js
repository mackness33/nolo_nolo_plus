import * as React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { identity, checkLogged } from "./comms";

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
import { NetworkContext } from "./NetworkContext";
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

import landing1 from "./images/landing1.jpg";
import landing2 from "./images/landing2.jpeg";
import landing3 from "./images/landing3.jpg";

import { GrPersonalComputer } from "react-icons/gr";

import Grow from "@mui/material/Fade";

const Landing = () => {
  const tablet = useMediaQuery("(max-width: 1024px)");
  const [logged, setLogged] = React.useState(false);
  const { globalUser, setGlobalUser } = React.useContext(NetworkContext);

  React.useEffect(async () => {
    const res = await checkLogged();
    setLogged(res);
  }, [globalUser]);

  return (
    <Container
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Grow timeout={500} in={true}>
        <Card
          sx={[
            { display: "flex", width: "100%", mt: "2rem" },
            tablet && { flexDirection: "column" },
          ]}
        >
          <CardMedia
            onClick={() => {
              console.log(logged);
            }}
            component='img'
            image={landing1}
            alt='uomo che scive sulla tastiera'
            sx={[
              { objectFit: "cover", maxWidth: "40%" },
              tablet && {
                display: "flex",
                justifyContent: "center",
                maxWidth: "none",
                maxHeight: "25rem",
              },
            ]}
          />
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography gutterBottom variant='h5' component='div'>
              Piu' spendi, piu' risparmi!
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Con il nostro servizio più prenoti e più risparmi! Ad ogni
              prenotazione ti verrà accreditato 1 punto. Potrai spenderli per
              ottenere fantastici sconti! Ogni 10 punti puoi ottenere 1€ di
              sconto sulla tua prossima prenotazione.
            </Typography>
            <Box sx={{ mt: "2rem" }}>
              {logged ? (
                <Button component={Link} to='/profile'>
                  vai al tuo profilo
                </Button>
              ) : (
                <Button component={Link} to='/registerLogin'>
                  registrati
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grow>

      <Divider flexItem sx={{ my: "2.5rem" }}>
        <GrPersonalComputer />
      </Divider>

      <Grow timeout={500} in={true}>
        <Card
          sx={[
            {
              display: "flex",
              width: "100%",
              flexDirection: "row-reverse",
            },
            tablet && { flexDirection: "column" },
          ]}
        >
          <CardMedia
            component='img'
            image={landing2}
            alt='Uomo in ufficio che sorride'
            sx={[
              { objectFit: "cover", maxWidth: "40%" },
              tablet && {
                display: "flex",
                justifyContent: "center",
                maxWidth: "none",
                maxHeight: "25rem",
              },
            ]}
          />
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography gutterBottom variant='h5' component='div'>
              Ti premiamo!
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Ci sono anche altri modi di guadagnare, infatti se sarai
              rispettoso degli oggetti noleggiati e li riporterai nelle loro
              condizioni iniziali avrai diritto ad una vasta varietà di altri
              sconti!
            </Typography>
            <Box sx={{ mt: "2rem" }}>
              <Button component={Link} to='/catalogue'>
                Vai al catalogo
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grow>

      <Divider flexItem sx={{ my: "2.5rem" }}>
        <GrPersonalComputer />
      </Divider>

      <Grow timeout={500} in={true}>
        <Card
          sx={[
            { display: "flex", width: "100%", mb: "1rem" },
            tablet && { flexDirection: "column" },
          ]}
        >
          <CardMedia
            component='img'
            image={landing3}
            alt='uomo che scive sulla tastiera'
            sx={[
              { objectFit: "cover", maxWidth: "40%" },
              tablet && {
                display: "flex",
                justifyContent: "center",
                maxWidth: "none",
                maxHeight: "25rem",
              },
            ]}
          />
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography gutterBottom variant='h5' component='div'>
              Siamo sempre disponibili!
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Sembra tutto troppo bello? Lo è perchè il nostro servizio vuole
              rendere l'esperienza di noleggio il più gradevole possibile. Per
              questo ti offriamo la possibilità di poter disdire la tua
              prenotazione fino al giorno precedente al ritiro!
            </Typography>
          </CardContent>
        </Card>
      </Grow>
    </Container>
  );
};

export default Landing;
