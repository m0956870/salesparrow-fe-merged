import React, { useEffect, useState } from 'react'
import group from "../../../images/group.png";

import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";
import { Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";
import { CircularProgress, Pagination } from '@mui/material';

import AddPartyGrpPriceListDialog from './AddPartyGrpPriceListDialog';
import EditPartyGrpPriceListDialog from './EditPartyGrpPriceListDialog';
import { toast } from 'react-toastify';
import { deletePartyGrpPriceList, getPartyGrpPriceList } from '../../../api/mappingAPI';


const PartyGrpPriceListListing = () => {
    const [isLoading, setisLoading] = useState(false)

    const [partyGrpPriecList, setpartyGrpPriecList] = useState([])
    const [pageCount, setpageCount] = useState(1);
    const [pageLength, setpageLength] = useState();

    const [addDialogBox, setaddDialogBox] = useState(false)
    const [editDialogBox, seteditDialogBox] = useState(false)
    const [editDialogBoxData, seteditDialogBoxData] = useState([])
    const [deletePopup, setdeletePopup] = useState(false);

    useEffect(() => {
        getPartyGrpPriecListFunc()
    }, [pageCount])

    useEffect(() => {
        if (addDialogBox === false) getPartyGrpPriecListFunc()
    }, [addDialogBox])

    useEffect(() => {
        if (editDialogBox === false) getPartyGrpPriecListFunc()
    }, [editDialogBox])

    // console.log("partyGrpPriecList", partyGrpPriecList)
    // console.log("editDialogBoxData", editDialogBoxData)

    async function getPartyGrpPriecListFunc() {
        setisLoading(true)

        let { data } = await getPartyGrpPriceList(pageCount)
        if (data.status) {
            setpartyGrpPriecList(data.result)
            setpageLength(data.pageLength)
            return setisLoading(false)
        }
        console.log("API Error!")
    }

    const deleteEmpPriceListFunc = async () => {
        // console.log(editDialogBoxData)

        setisLoading(true)
        let { data } = await deletePartyGrpPriceList({pricelist_id: editDialogBoxData.pricelist_id})
        if (data.status) {
            toast.success("Deleted Successfully!")
            getPartyGrpPriecListFunc()
            return setdeletePopup(false)
        }

        console.log("API Error!")
    };


    // Table Styling
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

    return (
        <div className="container">
            <div className="beat_heading">
                <div className="beat_left" >
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">PriceList / Party Group Mapping List</div>
                </div>
                <div className="beat_right">
                    <div className="add_btn" onClick={() => setaddDialogBox(true)} >
                        Add New
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div style={{ margin: "auto", }} >
                    <CircularProgress />
                </div>
            ) : (
                <div>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell >Pricelist Name</StyledTableCell>
                                <StyledTableCell align="center">Assigned Party Groups Name</StyledTableCell>
                                <StyledTableCell align="center">Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {partyGrpPriecList?.map((row, i) => (
                                <StyledTableRow key={i} >
                                    <StyledTableCell>{row.pricelist_name}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.partygrps?.length === 0 ? "-" :
                                            row.partygrps?.map(grp => (
                                                <div>{grp.partygrp_name}</div>
                                            ))}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <BorderColorIcon
                                            onClick={() => {
                                                seteditDialogBoxData(row);
                                                seteditDialogBox(true)
                                            }}
                                            style={{ fontSize: "1rem", color: "var(--main-color)", marginLeft: "0.5rem" }}
                                            className="emp_grp_icons"
                                        />
                                        <DeleteIcon
                                            style={{ fontSize: "1rem", color: "red", marginLeft: "0.5rem" }}
                                            className="emp_grp_icons"
                                            onClick={() => {
                                                setdeletePopup(true);
                                                seteditDialogBoxData(row);
                                            }}
                                        />
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {partyGrpPriecList?.length !== 0 && (
                        <div className="pagination">
                            <Pagination
                                count={pageLength}
                                size="large"
                                color="primary"
                                onChange={(e, value) => setpageCount(value)}
                                page={pageCount}
                            />
                        </div>
                    )}
                    {partyGrpPriecList?.length === 0 && (
                        <div className="no_data"> No Data </div>
                    )}
                </div >

            )}

            <AddPartyGrpPriceListDialog
                open={addDialogBox}
                close={() => setaddDialogBox(!addDialogBox)}
            />
            <EditPartyGrpPriceListDialog
                open={editDialogBox}
                close={() => seteditDialogBox(!editDialogBox)}
                data={editDialogBoxData}
            />

            <Dialog
                open={deletePopup}
                aria-labelledby="form-dialog-title"
                maxWidth="xs"
                fullWidth={true}
                onClose={() => setdeletePopup(false)}
            >
                <DialogTitle className="dialog_title">
                    <div>Do you want to delete {editDialogBoxData?.emp_name}-?</div>
                </DialogTitle>
                <DialogContent className="cardpopup_content">
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div
                            className="employee_gl_popup"
                            onClick={() => setdeletePopup(false)}
                        >
                            Cancel
                        </div>
                        <div
                            className="employee_gl_popup_del"
                            onClick={() => deleteEmpPriceListFunc()}
                        >
                            Delete
                        </div>
                    </div>
                </DialogContent>
                <DialogActions></DialogActions>
            </Dialog>
        </div>
    )
}

export default PartyGrpPriceListListing