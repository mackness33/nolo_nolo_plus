import * as React from "react";
import Searchbar2 from "./searchBar2";
import Catalogue from "./Catalogue";
import Container from "@mui/material/Container";
import { ComputerContext } from "./HomeContext";

export default function Home() {
  const [computers, setComputers] = React.useState(null);

  return (
    <ComputerContext.Provider value={{ computers, setComputers }}>
      <Searchbar2 />
      {/* <Drawer /> */}
      {/* <Searchbar /> */}
      <Catalogue />
    </ComputerContext.Provider>
  );
}
