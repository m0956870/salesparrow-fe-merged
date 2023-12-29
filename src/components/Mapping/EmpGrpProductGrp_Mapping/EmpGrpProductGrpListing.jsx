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
import AddEmpGrpProductGrp from './AddEmpGrpProductGrp';
import EditEmpGrpProductGrp from './EditEmpGrpProductGrp';
import { deleteEmpGrpProductGrp, deleteEmpPriceList, getEmpGrpProductGrp, getEmpPriceList } from '../../../api/mappingAPI';
import { toast } from 'react-toastify';


const EmpGrpProductGrpListing = () => {
    const [isLoading, setisLoading] = useState(false)
    const [empGrpProductGrp, setempGrpProductGrp] = useState([])

    const [pageCount, setpageCount] = useState(1);
    const [pageLength, setpageLength] = useState();

    const [addDialogBox, setaddDialogBox] = useState(false)
    const [editDialogBox, seteditDialogBox] = useState(false)
    const [editDialogBoxData, seteditDialogBoxData] = useState([])

    const [deletePopup, setdeletePopup] = useState(false);

    useEffect(() => {
        getEmpGrpProductGrpFunc()
    }, [pageCount])

    useEffect(() => {
        if (addDialogBox === false) getEmpGrpProductGrpFunc()
    }, [addDialogBox])

    useEffect(() => {
        if (editDialogBox === false) getEmpGrpProductGrpFunc()
    }, [editDialogBox])

    // console.log("empGrpProductGrp", empGrpProductGrp)
    // console.log("editDialogBoxData", editDialogBoxData)

    async function getEmpGrpProductGrpFunc() {
        setisLoading(true)

        let { data } = await getEmpGrpProductGrp(pageCount)
        if (data.status) {
            setempGrpProductGrp(data.result)
            setpageLength(data.pageLength)
            return setisLoading(false)
        }
        console.log("API Error!")
    }

    const deleteEmpGrpProductGrpFunc = async () => {
        setisLoading(true)
        let { data } = await deleteEmpGrpProductGrp({ emp_grp_id: editDialogBoxData.emp_grp_id })

        if (data.status) {
            toast.success("Employee Group Product Group Deleted Successfully!")
            getEmpGrpProductGrpFunc()
            return setdeletePopup(false)
        } else {
            toast.error("Some Error!")
            console.log("API Error!")
        }
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
                    <div className="title">Employee Group / Product Group Mapping List</div>
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
                                <StyledTableCell >Employee Group Name</StyledTableCell>
                                <StyledTableCell align="center">Assigned Product Group Name</StyledTableCell>
                                <StyledTableCell align="center">Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {empGrpProductGrp.length !== 0 && empGrpProductGrp?.map((row, i) => (
                                <StyledTableRow key={i} >
                                    <StyledTableCell>{row.emp_grp_name}</StyledTableCell>
                                    <StyledTableCell align="center">{row.products?.[0]?.productgrp_name || "-"} </StyledTableCell>
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

                    {empGrpProductGrp?.length !== 0 && (
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
                    {empGrpProductGrp?.length === 0 && (
                        <div className="no_data"> No Data </div>
                    )}
                </div >
            )}

            <AddEmpGrpProductGrp
                open={addDialogBox}
                close={() => setaddDialogBox(!addDialogBox)}
            />
            <EditEmpGrpProductGrp
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
                    <div>Do you want to delete {editDialogBoxData?.emp_grp_name}-{editDialogBoxData?.products?.[0]?.productgrp_name}?</div>
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
                            onClick={() => deleteEmpGrpProductGrpFunc()}
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

export default EmpGrpProductGrpListing