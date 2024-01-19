import "./Report.css";
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
import { CircularProgress, Pagination } from "@mui/material";
import { getCPRAllEmp } from "../../api/reportsAPI";

import { useRef } from "react";
import { BsFilterLeft } from "react-icons/bs"
import { saveToPdf } from "../../utils/saveToPdf";
import getStateFunc from "../../api/locationAPI";
import fetchAllEmployee from "../../api/employeeAPI";
import xlsx from "json-as-xlsx";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AdminContext } from "../../App";
import { Avatar } from "@mui/material";
import isAllowed from "../../utils/isAllowed";
import { DYNAMIC_REPORT } from "../../constants";

const PerformenceReportsAll = () => {
    const { state } = useContext(AdminContext);
    const navigate = useNavigate();
    const [isLoading, setisLoading] = useState(false);

    const pdfView = useRef(null);
    const [filterDivExtended, setfilterDivExtended] = useState(false);
    const [exportBtnLoading, setexportBtnLoading] = useState(false)
    const [pdfBtnLoading, setpdfBtnLoading] = useState(false)

    const [search, setSearch] = useState("");
    const [allState, setallState] = useState([]);
    const [allEmployee, setallEmployee] = useState([]);
    const [CPMReport, setCPMReport] = useState([]);
    const [reportSummery, setreportSummery] = useState({})
    const [pageCount, setpageCount] = useState(1);
    const [pageLength, setpageLength] = useState();
    const [totalDataCount, settotalDataCount] = useState();

    const [filterData, setfilterData] = useState({
        state: "",
        employee_id: "",
        start_date: "",
        end_date: "",
        limit: "10",
        page: pageCount,
    })

    useEffect(() => {
        getStateFunc().then((res) => setallState(res.data.result));
    }, [])
    useEffect(() => {
        getReportFunc({ ...filterData, page: pageCount })
    }, [pageCount]);

    useEffect(() => {
        if (search !== "") {
            let ID = setTimeout(() => {
                getReportFunc({ ...filterData, search })
            }, 1000);

            return () => clearTimeout(ID);
        }
    }, [search]);

    const getReportFunc = async () => {
        setisLoading(true);
        if (!await isAllowed(DYNAMIC_REPORT)) {
            toast.error("Module is not purchased!");
            return setisLoading(false);
        }
        let res = await getCPRAllEmp(filterData)
        if (res.data.status) {
            setCPMReport(res.data.result)
            setreportSummery(res.data.summary)
            setpageLength(res.data.pageLength);
            settotalDataCount(res.data.count);
            Object.keys(res.data.result).map(key => setreportSummery(reportSummery => {
                if (key !== "list") return { ...reportSummery, [key]: res.data.result[key] }
            }))
            setisLoading(false);
        } else {
            setisLoading(false);
            console.log("Some Error!");
        }
    }

    const handleInput = (e) => {
        setfilterData({ ...filterData, [e.target.name]: e.target.value });
    }
    const stateHandleInput = (e) => {
        fetchAllEmployee({ state: e.target.value }).then(res => setallEmployee(res.data.result));
    }
    const filterFunc = () => {
        getReportFunc(filterData)
    }

    const topFilterHandleInput = (e) => {
        setfilterData({ ...filterData, [e.target.name]: e.target.value })
        getReportFunc({ ...filterData, [e.target.name]: e.target.value })
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
            if (CPMReport.length < 1) return toast.error("Report list is empty!");
            return saveToPdf(pdfView, "Complete Performence Report (All Employee)");
        }
    }

    // Export
    let settings = {
        fileName: "Complete Performence Report (All Employee)", // Name of the resulting spreadsheet
        extraLength: 3, // A bigger number means that columns will be wider
        writeMode: 'writeFile', // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
        writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
        RTL: false, // Display the columns from right-to-left (the default value is false)
    }

    const exportFunc = () => {
        // console.log(allEmployee);
        if (CPMReport.length < 1) return toast.error("Report list is empty!");

        let data = [
            {
                sheet: "Adults",
                columns: [
                    { label: "ID", value: (row) => row.id ? row.id : "" },
                    { label: "Employee_Name", value: (row) => row.employeeName || "" },
                ],
                content: CPMReport
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

    // Filter
    const [tableCols, setTableCols] = useState([
        {
            label: 'Employee',
            key: 'emp_name',
            type: "row",
            active: true,
            colspan: true,
        },
        {
            label: 'Total Distributor',
            key: 'total_party',
            type: "row",
            active: true,
        },
        {
            label: 'Active Distributor',
            key: 'total_active_party',
            type: "row",
            active: true,
        },
        {
            label: 'Primary Sale',
            key: "total_primary_sales",
            type: "row",
            active: true,
        },
        {
            label: 'Secondary Sale',
            key: "total_secondary_sales",
            type: "row",
            active: true,
        },
        {
            label: 'Collection',
            key: "total_payment_collection",
            type: "row",
            active: true,
        },
        {
            label: 'Outstanding',
            key: "out_standing",
            type: "row",
            active: true,
        },
        {
            label: 'Salary',
            key: "salary",
            type: "row",
            active: true,
        },
        {
            label: 'Expense',
            key: "total_expense",
            type: "row",
            active: true,
        },
        {
            label: 'Total',
            key: "total",
            type: "row",
            active: true,
        },
        {
            label: 'Actions',
            key: "emp_id",
            type: "link",
            value: "View",
            active: true,
        },
    ]);

    let filterCols = tableCols.filter(col => col.active);
    let pdfFilterCols = tableCols.filter(col => col.type === "row" && col.active);
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
                    <div onClick={() => navigate("/performence_report_single", { state: { row } })} className="map_listing_assigned_col">
                        <NavLink to="">{col.value}</NavLink>
                    </div>
                </StyledTableCell>
            )
        } else if (col.type === "row") {
            return <StyledTableCell>{row[col.key]}</StyledTableCell>;
        }
    }
    const PDFTCComponent = ({ data }) => {
        let { row, col } = data;
        if (col.type === "row") {
            return <PDFStyledTableCell>{row[col.key]}</PDFStyledTableCell>;
        }
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
            whiteSpace: "nowrap",
        }
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
                    <div className="title">Complete Performence Report (All Employee)</div>
                </div>
                <div className="beat_right employee_head">
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

            <div className="tracking_tabs" style={{ marginBottom: "1.5rem" }}>
                <div className="tarcking_tab_left">
                    <select name="state" onChange={stateHandleInput}>
                        <option value="">All States</option>
                        {allState?.map((state) => (
                            <option key={state.id} value={state.id}>{state.name}</option>
                        ))}
                    </select>
                    <select name="employee_id" onChange={handleInput} >
                        <option value="">All Employees</option>
                        {allEmployee.length === 0 && <option disabled value="">No Employee Found</option>}
                        {allEmployee?.map((employee) => (
                            <option key={employee?.id} value={employee?.id} > {employee?.employeeName} </option>
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
                    <div
                        className="view_btn_2"
                        onClick={() => filterFunc()}
                    >
                        View
                    </div>
                </div>
                <div className="top_filter_section" >
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


            {isLoading ? (
                <div
                    style={{
                        margin: "auto",
                    }}
                >
                    <CircularProgress />
                </div>
            ) : (
                <div className="" >
                    <div className="table_scroll_container">
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>S. No.</StyledTableCell>
                                    {filterCols?.map(col => <StyledTableCell>{col.label}</StyledTableCell>)}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {CPMReport?.map((row, i) => (
                                    <StyledTableRow key={i} >
                                        <StyledTableCell>{((pageCount * filterData.limit) - filterData.limit) + (i + 1)}</StyledTableCell>
                                        {filterCols?.map(col => <TCComponent data={{ row, col }} />)}
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {CPMReport?.length !== 0 && (
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
                    {CPMReport?.length === 0 && (
                        <div className="no_data">
                            No Data
                        </div>
                    )}

                    {reportSummery && CPMReport?.length !== 0 && (
                        <div className="mattendance_summery_section">
                            <h2 className="report_summery_title">Summery</h2>
                            <div className="report_summery_body">
                                <div className="report_summery_left">
                                    <div className="summery_column">
                                        <div className="detail_title">Total Salary:</div>
                                        <div className="detail">₹{reportSummery.final_salary}</div>
                                    </div>
                                    <div className="summery_column">
                                        <div className="detail_title">Total Sale :-</div>
                                        <div className="detail"></div>
                                    </div>
                                    <div className="summery_column">
                                        <div className="detail_title">Total Secondary Sale:</div>
                                        <div className="detail">₹{reportSummery.final_secondary_sale}</div>
                                    </div>
                                    <div className="summery_column">
                                        <div className="detail_title">Performance:</div>
                                        <div className="detail">{reportSummery.secondary_performance}</div>
                                    </div>
                                </div>
                                <div className="report_summery_right">
                                    <div className="summery_column">
                                        <div className="detail_title">Total Expense:</div>
                                        <div className="detail">₹{reportSummery.final_expense}</div>
                                    </div>
                                    <div className="summery_column" style={{ visibility: "hidden" }}>
                                        <div className="detail_title">geuywe</div>
                                        <div className="detail">ewiufh</div>
                                    </div>
                                    <div className="summery_column">
                                        <div className="detail_title">Total Primary Sale:</div>
                                        <div className="detail">₹{reportSummery.final_primary_sale}</div>
                                    </div>
                                    <div className="summery_column">
                                        <div className="detail_title">Performance:</div>
                                        <div className="detail">{reportSummery.primary_performance}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* <div id="pdf_container" ref={pdfView}> */}
            <div id="hide_pdf_container" ref={pdfView}>
                <div className="pdf_head_section">
                    <div className="pdf_head_left">
                        <div className="pdf_company_logo">
                            <Avatar src={state?.result?.profileImage} sx={{ height: "9rem", width: "9rem" }} />
                        </div>
                        <div className="pdf_selected_date">Monthly Expense Report of All Employee ({reportSummery?.pdf_start_date || "NA"} - {reportSummery?.pdf_end_date || "NA"})</div>
                    </div>
                    <div className="pdf_head_right">
                        <div>{reportSummery?.pdf_employee_name}</div>
                        <div>{reportSummery?.pdf_employee_role}</div>
                        <div>{reportSummery?.pdf_employee_id}</div>
                        <div>{reportSummery?.pdf_employee_city}</div>
                        <div>{reportSummery?.pdf_employee_state}</div>
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
                        {CPMReport?.map((row, i) => (
                            <PDFStyledTableRow key={i} >
                                <PDFStyledTableCell>{((pageCount * filterData.limit) - filterData.limit) + (i + 1)}</PDFStyledTableCell>
                                {filterCols?.map(col => <PDFTCComponent data={{ row, col }} />)}
                            </PDFStyledTableRow>
                        ))}
                        <PDFStyledTableRow >
                            <PDFStyledTableCell colspan={tableCols.filter(col => col.colspan == true).length + 1} style={{ fontSize: "1.2rem", fontWeight: "bold", textAlign: "end" }}>Total</PDFStyledTableCell>
                            {tableCols[2]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_total_party}</PDFStyledTableCell>}
                            {tableCols[3]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_total_active_party}</PDFStyledTableCell>}
                            {tableCols[4]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_total_primary_sales}</PDFStyledTableCell>}
                            {tableCols[5]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_total_secondary_sales}</PDFStyledTableCell>}
                            {tableCols[6]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_total_payment_collection}</PDFStyledTableCell>}
                            {tableCols[7]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_out_standing}</PDFStyledTableCell>}
                            {tableCols[8]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_salary}</PDFStyledTableCell>}
                            {tableCols[9]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_total_expense}</PDFStyledTableCell>}
                            {tableCols[10]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_total}</PDFStyledTableCell>}
                        </PDFStyledTableRow>
                    </TableBody>
                </Table>

                <div className="pdf_summery_section">
                    {reportSummery && CPMReport?.length !== 0 && (
                        <div className="mattendance_summery_section" style={{ backgroundColor: "#fff" }} >
                            <h3 className="report_summery_title" style={{ color: "#000" }}>Summery</h3>
                            <div className="report_summery_body">
                                <div className="report_summery_left">
                                    <div className="summery_column">
                                        <div className="detail_title">Total Salary:</div>
                                        <div className="detail">₹{reportSummery.final_salary}</div>
                                    </div>
                                    <div className="summery_column">
                                        <div className="detail_title">Total Sale :-</div>
                                        <div className="detail"></div>
                                    </div>
                                    <div className="summery_column">
                                        <div className="detail_title">Total Secondary Sale:</div>
                                        <div className="detail">₹{reportSummery.final_secondary_sale}</div>
                                    </div>
                                    <div className="summery_column">
                                        <div className="detail_title">Performance:</div>
                                        <div className="detail">{reportSummery.secondary_performance}</div>
                                    </div>
                                </div>
                                <div className="report_summery_right">
                                    <div className="summery_column">
                                        <div className="detail_title">Total Expense:</div>
                                        <div className="detail">₹{reportSummery.final_expense}</div>
                                    </div>
                                    <div className="summery_column" style={{ visibility: "hidden" }}>
                                        <div className="detail_title">geuywe</div>
                                        <div className="detail">ewiufh</div>
                                    </div>
                                    <div className="summery_column">
                                        <div className="detail_title">Total Primary Sale:</div>
                                        <div className="detail">₹{reportSummery.final_primary_sale}</div>
                                    </div>
                                    <div className="summery_column">
                                        <div className="detail_title">Performance:</div>
                                        <div className="detail">{reportSummery.primary_performance}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PerformenceReportsAll;