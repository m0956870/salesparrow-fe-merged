import React, { useEffect, useRef, useState } from "react";
import group from "../../images/group.png";
import SearchIcon from "@mui/icons-material/Search";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";
import { getMMarketVisit, getMonthlyAttendance } from "../../api/reportsAPI";
import { CircularProgress, Pagination } from "@mui/material";

import { BsFilterLeft } from "react-icons/bs"
import { saveToPdf } from "../../utils/saveToPdf";
import getStateFunc from "../../api/locationAPI";
import fetchAllEmployee from "../../api/employeeAPI";
import fetchAllBeat from "../../api/beatAPI";
import xlsx from "json-as-xlsx";
import { toast } from "react-toastify";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AdminContext } from "../../App";
import { Avatar } from "@mui/material";
import isAllowed from "../../utils/isAllowed";
import { DYNAMIC_REPORT } from "../../constants";

const MonthlyMarketVisitSingle = () => {
    const { state } = useContext(AdminContext);
    const navigate = useNavigate()
    const location = useLocation()
    // console.log("location", location.state)
    const pdfView = useRef(null);
    const [isLoading, setisLoading] = useState(false);
    const [exportBtnLoading, setexportBtnLoading] = useState(false)
    const [pdfBtnLoading, setpdfBtnLoading] = useState(false)
    const [filterDivExtended, setfilterDivExtended] = useState(false);

    const [search, setSearch] = useState("");
    const [allState, setallState] = useState([]);
    const [allEmployee, setallEmployee] = useState([]);
    const [allBeats, setallBeats] = useState([])
    const [mMarketVisitReport, setmMarketVisitReport] = useState([]);
    const [reportSummery, setreportSummery] = useState({})
    const [pageCount, setpageCount] = useState(1);
    const [pageLength, setpageLength] = useState();
    const [totalDataCount, settotalDataCount] = useState();
    const [activeFilterTab, setactiveFilterTab] = useState("")

    const [filterData, setfilterData] = useState({
        state: "",
        employee_id: location.state?.emp_id,
        beat_id: "",
        start_date: "",
        end_date: "",
        limit: "10",
        page: pageCount,
    })

    useEffect(() => {
        getStateFunc().then((res) => setallState(res.data.result));
    }, []);
    useEffect(() => {
        getMMarketVisitFunc({ ...filterData, page: pageCount })
    }, [pageCount]);

    useEffect(() => {
        if (search !== "") {
            let ID = setTimeout(() => {
                getMMarketVisitFunc({ ...filterData, search })
            }, 1000);

            return () => clearTimeout(ID);
        }
    }, [search]);

    const getMMarketVisitFunc = async (filterData) => {
        setisLoading(true)
        if (!await isAllowed(DYNAMIC_REPORT)) {
            toast.error("Module is not purchased!");
            return setisLoading(false);
        }
        let res = await getMMarketVisit(filterData)
        if (res.data.status) {
            setmMarketVisitReport(res.data.result.list)
            setpageLength(res.data.result.pageLength);
            settotalDataCount(res.data.result.count)
            Object.keys(res.data.result).map(key => setreportSummery(reportSummery => {
                if (key !== "list") return { ...reportSummery, [key]: res.data.result[key] }
            }))
            setisLoading(false)
        }
    }

    const filterTabFunc = async (name) => {
        setpageCount(1)
        setactiveFilterTab(name);
        if (name === activeFilterTab) {
            setactiveFilterTab("");
            return getMMarketVisitFunc(filterData)
        }
        getMMarketVisitFunc({ ...filterData, order_status: name })
    }

    const handleInput = (e) => {
        setfilterData({ ...filterData, [e.target.name]: e.target.value });
    };

    const stateHandleInput = async (e) => {
        fetchAllEmployee({ state: e.target.value }).then((res) => {
            setallEmployee(res.data.result);
        });
    };

    const filterFunc = () => {
        getMMarketVisitFunc(filterData)
    }

    const topFilterHandleInput = async (e) => {
        setfilterData({ ...filterData, [e.target.name]: e.target.value })
        getMMarketVisitFunc({ ...filterData, [e.target.name]: e.target.value })
    }
    const filterAndExportFunc = (type) => {
        setTimeout(() => {
            setexportBtnLoading(false)
            setpdfBtnLoading(false)
        }, 2000);

        if (type === "column_filter") return setfilterDivExtended(!filterDivExtended);
        else if (type === "export") {
            setexportBtnLoading(true)
            setfilterDivExtended(false);
            return exportFunc();
        } else if (type === "pdf") {
            setpdfBtnLoading(true)
            setfilterDivExtended(false);
            if (mMarketVisitReport.length < 1) return toast.error("Report list is empty!");
            return saveToPdf(pdfView, "Monthly Market Visit Report (Single Employee)");
        }
    }

    // Filter
    const [tableCols, setTableCols] = useState([
        {
            label: 'Date',
            key: 'visit_date',
            type: "row",
            active: true,
            colspan: true,
        },
        {
            label: 'Beat',
            key: 'beat_name',
            type: "beat_row_data",
            active: true,
            colspan: true,
        },
        {
            label: 'Party Name',
            key: "",
            type: "retailer_row_data",
            active: true,
            colspan: true,
        },
        {
            label: 'Customer Name',
            key: "retailer_name",
            type: "retailer_row_data",
            active: true,
            colspan: true,
        },
        {
            label: 'Contact Number',
            key: "phone",
            type: "row",
            active: true,
            colspan: true,
        },
        {
            label: 'Time',
            key: "time",
            type: "row",
            active: true,
            colspan: true,
        },
        {
            label: 'Order Amount',
            key: "amount",
            type: "row",
            active: true,
        },
        {
            label: 'View Orders',
            key: "emp_id",
            type: "link",
            value: "View",
            active: true,
        },
    ]);

    let filterCols = tableCols.filter(col => col.active);
    let pdfFilterCols = tableCols.filter(col => col.type === "row" || col.type === "beat_row_data" || col.type === "retailer_row_data" && col.active);
    const toogleTableCol = (key) => {
        // if (key === "emp_name") return;
        const temp = tableCols.map(col => {
            if (col.key === key) {
                if (col.colspan == true || col.colspan == false) return { ...col, colspan: !col.colspan, active: !col.active }
                else return { ...col, active: !col.active }
            }
            return col;
        })
        setTableCols(temp)
    }

    const TCComponent = ({ data }) => {
        let { row, col } = data;
        if (col.type === "link") {
            return (
                <StyledTableCell>
                    <div onClick={() => navigate("/monthly_market_visit_single", { state: { row } })} className="map_listing_assigned_col">
                        <NavLink to="">{col.value}</NavLink>
                    </div>
                </StyledTableCell>
            )
        } else if (col.type === "beat_row_data") {
            return <StyledTableCell>{row.beat[col.key]}</StyledTableCell>;
        } else if (col.type === "retailer_row_data") {
            return <StyledTableCell>{row.retailer[col.key]}</StyledTableCell>;
        } else {
            return <StyledTableCell>{row[col.key]}</StyledTableCell>
        }
    }
    const PDFTCComponent = ({ data }) => {
        let { row, col } = data;
        if (col.type === "beat_row_data") {
            return <PDFStyledTableCell>{row.beat[col.key]}</PDFStyledTableCell>;
        } else if (col.type === "retailer_row_data") {
            return <PDFStyledTableCell>{row.retailer[col.key]}</PDFStyledTableCell>;
        } else if (col.type === "row") {
            return <PDFStyledTableCell>{row[col.key]}</PDFStyledTableCell>
        }
    }

    // Export
    let settings = {
        fileName: "Monthly Expense Report (Single Employee)", // Name of the resulting spreadsheet
        extraLength: 3, // A bigger number means that columns will be wider
        writeMode: 'writeFile', // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
        writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
        RTL: false, // Display the columns from right-to-left (the default value is false)
    }

    const exportFunc = () => {
        // console.log(allEmployee);
        if (mMarketVisitReport.length < 1) {
            return toast.error("Report list is empty!")
        }
        let data = [
            {
                sheet: "Adults",
                columns: [
                    { label: "ID", value: (row) => row.id ? row.id : "" },
                    { label: "Employee_Name", value: (row) => row.employeeName || "" },
                ],
                content: mMarketVisitReport
            },
        ]
        try {
            xlsx(data, settings, callback)
        } catch (error) {
            console.log(error);
        }
    }

    let callback = function (sheet) {
        console.log("Download complete:", sheet)
    }


    // Table style
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
            borderLeft: "2px solid #f3f3f3",
            '&:last-child': {
                borderRight: "2px solid #f3f3f3",
            },
            whiteSpace: "nowrap"
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        borderBottom: "2px solid #f3f3f3",
        '&:nth-of-type(odd)': {
            backgroundColor: "#fff",
        },
        '&:nth-of-type(even)': {
            backgroundColor: "#fbfbfb",
        },
    }));

    // pdf Table style
    const PDFStyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            fontSize: 14,
            backgroundColor: "#d9d9d9",
            color: "#000",
            fontWeight: "bold",
            border: "1px solid #000",
            padding: "0.5rem",
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 13,
            border: "1px solid #000",
            whiteSpace: "nowrap",
            padding: "0.8rem",
        },
    }));
    const PDFStyledTableRow = styled(TableRow)(({ theme }) => ({
        border: "1px solid #000",
        backgroundColor: "#fff",
    }));


    return (
        <div className="container">
            <div className="beat_heading">
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">Monthly Market Visit Report (Single Employee)</div>
                </div>
                <div className="beat_right">
                    <div className="search">
                        <SearchIcon style={{ color: `var(--main-color)` }} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search"
                        />
                    </div>
                </div>
            </div>

            <div className="tracking_tabs" style={{ marginBottom: "1.5rem" }} >
                <div className="tarcking_tab_left">
                    <select name="state" onChange={stateHandleInput}>
                        <option value="">All States</option>
                        {allState?.map((state) => (
                            <option key={state.id} value={state.id}>{state.name}</option>
                        ))}
                    </select>
                    <select name="employee_id" onChange={handleInput}>
                        <option value="">All Employees</option>
                        {allEmployee.length === 0 && <option disabled value="">No Employee Found</option>}
                        {allEmployee?.map((employee) => (
                            <option value={employee?.id} >{employee?.employeeName}</option>
                        ))}
                    </select>
                    <select name="beat_id" onChange={handleInput}>
                        <option value="">All Beats</option>
                        {allBeats.length === 0 && <option disabled value="">No Beats Found</option>}
                        {allBeats?.map((beat) => (
                            <option value={beat?.id}>{beat?.beatName}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        onClick={(e) => (e.target.type = "date")}
                        onBlur={(e) => (e.target.type = "text")}
                        name="start_date"
                        onChange={handleInput}
                        placeholder="Start Date"
                    />
                    <input
                        type="text"
                        onClick={(e) => (e.target.type = "date")}
                        onBlur={(e) => (e.target.type = "text")}
                        name="end_date"
                        onChange={handleInput}
                        placeholder="End Date"
                    />
                    <div className="view_btn_2" onClick={() => filterFunc()}>
                        View
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
                        <div className="other_functionality_section" style={{ marginRight: 0 }}>
                            <div className="section_options" onClick={() => filterAndExportFunc("column_filter")}>
                                <span className="filter_icon" ><BsFilterLeft size={22} /></span> Filter
                            </div>
                            <div className="section_options" onClick={() => filterAndExportFunc("export")}>
                                {exportBtnLoading ? <CircularProgress size={24} /> : "Export"}
                            </div>
                            <div className="section_options" onClick={() => filterAndExportFunc("pdf")} >
                                {pdfBtnLoading ? <CircularProgress size={24} /> : "PDF"}
                            </div>
                            <div style={{ display: filterDivExtended ? "block" : "none" }} className="col_filter_section">
                                {tableCols?.map((col) => (
                                    <div className="col_filter" >
                                        <label >
                                            <input type="checkbox" checked={col.active} onChange={() => toogleTableCol(col.key)} />
                                            <span onChange={() => toogleTableCol(col.key)} >{col.label}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* {mMarketVisitReport?.length !== 0 && reportSummery && ( */}
            <div className="mv_call_container" >
                <div className="mv_call_div" onClick={() => filterTabFunc("Productive")} style={{ background: "#5fd24c", outline: `${activeFilterTab === "Productive" ? "2px solid #000" : ""}` }} >
                    <div>{reportSummery.pc}/{reportSummery.tc}</div>
                    <div className="mv_call_span">Productive Calls</div>
                </div>
                <div className="mv_call_div" onClick={() => filterTabFunc("New-Call")} style={{ background: "#6babc7", outline: `${activeFilterTab === "New-Call" ? "2px solid #000" : ""}` }} >
                    <div>{reportSummery.nc || "NA"}/{reportSummery.tc} </div>
                    <span className="mv_call_span" >New Call</span>
                </div>
                <div className="mv_call_div" onClick={() => filterTabFunc("Non-Productive")} style={{ background: "#ff6ccc", outline: `${activeFilterTab === "Non-Productive" ? "2px solid #000" : ""}` }} >
                    <div>{reportSummery.npc}/{reportSummery.tc} </div>
                    <span className="mv_call_span" >Not Productives</span>
                </div>
                <div className="mv_call_div" onClick={() => filterTabFunc("Exception")} style={{ background: "#ff5454", outline: `${activeFilterTab === "Exception" ? "2px solid #000" : ""}` }} >
                    <div>{reportSummery.exception || "NA"}/{reportSummery.tc} </div>
                    <span className="mv_call_span" >Exception</span>
                </div>
            </div>
            {/* )} */}


            {isLoading ? (
                <div style={{ margin: "auto", }} >
                    <CircularProgress />
                </div>
            ) : (
                <>
                    <div className="">
                        <div className="table_scroll_container">
                            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>S. No.</StyledTableCell>
                                        {filterCols?.map(col => <StyledTableCell>{col.label}</StyledTableCell>)}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {mMarketVisitReport?.map((row, i) => (
                                        <StyledTableRow key={i} >
                                            <StyledTableCell>{((pageCount * filterData.limit) - filterData.limit) + (i + 1)}</StyledTableCell>
                                            {filterCols?.map(col => <TCComponent data={{ row, col }} />)}
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {mMarketVisitReport?.length !== 0 && (
                            <div className="top_filter_section" style={{ marginBlock: "1rem" }} >
                                <div className="limit_bottom_info">Showing {((pageCount * filterData.limit) - filterData.limit) + 1} to {totalDataCount > pageCount * filterData.limit ? pageCount * filterData.limit : totalDataCount} of {totalDataCount} entries</div>
                                <div>
                                    <Pagination
                                        count={pageLength}
                                        size="medium"
                                        color="primary"
                                        shape="rounded"
                                        variant="outlined"
                                        onChange={(e, value) => setpageCount(value)}
                                        page={pageCount}
                                    />
                                </div>
                            </div>
                        )}
                        {mMarketVisitReport?.length === 0 && (
                            <div className="no_data">
                                No Data
                            </div>
                        )}

                        {mMarketVisitReport?.length !== 0 && reportSummery && (
                            <div className="mv_single_total_div">
                                Total Amount: ₹{reportSummery.final_amount}
                            </div>
                        )}
                    </div >
                </>
            )}

            {/* <div id="pdf_container" ref={pdfView}> */}
            <div id="hide_pdf_container" ref={pdfView}>
                <div className="pdf_head_section">
                    <div className="pdf_head_left">
                        <div className="pdf_company_logo">
                            <Avatar src={state?.result?.profileImage} sx={{ height: "9rem", width: "9rem" }} />
                        </div>
                        <div className="pdf_selected_date">Monthly Market Visit Report (Single Employee) ({reportSummery?.pdf_start_date || "NA"} - {reportSummery?.pdf_end_date || "NA"})</div>
                    </div>
                    <div className="pdf_head_right">
                        <div>{reportSummery?.pdf_employee_name}</div>
                        <div>{reportSummery?.pdf_employee_role}</div>
                        <div>{reportSummery?.pdf_employee_id}</div>
                        <div>{reportSummery?.pdf_employee_city}</div>
                        <div>{reportSummery?.pdf_employee_state}</div>
                    </div>
                </div>

                <div className="mv_call_container" style={{ marginBottom: 0 }} >
                    <div className="mv_call_div" style={{ background: "#d9d9d9", color: "#000" }} >
                        <div>{reportSummery.pc}/{reportSummery.tc}</div>
                        <div className="mv_call_span">Productive Calls</div>
                    </div>
                    <div className="mv_call_div" style={{ background: "#d9d9d9", color: "#000" }} >
                        <div>{reportSummery.nc || "NA"}/{reportSummery.tc} </div>
                        <span className="mv_call_span" >New Call</span>
                    </div>
                    <div className="mv_call_div" style={{ background: "#d9d9d9", color: "#000" }} >
                        <div>{reportSummery.npc}/{reportSummery.tc} </div>
                        <span className="mv_call_span" >Not Productives</span>
                    </div>
                    <div className="mv_call_div" style={{ background: "#d9d9d9", color: "#000" }} >
                        <div>{reportSummery.exception || "NA"}/{reportSummery.tc} </div>
                        <span className="mv_call_span" >Exception</span>
                    </div>
                </div>

                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <PDFStyledTableCell>S. No.</PDFStyledTableCell>
                            {pdfFilterCols?.map(col => <PDFStyledTableCell>{col.label}</PDFStyledTableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mMarketVisitReport?.map((row, i) => (
                            <PDFStyledTableRow key={i} >
                                <PDFStyledTableCell>{((pageCount * filterData.limit) - filterData.limit) + (i + 1)}</PDFStyledTableCell>
                                {filterCols?.map(col => <PDFTCComponent data={{ row, col }} />)}
                            </PDFStyledTableRow>
                        ))}
                        <PDFStyledTableRow >
                            <PDFStyledTableCell colspan={tableCols.filter(col => col.colspan == true).length + 1} style={{ fontSize: "1.2rem", fontWeight: "bold", textAlign: "end" }}>Total</PDFStyledTableCell>
                            {tableCols[3]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.final_amount}</PDFStyledTableCell>}
                        </PDFStyledTableRow>
                    </TableBody>
                </Table>

                <div className="pdf_summery_section">
                    {mMarketVisitReport?.length !== 0 && reportSummery && (
                        <div className="mv_single_total_div" style={{ marginTop: 0 }} >
                            Total Amount: ₹{reportSummery.final_amount}
                        </div>
                    )}
                </div>
            </div >
        </div >
    );
};

export default MonthlyMarketVisitSingle;
