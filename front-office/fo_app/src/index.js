import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import App2 from "./App2";
import Navbar from "./navbar.js";
import Container from "@mui/material/Container";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Profile from "./profile/Profile";
import Home from "./homepage/HomeContainer";
import ProductPage from "./productPage/ProductPage";

ReactDOM.render(
  <React.StrictMode>
    <Navbar />

    <Container
      maxWidth='xl'
      sx={{
        boxShadow: 24,
        pt: "1rem",
        bgcolor: "rgba(255, 255, 255, 0.95)",
        minHeight: "100vh",
      }}
    >
      <BrowserRouter basename='front'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='product/:id' element={<ProductPage />} />
        </Routes>
      </BrowserRouter>
    </Container>
    {/* <Container
      maxWidth='xl'
      sx={{
        boxShadow: 24,
        pt: "1rem",
        bgcolor: "rgba(255, 255, 255, 0.90)",
        minHeight: "100vh",
      }}
    >
      <Home />
    </Container> */}
  </React.StrictMode>,
  document.getElementById("root")
);
