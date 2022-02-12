import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import useMediaQuery from "@mui/material/useMediaQuery";
import { ComputerContext, ComputerBackup } from "./HomeContext";
import Computercard from "./ComputerCard";

const CardContainer = () => {
  const mobile = useMediaQuery("(max-width: 768px)");
  const { computers, setComputers } = React.useContext(ComputerContext);

  return (
    <Box>
      <Container
        sx={[
          {
            display: "flex",
            flexWrap: "wrap",
            ml: "0rem",
            mr: "0rem",
            minWidth: "100%",
            justifyContent: "center",
          },
        ]}
        disableGutters
      >
        {computers?.map((computer) => {
          // console.log(computer);
          return <Computercard computer={computer} />;
        })}
      </Container>
    </Box>
  );
};

export default CardContainer;
