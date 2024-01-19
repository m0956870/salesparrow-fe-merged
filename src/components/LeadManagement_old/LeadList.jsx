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
            lead_name: "Lorem Ipsum",
            mobile_no: "9999999999",
            email: "lorem@gmail.com",
            state: "Rajasthan",
            lead_source: "Maunal",
            assigned_to: "Employee Name",
            lead_status: "OPEN",
            last_follow_up: "12/10/2021",
        },
        {
            lead_name: "Lorem Ipsum",
            mobile_no: "9999999999",
            email: "lorem@gmail.com",
            state: "Rajasthan",
            lead_source: "Maunal",
            assigned_to: "Assign",
            lead_status: "CLOSED",
            last_follow_up: "12/10/2021",
        },
        {
            lead_name: "Lorem Ipsum",
            mobile_no: "9999999999",
            email: "lorem@gmail.com",
            state: "Rajasthan",
            lead_source: "Maunal",
            assigned_to: "Employee Name",
            lead_status: "OPEN",
            last_follow_up: "12/10/2021",
        },
        {
            lead_name: "Lorem Ipsum",
            mobile_no: "9999999999",
            email: "lorem@gmail.com",
            state: "Rajasthan",
            lead_source: "Maunal",
            assigned_to: "Assign",
            lead_status: "CLOSED",
            last_follow_up: "12/10/2021",
        },
        {
            lead_name: "Lorem Ipsum",
            mobile_no: "9999999999",
            email: "lorem@gmail.com",
            state: "Rajasthan",
            lead_source: "Maunal",
            assigned_to: "Employee Name",
            lead_status: "OPEN",
            last_follow_up: "12/10/2021",
        },
        {
            lead_name: "Lorem Ipsum",
            mobile_no: "9999999999",
            email: "lorem@gmail.com",
            state: "Rajasthan",
            lead_source: "Maunal",
            assigned_to: "Assign",
            lead_status: "CLOSED",
            last_follow_up: "12/10/2021",
        },
        {
            lead_name: "Lorem Ipsum",
            mobile_no: "9999999999",
            email: "lorem@gmail.com",
            state: "Rajasthan",
            lead_source: "Maunal",
            assigned_to: "Employee Name",
            lead_status: "OPEN",
            last_follow_up: "12/10/2021",
        },
        {
            lead_name: "Lorem Ipsum",
            mobile_no: "9999999999",
            email: "lorem@gmail.com",
            state: "Rajasthan",
            lead_source: "Maunal",
            assigned_to: "Assign",
            lead_status: "CLOSED",
            last_follow_up: "12/10/2021",
        },
        {
            lead_name: "Lorem Ipsum",
            mobile_no: "9999999999",
            email: "lorem@gmail.com",
            state: "Rajasthan",
            lead_source: "Maunal",
            assigned_to: "Employee Name",
            lead_status: "OPEN",
            last_follow_up: "12/10/2021",
        },
        {
            lead_name: "Lorem Ipsum",
            mobile_no: "9999999999",
            email: "lorem@gmail.com",
            state: "Rajasthan",
            lead_source: "Maunal",
            assigned_to: "Assign",
            lead_status: "CLOSED",
            last_follow_up: "12/10/2021",
        },
    ];

    return (
        <div className="container">
            <div className="beat_heading">
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">Lead List</div>
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
                    <select name="city">
                        <option value="City">Select State</option>
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

                    <select name="state">
                        <option value="State">Lead Source</option>
                        <option value="saab">Saab</option>
                        <option value="mercedes">Mercedes</option>
                        <option value="audi">Audi</option>
                    </select>

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
                            <StyledTableCell>Lead Name</StyledTableCell>
                            <StyledTableCell align="left">Mobile No.</StyledTableCell>
                            <StyledTableCell align="left">Email ID</StyledTableCell>
                            <StyledTableCell align="left">State</StyledTableCell>
                            <StyledTableCell align="left">Lead Source</StyledTableCell>
                            <StyledTableCell align="left">Assigned To</StyledTableCell>
                            <StyledTableCell align="left">Lead Status</StyledTableCell>
                            <StyledTableCell align="left">Last Follow Up</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    {/* <div style={{ margin: "0.5rem 0" }}></div> */}
                    <TableBody>
                        {allData.map((row) => (
                            <>
                                <StyledTableRow key={row.lead_name}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.lead_name}
                                    </StyledTableCell>
                                    <StyledTableCell align="left" component="th" scope="row">
                                        {row.mobile_no}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        {row.email}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">{row.state}</StyledTableCell>
                                    <StyledTableCell align="left">{row.lead_source}</StyledTableCell>
                                    {row.assigned_to !== "Assign" ? (
                                        <StyledTableCell align="left">{row.assigned_to}</StyledTableCell>
                                    ) : (
                                        <StyledTableCell align="center">
                                            <a className="dialog_link" href="#">{row.assigned_to}</a>
                                        </StyledTableCell>
                                    )}
                                    <StyledTableCell align="left" component="th" scope="row">
                                        <div
                                            className={`${row.lead_status === "OPEN" ? "active_beat" : "inactive_beat"
                                                }`}
                                        >
                                            {row.lead_status}
                                        </div>
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        {row.last_follow_up}
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

export default LeadList;
