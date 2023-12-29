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
import { TfiPlus } from "react-icons/tfi"

import { toast } from 'react-toastify';
import { deleteSSDistributor, getSSDistributorList } from '../../../api/mappingAPI';
import fetchAllParty from '../../../api/partyAPI';
import getStateFunc from '../../../api/locationAPI';
import { NavLink, useNavigate } from 'react-router-dom';


const SSDistributorMappingListing = () => {
    const navigate = useNavigate()
    const [isLoading, setisLoading] = useState(false)

    const [allState, setallState] = useState([]);
    const [allParty, setallParty] = useState([]);

    const [ssDistributorList, setssDistributorList] = useState([])
    const [pageCount, setpageCount] = useState(1);
    const [pageLength, setpageLength] = useState();
    const [totalDataCount, settotalDataCount] = useState();

    const [editDialogBoxData, seteditDialogBoxData] = useState([])
    const [deletePopup, setdeletePopup] = useState(false);

    const [filterData, setfilterData] = useState({
        page: pageCount,
        limit: "10",
        party: "",
        state: "",
    })

    useEffect(() => {
        getStateFunc().then((res) => setallState(res.data.result));
        fetchAllParty({ partyType: "63766b79043f582fcc7a80e1" }).then(res => setallParty(res.data.result))
    }, [])
    useEffect(() => {
        getssDistributorListFunc(filterData)
    }, [pageCount])

    // console.log("ssDistributorList", ssDistributorList)
    // console.log("editDialogBoxData", editDialogBoxData)

    async function getssDistributorListFunc(filterData) {
        setisLoading(true)

        let { data } = await getSSDistributorList(filterData)
        if (data.status) {
            setssDistributorList(data.result)
            setpageLength(data.page_length)
            settotalDataCount(data.count)
            return setisLoading(false)
        }
        console.log("API Error!")
    }

    const deletessDistributorListFunc = async () => {
        // console.log(editDialogBoxData)

        // setisLoading(true)
        let { data } = await deleteSSDistributor({ ss_id: editDialogBoxData.ss_id })
        if (data.status) {
            toast.success("Assigned Distributors Deleted Successfully!")
            getssDistributorListFunc()
            return setdeletePopup(false)
        } else {
            toast.error("Some Error!")
            console.log("API Error!")
        }
    };

    const handleInput = (e) => {
        setfilterData({ ...filterData, [e.target.name]: e.target.value });
    };

    const topFilterHandleInput = async (e) => {
        setfilterData({ ...filterData, [e.target.name]: e.target.value })
        getssDistributorListFunc({ ...filterData, [e.target.name]: e.target.value })
    }

    const filterFunc = async () => {
        setisLoading(true)
        getssDistributorListFunc(filterData)
    }


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
                    <div className="title">SS / Distributor Mapping List</div>
                </div>
                <div className="beat_right">
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
                    <div onClick={() => navigate("/add_ss_distributor_mapping")} className="top_right_create_btn_icon">
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
                    <div className="view_btn" onClick={() => filterFunc()}>
                        View
                    </div>
                </div>
                <div className="tarcking_tab_right">
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
                                <StyledTableCell >SS Name</StyledTableCell>
                                <StyledTableCell>Assigned Distributors</StyledTableCell>
                                <StyledTableCell>Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ssDistributorList.length !== 0 && ssDistributorList?.map((row, i) => (
                                <StyledTableRow key={i} >
                                    <StyledTableCell>{row.ss_name}</StyledTableCell>
                                    <StyledTableCell>
                                        <div className="map_listing_assigned_col">
                                            <div>
                                                {row.parties.length === 0 ? (<div>-</div>) :
                                                    row.parties.length === 1 ? (
                                                        <span>{row.parties[0].firmName}</span>
                                                    ) : (
                                                        <span>{row.parties[0].firmName}
                                                            <span style={{ fontWeight: "600", marginLeft: "0.7rem" }} >{row.parties.length - 1}+</span>
                                                        </span>
                                                    )}
                                            </div>
                                            <div>
                                                <NavLink to={`/ss_assigned_distributors/${row.ss_id}`} >See all</NavLink>
                                            </div>
                                        </div>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <BorderColorIcon
                                            onClick={() => navigate("/edit_ss_distributor_mapping", { state: row })}
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

                    {ssDistributorList?.length !== 0 && (
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
                    {ssDistributorList?.length === 0 && (
                        <div className="no_data"> No Data </div>
                    )}
                </div >
            )}

            {/* <AddSSDistributorMapping
                open={addDialogBox}
                close={() => setaddDialogBox(!addDialogBox)}
            />
            <EditSSDistributorMapping
                open={editDialogBox}
                close={() => seteditDialogBox(!editDialogBox)}
                data={editDialogBoxData}
            /> */}

            <Dialog
                open={deletePopup}
                aria-labelledby="form-dialog-title"
                maxWidth="xs"
                fullWidth={true}
                onClose={() => setdeletePopup(false)}
            >
                <DialogTitle className="dialog_title">
                    <div>Do you want to delete {editDialogBoxData?.ss_name} assigned distributors?</div>
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
                            onClick={() => deletessDistributorListFunc()}
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

export default SSDistributorMappingListing