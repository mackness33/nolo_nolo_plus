import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import App2 from "./App2";
import Navbar from "./navbar.js";
import Container from "@mui/material/Container";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Profile from "./profile/Profile2";
import Home from "./homepage/HomeContainer";
import ProductPage from "./productPage/ProductPage";
import RegisterLogin from "./registerLogin/RegisterLogin";

const Wrapper = ({ children }) => {
  const location = useLocation();
  React.useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);
  return children;
};

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename='front'>
      <Navbar />
      <Wrapper>
        <Container
          maxWidth='xl'
          sx={{
            boxShadow: 24,
            pt: "1rem",
            bgcolor: "whitesmoke",
            minHeight: "100vh",
          }}
        >
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/registerLogin' element={<RegisterLogin />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='product/:id' element={<ProductPage />} />
          </Routes>
        </Container>
      </Wrapper>
    </BrowserRouter>
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
