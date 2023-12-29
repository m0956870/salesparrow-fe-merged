import "./Leads.css";
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
import { useNavigate } from "react-router-dom";

const LeadList = () => {
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
            employee_name: "Lorem Ipsum",
            lead_name: "Lorem Ipsum",
            status: "Done",
            state: "Rajasthan",
            date: "10/02/2021",
            notes: "Lorem Ipsum",
            action: "",
        },
        {
            employee_name: "Lorem Ipsum",
            lead_name: "Lorem Ipsum",
            status: "Overdue",
            state: "Rajasthan",
            date: "10/02/2021",
            notes: "Lorem Ipsum",
            action: "Notify",
        },
        {
            employee_name: "Lorem Ipsum",
            lead_name: "Lorem Ipsum",
            status: "Done",
            state: "Rajasthan",
            date: "10/02/2021",
            notes: "Lorem Ipsum",
            action: "",
        },
        {
            employee_name: "Lorem Ipsum",
            lead_name: "Lorem Ipsum",
            status: "Overdue",
            state: "Rajasthan",
            date: "10/02/2021",
            notes: "Lorem Ipsum",
            action: "Notify",
        },
        {
            employee_name: "Lorem Ipsum",
            lead_name: "Lorem Ipsum",
            status: "Done",
            state: "Rajasthan",
            date: "10/02/2021",
            notes: "Lorem Ipsum",
            action: "",
        },
        {
            employee_name: "Lorem Ipsum",
            lead_name: "Lorem Ipsum",
            status: "Overdue",
            state: "Rajasthan",
            date: "10/02/2021",
            notes: "Lorem Ipsum",
            action: "Notify",
        },
        {
            employee_name: "Lorem Ipsum",
            lead_name: "Lorem Ipsum",
            status: "Done",
            state: "Rajasthan",
            date: "10/02/2021",
            notes: "Lorem Ipsum",
            action: "",
        },
        {
            employee_name: "Lorem Ipsum",
            lead_name: "Lorem Ipsum",
            status: "Overdue",
            state: "Rajasthan",
            date: "10/02/2021",
            notes: "Lorem Ipsum",
            action: "Notify",
        },
        {
            employee_name: "Lorem Ipsum",
            lead_name: "Lorem Ipsum",
            status: "Done",
            state: "Rajasthan",
            date: "10/02/2021",
            notes: "Lorem Ipsum",
            action: "",
        },
        {
            employee_name: "Lorem Ipsum",
            lead_name: "Lorem Ipsum",
            status: "Overdue",
            state: "Rajasthan",
            date: "10/02/2021",
            notes: "Lorem Ipsum",
            action: "Notify",
        },
        {
            employee_name: "Lorem Ipsum",
            lead_name: "Lorem Ipsum",
            status: "Done",
            state: "Rajasthan",
            date: "10/02/2021",
            notes: "Lorem Ipsum",
            action: "",
        },
        {
            employee_name: "Lorem Ipsum",
            lead_name: "Lorem Ipsum",
            status: "Overdue",
            state: "Rajasthan",
            date: "10/02/2021",
            notes: "Lorem Ipsum",
            action: "Notify",
        },
    ];

    return (
        <div className="container">
            <div className="beat_heading">
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">Leads</div>
                </div>
                <div className="beat_right">
                    <div className="search">
                        <SearchIcon style={{ color: `var(--main-color)` }} />
                        <input type="text" placeholder="Search" />
                    </div>
                    <div className="add_btn"
                      onClick={() => navigate("/add_lead")}
                    >
                        Add New
                    </div>
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
                            <StyledTableCell>Employee Name</StyledTableCell>
                            <StyledTableCell align="left">Laed Name</StyledTableCell>
                            <StyledTableCell align="left">Status</StyledTableCell>
                            <StyledTableCell align="left">Date</StyledTableCell>
                            <StyledTableCell align="left">Notes</StyledTableCell>
                            <StyledTableCell align="left">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    {/* <div style={{ margin: "0.5rem 0" }}></div> */}
                    <TableBody>
                        {allData.map((row) => (
                            <>
                                <StyledTableRow key={row.employee_name}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.employee_name}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">{row.lead_name}</StyledTableCell>
                                    <StyledTableCell align="left" component="th" scope="row">
                                        <div
                                            className={`${row.status === "Done" ? "done" : "overdue"}`}
                                        >
                                            {row.status}
                                        </div>
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        {row.date}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        {row.notes}
                                    </StyledTableCell>
                                    {row.action !== "Notify" ? (
                                        <StyledTableCell align="left">{row.action}</StyledTableCell>
                                    ) : (
                                        <StyledTableCell align="center">
                                            <a className="dialog_link" href="#">{row.action}</a>
                                        </StyledTableCell>
                                    )}
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

export default LeadList;
