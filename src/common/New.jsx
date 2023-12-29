import "./New.css";
import React, { useContext, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";

import Sidebar from "./Sidebar/Sidebar";

import bell from "../images/bell.png";

import { AdminContext } from "../App";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import routeArray from "../routes";

import Container from "@mui/material/Container";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";

const New = () => {
  const { state, dispatch } = useContext(AdminContext);
  // console.log("Home State", state);

  const navigate = useNavigate();
  const { route } = useParams();

  const [openSidebar, setopenSidebar] = useState(true);

  const [sidebarWidth, setsidebarWidth] = useState("17.5%");
  const [rightWidth, setrightWidth] = useState("82.5%");
  const [navWidth, setnavWidth] = useState("82.5%");

  const closeSidebarFunc = () => {
    if (sidebarWidth === "17.5%") {
      setsidebarWidth("8%");
      setrightWidth("100%");
      setnavWidth("100%");
      setopenSidebar(false);
    } else {
      setsidebarWidth("17.5%");
      setrightWidth("82.5%");
      setnavWidth("82.5%");
      setopenSidebar(true);
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
  return (
    <>
      <div id="home">
        <div className="home_sidebar" style={{ width: `${sidebarWidth}` }}>
          <Sidebar open={openSidebar} />
        </div>
        <div className="home_rightbar" style={{ width: `${rightWidth}` }}>
          <AppBar
            // position="fixed"
            style={{ transition: "all 0.2s ease-in-out", width: `${navWidth}` }}
          >
            <div className="main">
              <div className="navbar">
                <div className="toggle_btn">
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={closeSidebarFunc}
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
                    // src={state?.result.profileImage}
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
                    <MenuItem
                    // onClick={() => logoutFunc()}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                  {/* <div className="name">{state?.result.company_name}</div> */}
                  {/* )} */}
                </div>
              </div>
            </div>
          </AppBar>

          <div className="main_dash">
            <Container>
              {routeArray.map(
                (item) => route === item.params && item.component
              )}
            </Container>
          </div>
        </div>
      </div>
    </>
  );
};

export default New;
