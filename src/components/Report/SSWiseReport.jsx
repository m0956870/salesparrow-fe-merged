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
import { getCollectionReport, getSSWiseReport } from "../../api/reportsAPI";
import fetchAllParty from "../../api/partyAPI";
import { useContext } from "react";
import { AdminContext } from "../../App";
import { Avatar } from "@mui/material";

import { useRef } from "react";
import { BsFilterLeft } from "react-icons/bs"
import { saveToPdf } from "../../utils/saveToPdf";
import getStateFunc from "../../api/locationAPI";
import fetchAllEmployee from "../../api/employeeAPI";
import xlsx from "json-as-xlsx";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import isAllowed from "../../utils/isAllowed";
import { DYNAMIC_REPORT } from "../../constants";

const SSWiseReport = () => {
    const { state } = useContext(AdminContext);
    const navigate = useNavigate();
    const [isLoading, setisLoading] = useState(false);

    const pdfView = useRef(null);
    const [filterDivExtended, setfilterDivExtended] = useState(false);
    const [exportBtnLoading, setexportBtnLoading] = useState(false)
    const [pdfBtnLoading, setpdfBtnLoading] = useState(false)

    const [search, setSearch] = useState("");
    const [allState, setallState] = useState([]);
    const [allParty, setallParty] = useState([]);
    const [ssWiseReport, setssWiseReport] = useState([]);
    const [reportSummery, setreportSummery] = useState({});
    const [pageCount, setpageCount] = useState(1);
    const [pageLength, setpageLength] = useState();
    const [totalDataCount, settotalDataCount] = useState();
    const [empSelected, setempSelected] = useState(false)

    const [filterData, setfilterData] = useState({
        state: "",
        party_id: "",
        start_date: "",
        end_date: "",
        page: pageCount,
        limit: "10",
    })

    useEffect(() => {
        getStateFunc().then((res) => setallState(res.data.result));
        fetchAllParty({ partyType: "63766b79043f582fcc7a80e1" }).then(res => setallParty(res.data.result))
    }, []);
    useEffect(() => {
        if (filterData.party_id !== "") ssWiseReportFunc({ ...filterData, page: pageCount })
    }, [pageCount]);

    useEffect(() => {
        if (search !== "") {
            let ID = setTimeout(() => {
                if (filterData.party_id !== "") ssWiseReportFunc({ ...filterData, search })
            }, 1000);

            return () => clearTimeout(ID);
        }
    }, [search]);

    const ssWiseReportFunc = async (filterData) => {
        setisLoading(true)
        if (!await isAllowed(DYNAMIC_REPORT)) {
            toast.error("Module is not purchased!");
            return setisLoading(false);
        }
        let { data } = await getSSWiseReport(filterData)
        if (data.status) {
            setssWiseReport(data.result.list)
            setpageLength(data.pageLength);
            settotalDataCount(data.total_records);
            setempSelected(true)
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

    const stateHandleInput = (e) => {
        fetchAllParty({ state: e.target.value, partyType: "63766b79043f582fcc7a80e1" }).then(res => setallParty(res.data.result))
    };

    const filterFunc = () => {
        ssWiseReportFunc(filterData)
    }

    const topFilterHandleInput = (e) => {
        setfilterData({ ...filterData, [e.target.name]: e.target.value })
        ssWiseReportFunc({ ...filterData, [e.target.name]: e.target.value })
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
            if (ssWiseReport.length < 1) return toast.error("Report list is empty!");
            return saveToPdf(pdfView, "SS Wise Reports Performance");
        }
    }

    // Export
    let settings = {
        fileName: "SS Wise Report", // Name of the resulting spreadsheet
        extraLength: 3, // A bigger number means that columns will be wider
        writeMode: 'writeFile', // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
        writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
        RTL: false, // Display the columns from right-to-left (the default value is false)
    }

    const exportFunc = () => {
        // console.log(allEmployee);
        if (ssWiseReport.length < 1) return toast.error("Report list is empty!");

        let data = [
            {
                sheet: "Adults",
                columns: [
                    { label: "Distributer Name", value: (row) => row.party ?? "-" },
                    { label: "Sale", value: (row) => row.sale ?? "-" },
                    { label: "Collection", value: (row) => row.collection ?? "-" },
                    { label: "Outstanding", value: (row) => row.out_standing ?? "-" },
                    { label: "Stock", value: (row) => row.stock ?? "-" },
                ],
                content: ssWiseReport
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
            label: 'Distributer Name',
            key: 'party',
            type: "value",
            active: true,
            colspan: true,
        },
        {
            label: 'Sale',
            key: 'sale',
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
            label: 'Outstanding',
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
    let pdfFilterCols = tableCols.filter(col => col.type === "value" || col.type === "beat_row_data" || col.type === "retailer_row_data" && col.active);
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
            return <PDFStyledTableCell>{row[col.key]}</PDFStyledTableCell>
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
                    <div className="title">SS Wise Report (Performence)</div>
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
                    <select name="party_id" onChange={handleInput}>
                        <option value="">All SS</option>
                        {allParty.length === 0 && <option disabled value="">No Party Found</option>}
                        {allParty?.map((party) => (
                            <option value={party?.id} >
                                {party?.firmName}
                            </option>
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
                        className="view_btn"
                        onClick={() => ssWiseReportFunc(filterData)}
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
                <div style={{ margin: "auto", }}>
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
                                {ssWiseReport?.map((row, i) => (
                                    <StyledTableRow key={i} >
                                        <StyledTableCell>{((pageCount * filterData.limit) - filterData.limit) + (i + 1)}</StyledTableCell>
                                        {filterCols?.map(col => <TCComponent data={{ row, col }} />)}
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {ssWiseReport?.length !== 0 && (
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

                    {empSelected == false && (
                        <div className="no_data">
                            Select Party
                        </div>
                    )}
                    {empSelected == true && ssWiseReport?.length === 0 && (
                        <div className="no_data">
                            No Data
                        </div>
                    )}
                    {/* {ssWiseReport?.length === 0 && (
                        <div className="no_data">
                            No Data
                        </div>
                    )} */}

                    {reportSummery && ssWiseReport?.length !== 0 && (
                        <div className="mattendance_summery_section">
                            <h2 className="report_summery_title">Summery</h2>
                            <div className="report_summery_body">
                                <div className="report_summery_left">
                                    <div className="summery_column">
                                        <div className="detail_title">Total Distributor:</div>
                                        <div className="detail">{reportSummery.total_dealers}</div>
                                    </div>
                                    <div className="summery_column">
                                        <div className="detail_title">Total Sale:</div>
                                        <div className="detail">{reportSummery.total_sale}</div>
                                    </div>
                                    <div className="summery_column">
                                        <div className="detail_title">Total Outstanding:</div>
                                        <div className="detail">{reportSummery.total_outstanding}</div>
                                    </div>
                                    <div className="summery_column">
                                        <div className="detail_title">Total SS Stock:</div>
                                        <div className="detail">{reportSummery.total_ss_stock}</div>
                                    </div>
                                </div>
                                <div className="report_summery_right">
                                    <div className="summery_column">
                                        <div className="detail_title">Total Active Dealer:</div>
                                        <div className="detail">{reportSummery.total_dealers}</div>
                                    </div>
                                    <div className="summery_column">
                                        <div className="detail_title">Total Collection:</div>
                                        <div className="detail">{reportSummery.total_collection}</div>
                                    </div>
                                    <div className="summery_column">
                                        <div className="detail_title">Total Distributor Stock:</div>
                                        <div className="detail">{reportSummery.total_distributor_stock}</div>
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
                        <div className="pdf_selected_date">SS Wise Reports Performance ({reportSummery?.pdf_start_date || "NA"} - {reportSummery?.pdf_end_date || "NA"})</div>
                    </div>
                    <div className="pdf_head_right">
                        <div>{reportSummery?.pdf_party_name}</div>
                        <div>{reportSummery?.pdf_party_type_name}</div>
                        <div>{reportSummery?.pdf_state_name}</div>
                        {/*   <div>{reportSummery?.pdf_employee_city}</div>
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
                        {ssWiseReport?.map((row, i) => (
                            <PDFStyledTableRow key={i} >
                                <PDFStyledTableCell>{((pageCount * filterData.limit) - filterData.limit) + (i + 1)}</PDFStyledTableCell>
                                {filterCols?.map(col => <PDFTCComponent data={{ row, col }} />)}
                            </PDFStyledTableRow>
                        ))}
                        <PDFStyledTableRow >
                            <PDFStyledTableCell colspan={tableCols.filter(col => col.colspan == true).length + 1} style={{ fontSize: "1.2rem", fontWeight: "bold", textAlign: "end" }}>Total</PDFStyledTableCell>
                            {tableCols[2]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.total_sale}</PDFStyledTableCell>}
                            {tableCols[3]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.total_collection}</PDFStyledTableCell>}
                            {tableCols[4]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.total_outstanding}</PDFStyledTableCell>}
                            {tableCols[5]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.total_ss_stock}</PDFStyledTableCell>}
                        </PDFStyledTableRow>
                    </TableBody>
                </Table>

                <div className="pdf_summery_section">
                    {reportSummery && ssWiseReport?.length !== 0 && (
                        <div className="mattendance_summery_section" style={{ backgroundColor: "#fff" }} >
                            <h3 className="report_summery_title" style={{ color: "#000" }}>Summery</h3>
                            <div className="report_summery_body">
                                <div className="report_summery_left">
                                    <div className="summery_column">
                                        <div className="detail_title">Total Distributor:</div>
                                        <div className="detail">{reportSummery.total_dealers}</div>
                                    </div>
                                    <div className="summery_column">
                                        <div className="detail_title">Total Sale:</div>
                                        <div className="detail">{reportSummery.total_sale}</div>
                                    </div>
                                    <div className="summery_column">
                                        <div className="detail_title">Total Outstanding:</div>
                                        <div className="detail">{reportSummery.total_outstanding}</div>
                                    </div>
                                    <div className="summery_column">
                                        <div className="detail_title">Total SS Stock:</div>
                                        <div className="detail">{reportSummery.total_ss_stock}</div>
                                    </div>
                                </div>
                                <div className="report_summery_right">
                                    <div className="summery_column">
                                        <div className="detail_title">Total Active Dealer:</div>
                                        <div className="detail">{reportSummery.total_dealers}</div>
                                    </div>
                                    <div className="summery_column">
                                        <div className="detail_title">Total Collection:</div>
                                        <div className="detail">{reportSummery.total_collection}</div>
                                    </div>
                                    <div className="summery_column">
                                        <div className="detail_title">Total Distributor Stock:</div>
                                        <div className="detail">{reportSummery.total_distributor_stock}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div >
        </div>
    );
};

export default SSWiseReport;