// import "./EmployeeDealerVisits.css";
import React from "react";
import group from "../../images/group.png";
import SearchIcon from "@mui/icons-material/Search";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";

const EmployeeDealerVisits = () => {
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: "var(--main-color)",
            color: theme.palette.common.white,
            fontWeight: "bold",
            borderRight: "1px solid #fff",
            overflow: "hidden",
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
            border: "none",
            borderLeft: "2px solid #00000011",
            '&:last-child': {
                borderRight: "2px solid #00000011",
            },
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        borderBottom: "2px solid #00000011",
    }));

    const allData = [
        {
            distributor_name: "Lorem Ipsum",
            no_of_visits: "1",
            primary_mount: "20,000",
            secondary_mount: "40,000",
        },
        {
            distributor_name: "Lorem Ipsum",
            no_of_visits: "1",
            primary_mount: "20,000",
            secondary_mount: "40,000",
        },
        {
            distributor_name: "Lorem Ipsum",
            no_of_visits: "1",
            primary_mount: "20,000",
            secondary_mount: "40,000",
        },
        {
            distributor_name: "Lorem Ipsum",
            no_of_visits: "1",
            primary_mount: "20,000",
            secondary_mount: "40,000",
        },
        {
            distributor_name: "Lorem Ipsum",
            no_of_visits: "1",
            primary_mount: "20,000",
            secondary_mount: "40,000",
        },
        {
            distributor_name: "Lorem Ipsum",
            no_of_visits: "1",
            primary_mount: "20,000",
            secondary_mount: "40,000",
        },
        {
            distributor_name: "Lorem Ipsum",
            no_of_visits: "1",
            primary_mount: "20,000",
            secondary_mount: "40,000",
        },
        {
            distributor_name: "Lorem Ipsum",
            no_of_visits: "1",
            primary_mount: "20,000",
            secondary_mount: "40,000",
        },
        {
            distributor_name: "Lorem Ipsum",
            no_of_visits: "1",
            primary_mount: "20,000",
            secondary_mount: "40,000",
        },
        {
            distributor_name: "Lorem Ipsum",
            no_of_visits: "1",
            primary_mount: "20,000",
            secondary_mount: "40,000",
        },
        {
            distributor_name: "Lorem Ipsum",
            no_of_visits: "1",
            primary_mount: "20,000",
            secondary_mount: "40,000",
        },
        {
            distributor_name: "Lorem Ipsum",
            no_of_visits: "1",
            primary_mount: "20,000",
            secondary_mount: "40,000",
        },
        {
            distributor_name: "Lorem Ipsum",
            no_of_visits: "1",
            primary_mount: "20,000",
            secondary_mount: "40,000",
        },
    ];

    return (
        <div className="container">
            <div className="beat_heading">
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">Employee Dealer Visits</div>
                </div>
                <div className="beat_right">
                    <div className="search">
                        <SearchIcon style={{ color: `var(--main-color)` }} />
                        <input type="text" placeholder="Search" />
                    </div>
                </div>
            </div>

            <div className="tracking_tabs">
                <div className="tarcking_tab_left">
                    <select name="city">
                        <option value="City">Select a State</option>
                        <option value="saab">Saab</option>
                        <option value="mercedes">Mercedes</option>
                        <option value="audi">Audi</option>
                    </select>
                    <select name="state">
                        <option value="State">Select Employee</option>
                        <option value="saab">Saab</option>
                        <option value="mercedes">Mercedes</option>
                        <option value="audi">Audi</option>
                    </select>
                    <input type="date" name="" />
                    <input type="date" name="" />
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
                        <TableRow style={{ display: "flex" }}>
                            <StyledTableCell style={{ flex: 1 }} align="center">Distributor Name</StyledTableCell>
                            <StyledTableCell style={{ flex: 1 }} align="center">No. of Visits</StyledTableCell>
                            <StyledTableCell style={{ flex: 1 }} align="center">Primary Amount</StyledTableCell>
                            <StyledTableCell style={{ flex: 1 }} align="center">Secondary Amount</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allData.map((row) => (
                            <>
                                <StyledTableRow key={row.date} style={{ display: "flex" }} >
                                    <StyledTableCell style={{ flex: 1 }} align="center">{row.distributor_name}</StyledTableCell>
                                    <StyledTableCell style={{ flex: 1 }} align="center">{row.no_of_visits}</StyledTableCell>
                                    <StyledTableCell style={{ flex: 1 }} align="center">₹{row.primary_mount}</StyledTableCell>
                                    <StyledTableCell style={{ flex: 1 }} align="center">₹{row.secondary_mount}</StyledTableCell>
                                </StyledTableRow>
                            </>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default EmployeeDealerVisits;
