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

const BannerList = () => {
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
            occassion_type: "Personal Occassion",
            banner_name: "Birthday",
            date: "-",
        },
        {
            occassion_type: "Festival Occassion",
            banner_name: "Diwali",
            date: "12/04/2021",
        },
        {
            occassion_type: "Personal Occassion",
            banner_name: "Birthday",
            date: "-",
        },
        {
            occassion_type: "Festival Occassion",
            banner_name: "Diwali",
            date: "12/04/2021",
        },
        {
            occassion_type: "Personal Occassion",
            banner_name: "Birthday",
            date: "-",
        },
        {
            occassion_type: "Festival Occassion",
            banner_name: "Diwali",
            date: "12/04/2021",
        },
        {
            occassion_type: "Personal Occassion",
            banner_name: "Birthday",
            date: "-",
        },
        {
            occassion_type: "Festival Occassion",
            banner_name: "Diwali",
            date: "12/04/2021",
        },
        {
            occassion_type: "Personal Occassion",
            banner_name: "Birthday",
            date: "-",
        },
        {
            occassion_type: "Festival Occassion",
            banner_name: "Diwali",
            date: "12/04/2021",
        },
        {
            occassion_type: "Personal Occassion",
            banner_name: "Birthday",
            date: "-",
        },
        {
            occassion_type: "Festival Occassion",
            banner_name: "Diwali",
            date: "12/04/2021",
        },
    ];

    return (
        <div className="container">
           <div className="beat_heading">
        <div className="beat_left">
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Banner List</div>
        </div>
        <div className="beat_right">
        <select className="select_btn" name="city" style={{marginRight:"1rem"}}>
              <option value="City">Occupation Type</option>
              <option value="saab">Saab</option>
              <option value="mercedes">Mercedes</option>
              <option value="audi">Audi</option>
            </select>
   
          <div className="search">
            <SearchIcon style={{ color: `var(--main-color)` }} />
            <input type="text" placeholder="Search" />
          </div>
          
        </div>
      </div>

            <div className="device_table" style={{marginTop:0}} >
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Occassion Type</StyledTableCell>
                            <StyledTableCell align="left">Banner Name</StyledTableCell>
                            <StyledTableCell align="left">Date</StyledTableCell>
                            <StyledTableCell align="left">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    {/* <div style={{ margin: "0.5rem 0" }}></div> */}
                    <TableBody>
                        {allData.map((row) => (
                            <>
                                <StyledTableRow key={row.occassion_type}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.occassion_type}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">{row.banner_name}</StyledTableCell>
                                    <StyledTableCell align="left">
                                        {row.date}
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

export default BannerList;
