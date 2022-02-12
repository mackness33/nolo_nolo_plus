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

import Divider from "@mui/material/Divider";

import useMediaQuery from "@mui/material/useMediaQuery";
import { ComputerContext, ComputerBackup } from "./HomeContext";

import { BsCpu } from "react-icons/bs";
import { GiProcessor } from "react-icons/gi";
import { FaMemory } from "react-icons/fa";

import { Link } from "react-router-dom";

import Grow from "@mui/material/Fade";

const Computercard = ({ computer }) => {
  const mobile = useMediaQuery("(max-width: 768px)");
  let params = useParams();

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
        <Divider />
        <CardContent
          sx={{
            height: "80%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
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
