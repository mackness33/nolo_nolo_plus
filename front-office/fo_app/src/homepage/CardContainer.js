import * as React from "react";
import { checkLogged, identity } from "../comms";

import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import useMediaQuery from "@mui/material/useMediaQuery";
import { ComputerContext, ComputerBackup } from "./HomeContext";
import { NetworkContext } from "../NetworkContext";
import Computercard from "./ComputerCard";
import { ClassNames } from "@emotion/react";

const CardContainer = () => {
  const mobile = useMediaQuery("(max-width: 768px)");
  const { computers, setComputers } = React.useContext(ComputerContext);
  const { globalUser, setGlobalUser } = React.useContext(NetworkContext);
  const [user, setUser] = React.useState();
  React.useEffect(async () => {
    const res = await identity();
    if (res.success) {
      console.log("PIACENTI");
      console.log(res);
      setUser(res.payload);
    } else {
      setUser(null);
    }
  }, [globalUser]);
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
          console.log(computer._id);
          const chosen = user ? user.favourites.includes(computer._id) : false;
          return (
            <Computercard computer={computer} user={user} chosen={chosen} />
          );
        })}
      </Container>
    </Box>
  );
};

export default CardContainer;
