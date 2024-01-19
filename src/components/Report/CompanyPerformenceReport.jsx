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
import { getCollectionReport, getCompanyReport, getSSWiseReport } from "../../api/reportsAPI";
import fetchAllParty, { getPartyType } from "../../api/partyAPI";

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

const CompanyPerformenceReport = () => {
    const { state } = useContext(AdminContext);
    const navigate = useNavigate();
    const [isLoading, setisLoading] = useState(false);

    const pdfView = useRef(null);
    const [filterDivExtended, setfilterDivExtended] = useState(false);
    const [exportBtnLoading, setexportBtnLoading] = useState(false)
    const [pdfBtnLoading, setpdfBtnLoading] = useState(false)

    const [search, setSearch] = useState("");
    const [allState, setallState] = useState([]);
    const [partyTypes, setpartyTypes] = useState()
    const [performenceReport, setperformenceReport] = useState([]);
    const [reportSummery, setreportSummery] = useState({})
    const [pageCount, setpageCount] = useState(1);
    const [pageLength, setpageLength] = useState();
    const [totalDataCount, settotalDataCount] = useState();

    const [summeryPartyType, setsummeryPartyType] = useState()
    const [summeryPartyTypeData, setsummeryPartyTypeData] = useState()

    const [filterData, setfilterData] = useState({
        party_type_id: "",
        month: "",
        year: "",
        page: pageCount,
        state: "",
        start_date: "",
        end_date: "",
        limit: "10",
    })

    useEffect(() => {
        getPartyType().then(res => setpartyTypes(res.data.result))
    }, []);
    useEffect(() => {
        companyReportFunc({ ...filterData, page: pageCount })
    }, [pageCount]);

    useEffect(() => {
        if (search !== "") {
            let ID = setTimeout(() => {
                companyReportFunc({ ...filterData, search })
            }, 1000);

            return () => clearTimeout(ID);
        }
    }, [search]);

    const companyReportFunc = async (filterData) => {
        setisLoading(true)
        if (!await isAllowed(DYNAMIC_REPORT)) {
            toast.error("Module is not purchased!");
            return setisLoading(false);
        }
        let { data } = await getCompanyReport(filterData)
        if (data.status) {
            setperformenceReport(data.result.list)
            setpageLength(data.pageLength);
            settotalDataCount(data.count);
            Object.keys(data.result).map(key => setreportSummery(reportSummery => {
                if (key !== "list") return { ...reportSummery, [key]: data.result[key] }
            }))
            return setisLoading(false)
        }
        console.log("Server Error")
    }

    const handleInput = (e) => {
        setfilterData({ ...filterData, [e.target.name]: e.target.value });
    };
    const summeryPartyTypeFunc = async (e) => {
        let selectedPartyType = JSON.parse(e.target.value)
        setsummeryPartyType(selectedPartyType)
        let { data } = await getCompanyReport({ summary_partytype: selectedPartyType._id })
        if (data.status) {
            Object.keys(data.result).map(key => setsummeryPartyTypeData(summeryPartyTypeData => {
                if (key !== "list") return { ...summeryPartyTypeData, [key]: data.result[key] }
            }))
            let { summery_total_active_party, summery_total_collection, summery_total_out_standing, summery_total_party, summery_total_sale, summery_total_stock } = data.result
            let summeryObj = {
                summery_total_active_party, summery_total_collection, summery_total_out_standing, summery_total_party, summery_total_sale, summery_total_stock
            }
        }
    };

    const stateHandleInput = (e) => {
        // fetchAllEmployee({ state: e.target.value }).then(res => setallEmployee(res.data.result));
    };

    const filterFunc = () => {
        companyReportFunc(filterData)
    }

    const topFilterHandleInput = (e) => {
        setfilterData({ ...filterData, [e.target.name]: e.target.value })
        companyReportFunc({ ...filterData, [e.target.name]: e.target.value })
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
            if (performenceReport.length < 1) return toast.error("Report list is empty!");
            return saveToPdf(pdfView, "Company Performance Report");
        }
    }

    // Export
    let settings = {
        fileName: "Company Performance Report", // Name of the resulting spreadsheet
        extraLength: 3, // A bigger number means that columns will be wider
        writeMode: 'writeFile', // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
        writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
        RTL: false, // Display the columns from right-to-left (the default value is false)
    }

    const exportFunc = () => {
        // console.log(allEmployee);
        if (performenceReport.length < 1) return toast.error("Report list is empty!");

        let data = [
            {
                sheet: "Adults",
                columns: [
                    { label: "Party Name", value: (row) => row.party ?? "-" },
                    { label: "Party Type", value: (row) => row.party_type ?? "-" },
                    { label: "Sale", value: (row) => row.sale ?? "-" },
                    { label: "Collection", value: (row) => row.collection ?? "-" },
                    { label: "Outstanding", value: (row) => row.out_standing ?? "-" },
                    { label: "Stock", value: (row) => row.stock ?? "-" },
                ],
                content: performenceReport
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
            label: 'Party Name',
            key: 'party',
            type: "value",
            active: true,
            colspan: true,
        },
        {
            label: 'Party Type',
            key: 'party_type',
            type: "value",
            active: true,
            colspan: true,
        },
        {
            label: 'Sale',
            key: "sale",
            type: "value",
            active: true,
        },
        {
            label: 'Collection',
            key: "collection",
            type: "value",
            active: true,
        },
        {
            label: 'Outsatnding',
            key: "out_standing",
            type: "value",
            active: true,
        },
        {
            label: 'Stock',
            key: "stock",
            type: "value",
            active: true,
        },
        {
            label: 'Status',
            key: "status",
            type: "component",
            active: true,
        },
    ]);

    let filterCols = tableCols.filter(col => col.active);
    let pdfFilterCols = tableCols.filter(col => col.type === "value" && col.active);
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
        if (col.type === "component") {
            return <StyledTableCell>
                <div className={`${row[col.key] === "Active" ? "active_beat" : "inactive_beat"}`}>
                    {row[col.key]}
                </div>
            </StyledTableCell >
        }
        return <StyledTableCell>{row[col.key]}</StyledTableCell>;
    }
    const PDFTCComponent = ({ data }) => {
        let { row, col } = data;
        if (col.type === "value") {
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
            whiteSpace: "nowrap"
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
                    <div className="title">Company Performence Report</div>
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
                    <select onChange={stateHandleInput}>
                        <option value="">All States</option>
                        {allState?.map((state) => (
                            <option key={state.id} value={state.id}>{state.name}</option>
                        ))}
                    </select>
                    <select name="party_type_id" onChange={handleInput}>
                        <option value="">All Party Type</option>
                        {partyTypes?.map((type) => (
                            <option key={type._id} value={type._id}>{type.party_type}</option>
                        ))}
                    </select>
                    {/* <select name="month" onChange={handleInput} >
                        <option value="">Months</option>
                        {monthsArr?.map(month => (
                            <option key={month.value} value={month.value}>{month.name}</option>
                        ))}
                    </select>
                    <select name="year" onChange={handleInput} >
                        <option value="">Year</option>
                        {yearsArr?.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select> */}
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
                        className="view_btn"
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
                <div style={{ margin: "auto" }} >
                    <CircularProgress />
                </div>
            ) : (
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
                                {performenceReport?.map((row, i) => (
                                    <StyledTableRow key={i} >
                                        <StyledTableCell>{((pageCount * filterData.limit) - filterData.limit) + (i + 1)}</StyledTableCell>
                                        {filterCols?.map(col => <TCComponent data={{ row, col }} />)}
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {performenceReport?.length !== 0 && (
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
                    {performenceReport?.length === 0 && (
                        <div className="no_data">
                            No Data
                        </div>
                    )}

                    {reportSummery && performenceReport?.length !== 0 && (
                        <div className="mattendance_summery_section">
                            <h2 className="report_summery_title">Total Summary</h2>
                            <div className="report_summery_body" style={{ padding: 0 }}>
                                <div className="report_summery_left bg-color1">
                                    <div className="performance_summary_col">
                                        <div className="detail_title">Total Party</div>
                                        <div className="detail">{reportSummery.distributor_total_party ?? "-"}</div>
                                    </div>
                                    <hr />
                                    {/* <div className="performance_summary_col">
                                        <div className="detail_title">Total Dealer</div>
                                        <div className="detail">{reportSummery.dealer_total_party ?? "-"}</div>
                                    </div>
                                    <hr />
                                    <div className="performance_summary_col">
                                        <div className="detail_title">Total SS</div>
                                        <div className="detail">{reportSummery.ss_total_party ?? "-"}</div>
                                    </div> */}
                                </div>
                                <div className="report_summery_right bg-color2">
                                    <div className="performance_summary_col">
                                        <div className="detail_title">Active Party</div>
                                        <div className="detail">{reportSummery.distributor_total_active_party ?? "-"}</div>
                                    </div>
                                    <hr />
                                    {/* <div className="performance_summary_col">
                                        <div className="detail_title">Active Dealer</div>
                                        <div className="detail">{reportSummery.dealer_total_active_party ?? "-"}</div>
                                    </div>
                                    <hr />
                                    <div className="performance_summary_col">
                                        <div className="detail_title">Active SS</div>
                                        <div className="detail">{reportSummery.ss_total_active_party ?? "-"}</div>
                                    </div> */}
                                </div>
                                <div className="report_summery_right bg-color3">
                                    <div className="performance_summary_col">
                                        <div className="detail_title">Total Sale</div>
                                        <div className="detail">{reportSummery.distributor_total_sale ?? "-"}</div>
                                    </div>
                                    <hr />
                                    {/* <div className="performance_summary_col">
                                        <div className="detail_title">Sale To Dealer</div>
                                        <div className="detail">{reportSummery.dealer_total_sale ?? "-"}</div>
                                    </div>
                                    <hr />
                                    <div className="performance_summary_col">
                                        <div className="detail_title">Sale To SS</div>
                                        <div className="detail">{reportSummery.ss_total_sale ?? "-"}</div>
                                    </div> */}
                                </div>
                                <div className="report_summery_right bg-color4">
                                    <div className="performance_summary_col">
                                        <div className="detail_title">Total Collection</div>
                                        <div className="detail">{reportSummery.distributor_total_collection ?? "-"}</div>
                                    </div>
                                    <hr />
                                    {/* <div className="performance_summary_col">
                                        <div className="detail_title">Dealer Collection</div>
                                        <div className="detail">{reportSummery.dealer_total_collection ?? "-"}</div>
                                    </div>
                                    <hr />
                                    <div className="performance_summary_col">
                                        <div className="detail_title">SS Collection</div>
                                        <div className="detail">{reportSummery.ss_total_collection ?? "-"}</div>
                                    </div> */}
                                </div>
                                <div className="report_summery_right bg-color5">
                                    <div className="performance_summary_col">
                                        <div className="detail_title">Total Stock</div>
                                        <div className="detail">{reportSummery.distributor_total_stock ?? "-"}</div>
                                    </div>
                                    <hr />
                                    {/* <div className="performance_summary_col">
                                        <div className="detail_title">Dealer Stock</div>
                                        <div className="detail">{reportSummery.dealer_total_stock ?? "-"}</div>
                                    </div>
                                    <hr />
                                    <div className="performance_summary_col">
                                        <div className="detail_title">SS Stock</div>
                                        <div className="detail">{reportSummery.ss_total_stock ?? "-"}</div>
                                    </div> */}
                                </div>
                                <div className="report_summery_right bg-color6">
                                    <div className="performance_summary_col">
                                        <div className="detail_title">Total Outstanding</div>
                                        <div className="detail">{reportSummery.distributor_total_out_standing ?? "-"}</div>
                                    </div>
                                    <hr />
                                    {/* <div className="performance_summary_col">
                                        <div className="detail_title">Dealer Outstanding</div>
                                        <div className="detail">{reportSummery.dealer_total_out_standing ?? "-"}</div>
                                    </div>
                                    <hr />
                                    <div className="performance_summary_col">
                                        <div className="detail_title">Stock Outstanding</div>
                                        <div className="detail">{reportSummery.ss_total_out_standing ?? "-"}</div>
                                    </div> */}
                                </div>
                            </div>
                            {/* <h2 className="report_summery_title">Total Summary</h2> */}
                            <select className="report_summery_title" style={{ margin: "0.5rem 1rem" }} onChange={summeryPartyTypeFunc} >
                                <option value="">All Party Type</option>
                                {partyTypes?.map((type) => (
                                    <option key={type._id} value={JSON.stringify(type)}>{type.party_type}</option>
                                ))}
                            </select>
                            {summeryPartyType && (
                                <div className="report_summery_body" style={{ padding: 0 }}>
                                    <div className="report_summery_left bg-color1">
                                        <div className="performance_summary_col">
                                            <div className="detail_title">Total {summeryPartyType.party_type}</div>
                                            <div className="detail">{summeryPartyTypeData?.summary_total_party ?? "-"}</div>
                                        </div>
                                    </div>
                                    <div className="report_summery_right bg-color2">
                                        <div className="performance_summary_col">
                                            <div className="detail_title">Active {summeryPartyType.party_type}</div>
                                            <div className="detail">{summeryPartyTypeData?.summary_total_active_party ?? "-"}</div>
                                        </div>
                                    </div>
                                    <div className="report_summery_right bg-color3">
                                        <div className="performance_summary_col">
                                            <div className="detail_title">Total Sale</div>
                                            <div className="detail">{summeryPartyTypeData?.summary_total_sale ?? "-"}</div>
                                        </div>
                                    </div>
                                    <div className="report_summery_right bg-color4">
                                        <div className="performance_summary_col">
                                            <div className="detail_title">Total Collection</div>
                                            <div className="detail">{summeryPartyTypeData?.summary_total_collection ?? "-"}</div>
                                        </div>
                                    </div>
                                    <div className="report_summery_right bg-color5">
                                        <div className="performance_summary_col">
                                            <div className="detail_title">Total Stock</div>
                                            <div className="detail">{summeryPartyTypeData?.summary_total_stock ?? "-"}</div>
                                        </div>
                                    </div>
                                    <div className="report_summery_right bg-color6">
                                        <div className="performance_summary_col">
                                            <div className="detail_title">Total Outstanding</div>
                                            <div className="detail">{summeryPartyTypeData?.summary_total_out_standing ?? "-"}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
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
                        <div className="pdf_selected_date">Company Performence Report ({reportSummery?.pdf_start_date || "NA"} - {reportSummery?.pdf_end_date || "NA"})</div>
                    </div>
                    <div className="pdf_head_right">
                        <div>{reportSummery?.pdf_party_type_name}</div>
                        {/* <div>{reportSummery?.pdf_employee_role}</div>
                        <div>{reportSummery?.pdf_employee_id}</div>
                        <div>{reportSummery?.pdf_employee_city}</div>
                        <div>{reportSummery?.pdf_employee_state}</div> */}
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
                        {performenceReport?.map((row, i) => (
                            <PDFStyledTableRow key={i} >
                                <PDFStyledTableCell>{((pageCount * filterData.limit) - filterData.limit) + (i + 1)}</PDFStyledTableCell>
                                {filterCols?.map(col => <PDFTCComponent data={{ row, col }} />)}
                            </PDFStyledTableRow>
                        ))}
                        <PDFStyledTableRow >
                            <PDFStyledTableCell colspan={tableCols.filter(col => col.colspan == true).length + 1} style={{ fontSize: "1.2rem", fontWeight: "bold", textAlign: "end" }}>Total</PDFStyledTableCell>
                            {tableCols[3]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_total_sale}</PDFStyledTableCell>}
                            {tableCols[4]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_total_collection}</PDFStyledTableCell>}
                            {tableCols[5]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_total_out_standing}</PDFStyledTableCell>}
                            {tableCols[6]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_total_stock}</PDFStyledTableCell>}
                            {/* {tableCols[7]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.result?.pdf_total_claim_amount}</PDFStyledTableCell>}
                            {tableCols[8]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.result?.pdf_approved_amount}</PDFStyledTableCell>} */}
                        </PDFStyledTableRow>
                    </TableBody>
                </Table>

                <div className="pdf_summery_section">
                    {reportSummery && performenceReport?.length !== 0 && (
                        <div className="mattendance_summery_section" style={{ backgroundColor: "#fff" }} >
                            <h3 className="report_summery_title" style={{ color: "#000" }}>Summery</h3>
                            <div className="report_summery_body" style={{ padding: 0, fontSize: "0.9rem" }}>
                                <div className="report_summery_left">
                                    <div className="performance_summary_col">
                                        <div className="detail_title">Total Party</div>
                                        <div className="detail">{reportSummery.distributor_total_party ?? "-"}</div>
                                    </div>
                                    <hr />
                                </div>
                                <div className="report_summery_right">
                                    <div className="performance_summary_col">
                                        <div className="detail_title">Active Party</div>
                                        <div className="detail">{reportSummery.distributor_total_active_party ?? "-"}</div>
                                    </div>
                                    <hr />
                                </div>
                                <div className="report_summery_right">
                                    <div className="performance_summary_col">
                                        <div className="detail_title">Total Sale</div>
                                        <div className="detail">{reportSummery.distributor_total_sale ?? "-"}</div>
                                    </div>
                                    <hr />
                                </div>
                                <div className="report_summery_right">
                                    <div className="performance_summary_col">
                                        <div className="detail_title">Total Collection</div>
                                        <div className="detail">{reportSummery.distributor_total_collection ?? "-"}</div>
                                    </div>
                                    <hr />
                                </div>
                                <div className="report_summery_right">
                                    <div className="performance_summary_col">
                                        <div className="detail_title">Total Stock</div>
                                        <div className="detail">{reportSummery.distributor_total_stock ?? "-"}</div>
                                    </div>
                                    <hr />
                                </div>
                                <div className="report_summery_right">
                                    <div className="performance_summary_col">
                                        <div className="detail_title">Total Outstanding</div>
                                        <div className="detail">{reportSummery.distributor_total_out_standing ?? "-"}</div>
                                    </div>
                                    <hr />
                                </div>
                            </div>
                            {/* <h2 className="report_summery_title">Total Summary</h2> */}
                            {/* <select className="report_summery_title" style={{ margin: "0.5rem 1rem" }} onChange={summeryPartyTypeFunc} >
                                <option value="">All Party Type</option>
                                {partyTypes?.map((type) => (
                                    <option key={type._id} value={JSON.stringify(type)}>{type.party_type}</option>
                                ))}
                            </select> */}
                            {summeryPartyType && (
                                <div className="report_summery_body" style={{ padding: 0 }}>
                                    <div className="report_summery_left">
                                        <div className="performance_summary_col">
                                            <div className="detail_title">Total {summeryPartyType.party_type}</div>
                                            <div className="detail">{summeryPartyTypeData?.summary_total_party ?? "-"}</div>
                                        </div>
                                    </div>
                                    <div className="report_summery_right">
                                        <div className="performance_summary_col">
                                            <div className="detail_title">Active {summeryPartyType.party_type}</div>
                                            <div className="detail">{summeryPartyTypeData?.summary_total_active_party ?? "-"}</div>
                                        </div>
                                    </div>
                                    <div className="report_summery_right">
                                        <div className="performance_summary_col">
                                            <div className="detail_title">Total Sale</div>
                                            <div className="detail">{summeryPartyTypeData?.summary_total_sale ?? "-"}</div>
                                        </div>
                                    </div>
                                    <div className="report_summery_right">
                                        <div className="performance_summary_col">
                                            <div className="detail_title">Total Collection</div>
                                            <div className="detail">{summeryPartyTypeData?.summary_total_collection ?? "-"}</div>
                                        </div>
                                    </div>
                                    <div className="report_summery_right">
                                        <div className="performance_summary_col">
                                            <div className="detail_title">Total Stock</div>
                                            <div className="detail">{summeryPartyTypeData?.summary_total_stock ?? "-"}</div>
                                        </div>
                                    </div>
                                    <div className="report_summery_right">
                                        <div className="performance_summary_col">
                                            <div className="detail_title">Total Outstanding</div>
                                            <div className="detail">{summeryPartyTypeData?.summary_total_out_standing ?? "-"}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanyPerformenceReport;