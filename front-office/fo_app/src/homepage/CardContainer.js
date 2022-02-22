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
  const [localComps, setLocalComps] = React.useState();
  const { computers, setComputers } = React.useContext(ComputerContext);
  const { globalUser, setGlobalUser } = React.useContext(NetworkContext);
  const [user, setUser] = React.useState();
  React.useEffect(async () => {
    const res = await identity();
    if (res.success) {
      if (computers) {
        let temp = JSON.parse(JSON.stringify(computers));
        let cop = temp.filter((x) => res.payload.favourites.includes(x._id));

        const filtered = computers.filter(
          (comp) => !res.payload.favourites.includes(comp._id)
        );

        setLocalComps([...cop, ...filtered]);
      }
      setUser(res.payload);
    } else {
      setUser(null);
    }
  }, [globalUser, computers]);
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
        {localComps?.map((computer) => {
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
