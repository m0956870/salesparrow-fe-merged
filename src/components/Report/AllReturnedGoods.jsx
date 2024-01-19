// import "./AllReturnedGoods.css";
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

const AllReturnedGoods = () => {
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
            employee_name: "Lorem Ipsum",
            distributor_name: "Lorem Ipsum",
            invoice_no: "2345678",
            product_name: "Haldi Powder Masala 100g",
            description: "Lorem Ipsum",
            qty: "10",
            amount: "20,000",
            returned_date: "02/12/2021",
        },
        {
            employee_name: "Lorem Ipsum",
            distributor_name: "Lorem Ipsum",
            invoice_no: "2345678",
            product_name: "Haldi Powder Masala 100g",
            description: "Lorem Ipsum",
            qty: "10",
            amount: "20,000",
            returned_date: "02/12/2021",
        },
        {
            employee_name: "Lorem Ipsum",
            distributor_name: "Lorem Ipsum",
            invoice_no: "2345678",
            product_name: "Haldi Powder Masala 100g",
            description: "Lorem Ipsum",
            qty: "10",
            amount: "20,000",
            returned_date: "02/12/2021",
        },
        {
            employee_name: "Lorem Ipsum",
            distributor_name: "Lorem Ipsum",
            invoice_no: "2345678",
            product_name: "Haldi Powder Masala 100g",
            description: "Lorem Ipsum",
            qty: "10",
            amount: "20,000",
            returned_date: "02/12/2021",
        },
        {
            employee_name: "Lorem Ipsum",
            distributor_name: "Lorem Ipsum",
            invoice_no: "2345678",
            product_name: "Haldi Powder Masala 100g",
            description: "Lorem Ipsum",
            qty: "10",
            amount: "20,000",
            returned_date: "02/12/2021",
        },
        {
            employee_name: "Lorem Ipsum",
            distributor_name: "Lorem Ipsum",
            invoice_no: "2345678",
            product_name: "Haldi Powder Masala 100g",
            description: "Lorem Ipsum",
            qty: "10",
            amount: "20,000",
            returned_date: "02/12/2021",
        },
        {
            employee_name: "Lorem Ipsum",
            distributor_name: "Lorem Ipsum",
            invoice_no: "2345678",
            product_name: "Haldi Powder Masala 100g",
            description: "Lorem Ipsum",
            qty: "10",
            amount: "20,000",
            returned_date: "02/12/2021",
        },
        {
            employee_name: "Lorem Ipsum",
            distributor_name: "Lorem Ipsum",
            invoice_no: "2345678",
            product_name: "Haldi Powder Masala 100g",
            description: "Lorem Ipsum",
            qty: "10",
            amount: "20,000",
            returned_date: "02/12/2021",
        },
        {
            employee_name: "Lorem Ipsum",
            distributor_name: "Lorem Ipsum",
            invoice_no: "2345678",
            product_name: "Haldi Powder Masala 100g",
            description: "Lorem Ipsum",
            qty: "10",
            amount: "20,000",
            returned_date: "02/12/2021",
        },
        {
            employee_name: "Lorem Ipsum",
            distributor_name: "Lorem Ipsum",
            invoice_no: "2345678",
            product_name: "Haldi Powder Masala 100g",
            description: "Lorem Ipsum",
            qty: "10",
            amount: "20,000",
            returned_date: "02/12/2021",
        },
        {
            employee_name: "Lorem Ipsum",
            distributor_name: "Lorem Ipsum",
            invoice_no: "2345678",
            product_name: "Haldi Powder Masala 100g",
            description: "Lorem Ipsum",
            qty: "10",
            amount: "20,000",
            returned_date: "02/12/2021",
        },
    ];

    return (
        <div className="container">
            <div className="beat_heading">
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">All Returned Goods</div>
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
                            <StyledTableCell style={{ flex: 1 }} align="center">Employee Name</StyledTableCell>
                            <StyledTableCell style={{ flex: 1 }} align="center">Distributor Name</StyledTableCell>
                            <StyledTableCell style={{ flex: 1 }} align="center">Invoice No.</StyledTableCell>
                            <StyledTableCell style={{ flex: 1 }} align="center">Product Name</StyledTableCell>
                            <StyledTableCell style={{ flex: 1 }} align="center">Description</StyledTableCell>
                            <StyledTableCell style={{ flex: 1 }} align="center">Qty</StyledTableCell>
                            <StyledTableCell style={{ flex: 1 }} align="center">Amount</StyledTableCell>
                            <StyledTableCell style={{ flex: 1 }} align="center">Returned Date</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allData.map((row) => (
                            <>
                                <StyledTableRow key={row.qty} style={{ display: "flex" }} >
                                    <StyledTableCell style={{ flex: 1 }} align="center">{row.employee_name}</StyledTableCell>
                                    <StyledTableCell style={{ flex: 1 }} align="center">{row.distributor_name}</StyledTableCell>
                                    <StyledTableCell style={{ flex: 1 }} align="center">{row.invoice_no}</StyledTableCell>
                                    <StyledTableCell style={{ flex: 1 }} align="center">{row.product_name}</StyledTableCell>
                                    <StyledTableCell style={{ flex: 1 }} align="center">{row.description}</StyledTableCell>
                                    <StyledTableCell style={{ flex: 1 }} align="center">{row.qty}</StyledTableCell>
                                    <StyledTableCell style={{ flex: 1 }} align="center">₹{row.amount}</StyledTableCell>
                                    <StyledTableCell style={{ flex: 1 }} align="center">{row.returned_date}</StyledTableCell>
                                </StyledTableRow>
                            </>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AllReturnedGoods;
