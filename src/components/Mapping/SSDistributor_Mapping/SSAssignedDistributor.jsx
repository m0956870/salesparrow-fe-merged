import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import group from "../../../images/group.png";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";
// import { Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";
import { CircularProgress, Pagination } from '@mui/material';
// import { toast } from "react-toastify";
// import { TfiPlus } from "react-icons/tfi"

import { getSSAssignedDistributors } from '../../../api/mappingAPI'
import { getPartyType } from '../../../api/partyAPI';
import getStateFunc, { getCityFunc } from '../../../api/locationAPI';

const SSAssignedDistributor = () => {
    // const navigate = useNavigate()
    const params = useParams()
    // console.log(params.id)

    const [isLoading, setisLoading] = useState(false)

    const [allState, setallState] = useState([]);
    const [allCity, setallCity] = useState([]);

    const [ssAssignedDistributors, setssAssignedDistributors] = useState([])
    const [pageCount, setpageCount] = useState(1);
    const [pageLength, setpageLength] = useState();
    const [totalDataCount, settotalDataCount] = useState();

    const [filterData, setfilterData] = useState({
        ss_id: params.id,
        page: pageCount,
        limit: "10",
        state: "",
        city: "",
    })

    useEffect(() => {
        getStateFunc().then((res) => setallState(res.data.result));
    }, [])

    useEffect(() => {
        getssAssignedDistributorFunc(filterData)
    }, [pageCount])
    // console.log("ssAssignedDistributors", ssAssignedDistributors)

    async function getssAssignedDistributorFunc(filterData) {
        setisLoading(true)

        let { data } = await getSSAssignedDistributors(filterData)
        if (data.status) {
            setssAssignedDistributors(data.result)
            setpageLength(data.page_length)
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
        getssAssignedDistributorFunc({ ...filterData, [e.target.name]: e.target.value })
    }

    const stateHandleInput = async (e) => {
        setfilterData({ ...filterData, [e.target.name]: e.target.value })
        getCityFunc(e.target.value).then((res) => setallCity(res.data.result));
    };

    const filterFunc = async () => {
        setisLoading(true)
        getssAssignedDistributorFunc(filterData)
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
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">{ssAssignedDistributors?.ss_name}</div>
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
                    {/* <div onClick={() => navigate("/add_employee_party_mapping")} className="top_right_create_btn_icon">
                        <TfiPlus className="create_btn_icon" /> <span>Create New</span>
                    </div> */}
                </div>
            </div>

            <div className="tracking_tabs" style={{ margin: "1rem 0" }}>
                <div className="tarcking_tab_left">
                    <select name="state" onChange={stateHandleInput}>
                        <option value="">All States</option>
                        {allState?.map((state) => (
                            <option key={state.id} value={state.id}>{state.name}</option>
                        ))}
                    </select>
                    <select name="city" onChange={handleInput}>
                        <option value="">All City</option>
                        {allCity.length === 0 && <option disabled value="">No City Found</option>}
                        {allCity?.map((city) => (
                            <option key={city.id} value={city.id}>{city.name}</option>
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
                                <StyledTableCell>Party Name</StyledTableCell>
                                <StyledTableCell>Party Type</StyledTableCell>
                                <StyledTableCell>State</StyledTableCell>
                                <StyledTableCell>City</StyledTableCell>
                                {/* <StyledTableCell>Actions</StyledTableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ssAssignedDistributors?.parties?.map((row, i) => (
                                <StyledTableRow key={i} >
                                    <StyledTableCell>{row.firmName}</StyledTableCell>
                                    <StyledTableCell>{row.firmName}</StyledTableCell>
                                    <StyledTableCell>{row.state}</StyledTableCell>
                                    <StyledTableCell>{row.city}</StyledTableCell>
                                    {/* <StyledTableCell>
                                        <BorderColorIcon
                                            onClick={() => navigate("/edit_employee_party_mapping", { state: row })}
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
                                    </StyledTableCell> */}
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {ssAssignedDistributors?.parties?.length !== 0 && (
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
                    {ssAssignedDistributors?.parties?.length === 0 && (
                        <div className="no_data"> No Data </div>
                    )}
                </div >

            )}

            {/* <Dialog
                open={deletePopup}
                aria-labelledby="form-dialog-title"
                maxWidth="xs"
                fullWidth={true}
                onClose={() => setdeletePopup(false)}
            >
                <DialogTitle className="dialog_title">
                    <div>Do you want to delete {editDialogBoxData?.emp_name}-{editDialogBoxData?.pricelist || "-"}?</div>
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
                            onClick={() => deletEmpPartyMappingFunc()}
                        >
                            Delete
                        </div>
                    </div>
                </DialogContent>
                <DialogActions></DialogActions>
            </Dialog> */}
        </div>
    )
}

export default SSAssignedDistributor