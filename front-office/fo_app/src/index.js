import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import App2 from "./App2";
import Navbar from "./navbar.js";
import Searchbar from "./searchbar.js";
import Searchbar2 from "./searchBar2";
import Catalogue from "./homepage/Catalogue";
// import Drawer from "./drawer.js";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Container from "@mui/material/Container";

ReactDOM.render(
  <React.StrictMode>
    <Navbar />
    <Container
      maxWidth='xl'
      sx={{ boxShadow: 24, pt: "1rem", bgcolor: "rgba(255, 255, 255, 0.90)" }}
    >
      <Searchbar2 />
      {/* <Drawer /> */}
      {/* <Searchbar /> */}
      <Catalogue />
    </Container>
  </React.StrictMode>,
  document.getElementById("root")
);
