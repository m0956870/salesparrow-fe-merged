import "./Report.css";
import React from "react";
import group from "../../images/group.png";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BorderColorIcon from "@mui/icons-material/BorderColor";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";

const CompanyCurrentStock = () => {
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
            product_name: "Haldi Powder 100 gm",
            product_unit: "2",
            product_qty: "6",
            price: "20/Unit 1",
            amount: "2000",
            date: "12/10/2021"
        },
        {
            product_name: "Haldi Powder 100 gm",
            product_unit: "2",
            product_qty: "6",
            price: "20/Unit 1",
            amount: "2000",
            date: "12/10/2021"
        },
        {
            product_name: "Haldi Powder 100 gm",
            product_unit: "2",
            product_qty: "6",
            price: "20/Unit 1",
            amount: "2000",
            date: "12/10/2021"
        },
        {
            product_name: "Haldi Powder 100 gm",
            product_unit: "2",
            product_qty: "6",
            price: "20/Unit 1",
            amount: "2000",
            date: "12/10/2021"
        },
        {
            product_name: "Haldi Powder 100 gm",
            product_unit: "2",
            product_qty: "6",
            price: "20/Unit 1",
            amount: "2000",
            date: "12/10/2021"
        },
        {
            product_name: "Haldi Powder 100 gm",
            product_unit: "2",
            product_qty: "6",
            price: "20/Unit 1",
            amount: "2000",
            date: "12/10/2021"
        },
        {
            product_name: "Haldi Powder 100 gm",
            product_unit: "2",
            product_qty: "6",
            price: "20/Unit 1",
            amount: "2000",
            date: "12/10/2021"
        },
        {
            product_name: "Haldi Powder 100 gm",
            product_unit: "2",
            product_qty: "6",
            price: "20/Unit 1",
            amount: "2000",
            date: "12/10/2021"
        },
        {
            product_name: "Haldi Powder 100 gm",
            product_unit: "2",
            product_qty: "6",
            price: "20/Unit 1",
            amount: "2000",
            date: "12/10/2021"
        },
        {
            product_name: "Haldi Powder 100 gm",
            product_unit: "2",
            product_qty: "6",
            price: "20/Unit 1",
            amount: "2000",
            date: "12/10/2021"
        },
        {
            product_name: "Haldi Powder 100 gm",
            product_unit: "2",
            product_qty: "6",
            price: "20/Unit 1",
            amount: "2000",
            date: "12/10/2021"
        },
        {
            product_name: "Haldi Powder 100 gm",
            product_unit: "2",
            product_qty: "6",
            price: "20/Unit 1",
            amount: "2000",
            date: "12/10/2021"
        },
        {
            product_name: "Haldi Powder 100 gm",
            product_unit: "2",
            product_qty: "6",
            price: "20/Unit 1",
            amount: "2000",
            date: "12/10/2021"
        },
        {
            product_name: "Haldi Powder 100 gm",
            product_unit: "2",
            product_qty: "6",
            price: "20/Unit 1",
            amount: "2000",
            date: "12/10/2021"
        },
    ];

    return (
        <div className="container">

            <div className="beat_heading">
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">Company Current Stock</div>
                </div>
                <div className="beat_right">
                    <div className="search">
                        <SearchIcon style={{ color: `var(--main-color)` }} />
                        <input type="text" placeholder="Search" />
                    </div>
                    <div className="add_btn">
                        Add New
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
                            <StyledTableCell style={{ flex: 2 }} align="" >Product Name</StyledTableCell>
                            <StyledTableCell style={{ flex: 1 }} align="left">Product Unit</StyledTableCell>
                            <StyledTableCell style={{ flex: 1 }} align="left">Product Qty.</StyledTableCell>
                            <StyledTableCell style={{ flex: 1 }} align="left">Price</StyledTableCell>
                            <StyledTableCell style={{ flex: 1 }} align="left">Amount</StyledTableCell>
                            <StyledTableCell style={{ flex: 1 }} align="left">Date</StyledTableCell>
                            <StyledTableCell style={{ flex: 1 }} align="left">Date</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allData.map((row) => (
                            <>
                                <StyledTableRow key={row.product_name} style={{ display: "flex" }} >
                                    <StyledTableCell style={{ flex: 2 }} component="th" scope="row">
                                        {row.product_name}
                                    </StyledTableCell>
                                    <StyledTableCell style={{ flex: 1 }} align="left" component="th" scope="row">
                                        {row.product_unit}
                                    </StyledTableCell>
                                    <StyledTableCell style={{ flex: 1 }} align="left">
                                        {row.product_qty}
                                    </StyledTableCell>
                                    <StyledTableCell style={{ flex: 1 }} align="left">₹{row.price}</StyledTableCell>
                                    <StyledTableCell style={{ flex: 1 }} align="left">₹{row.amount}</StyledTableCell>
                                    <StyledTableCell style={{ flex: 1 }} align="left">{row.date}</StyledTableCell>
                                    <StyledTableCell style={{ flex: 1 }} align="left">
                                        <VisibilityIcon
                                            style={{ fontSize: "1rem", color: "var(--main-color)" }}
                                        />
                                        <BorderColorIcon
                                            // onClick={() => editBeatFunc(row)}
                                            style={{
                                                fontSize: "1rem",
                                                color: "var(--main-color)",
                                                marginLeft: "0.5rem",
                                            }}
                                        />
                                    </StyledTableCell>
                                </StyledTableRow>
                            </>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="report_summery">
                <div className="report_summery_details company_stock">
                    <div className="detail_div">
                        <div className="detail_title">Total Amount:</div>
                    </div>
                    <div className="detail_div">
                        <div className="">₹2,00,000</div>
                    </div>


                </div>
            </div>

        </div>
    );
};

export default CompanyCurrentStock;
