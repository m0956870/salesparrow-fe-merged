import "./Product.css";
import React, { useState, useEffect } from "react";
import group from "../../images/group.png";

import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from '@mui/icons-material/Cancel';

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";


const FocusedProduct = () => {
    // const selectedVal = []
    const [selectedVal, setselectedVal] = useState([])

    const selectedValFunc = (e) => {
        if (selectedVal.includes(e.target.value)) {
            return
        }
        setselectedVal((prev) => [...prev, e.target.value])
    }

    const removeItemFunc = (sItem) => {
        const filtered = selectedVal.filter(item => item !== sItem)
        setselectedVal(filtered)
    }

    const allData = [
        {
            category: "Lorem Ipsum",
            product: "Haldi Powder 100g"
        },
        {
            category: "Lorem Ipsum",
            product: "Haldi Powder 100g"
        },
        {
            category: "Lorem Ipsum",
            product: "Haldi Powder 100g"
        },
        {
            category: "Lorem Ipsum",
            product: "Haldi Powder 100g"
        },
        {
            category: "Lorem Ipsum",
            product: "Haldi Powder 100g"
        },
        {
            category: "Lorem Ipsum",
            product: "Haldi Powder 100g"
        },
        {
            category: "Lorem Ipsum",
            product: "Haldi Powder 100g"
        },
        {
            category: "Lorem Ipsum",
            product: "Haldi Powder 100g"
        },
        {
            category: "Lorem Ipsum",
            product: "Haldi Powder 100g"
        },
        {
            category: "Lorem Ipsum",
            product: "Haldi Powder 100g"
        },
        {
            category: "Lorem Ipsum",
            product: "Haldi Powder 100g"
        },
        {
            category: "Lorem Ipsum",
            product: "Haldi Powder 100g"
        },
        {
            category: "Lorem Ipsum",
            product: "Haldi Powder 100g"
        },
    ]

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

    return (
        <div className="container">
            <div className="beat_heading">
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">Focused Product</div>
                </div>
                <div className="beat_right">
                    <div className="search">
                        <SearchIcon style={{ color: `var(--main-color)` }} />
                        <input type="text" placeholder="Search" />
                    </div>
                    <div className="add_btn"
                    // onClick={() => setbeatTab("add")}
                    >
                        Add New
                    </div>
                </div>
            </div>
            <div className="party_container">
                <div className="grouping_submit">
                    <div className="message_left">
                        <div className="message_form">
                            <select className="grouping_select" name="city">
                                <option value="Category">Category</option>
                                <option value="saab">Saab</option>
                                <option value="mercedes">Mercedes</option>
                                <option value="audi">Audi</option>
                            </select>
                        </div>
                    </div>
                    <div className="message_right">
                        <div className="message_form">
                            <select className="grouping_select" name="city" onChange={selectedValFunc}>
                                <option value="Party Type">Haldi Powder....</option>
                                <option value="saab">Saab</option>
                                <option value="mercedes">Mercedes</option>
                                <option value="audi">Audi</option>
                            </select>
                        </div>
                        <div className="seleced">
                            {selectedVal && selectedVal.map((item) => (
                                <span className="seleced_item" >{item} <CancelIcon onClick={() => removeItemFunc(item)} style={{ color: "var(--main-color)", marginLeft: "0.3rem" }} /></span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="message_btn submit_btn">SUBMIT</div>
            </div>

            <div className="beat_table">
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Category</StyledTableCell>
                            <StyledTableCell align="center">Product</StyledTableCell>
                            <StyledTableCell align="center">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    {/* <div style={{ margin: "0.5rem 0" }}></div> */}
                    <TableBody>
                        {allData.map((row) => (
                            <>
                                <StyledTableRow key={row.category}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.category}
                                    </StyledTableCell>
                                    <StyledTableCell align="center" component="th" scope="row">
                                        {row.product}
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ flex: 0.5 }} align="center">
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

export default FocusedProduct