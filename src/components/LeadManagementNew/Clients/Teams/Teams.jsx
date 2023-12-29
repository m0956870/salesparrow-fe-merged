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
import { getCustomers } from '../../../../api/leadApi'

const Teams = () => {
    const [isLoading, setisLoading] = useState(false)

    const [teamsData, setteamsData] = useState([])
    const [pageCount, setpageCount] = useState(1);
    const [pageLength, setpageLength] = useState(1);
    const [totalDataCount, settotalDataCount] = useState(0);

    const [filterData, setfilterData] = useState({
        type: "teams",
        status: "",
        limit: "10",
    })

    useEffect(() => {
        getCustomersFunc(filterData)
    }, [])

    async function getCustomersFunc(filterData) {
        setisLoading(true)
        let { data } = await getCustomers(filterData)
        // console.log("data", data)
        if (data.status) {
            setteamsData(data.result)
            setpageLength(data.page_length)
            settotalDataCount(data.total)
            setisLoading(false)
        } else {
            console.log("Some Error!")
            setisLoading(false)
        }
    }
    // console.log("teamsData", teamsData)

    const filterHandleInput = (e) => {
        setfilterData({ ...filterData, [e.target.name]: e.target.value })
    }

    const topFilterHandleInput = async (e) => {
        setfilterData({ ...filterData, [e.target.name]: e.target.value })
        getCustomersFunc({ ...filterData, [e.target.name]: e.target.value })
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

    // const limitArr = [10]
    // function limitFunc() {
    //     let arr = [20, 50]
    //     console.log(teamsData?.length)
    //     let first = arr.filter(limit => limit < totalDataCount)
    //     console.log(first)
    //     console.log("totalDataCount", totalDataCount)
    // };
    // limitFunc()

    return (
        <div id="lm_clients_main_containers">
            <div className="top_filter_section">
                <div className="top_left_filter">
                    <div className="entry_div">Show Entries</div>
                    <select name="limit" onChange={topFilterHandleInput} className="limit_select" >
                        <option value="10">10</option>
                        <option disabled={teamsData?.length < 20} value="20">20</option>
                        <option disabled={teamsData?.length < 50} value="50">50</option>
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

            {isLoading ? (
                <div style={{ margin: "auto", }} >
                    <CircularProgress />
                </div>
            ) : (
                <>
                    {teamsData?.length !== 0 ? (
                        <>
                            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Name</StyledTableCell>
                                        <StyledTableCell align="left">Designation</StyledTableCell>
                                        <StyledTableCell align="left">State</StyledTableCell>
                                        {/* <StyledTableCell align="left">Action</StyledTableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {teamsData?.map((row, i) => (
                                        <StyledTableRow key={i}>
                                            <StyledTableCell>{row.emp_name}</StyledTableCell>
                                            <StyledTableCell align="left">{row.designation}</StyledTableCell>
                                            <StyledTableCell align="left">{row.state}</StyledTableCell>
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

export default Teams