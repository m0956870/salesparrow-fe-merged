import React, { useEffect, useState } from 'react'
import { TfiPlus } from "react-icons/tfi"

import img1 from "../../../../images/column_filter.png"
import img2 from "../../../../images/excel_import.png"
import img3 from "../../../../images/excel_export.png"
import img4 from "../../../../images/pdf_download.png"

// import SearchIcon from '@mui/icons-material/Search';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { tableCellClasses } from '@mui/material/TableCell';
import { CircularProgress, Pagination } from "@mui/material"

// APIs
import getStateFunc from "../../../../api/locationAPI";
import fetchAllEmployee from "../../../../api/employeeAPI";
import fetchAllBeat from "../../../../api/beatAPI";
import { getCustomers } from '../../../../api/leadApi'

const CustomersTab = ({ retailerData }) => {
    // console.log("retailerData", retailerData)
    const [isLoading, setisLoading] = useState(false)

    const [tabData, settabData] = useState([])
    const [pageCount, setpageCount] = useState(1);
    const [pageLength, setpageLength] = useState(1);
    const [totalDataCount, settotalDataCount] = useState();

    const [allState, setallState] = useState([]);
    const [allEmployee, setallEmployee] = useState([]);
    const [allBeat, setAllBeat] = useState([]);

    const [filterData, setfilterData] = useState({
        type: "customers",
        sub_type: "retailers",
        employee_id: "",
        beat_id: "",
        status: "",
        limit: "10",
    })

    useEffect(() => {
        settabData(retailerData?.result)
        setpageLength(retailerData?.page_length)
        settotalDataCount(retailerData?.total)
        getStateFunc().then((res) => setallState(res.data.result));
        fetchAllBeat().then((res) => setAllBeat(res.data.result));
    }, []);
    // console.log("tabData", tabData)

    const filterHandleInput = (e) => {
        setfilterData({ ...filterData, [e.target.name]: e.target.value })
    }

    const topFilterHandleInput = async (e) => {
        setfilterData({ ...filterData, [e.target.name]: e.target.value })
        filterFunc({ ...filterData, [e.target.name]: e.target.value })
    }

    const filterFunc = async (filterData) => {
        console.log(filterData)

        setisLoading(true)
        let { data } = await getCustomers(filterData)
        // console.log("data", data)
        if (data.status) {
            settabData(data.result)
            setpageLength(data.page_length)
            settotalDataCount(data.total)
            setisLoading(false)
        } else {
            console.log("Some Error!")
            setisLoading(false)
        }
    }

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
        <div id="lm_clients_main_containers">
            <div className="top_filter_section">
                <div className="top_left_filter">
                    <div className="entry_div">Show Entries</div>
                    <select name="limit" onChange={topFilterHandleInput} className="limit_select" >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                    {/* <div className="entry_div">Status</div> */}
                    {/* <select name="status" onChange={topFilterHandleInput} className="limit_select status_select" >
                        <option value="">Status</option>
                        <option value="Online" style={{ color: "green" }}>Online</option>
                        <option value="Offline" style={{ color: "red" }}>Offline</option>
                    </select> */}
                </div>
                <div className="top_right_filter">
                    <div className="other_functionality_section">
                        <div className="section_options"><img src={img1} /></div>
                        <div className="section_options"><img src={img2} /></div>
                        <div className="section_options"><img src={img3} /></div>
                        <div className="section_options"><img src={img4} /></div>
                    </div>
                    {/* <div className="top_right_create_btn_icon">
                        <TfiPlus className="create_btn_icon" /> <span>Create New</span>
                    </div> */}
                </div>
            </div>

            <div className="tracking_tabs">
                <div className="tarcking_tab_left">
                    <select name="state" onChange={(e) => fetchAllEmployee({ state: e.target.value }).then((res) => setallEmployee(res.data.result))}>
                        <option value="">All State</option>
                        {allState?.map((state) => (
                            <option key={state.id} value={state.id}> {state.name} </option>
                        ))}
                    </select>
                    <select name="employee_id" onChange={filterHandleInput}>
                        <option value="">All Employee</option>
                        {allEmployee?.map((employee) => (
                            <option key={employee.id} value={employee.id}>{employee.employeeName}</option>
                        ))}
                    </select>
                    <select name="beat_id" onChange={filterHandleInput}>
                        <option value="">All Beat</option>
                        {allBeat?.map((beat) => (
                            <option key={beat.id} value={beat.id}>{beat.beatName}</option>
                        ))}
                    </select>
                    <div className="view_btn" onClick={() => filterFunc(filterData)}>
                        View
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div style={{ margin: "auto", }} >
                    <CircularProgress />
                </div>
            ) : (
                <>
                    {tabData?.length !== 0 ? (
                        <>
                            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Customer Name</StyledTableCell>
                                        <StyledTableCell align="left">Beat Name</StyledTableCell>
                                        <StyledTableCell align="left">Mobile Number</StyledTableCell>
                                        <StyledTableCell align="left">Status</StyledTableCell>
                                        {/* <StyledTableCell align="left">Action</StyledTableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tabData?.map((row, i) => (
                                        <StyledTableRow key={i}>
                                            <StyledTableCell component="th" scope="row">{row.customer_name}</StyledTableCell>
                                            <StyledTableCell align="left">{row.beat_name}</StyledTableCell>
                                            <StyledTableCell align="left">{row.mobile_number}</StyledTableCell>
                                            <StyledTableCell align="left" component="th" scope="row">
                                                <span style={{ display: 'inline', padding: '0.2rem 1rem' }} className={`${row.status === 'Active' ? 'active_beat' : 'inactive_beat'}`}>
                                                    {row.status}
                                                </span>
                                            </StyledTableCell>
                                            {/* <StyledTableCell align="left">
                                               <BorderColorIcon style={{ fontSize: '1rem', color: 'var(--main-color)' }} />
                                               <DeleteIcon style={{ fontSize: '1rem', color: 'red', marginLeft: '0.5rem' }} />
                                           </StyledTableCell> */}
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className="top_filter_section" >
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
                        </>
                    ) : (
                        <div className="no_data">
                            No data
                        </div>
                    )}
                </>
            )}
        </div >
    )
}

export default CustomersTab