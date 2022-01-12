import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import App2 from "./App2";
import Navbar from './navbar.js'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
   <Navbar />
    <Router>
      <Routes>
        <Route path='nn+'>
          //<Route path='primo' element={<App />} />
          <Route path='secondo' element={<App2 />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
