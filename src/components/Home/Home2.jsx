import './Home.css';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
// import CssBaseline from '@mui/material/CssBaseline';
// import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';

import Avatar from "@mui/material/Avatar";
import { Container, Menu, MenuItem } from "@mui/material";
import routeArray from "../../routes.js";
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import Sidebar from '../../common/Sidebar/Sidebar.jsx';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AdminContext } from '../../App.js';
import bell from "../../images/bell.png";
import getProfile from '../../api/auth';

const drawerWidth = 200;

export default function ResponsiveDrawer(props) {
    const { state, dispatch } = React.useContext(AdminContext);
    // console.log("Home State", state);

    const { route } = useParams();
    const navigate = useNavigate();

    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const container = window !== undefined ? () => window().document.body : undefined;

    // 
    const [open, setOpen] = React.useState(true);

    useEffect(() => {
        if (mobileOpen) {
            setMobileOpen(!mobileOpen);
        }
    }, [route])

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
            } else {
                // toast.error(res.data.message)
                navigate("/login")
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getProfileFunc();
    }, []);

    return (
        <Box sx={{
            display: 'flex'
        }}>
            <AppBar
                position="fixed"
                sx={{ paddingRight: "0 !important" }}
            >
                <div className="main">
                    <div className="navbar">
                        <div className="toggle_btn">
                            <Toolbar>
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    edge="start"
                                    onClick={handleDrawerToggle}
                                    sx={{ display: { sm: 'none' }, color: "#000" }}
                                >
                                    <MenuIcon />
                                </IconButton>
                            </Toolbar>
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
                                        sx={{ position: "absolute" }}
                                    // PaperProps={{
                                    //     style: {
                                    //         marginTop: "0.5rem",
                                    //         width: "10%",
                                    //     },
                                    // }}
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
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    <Sidebar open={open} />
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    <Sidebar open={open} />
                </Drawer>
            </Box>
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
}