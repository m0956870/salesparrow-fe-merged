import React, { useState } from "react";
import group from "../../images/group.png";

import SearchIcon from "@mui/icons-material/Search";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";

const Clients = () => {
    const [activeTab, setactiveTab] = useState("Customers");

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: "var(--main-color)",
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
            // backgroundColor: "#fff",
            // borderRadius: "0.5rem",
        },
    }));

         const StyledTableRow = styled(TableRow)(({ theme }) => ({
        borderBottom: "2px solid #00000011",
    }));

    const allData = [
        {
            customer_name: "Lorem Ipsum",
            beat_name: "Lorem Ipsum",
            mobile_number: "Lorem Ipsum",
            status: "ACTIVE",
        },
        {
            customer_name: "Lorem Ipsum",
            beat_name: "Lorem Ipsum",
            mobile_number: "Lorem Ipsum",
            status: "INACTIVE",
        },
        {
            customer_name: "Lorem Ipsum",
            beat_name: "Lorem Ipsum",
            mobile_number: "Lorem Ipsum",
            status: "ACTIVE",
        },
        {
            customer_name: "Lorem Ipsum",
            beat_name: "Lorem Ipsum",
            mobile_number: "Lorem Ipsum",
            status: "INACTIVE",
        },
        {
            customer_name: "Lorem Ipsum",
            customer_name: "Lorem Ipsum",
            beat_name: "Lorem Ipsum",
            mobile_number: "Lorem Ipsum",
            status: "ACTIVE",
        },
        {
            customer_name: "Lorem Ipsum",
            beat_name: "Lorem Ipsum",
            mobile_number: "Lorem Ipsum",
            status: "INACTIVE",
        },
        {
            customer_name: "Lorem Ipsum",
            beat_name: "Lorem Ipsum",
            mobile_number: "Lorem Ipsum",
            status: "ACTIVE",
        },
        {
            customer_name: "Lorem Ipsum",
            beat_name: "Lorem Ipsum",
            mobile_number: "Lorem Ipsum",
            status: "INACTIVE",
        },
        {
            customer_name: "Lorem Ipsum",
            beat_name: "Lorem Ipsum",
            mobile_number: "Lorem Ipsum",
            status: "ACTIVE",
        },
        {
            customer_name: "Lorem Ipsum",
            beat_name: "Lorem Ipsum",
            mobile_number: "Lorem Ipsum",
            status: "INACTIVE",
        },
    ];

    return (
        <div className="container">
            <div className="beat_heading">
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">Clients</div>
                </div>
                <div className="beat_right">
                    <div className="search">
                        <SearchIcon style={{ color: `var(--main-color)` }} />
                        <input type="text" placeholder="Search" />
                    </div>
                    <div className="add_btn"
                    //   onClick={() => navigate("/add_beat")}
                    >
                        Add New
                    </div>
                </div>
            </div>

            <div className="lead_tab_container" style={{ margin: "1rem 0 2rem 0" }}>
                <div
                    onClick={() => setactiveTab("Customers")}
                    className={`${activeTab === "Customers" ? "lead_tab active_tab" : "lead_tab"}`}
                >
                    Customers
                </div>
                <div
                    onClick={() => setactiveTab("Leads")}
                    className={`${activeTab === "Leads" ? "lead_tab active_tab" : "lead_tab"
                        }`}
                >
                    Leads
                </div>
                <div
                    onClick={() => setactiveTab("Group")}
                    className={`${activeTab === "Group" ? "lead_tab active_tab" : "lead_tab"
                        }`}
                >
                    Group
                </div>
                <div
                    onClick={() => setactiveTab("Teams")}
                    className={`${activeTab === "Teams" ? "lead_tab active_tab" : "lead_tab"
                        }`}
                >
                    Teams
                </div>
            </div>

            <div className="tracking_tabs">
                <div className="tarcking_tab_left">
                    <select name="state">
                        <option value="State">State</option>
                        <option value="saab">Saab</option>
                        <option value="mercedes">Mercedes</option>
                        <option value="audi">Audi</option>
                    </select>

                    <input type="text" placeholder="Employee" />

                    <div
                        className="view_btn"
                    // onClick={() => setbeatTab("add")}
                    >
                        View
                    </div>
                </div>
            </div>

            <div className="device_table">
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Customer Name</StyledTableCell>
                            <StyledTableCell align="left">Beat Name</StyledTableCell>
                            <StyledTableCell align="left">Mobile Number</StyledTableCell>
                            <StyledTableCell align="left">Status</StyledTableCell>
                            <StyledTableCell align="left">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    {/* <div style={{ margin: "0.5rem 0" }}></div> */}
                    <TableBody>
                        {allData.map((row) => (
                            <>
                                <StyledTableRow key={row.customer_name}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.customer_name}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">{row.beat_name}</StyledTableCell>
                                    <StyledTableCell align="left">
                                        {row.mobile_number}
                                    </StyledTableCell>
                                    <StyledTableCell align="left" component="th" scope="row">
                                        <span
                                            style={{ display: "inline", padding: "0.2rem 1rem" }}
                                            className={`${row.status === "ACTIVE"
                                                ? "active_beat"
                                                : "inactive_beat"
                                                }`}
                                        >
                                            {row.status}
                                        </span>
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        <BorderColorIcon
                                            // onClick={() => viewDialog(row)}
                                            style={{ fontSize: "1rem", color: "var(--main-color)" }}
                                        />
                                        <DeleteIcon
                                            style={{
                                                fontSize: "1rem",
                                                color: "red",
                                                marginLeft: "0.5rem",
                                            }}
                                        />
                                    </StyledTableCell>
                                </StyledTableRow>
                                {/* <div style={{ margin: "0.2rem 0" }}></div> */}
                            </>
                        ))}
                    </TableBody>
                </Table>
            </div>

        </div>
    );
};

export default Clients;
