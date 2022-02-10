import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import App2 from "./App2";
import Navbar from "./navbar.js";
import Container from "@mui/material/Container";

import Home from "./homepage/HomeContainer";

ReactDOM.render(
  <React.StrictMode>
    <Navbar />
    <Container
      maxWidth='xl'
      sx={{
        boxShadow: 24,
        pt: "1rem",
        bgcolor: "rgba(255, 255, 255, 0.90)",
        minHeight: "100vh",
      }}
    >
      <Home />
    </Container>
  </React.StrictMode>,
  document.getElementById("root")
);
