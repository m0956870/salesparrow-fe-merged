import "./MExpReportAllEmployee.css";
import React, { useEffect, useState } from "react";
import group from "../../images/group.png";
import SearchIcon from "@mui/icons-material/Search";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";
import { getMonthlyExpReport } from "../../api/reportsAPI";
import { CircularProgress, Pagination } from "@mui/material";
import fetchAllEmployee from "../../api/employeeAPI";
import getStateFunc from "../../api/locationAPI";
import { toast } from "react-toastify";

const DailyExpenseReports = () => {
    const [isLoading, setisLoading] = useState(false);

    const [allState, setallState] = useState([]);
    const [allEmployee, setallEmployee] = useState([]);
    const [expReport, setexpReport] = useState([]);
    const [reportSummery, setreportSummery] = useState({})
    const [pageCount, setpageCount] = useState(1);
    const [pageLength, setpageLength] = useState();

    const [filterData, setfilterData] = useState({
        employee_id: "",
        date: getDate(),
        page: pageCount,
    })

    useEffect(() => {
        setisLoading(true)
        getMonthlyExpReportFunc()
        getStateFunc().then((res) => setallState(res.data.result));
        fetchAllEmployee().then((res) => setallEmployee(res.data.result));
    }, [pageCount]);

    // console.log("expReport", expReport)

    async function getMonthlyExpReportFunc() {
        setisLoading(true)

        let res = await getMonthlyExpReport(filterData)

        if (res.data.status) {
            setexpReport(res.data.result.list)
            setpageLength(res.data.pageLength);

            Object.keys(res.data.result).map(key => setreportSummery(reportSummery => {
                if (key !== "list") return { ...reportSummery, [key]: res.data.result[key] }
            }))

            setisLoading(false)
        }
    }

    function getDate() {
        let date = new Date().toLocaleDateString("en-IN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
        return date.split("/").reverse().join("-")
        // setfilterData({...filterData, date: filDate})
    }

    const employeeHandleInput = async (e) => {
        setfilterData({ ...filterData, [e.target.name]: e.target.value });

        setisLoading(true)
        getMonthlyExpReport({ ...filterData, employee_id: e.target.value }).then(res => {
            setexpReport(res.data.result.list)
            setpageLength(res.data.pageLength);

            Object.keys(res.data.result).map(key => setreportSummery(reportSummery => {
                if (key !== "list") return { ...reportSummery, [key]: res.data.result[key] }
            }))

            setisLoading(false)
        })
    }

    const stateHandleInput = async (e) => {
        // console.log(e.target.value);
        fetchAllEmployee({ state: e.target.value }).then((res) => {
            setallEmployee(res.data.result);
        });
    };


    // Table style
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: "var(--main-color)",
            color: theme.palette.common.white,
            fontWeight: "bold",
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
            border: "none",
            borderLeft: "2px solid lightgrey",
            '&:last-child': {
                borderRight: "2px solid lightgrey",
            },
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:last-child': {
            borderBottom: "2px solid lightgrey",
        },
    }));


    return (
        <div className="container">
            <div className="beat_heading">
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">Daily Expense Report</div>
                </div>
                <div className="beat_right">
                    {/* <div className="search">
                        <SearchIcon style={{ color: `var(--main-color)` }} />
                        <input type="text" placeholder="Search" />
                    </div> */}
                </div>
            </div>

            <div class="party_container party" style={{ marginBottom: "0rem" }}>
                <div class="grouping_submit">
                    <div class="message_left">
                        <div class="message_form">
                            <select onChange={stateHandleInput}>
                                <option value="">Select State</option>
                                {allState?.map((state) => (
                                    <option key={state.id} value={state.id}>{state.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div class="message_right">
                        <div class="message_form">
                            <select
                                name="employee_id"
                                onChange={employeeHandleInput}
                            >
                                <option value="">Select Employee</option>
                                {allEmployee.length === 0 && <option disabled value="">No Employee Found</option>}
                                {allEmployee?.map((employee) => (
                                    <option value={employee?.id} >{employee?.employeeName} </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div style={{ margin: "auto", }} >
                    <CircularProgress />
                </div>
            ) : (
                <div className="device_table">
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow style={{ display: "flex" }}>
                                <StyledTableCell style={{ flex: 1.5 }} >Employee Name</StyledTableCell>
                                <StyledTableCell style={{ flex: 1 }} align="left">Submitted KMS</StyledTableCell>
                                {/* <StyledTableCell style={{ flex: 1 }} align="left">Calculated KMS</StyledTableCell> */}
                                <StyledTableCell style={{ flex: 1 }} align="left">Total TA Amount</StyledTableCell>
                                <StyledTableCell style={{ flex: 1 }} align="left">Total DA Amount</StyledTableCell>
                                <StyledTableCell style={{ flex: 1 }} align="left">Night Hault</StyledTableCell>
                                <StyledTableCell style={{ flex: 1 }} align="left">Misc Amount</StyledTableCell>
                                <StyledTableCell style={{ flex: 1 }} align="left">Submitted Amount</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {expReport?.length !== 0 && expReport?.map((row) => (
                                <>
                                    <StyledTableRow key={row.emp_name} style={{ display: "flex" }} >
                                        <StyledTableCell style={{ flex: 1.5 }}>{row.emp_name}</StyledTableCell>
                                        <StyledTableCell style={{ flex: 1 }} align="left">{row.data?.travelled_distance} </StyledTableCell>
                                        {/* <StyledTableCell style={{ flex: 1 }} align="left"> {row.data?.calculated_kms} </StyledTableCell> */}
                                        <StyledTableCell style={{ flex: 1 }} align="left">{row.data?.ta_amount}</StyledTableCell>
                                        <StyledTableCell style={{ flex: 1 }} align="left">{row.data?.da_amount}</StyledTableCell>
                                        <StyledTableCell style={{ flex: 1 }} align="left">{row.data?.hotel}</StyledTableCell>
                                        <StyledTableCell style={{ flex: 1 }} align="left">{row.data?.misc_amount}</StyledTableCell>
                                        <StyledTableCell style={{ flex: 1 }} align="left">{row.data?.total_claim_amount}</StyledTableCell>
                                        <StyledTableCell style={{ flex: 1 }} align="left">{row.data?.submit_date}</StyledTableCell>
                                    </StyledTableRow>
                                </>
                            ))}
                        </TableBody>
                    </Table>

                    {expReport && expReport?.length !== 0 && (
                        <div className="report_summery">
                            <div className="report_summery_details single_report">
                                <div className="details_left">
                                    <div className="detail_div">
                                        <div className="detail_title">Total Distance (Submitted):</div>
                                        <div className="detail">{reportSummery?.travelled_distance}km</div>
                                    </div>
                                    <div className="detail_div">
                                        <div className="detail_title">Total TA:</div>
                                        <div className="detail">₹{reportSummery?.total_TA}</div>
                                    </div>
                                    <div className="detail_div">
                                        <div className="detail_title">Total Expense Submitted:</div>
                                        <div className="detail">₹{reportSummery?.total_claim_amount}</div>
                                    </div>
                                </div>
                                <div className="details_right">
                                    <div className="detail_div">
                                        <div className="detail_title">Total Distance (Calculated):</div>
                                        <div className="detail">{reportSummery?.travelled_distance}km</div>
                                    </div>
                                    <div className="detail_div">
                                        <div className="detail_title">Total DA:</div>
                                        <div className="detail">₹{reportSummery?.total_DA}</div>
                                    </div>
                                    <div className="detail_div">
                                        <div className="detail_title">Total Expense Approved:</div>
                                        <div className="detail">₹{reportSummery?.total_claim_amount}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {expReport  && (
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
                    {!expReport && (
                        <div className="no_data">
                            No Data
                        </div>
                    )}
                </div >
            )}



        </div >
    );
};

export default DailyExpenseReports;
