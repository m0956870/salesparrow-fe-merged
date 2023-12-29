import React, { useState } from "react";
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
import MappingEmployeeGroupListDialog from "./Popup/MappingEmployeeGroupListDialog";

const MappingEmployeeGroupList = () => {

    const [popupDialog, setpopupDialog] = useState(false);
    const [dialogData, setdialogData] = useState();

    const openDialog = () => {
        setdialogData()
        setpopupDialog(true)
    }
    const viewDialog = (row) => {
        setdialogData(row)
        setpopupDialog(true)
    }

    const allData = [
        {
            employee_group_name: "Lorem Ipsum",
            description:
                "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam magni sunt ipsum. Laboriosam magni sunt ipsum.",
            state: "Rajasthan, Haryana",
        },
        {
            employee_group_name: "Lorem Ipsum",
            description:
                "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam magni sunt ipsum.",
            state: "Rajasthan, Haryana",
        },
        {
            employee_group_name: "Lorem Ipsum",
            description:
                "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam magni sunt ipsum.",
            state: "Rajasthan, Haryana",
        },
        {
            employee_group_name: "Lorem Ipsum",
            description:
                "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam magni sunt ipsum.",
            state: "Rajasthan, Haryana",
        },
        {
            employee_group_name: "Lorem Ipsum",
            description:
                "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam magni sunt ipsum.",
            state: "Rajasthan, Haryana",
        },
        {
            employee_group_name: "Lorem Ipsum",
            description:
                "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam magni sunt ipsum.",
            state: "Rajasthan, Haryana",
        },
        {
            employee_group_name: "Lorem Ipsum",
            description:
                "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam magni sunt ipsum.",
            state: "Rajasthan, Haryana",
        },
        {
            employee_group_name: "Lorem Ipsum",
            description:
                "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam magni sunt ipsum.",
            state: "Rajasthan, Haryana",
        },
        {
            employee_group_name: "Lorem Ipsum",
            description:
                "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam magni sunt ipsum.",
            state: "Rajasthan, Haryana",
        },
        {
            employee_group_name: "Lorem Ipsum",
            description:
                "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam magni sunt ipsum.",
            state: "Rajasthan, Haryana",
        },
    ];

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
                    <div className="title">Employee Grouping List</div>
                </div>
                <div className="beat_right">
                    <div className="search">
                        <select name="city">
                            <option value="State">State</option>
                            <option value="saab">Saab</option>
                            <option value="mercedes">Mercedes</option>
                            <option value="audi">Audi</option>
                        </select>
                    </div>
                    <div className="add_btn"
                        onClick={() => openDialog()}
                    >Add New</div>
                </div>
            </div>
            <div className="beat_table">
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow sx={{ display: "flex", width: "100%" }}>
                            <StyledTableCell sx={{ flex: 1 }} >Employee Group Name</StyledTableCell>
                            <StyledTableCell sx={{ flex: 2 }} align="left">Description</StyledTableCell>
                            <StyledTableCell sx={{ flex: 1 }} align="left">State</StyledTableCell>
                            <StyledTableCell sx={{ flex: 0.5 }} align="left">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    {/* <div style={{ margin: "0.5rem 0" }}></div> */}
                    <TableBody>
                        {allData.map((row) => (
                            <>
                                <StyledTableRow sx={{ display: "flex", width: "100%" }} key={row.employee_group_name}>
                                    <StyledTableCell sx={{ flex: 1 }} component="th" scope="row">
                                        {row.employee_group_name}
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ flex: 2 }} align="left" component="th" scope="row">
                                        {row.description}
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ flex: 1 }} align="left">{row.state}</StyledTableCell>
                                    <StyledTableCell sx={{ flex: 0.5 }} align="left">
                                        <BorderColorIcon
                                            onClick={() => viewDialog(row)}
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
            <MappingEmployeeGroupListDialog
                open={popupDialog}
                close={() => setpopupDialog(!popupDialog)}
                dialogData={dialogData}
            />
        </div>
    );
};

export default MappingEmployeeGroupList;
