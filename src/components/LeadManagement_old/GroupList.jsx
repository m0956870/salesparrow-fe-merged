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
import { useNavigate } from "react-router-dom";

const GroupList = () => {
    const navigate = useNavigate()
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
            colours: "#ff8181",
            group_name: "Group 1",
            leads: "10",
            customer: "-"
        },
        {
            colours: "#81ffe8",
            group_name: "Group 2",
            leads: "-",
            customer: "20"
        },
        {
            colours: "#ffeb81",
            group_name: "Group 1",
            leads: "10",
            customer: "-"
        },
        {
            colours: "#e4fa8c",
            group_name: "Group 2",
            leads: "-",
            customer: "20"
        },
        {
            colours: "#ff8181",
            group_name: "Group 1",
            leads: "10",
            customer: "-"
        },
        {
            colours: "#81ffe8",
            group_name: "Group 2",
            leads: "-",
            customer: "20"
        },
        {
            colours: "#ffeb81",
            group_name: "Group 1",
            leads: "10",
            customer: "-"
        },
        {
            colours: "#e4fa8c",
            group_name: "Group 2",
            leads: "-",
            customer: "20"
        },
        {
            colours: "#ff8181",
            group_name: "Group 1",
            leads: "10",
            customer: "-"
        },
        {
            colours: "#81ffe8",
            group_name: "Group 2",
            leads: "-",
            customer: "20"
        },
        {
            colours: "#ffeb81",
            group_name: "Group 1",
            leads: "10",
            customer: "-"
        },
        {
            colours: "#e4fa8c",
            group_name: "Group 2",
            leads: "-",
            customer: "20"
        },
    ];

    return (
        <div className="container">
            <div className="beat_heading">
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">Group List</div>
                </div>
                <div className="beat_right">
                    <div className="search">
                        <SearchIcon style={{ color: `var(--main-color)` }} />
                        <input type="text" placeholder="Search" />
                    </div>
                    <div className="add_btn"
                        onClick={() => navigate("/create_group")}
                    >
                        Add New
                    </div>
                </div>
            </div>

            <div className="device_table" style={{ marginTop: 0 }} >
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Colours</StyledTableCell>
                            <StyledTableCell align="center">Group Name</StyledTableCell>
                            <StyledTableCell align="center">Leads</StyledTableCell>
                            <StyledTableCell align="center">Customers</StyledTableCell>
                            <StyledTableCell align="center">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    {/* <div style={{ margin: "0.5rem 0" }}></div> */}
                    <TableBody>
                        {allData.map((row) => (
                            <>
                                <StyledTableRow key={row.colours}>
                                    <StyledTableCell component="th" scope="row">
                                        <div style={{ height: "20px", width: "20px", background: `${row.colours}` }} ></div>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{row.group_name}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.leads != "-" ? <a href="#">{row.leads}</a> : row.leads}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.customer != "-" ? <a href="#">{row.customer}</a> : row.customer}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <BorderColorIcon style={{ fontSize: '1rem', color: 'var(--main-color)' }} />
                                        <DeleteIcon style={{ fontSize: '1rem', color: 'red', marginLeft: '0.5rem' }} />
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

export default GroupList;
