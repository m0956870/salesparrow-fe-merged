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

import AddStatePriceListDialog from './AddStatePriceListDialog';
import EditStatePriceListDialog from './EditStatePriceListDialog';
import { deleteStatePriceList, getStatePriceList } from '../../../api/mappingAPI';
import { toast } from 'react-toastify';
import { TfiPlus } from "react-icons/tfi"

import { fetchPriceListing } from '../../../api/productAPI';
import getStateFunc from '../../../api/locationAPI';
import { NavLink } from 'react-router-dom';


const StatePricListMappingListing = () => {
    const [isLoading, setisLoading] = useState(false)

    const [allState, setallState] = useState([]);
    const [allPriceList, setallPriceList] = useState([])

    const [statePriceList, setstatePriceList] = useState([])
    const [pageCount, setpageCount] = useState(1);
    const [pageLength, setpageLength] = useState();
    const [totalDataCount, settotalDataCount] = useState();

    const [addDialogBox, setaddDialogBox] = useState(false)
    const [editDialogBox, seteditDialogBox] = useState(false)
    const [editDialogBoxData, seteditDialogBoxData] = useState([])
    const [deletePopup, setdeletePopup] = useState(false);

    const [statesPopup, setstatesPopup] = useState(false);

    const [filterData, setfilterData] = useState({
        state: "",
        pricelist: "",
        page: pageCount,
        limit: "10",
    })

    useEffect(() => {
        getStateFunc().then((res) => setallState(res.data.result));
        fetchPriceListing().then((res) => setallPriceList(res.data.result));
    }, [])

    useEffect(() => {
        getStatePriceListFunc(filterData)
    }, [pageCount])

    useEffect(() => {
        if (addDialogBox === false) getStatePriceListFunc(filterData)
    }, [addDialogBox])

    useEffect(() => {
        if (editDialogBox === false) getStatePriceListFunc(filterData)
    }, [editDialogBox])

    // console.log("statePriceList", statePriceList)
    // console.log("editDialogBoxData", editDialogBoxData)

    async function getStatePriceListFunc(filterData) {
        setisLoading(true)

        let { data } = await getStatePriceList(filterData)
        if (data.status) {
            setstatePriceList(data.result)
            setpageLength(data.pageLength)
            settotalDataCount(data.count)
            return setisLoading(false)
        }
        console.log("API Error!")
    }

    const handleInput = (e) => {
        setfilterData({ ...filterData, [e.target.name]: e.target.value });
    };

    const topFilterHandleInput = async (e) => {
        setfilterData({ ...filterData, [e.target.name]: e.target.value })
        getStatePriceListFunc({ ...filterData, [e.target.name]: e.target.value })
    }

    const filterFunc = async () => {
        getStatePriceListFunc(filterData)
    }

    const deleteEmpPriceListFunc = async () => {
        // console.log(editDialogBoxData)

        setisLoading(true)
        let { data } = await deleteStatePriceList({ pricelist_id: editDialogBoxData.pricelist_id })
        if (data.status) {
            toast.success("Deleted Successfully!")
            getStatePriceListFunc()
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
                    <div className="title">Assigned Pricelist (State-wise)</div>
                </div>
                <div className="beat_right">
                    {/* <div className="add_btn" onClick={() => setaddDialogBox(true)} >
                        Add New
                    </div> */}
                </div>
            </div>

            <div className="top_filter_section">
                <div className="top_left_filter">
                    <div className="entry_div">Show Entries</div>
                    <select name="limit" onChange={topFilterHandleInput} className="limit_select" >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>
                <div className="top_right_filter">
                    <div onClick={() => setaddDialogBox(true)} className="top_right_create_btn_icon">
                        <TfiPlus className="create_btn_icon" /> <span>Create New</span>
                    </div>
                </div>
            </div>

            <div className="tracking_tabs" style={{ margin: "1rem 0" }}>
                <div className="tarcking_tab_left">
                    <select name="state" onChange={handleInput}>
                        <option value="">All States</option>
                        {allState?.map((state) => (
                            <option key={state.id} value={state.id}>{state.name}</option>
                        ))}
                    </select>
                    <select name="pricelist" onChange={handleInput}>
                        <option value="">Price List</option>
                        {allPriceList.length === 0 && <option disabled value="">No Price List Found</option>}
                        {allPriceList?.map((priceList) => (
                            <option key={priceList._id} value={priceList._id}>{priceList.price_list_name}</option>
                        ))}
                    </select>
                    <div className="view_btn" onClick={() => filterFunc()}>
                        View
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
                                <StyledTableCell align="center">Assigned States Name</StyledTableCell>
                                <StyledTableCell align="center">Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {statePriceList?.map((row, i) => (
                                <StyledTableRow key={i} >
                                    <StyledTableCell>{row.pricelist_name}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <div className="map_listing_assigned_col">
                                            <div>
                                                {row.parties.length === 0 ? (<div>-</div>) :
                                                    row.parties.length === 1 ? (
                                                        <span>{row.parties[0].state_name}</span>
                                                    ) : (
                                                        <span>{row.parties[0].state_name}
                                                            <span style={{ fontWeight: "600", marginLeft: "0.7rem" }} >{row.parties.length - 1}+</span>
                                                        </span>
                                                    )}
                                            </div>
                                            <div>
                                                <NavLink
                                                    onClick={() => {
                                                        seteditDialogBoxData(row);
                                                        setstatesPopup(true)
                                                    }}
                                                >
                                                    See all
                                                </NavLink>
                                            </div>
                                        </div>
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

                    {statePriceList?.length !== 0 && (
                        <div className="top_filter_section" style={{ margin: "1rem 0" }} >
                            <div className="limit_bottom_info">Showing {((pageCount * filterData.limit) - filterData.limit) + 1} to {totalDataCount > pageCount * filterData.limit ? pageCount * filterData.limit : totalDataCount} of {totalDataCount} entries</div>
                            <div>
                                <Pagination
                                    count={pageLength}
                                    size="medium"
                                    color="primary"
                                    shape="rounded"
                                    onChange={(e, value) => setpageCount(value)}
                                    page={pageCount}
                                />
                            </div>
                        </div>
                    )}
                    {statePriceList?.length === 0 && (
                        <div className="no_data"> No Data </div>
                    )}
                </div >

            )}

            <AddStatePriceListDialog
                open={addDialogBox}
                close={() => setaddDialogBox(!addDialogBox)}
            />
            <EditStatePriceListDialog
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
                        <div onClick={() => setdeletePopup(false)} className="employee_gl_popup" >
                            Cancel
                        </div>
                        <div onClick={() => deleteEmpPriceListFunc()} className="employee_gl_popup_del" >
                            Delete
                        </div>
                    </div>
                </DialogContent>
                <DialogActions></DialogActions>
            </Dialog>


            {/* State Popup */}
            <Dialog
                open={statesPopup}
                aria-labelledby="form-dialog-title"
                maxWidth="xs"
                fullWidth={true}
                onClose={() => setstatesPopup(false)}
            >
                <DialogTitle className="dialog_title">
                    <div>{editDialogBoxData?.pricelist_name} Assigned States</div>
                </DialogTitle>
                <DialogContent className='sp_states_popup'>
                    {editDialogBoxData?.parties?.length !== 0 ? editDialogBoxData?.parties?.map(state => (
                        <div className='sp_states_popup_list'>{state.state_name}</div>
                    )) : (
                        <div style={{ textAlign: "center" }} >No States Assigned Yet!</div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default StatePricListMappingListing