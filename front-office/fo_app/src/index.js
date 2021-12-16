import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import App2 from "./App2";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <nav>
        <Link to='nolo-nolo/primo'>home</Link>
        <span> </span>
        <Link to='nolo-nolo/secondo'>another page</Link>
      </nav>
      <Routes>
        <Route path='nolo-nolo'>
          <Route path='primo' element={<App />} />
          <Route path='secondo' element={<App2 />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
