import React from 'react'
import group from "../../images/group.png";

import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";

const SchemeList = () => {

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

    const allData = [
        {
            schema_name: "Schema 1",
            party: "party",
            start_date: "12/02/2021",
            end_date: "14/02/2021",
            point_formula: "Quantity",
            set_prize: "view",
        },
        {
            schema_name: "Schema 1",
            party: "party",
            start_date: "12/02/2021",
            end_date: "14/02/2021",
            point_formula: "Quantity",
            set_prize: "view",
        },
        {
            schema_name: "Schema 1",
            party: "party",
            start_date: "12/02/2021",
            end_date: "14/02/2021",
            point_formula: "Quantity",
            set_prize: "view",
        },
        {
            schema_name: "Schema 1",
            party: "party",
            start_date: "12/02/2021",
            end_date: "14/02/2021",
            point_formula: "Quantity",
            set_prize: "view",
        },
        {
            schema_name: "Schema 1",
            party: "party",
            start_date: "12/02/2021",
            end_date: "14/02/2021",
            point_formula: "Quantity",
            set_prize: "view",
        },
        {
            schema_name: "Schema 1",
            party: "party",
            start_date: "12/02/2021",
            end_date: "14/02/2021",
            point_formula: "Quantity",
            set_prize: "view",
        },
        {
            schema_name: "Schema 1",
            party: "party",
            start_date: "12/02/2021",
            end_date: "14/02/2021",
            point_formula: "Quantity",
            set_prize: "view",
        },
        {
            schema_name: "Schema 1",
            party: "party",
            start_date: "12/02/2021",
            end_date: "14/02/2021",
            point_formula: "Quantity",
            set_prize: "view",
        },

    ];

         const StyledTableRow = styled(TableRow)(({ theme }) => ({
        borderBottom: "2px solid #00000011",
    }));
    return (
        <div className="container">
            <div className="beat_heading">
                <div className="beat_left" >
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">Scheme List</div>
                </div>

                <div className="beat_right">
                    <div className="add_btn" style={{ background: "#fff", color: "#000", fontWeight: "500", marginRight: "1rem", boxShadow: "var(--box-shadow)" }} >
                        QPS
                    </div>
                    <div className="add_btn" >
                        Coupon
                    </div>
                </div>

            </div>

            <div className="tracking_tabs">
                <div className="tarcking_tab_left">
                    <select name="city">
                        <option value="City">City</option>
                        <option value="saab">Saab</option>
                        <option value="mercedes">Mercedes</option>
                        <option value="audi">Audi</option>
                    </select>
                    <select name="state">
                        <option value="State">State</option>
                        <option value="saab">Saab</option>
                        <option value="mercedes">Mercedes</option>
                        <option value="audi">Audi</option>
                    </select>
                    <input type="date" name="" id="" />
                    <input type="date" name="" id="" />
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
                            <StyledTableCell>Schema Name</StyledTableCell>
                            <StyledTableCell align="left"></StyledTableCell>
                            <StyledTableCell align="left">Start Date</StyledTableCell>
                            <StyledTableCell align="left">End Date</StyledTableCell>
                            <StyledTableCell align="left">Point Formula</StyledTableCell>
                            <StyledTableCell align="left">Set Prize</StyledTableCell>
                            <StyledTableCell align="left">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    {/* <div style={{ margin: "0.5rem 0" }}></div> */}
                    <TableBody>
                        {allData.map((row) => (
                            <>
                                <StyledTableRow key={row.schema_name}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.schema_name}
                                    </StyledTableCell>
                                    <StyledTableCell align="left" component="th" scope="row">
                                        <a href="#" className="dialog_link">
                                            {row.party}
                                        </a>
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        {row.start_date}
                                    </StyledTableCell>
                                    <StyledTableCell align="left" component="th" scope="row">
                                        {row.end_date}
                                    </StyledTableCell>
                                    <StyledTableCell align="left" component="th" scope="row">
                                        {row.point_formula}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        <a href="#" className="dialog_link">
                                            {row.set_prize}
                                        </a>
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
    )
}

export default SchemeList