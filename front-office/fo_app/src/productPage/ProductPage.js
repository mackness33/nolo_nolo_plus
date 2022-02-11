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

import { BsCpu } from "react-icons/bs";
import { GiProcessor } from "react-icons/gi";
import { FaMemory } from "react-icons/fa";

import useMediaQuery from "@mui/material/useMediaQuery";

export default function ComputerContent() {
  let params = useParams();
  const [computer, setComputer] = useState();
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

  return (
    <Container maxWidth='xl' sx={{ mt: "2rem" }} disableGutters>
      <Card sx={[{ display: "flex" }]}>
        <CardMedia
          sx={{
            height: "25rem",
            width: "20rem",
            objectFit: "contain",
          }}
          component='img'
          image={computer?.image}
          alt='green iguana'
        />
        <Divider orientation='vertical' flexItem />
        <CardContent
          sx={{
            width: "80%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Container>
            <Typography
              sx={{
                color: "text.secondary",
                fontWeight: "bold",
                textTransform: "capitalize",
              }}
              variant='h7'
            >
              {computer?.brand}
            </Typography>
            <Typography
              sx={{ fontWeight: "bold", textTransform: "capitalize" }}
              gutterBottom
              variant='h5'
              component='div'
            >
              {computer?.model}
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
                    primary={computer?.cpu}
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
                    primary={computer?.gpu}
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
                    primary={computer?.ram}
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
          </Container>
        </CardContent>
        <Divider orientation='vertical' flexItem />
        <CardActions sx={{}}></CardActions>
      </Card>
    </Container>
  );
}
