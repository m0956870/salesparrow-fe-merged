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
import { editPaymentStatus, getCollectionReport } from "../../api/reportsAPI";
import fetchAllParty, { getPartyType } from "../../api/partyAPI";

import { useRef } from "react";
import { BsFilterLeft } from "react-icons/bs";
import { saveToPdf } from "../../utils/saveToPdf";
import getStateFunc from "../../api/locationAPI";
import fetchAllEmployee from "../../api/employeeAPI";
import xlsx from "json-as-xlsx";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@mui/material";
import isAllowed from "../../utils/isAllowed";
import { COLLECTION_MANAGEMENT } from "../../constants";

const CollectionApproval = () => {
    const navigate = useNavigate()
    const [isLoading, setisLoading] = useState(false);

    const pdfView = useRef(null);
    const [filterDivExtended, setfilterDivExtended] = useState(false);
    const [exportBtnLoading, setexportBtnLoading] = useState(false)
    const [pdfBtnLoading, setpdfBtnLoading] = useState(false)

    const [search, setSearch] = useState("");
    const [partyTypes, setpartyTypes] = useState()
    const [allParty, setallParty] = useState([]);
    const [allState, setallState] = useState([]);
    const [allEmployee, setallEmployee] = useState([]);

    const [collectionReport, setcollectionReport] = useState([]);
    const [reportSummery, setreportSummery] = useState({})
    const [pageCount, setpageCount] = useState(1);
    const [pageLength, setpageLength] = useState();
    const [totalDataCount, settotalDataCount] = useState();

    const [approvedAmount, setapprovedAmount] = useState("")
    const [approveAmtPopup, setapproveAmtPopup] = useState(false);
    const [currentReport, setcurrentReport] = useState({});
    const [attachmentPopup, setattachmentPopup] = useState(false)

    const [filterData, setfilterData] = useState({
        party_type_id: "",
        party_id: "",
        page: pageCount,
        state: "",
        employee_id: "",
        start_date: "",
        end_date: "",
        limit: "10",
    })

    useEffect(() => {
        getPartyType().then(res => setpartyTypes(res.data.result))
        fetchAllParty().then(res => setallParty(res.data.result))
        getStateFunc().then((res) => setallState(res.data.result));
    }, [])
    useEffect(() => {
        collectionReportFunc({ ...filterData, page: pageCount })
    }, [pageCount]);

    useEffect(() => {
        if (search !== "") {
            let ID = setTimeout(() => {
                collectionReportFunc({ ...filterData, search })
            }, 1000);

            return () => clearTimeout(ID);
        }
    }, [search]);

    const collectionReportFunc = async (filterData) => {
        setisLoading(true)
        if (!await isAllowed(COLLECTION_MANAGEMENT)) {
            toast.error("Module is not purchased!");
            return setisLoading(false);
        }
        let { data } = await getCollectionReport(filterData)
        if (data.status) {
            setcollectionReport(data.result)
            setpageLength(data.pageLength);
            settotalDataCount(data.count);
            Object.keys(data).map(key => setreportSummery(reportSummery => {
                if (key !== "result") return { ...reportSummery, [key]: data[key] }
            }))
            return setisLoading(false)
        }
        console.log("Server Error")
    }

    const editStatusFunc = async (status, row, amt) => {
        if (Number(currentReport?.data?.claim_amount) < Number(approvedAmount)) return toast.error("Approval Amount Must Be Less Than Submitted Amount!")
        setisLoading(true);
        let res = await editPaymentStatus({ id: row?.id || currentReport?.id, approval_status: status, approved_amount: approvedAmount || amt });
        if (res.data.status) {
            toast.success("Report Edited Successfully!");
            setapproveAmtPopup(false)
            collectionReportFunc(filterData)
            setisLoading(false)
            setapprovedAmount(0)
            return;
        }
        console.log("Error");
    };

    const handleInput = (e) => {
        setfilterData({ ...filterData, [e.target.name]: e.target.value });
    }
    const stateHandleInput = (e) => {
        setfilterData({ ...filterData, [e.target.name]: e.target.value });
        fetchAllEmployee({ state: e.target.value }).then(res => setallEmployee(res.data.result));
    }
    const filterFunc = () => {
        collectionReportFunc(filterData)
    }

    const topFilterHandleInput = (e) => {
        setfilterData({ ...filterData, [e.target.name]: e.target.value })
        collectionReportFunc({ ...filterData, [e.target.name]: e.target.value })
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
            if (collectionReport.length < 1) return toast.error("Report list is empty!");
            return saveToPdf(pdfView, "Monthly Expense Report (All Employee)");
        }
    }

    // Export
    let settings = {
        fileName: "Collection Approval Report", // Name of the resulting spreadsheet
        extraLength: 3, // A bigger number means that columns will be wider
        writeMode: 'writeFile', // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
        writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
        RTL: false, // Display the columns from right-to-left (the default value is false)
    }

    const exportFunc = () => {
        // console.log(allEmployee);
        if (collectionReport.length < 1) return toast.error("Report list is empty!");

        let data = [
            {
                sheet: "Adults",
                columns: [
                    { label: "ID", value: (row) => row.id || "" },
                    { label: "Party Name", value: (row) => row.party_id || "" },
                    { label: "Party Type", value: (row) => row.party_type_id || "" },
                    { label: "Payment Mode", value: (row) => row.payment_mode || "" },
                    { label: "Collected By", value: (row) => row.collected_by || "" },
                    { label: "Date", value: (row) => row.claim_date || "" },
                    { label: "Amount", value: (row) => row.amount || "" },
                ],
                content: collectionReport
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
            type: "row",
            active: true,
        },
        {
            label: 'Party Type',
            key: 'party_type',
            type: "row",
            active: true,
        },
        {
            label: 'Payment Mode',
            key: 'payment_mode',
            type: "row",
            active: true,
        },
        {
            label: 'Collected By',
            key: "collected_by",
            type: "row",
            active: true,
        },
        {
            label: 'Date',
            key: 'date',
            type: "row",
            active: true,
        },
        {
            label: "Amount",
            key: "amount",
            type: "row",
            active: true,
        },
        {
            label: 'Status',
            key: "approval_status",
            type: "component",
            active: true,
        },
    ]);

    let filterCols = tableCols.filter(col => col.active);
    const toogleTableCol = (key) => {
        // if (key === "emp_name") return;
        const temp = tableCols.map(col => {
            if (col.key === key) return { ...col, active: !col.active }
            return col;
        })
        setTableCols(temp)
    }

    const TCComponent = ({ data }) => {
        let { row, col } = data;
        if (col.type === "row") {
            return <StyledTableCell>{row[col.key]}</StyledTableCell>;
        } else if (col.type === "component") {
            return <StyledTableCell>
                <div className={`${row?.approval_status === "Approved" ? "active_beat" : "inactive_beat"}`} >
                    <select name="day"
                        onChange={(e) => {
                            setcurrentReport(row);
                            if (e.target.value === "Approved") {
                                setapprovedAmount(row?.amount);
                                editStatusFunc(e.target.value, row, row?.amount)
                            } else if (e.target.value === "Reject") {
                                setapprovedAmount("0");
                                editStatusFunc(e.target.value, row, "0")
                            } else {
                                setapprovedAmount(row?.amount);
                                setapproveAmtPopup(true);
                            }
                        }}>
                        <option value="">{row?.approval_status}</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Reject">Reject</option>
                    </select>
                </div>
            </StyledTableCell >
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

    return (
        <div className="container">
            <div className="beat_heading">
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">Collection Approval</div>
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
                    <select name="party_id" onChange={handleInput}>
                        <option value="">All Party</option>
                        {allParty.length === 0 && <option disabled value="">No Party Found</option>}
                        {allParty?.map((party) => (
                            <option value={party?.id}>{party?.firmName} </option>
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
                        onClick={() => collectionReportFunc(filterData)}
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
                <div className="" ref={pdfView}>
                    <div className="table_scroll_container">
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>S. No.</StyledTableCell>
                                    {filterCols?.map(col => <StyledTableCell>{col.label}</StyledTableCell>)}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {collectionReport?.map((row, i) => (
                                    <StyledTableRow key={i} >
                                        <StyledTableCell>{((pageCount * filterData.limit) - filterData.limit) + (i + 1)}</StyledTableCell>
                                        {filterCols?.map(col => <TCComponent data={{ row, col }} />)}
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {collectionReport?.length !== 0 && (
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

                    {collectionReport?.length === 0 && (
                        <div className="no_data">
                            No Data
                        </div>
                    )}

                    {reportSummery && collectionReport?.length !== 0 && (
                        <div className="mattendance_summery_section">
                            <h2 className="report_summery_title">Summery</h2>
                            <div className="report_summery_body">
                                <div className="report_summery_left">
                                    <div className="summery_column">
                                        <div className="detail_title">Total Collection Amount:</div>
                                        <div className="detail">₹{reportSummery.total_collection_amount}</div>
                                    </div>
                                    <div className="summery_column">
                                        <div className="detail_title">Total Approved Amount:</div>
                                        <div className="detail">₹{reportSummery.total_approved_amount}</div>
                                    </div>
                                </div>
                                <div className="report_summery_right">
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <Dialog
                open={approveAmtPopup}
                aria-labelledby="form-dialog-title"
                maxWidth="xs"
                fullWidth={true}
                onClose={() => setapproveAmtPopup(false)}
            >
                <div className="approve_popup_container">
                    <DialogContent className="cardpopup_content">
                        <div style={{ fontWeight: 600 }} >Submitted Amount</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <input
                                type="text"
                                value={currentReport?.data?.total_claim_amount}
                                disabled
                                onChange={(e) => {
                                    if (isNaN(e.target.value.trim())) return;
                                    else if (e.target.value.trim().includes(".")) return;
                                    setapprovedAmount(e.target.value)
                                }} />
                        </div>
                        <div style={{ fontWeight: 600 }} >Enter Approved Amount</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <input
                                type="text"
                                value={approvedAmount}
                                onChange={(e) => {
                                    if (isNaN(e.target.value.trim())) return;
                                    else if (e.target.value.trim().includes(".")) return;
                                    setapprovedAmount(e.target.value)
                                }} />
                        </div>
                        <div
                            className="employee_gl_popup"
                            style={{ marginTop: "1rem" }}
                            onClick={() => editStatusFunc("Approved")}
                        >
                            Submit
                        </div>
                    </DialogContent>
                </div>
            </Dialog>
        </div>
    );
};

export default CollectionApproval;