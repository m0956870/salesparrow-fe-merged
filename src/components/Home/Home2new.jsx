import './Home.css';
import * as React from 'react';

// Images
// import dashboard_white from "../../images/dashboard_white.png";
import area_white from "../../images/area_white.png";
import employees_white from "../../images/employees_white.png";
import parties_white from "../../images/parties_white.png";
import products_white from "../../images/products_white.png";
// import mapping_white from "../../images/mapping_white.png";
// import tracking_white from "../../images/tracking_white.png";
// import report_white from "../../images/report_white.png";
// import transactions_white from "../../images/transactions_white.png";
// import scheme_white from "../../images/scheme_white.png";
import lead_white from "../../images/lead_white.png";
import setting_white from "../../images/setting_white.png";

import { styled, alpha } from '@mui/material/styles';
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
import SearchIcon from "@mui/icons-material/Search";
import InputBase from '@mui/material/InputBase';

import Icon from '@mui/material/Icon';
import { GoPlus } from "react-icons/go"

import Avatar from "@mui/material/Avatar";
import { Container, Menu, MenuItem } from "@mui/material";
import routeArray from "../../routes.js";
import { useNavigate, useParams, NavLink, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AdminContext } from '../../App.js';
import bell from "../../images/bell.png";
import getProfile from '../../api/auth';

import Sidebar from '../../common/Sidebar/Sidebar.jsx';

export let cid;

export default function ResponsiveDrawer(props) {
    // let drawerWidth = 200;
    const [drawerWidth, setdrawerWidth] = useState(200)
    const [hamMargin, sethamMargin] = useState("13.5rem")
    const { state, dispatch } = React.useContext(AdminContext);
    console.log("Home State", state);

    cid = state?.result?.company_name

    const { route } = useParams();
    const navigate = useNavigate();

    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const container = window !== undefined ? () => window().document.body : undefined;

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

    const changeWidth = () => {
        if (drawerWidth == 200) {
            setdrawerWidth(80)
            sethamMargin("5rem")
            setOpen(false)
        } else {
            setdrawerWidth(200)
            sethamMargin("13.5rem")
            setOpen(true)
        }
    }


    // Search bar 
    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        marginRight: 6,
        width: '100%',
        boxShadow: "var(--box-shadow)",
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    }));

    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        color: "var(--main-color)",
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            width: '100%',
            color: "gray",
            [theme.breakpoints.up('sm')]: {
                width: '12ch',
                '&:focus': {
                    width: '20ch',
                },
            },
        },
    }));

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
                        <div onClick={() => changeWidth()} className="hamburger_menu" style={{ marginLeft: `${hamMargin}`, color: "#000", transition: "all 0.3s ease-in-out" }}>
                            <MenuIcon />
                        </div>
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
                            {/* <div className="app_searchbar">
                                <SearchIcon style={{ color: `var(--main-color)` }} />
                                <input
                                    // onChange={(e) => settitlename(e.target.value)}
                                    type="text"
                                    placeholder="Search"
                                />
                            </div> */}
                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Search…"
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </Search>
                            <div className='appbar_plus_icon'>
                                <Icon className="emp_grp_icons">
                                    <GoPlus style={{ color: "var(--main-color)" }} />
                                </Icon>
                                <PlusIconContainer />
                            </div>
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
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 }, transition: "all 0.3s ease-in-out" }}
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
                        display: { xs: 'block', sm: 'none' }, backgroundColor: "var(--main-color)",
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, transition: "all 0.3s ease-in-out" },
                    }}
                >
                    <Sidebar open={open} />
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' }, backgroundColor: "var(--main-color)",
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, transition: "all 0.3s ease-in-out" },
                    }}
                    open
                >
                    <Sidebar open={open} />
                </Drawer>
            </Box>
            <Box component="main" sx={{ flexGrow: 1, marginTop: "4rem", backgroundColor: "#f9f9fa" }} >
                <div id={`${open === true ? "open" : "close"}`}>
                    {routeArray.map((item) => route === item.params && (
                        <div key={item.params} >
                            {item.component}
                        </div>
                    ))}
                </div>
            </Box>
        </Box>
    );
}

const PlusIconContainer = () => {
    return (
        <div className="plus_icon_hover_layer">
            <div className="add_btn_container">
                <div className='add_elem'>
                    {/* <GoPlus className='elem_icon' /> */}
                    <span className="add_elem_img"><img src={area_white} alt="" /></span>
                    <Link to="/create_route">Add Route</Link>
                </div>
                <div className='add_elem'>
                    <span className="add_elem_img"><img src={area_white} alt="" /></span>
                    <Link to="/add_beat">Add Beat</Link>
                </div>
                <div className='add_elem'>
                    <span className="add_elem_img"><img src={employees_white} alt="" /></span>
                    <Link to="/add_employees">Add Employee</Link>
                </div>
                <div className='add_elem'>
                    <span className="add_elem_img"><img src={employees_white} alt="" /></span>
                    <Link to="/employee_grouping">Add Employee Group</Link>
                </div>
                <div className='add_elem'>
                    <span className="add_elem_img"><img src={employees_white} alt="" /></span>
                    <Link to="/add_employee_target">Add Employee Target</Link>
                </div>
                <div className='add_elem'>
                    <span className="add_elem_img"><img src={parties_white} alt="" /></span>
                    <Link to="/add_party">Add Party</Link>
                </div>
                <div className='add_elem'>
                    <span className="add_elem_img"><img src={parties_white} alt="" /></span>
                    <Link to="/party_grouping">Add Party Group</Link>
                </div>
                <div className='add_elem'>
                    <span className="add_elem_img"><img src={products_white} alt="" /></span>
                    <Link to="/add_brand">Add Brand</Link>
                </div>
                <div className='add_elem'>
                    <span className="add_elem_img"><img src={products_white} alt="" /></span>
                    <Link to="/add_product">Add Product</Link>
                </div>
                <div className='add_elem'>
                    <span className="add_elem_img"><img src={products_white} alt="" /></span>
                    <Link to="/product_grouping">Add Product Group</Link>
                </div>
                <div className='add_elem'>
                    <span className="add_elem_img"><img src={products_white} alt="" /></span>
                    <Link to="/add_price_list">Add Price List</Link>
                </div>
                <div className='add_elem'>
                    <span className="add_elem_img"><img src={setting_white} alt="" /></span>
                    <Link to="/create_role">Add Role</Link>
                </div>
                <div className='add_elem'>
                    <span className="add_elem_img"><img src={lead_white} alt="" /></span>
                    <Link to="/add_lead">Add Lead</Link>
                </div>
                <div className='add_elem'>
                    <span className="add_elem_img"><img src={lead_white} alt="" /></span>
                    <Link to="/create_lead_group">Create Lead Group</Link>
                </div>
            </div>
        </div>
    )
}