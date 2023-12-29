import "./Home.css";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";

import { Container, Menu, MenuItem } from "@mui/material";

// Images
import bell from "../../images/bell.png";

// Components
import Sidebar from "../../common/Sidebar/Sidebar";

import routeArray from "../../routes.js";
import { AdminContext } from "../../App";
import axios from "axios";
import { toast } from "react-toastify";
import getProfile from "../../api/auth";

// const token = localStorage.getItem("token");
// console.log("token", token);
const auth = localStorage.getItem("auth");
// console.log("auth", auth);

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(12)} + 1px)`,
  },
});

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Home = () => {
  const { state, dispatch } = useContext(AdminContext);
  console.log("Home State", state);

  const { route } = useParams();
  // console.log(route);

  const navigate = useNavigate();

  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    if (open) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const openAcc = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutFunc = () => {
    setAnchorEl(null);
    // console.log("logout func");
    localStorage.setItem("token", null);
    localStorage.setItem("auth", false);
    toast.success("Logout Successfully!");
    navigate("/login");
  };

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth === "false" || !auth) {
      navigate("/login");
      toast.error("Please Login First!");
    }

    const allRoutes = [];
    routeArray.map((item) => {
      allRoutes.push(item.params);
    });
    // console.log(allRoutes);
    if (!allRoutes.includes(route)) {
      navigate("/error");
    }
  }, []);

  const getProfileFunc = async () => {
    try {
      let res = await getProfile();
      // console.log(res.data);
      if (res.data.status) {
        dispatch({
          type: "ADMIN",
          payload: { ...state, result: res.data.result[0] },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfileFunc();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={open}>
        <div className="main">
          <div className="navbar">
            <div className="toggle_btn">
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: 5,
                  color: "#28A9E2",
                }}
              >
                <MenuIcon style={{ fontSize: "2rem" }} />
              </IconButton>
            </div>
            <div className="user_info">
              {state && (
                <>
                  <img
                    src={bell}
                    alt="notification"
                    onClick={() => navigate("/message")}
                  />
                  <Avatar
                    alt="Profile Pic"
                    src={state?.result?.profileImage}
                    aria-controls={openAcc ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openAcc ? "true" : undefined}
                    onClick={handleClick}
                  />

                  <Menu
                    className="menu"
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={openAcc}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                    PaperProps={{
                      style: {
                        marginTop: "0.5rem",
                        // width: "10%",
                      },
                    }}
                  >
                    <MenuItem onClick={handleClose}>
                      <NavLink
                        style={{ textDecoration: "none", color: "#000" }}
                        to="/profile"
                      >
                        Profile
                      </NavLink>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <NavLink
                        style={{ textDecoration: "none", color: "#000" }}
                        to="/change_password"
                      >
                        Change Password
                      </NavLink>
                    </MenuItem>
                    <MenuItem onClick={() => logoutFunc()}>Logout</MenuItem>
                  </Menu>
                  <div className="name">{state?.result?.company_name}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <div
          onMouseEnter={() => setOpen(true)}
          // onMouseLeave={() => setOpen(false)}F
        >
          <Sidebar open={open} />
        </div>
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, marginTop: "4rem", backgroundColor: "#f9f9fa" }}
      >
        <Container id={`${open === true ? "open" : "close"}`}>
          {routeArray.map((item) => route === item.params && item.component)}
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
