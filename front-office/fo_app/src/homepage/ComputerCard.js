import * as React from "react";
import { useParams } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import Button from "@mui/material/Button";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import Divider from "@mui/material/Divider";

import useMediaQuery from "@mui/material/useMediaQuery";
import { ComputerContext, ComputerBackup } from "./HomeContext";
import { NetworkContext } from "../NetworkContext";

import { BsCpu } from "react-icons/bs";
import { GiProcessor } from "react-icons/gi";
import { FaMemory } from "react-icons/fa";

import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";

import { Link } from "react-router-dom";

import Grow from "@mui/material/Fade";
import axios from "axios";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const Computercard = ({ computer, user, chosen }) => {
  const mobile = useMediaQuery("(max-width: 768px)");
  let params = useParams();
  const [fav, setFav] = React.useState(false);
  const [alert, setAlert] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState("");
  const [severity, setSeverity] = React.useState("success");
  const { globalUser, setGlobalUser } = React.useContext(NetworkContext);

  const handleAlertClose = () => {
    setAlert(false);
  };

  React.useEffect(() => {
    if (chosen) {
      setFav(true);
    }
  }, [user]);

  const handleFav = async (add) => {
    console.log(user);
    if (user !== null) {
      const res = await axios.post(
        "http://localhost:8000/front/user/changeFavs",
        { userId: user._id, compId: computer._id, add: add }
      );
      console.log(res);
      if (res.data.success) {
        setSeverity("success");
        setFav(add);
        setAlertMsg(add ? "Aggiunto ai preferiti!" : "Rimosso dai preferiti!");
        setAlert(true);
      } else {
        setSeverity("error");
        setAlertMsg("Modifica fallita!");
        console.log(res.data.error);
        setAlert(true);
      }
      console.log(computer._id);
    } else {
      setSeverity("error");
      setAlertMsg("Devi fare login per salvare i preferiti!");
      setAlert(true);
    }
  };

  return (
    <Grow timeout={500} in={true}>
      <Card
        sx={[
          {
            minWidth: "22rem",
            maxWidth: "22rem",
            minHeight: "35rem",
            margin: "1rem",
            display: "flex",
            flexDirection: "column",
            boxShadow: 4,
          },
          mobile && {
            minWidth: 0,
            minHeight: "42rem",
            margin: "0.3rem",
          },
        ]}
      >
        <Snackbar
          anchorOrigin={{ horizontal: "center", vertical: "top" }}
          open={alert}
          autoHideDuration={3000}
          onClose={handleAlertClose}
        >
          <Alert
            onClose={handleAlertClose}
            severity={severity}
            sx={{ width: "100%" }}
          >
            {alertMsg}
          </Alert>
        </Snackbar>

        <CardMedia
          sx={[
            {
              height: "15rem",
              objectFit: "contain",
            },
            mobile && {
              height: "20rem",
            },
          ]}
          component='img'
          src={computer.image}
          alt={`${computer.brand} ${computer.model}`}
        />

        {fav ? (
          <StarIcon
            onClick={() => {
              handleFav(false);
            }}
            sx={{ m: "0.5rem" }}
          />
        ) : (
          <StarBorderIcon
            onClick={() => {
              handleFav(true);
            }}
            sx={{ m: "0.5rem" }}
          />
        )}

        <Divider />
        <CardContent
          sx={{
            height: "80%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: fav ? "rgba(191, 191, 63, 0.8)" : "none",
          }}
        >
          <Container>
            <Typography
              sx={{
                color: "text.secondary",
                fontWeight: "bold",
                textTransform: "capitalize",
              }}
            >
              {computer.brand}
            </Typography>
            <Typography
              sx={{ fontWeight: "bold", textTransform: "capitalize" }}
              gutterBottom
              variant='h5'
              component='div'
            >
              {computer.model}
            </Typography>
            <Typography variant='subtitle1' color='text.secondary'>
              <List disablePadding dense>
                <ListItem disablePadding>
                  <ListItemIcon
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <BsCpu />
                  </ListItemIcon>
                  <ListItemText
                    sx={{ textTransform: "uppercase" }}
                    primary={computer.cpu}
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <GiProcessor />
                  </ListItemIcon>
                  <ListItemText
                    sx={{ textTransform: "uppercase" }}
                    primary={computer.gpu}
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FaMemory />
                  </ListItemIcon>
                  <ListItemText
                    sx={{ textTransform: "uppercase" }}
                    primary={computer.ram}
                  />
                </ListItem>
              </List>
            </Typography>
          </Container>
          <Container
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
            {computer.discount !== 0 ? (
              <Typography
                sx={{ fontSize: 20, mr: "0.5rem", color: "text.secondary" }}
              >
                <del>{computer.price.toFixed(2)} $</del>
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
                computer.price -
                (computer.discount / 100) * computer.price
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
          </Container>
        </CardContent>
        <Divider />
        <CardActions
          sx={{ display: "flex", justifyContent: "center", flexGrow: 1 }}
        >
          <Button
            component={Link}
            to={`/product/${computer._id}`}
            size='large'
            variant='contained'
          >
            prenota
          </Button>
        </CardActions>
      </Card>
    </Grow>
  );
};

export default Computercard;
