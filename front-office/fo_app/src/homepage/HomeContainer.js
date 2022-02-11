import * as React from "react";
import Searchbar2 from "./searchBar2";
import Catalogue from "./Catalogue";
import Container from "@mui/material/Container";
import { ComputerContext, ComputerBackup } from "./HomeContext";

export default function Home() {
  const [computers, setComputers] = React.useState(null);
  const [computersB, setComputersB] = React.useState(null);

  return (
    <ComputerContext.Provider value={{ computers, setComputers }}>
      <ComputerBackup.Provider value={{ computersB, setComputersB }}>
        <Searchbar2 />
        {/* <Drawer /> */}
        {/* <Searchbar /> */}
        <Catalogue />
      </ComputerBackup.Provider>
    </ComputerContext.Provider>
  );
}
