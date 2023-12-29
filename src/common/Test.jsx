import "./Test.css";
import React, { useContext, useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import routeArray from "../routes";
import { NavLink, useNavigate, useParams } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import { Container, Menu, MenuItem } from "@mui/material";

import bell from "../images/bell.png";
import { AdminContext } from "../App";

const Test = () => {
  const { route } = useParams();
  const navigate = useNavigate();

  const { state, dispatch } = useContext(AdminContext);
  // console.log("Home State", state);'

  const [open, setOpen] = useState(true);

  const [width, setwidth] = useState("240px");

  const click = () => {
    if (width === "240px") {
      setwidth("100px");
      setOpen(false);
    } else {
      setwidth("240px");
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
    console.log("logout func");
    localStorage.setItem("token", null);
    localStorage.setItem("auth", false);
    navigate("/login");
  };

  return (
    <>
      <div className="container">
        <div id="test">
          <div className="t_left" style={{ width: `${width}` }}>
            <Sidebar open={open} />
          </div>

          <div className="t_right">
            <AppBar position="fixed" style={{ transition: "all 0.2s ease-in-out" }} sx={{ width: `${open ? "84.9%" : "100%"}` }}>
              <div className="main">
                <div className="navbar">
                  <div className="toggle_btn">
                    <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      onClick={click}
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
                    {/* {state && ( */}
                    <img
                      src={bell}
                      alt="notification"
                      onClick={() => navigate("/message")}
                    />
                    <Avatar
                      alt="Profile Pic"
                      src={state?.result.profileImage}
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
                    <div className="name">{state?.result.company_name}</div>
                    {/* )} */}
                  </div>
                </div>
              </div>
            </AppBar>

            <div className="t_body" style={{ backgroundColor: "#f9f9fa", padding: "0 2rem" }}>
              {routeArray.map(
                (item) => route === item.params && item.component
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Test;