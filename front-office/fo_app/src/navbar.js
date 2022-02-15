import * as React from "react";
import axios from "axios";
import { checkLogged, identity, logOut } from "./comms";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";

import logo from "./images/logo.png";
import colors from "./images/colors.jpg";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link, useNavigate } from "react-router-dom";
import { NetworkContext } from "./NetworkContext";

const pages = ["Catalog", "Rental"];
const settings = ["Profile", "Logout"];

const Navbar = () => {
  const [logged, setLogged] = React.useState(false);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { globalUser, setGlobalUser } = React.useContext(NetworkContext);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  /**
   * at each globalUser context change, check if user is still logged
   * in which case update the navbar
   */

  React.useEffect(async () => {
    const res = await checkLogged();
    if (res) {
      setLogged(true);
    } else {
      setLogged(false);
    }
  }, [globalUser]);

  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar sx={{ height: "4.5rem" }}>
          {/* EXTRA SMALL SIZE */}
          <Logo second={"flex"} attr={{ mr: 2, display: {} }} />
          <SmallMenu />

          {/* MEDIUM SIZE */}
          {/* <Logo first={"flex"} attr={{ flexGrow: 1, display: {} }} /> */}
          <Pages />

          {/* ALL SIZE */}
          {logged ? (
            <UserSetting />
          ) : (
            <Button
              component={Link}
              to='/registerLogin'
              size='large'
              key='home'
              onClick={Navbar.handleCloseNavMenu}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              log in
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const Logo = ({ first = "none", second = "none", attr }) => {
  const [small, setSmall] = React.useState(first);
  const [medium, setMedium] = React.useState(second);
  attr.display.xs = first;
  attr.display.md = second;

  const tablet = useMediaQuery("(max-width: 1024px)");

  // TODO: replace the logo with a real image
  return (
    <>
      <Box
        sx={[
          {
            maxHeight: "4rem",
            borderRadius: "0.3rem",
            display: "flex",
            alignItems: "center",
            backgroundImage: `url(${colors})`,
            backgroundSize: "cover",
          },
          tablet && { display: "none" },
        ]}
      >
        <img style={{ height: "2.5rem" }} src={logo} alt='logo' />
      </Box>
    </>
  );
};

const Pages = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: { xs: "none", md: "flex" },
        justifyContent: "flex-end",
      }}
    >
      <Button
        component={Link}
        to='/'
        size='large'
        key='home'
        onClick={Navbar.handleCloseNavMenu}
        sx={{ my: 2, color: "white", display: "block" }}
      >
        homepage
      </Button>
      <Button
        component={Link}
        to='/catalogue'
        size='large'
        key='catalogo'
        onClick={Navbar.handleCloseNavMenu}
        sx={{ my: 2, color: "white", display: "block" }}
      >
        catalogo
      </Button>
    </Box>
  );
};

const UserSetting = () => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();
  const { globalUser, setGlobalUser } = React.useContext(NetworkContext);
  const [user, setUser] = React.useState();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const LogoutHandler = async () => {
    const res = await logOut();
    if (res) {
      setGlobalUser(null);
    } else {
      alert("logout fallito");
    }
    console.log(res);
    navigate("/");
  };

  React.useEffect(async () => {
    const res = await identity();
    if (!res.success) {
      setGlobalUser(null);
      navigate("/");
      return;
    }
    setGlobalUser(res.paylaod);
    setUser(res.payload);
  }, []);

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title='Open user settings'>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          {/* TODO: add as the alt the name of the user + it's profile pic if present */}
          <Avatar alt='User to be Added' src={user?.picture} />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id='menu-appbar'
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem key='profile' component={Link} to='/profile'>
          <Typography textAlign='center'>Profilo</Typography>
        </MenuItem>
        <MenuItem key='logout' onClick={LogoutHandler}>
          <Typography textAlign='center'>Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

const SmallMenu = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const { globalUser, setGlobalUser } = React.useContext(NetworkContext);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
      <IconButton
        size='large'
        aria-label='account of current user'
        aria-controls='menu-appbar'
        aria-haspopup='true'
        onClick={handleOpenNavMenu}
        color='inherit'
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id='menu-appbar'
        anchorEl={anchorElNav}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
        sx={{
          display: { xs: "block", md: "none" },
        }}
      >
        <MenuItem key='homepage'>
          <Typography textAlign='center'>Homepage</Typography>
        </MenuItem>
        <MenuItem key='catalogo'>
          <Typography textAlign='center'>Catalogo</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Navbar;
