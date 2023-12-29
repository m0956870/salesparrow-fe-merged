import React, {useState} from 'react'
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

import DistributorBeatMappingDialog from "./Popup/DistributorBeatMappingDialog"

const DistributorBeatMapping = () => {

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
            distributor: "Lorem Ipsum",
            beat: "Beat 1, Beat 2",
            status: "ACTIVE",
        },
        {
            distributor: "Lorem Ipsum",
            beat: "Beat 1, Beat 2",
            status: "INACTIVE",
        },
        {
            distributor: "Lorem Ipsum",
            beat: "Beat 1, Beat 2",
            status: "ACTIVE",
        },
        {
            distributor: "Lorem Ipsum",
            beat: "Beat 1, Beat 2",
            status: "INACTIVE",
        },
        {
            distributor: "Lorem Ipsum",
            beat: "Beat 1, Beat 2",
            status: "ACTIVE",
        },
        {
            distributor: "Lorem Ipsum",
            beat: "Beat 1, Beat 2",
            status: "INACTIVE",
        },
        {
            distributor: "Lorem Ipsum",
            beat: "Beat 1, Beat 2",
            status: "ACTIVE",
        },
        {
            distributor: "Lorem Ipsum",
            beat: "Beat 1, Beat 2",
            status: "INACTIVE",
        },
        {
            distributor: "Lorem Ipsum",
            beat: "Beat 1, Beat 2",
            status: "ACTIVE",
        },
        {
            distributor: "Lorem Ipsum",
            beat: "Beat 1, Beat 2",
            status: "INACTIVE",
        },
        {
            distributor: "Lorem Ipsum",
            beat: "Beat 1, Beat 2",
            status: "ACTIVE",
        },
        {
            distributor: "Lorem Ipsum",
            beat: "Beat 1, Beat 2",
            status: "INACTIVE",
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
                <div className="beat_left" >
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">Distributor - Beat Mapping</div>
                </div>

                <div className="beat_right">
                    <div className="search">
                        <SearchIcon style={{ color: `var(--main-color)` }} />
                        <input type="text" placeholder="Search" />
                    </div>
                    <div className="add_btn"
                    onClick={() => openDialog()}
                    >
                        Add New
                    </div>
                </div>
            </div>

            <div className="beat_table">
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow >
                            <StyledTableCell  >Distributor</StyledTableCell>
                            <StyledTableCell align="center">Beat</StyledTableCell>
                            <StyledTableCell align="center">Status</StyledTableCell>
                            <StyledTableCell align="center">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    {/* <div style={{ margin: "0.5rem 0" }}></div> */}
                    <TableBody>
                        {allData.map((row) => (
                            <>
                                <StyledTableRow key={row.employee}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.distributor}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{row.beat}</StyledTableCell>
                                    <StyledTableCell align="center" component="th" scope="row">
                                        <span
                                            style={{ display: "inline", padding: "0.2rem 1rem" }}
                                            className={`${row.status === "ACTIVE"
                                                ? "active_beat"
                                                : "inactive_beat"
                                                }`}
                                        >
                                            {row.status}
                                        </span>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
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

            <DistributorBeatMappingDialog
                open={popupDialog}
                close={() => setpopupDialog(!popupDialog)}
                dialogData={dialogData}
            />
        </div>
    )
}

export default DistributorBeatMapping