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
import { getRetailer, getSecOrders } from "../../api/reportsAPI";

import { useRef } from "react";
import { BsFilterLeft } from "react-icons/bs"
import { saveToPdf } from "../../utils/saveToPdf";
import getStateFunc from "../../api/locationAPI";
import fetchAllEmployee from "../../api/employeeAPI";
import xlsx from "json-as-xlsx";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import fetchAllBeat from "../../api/beatAPI";
import { useContext } from "react";
import { AdminContext } from "../../App";
import { Avatar } from "@mui/material";
import isAllowed from "../../utils/isAllowed";
import { SECONDARY_ORDER_MANAGEMENT } from "../../constants";

const SecondaryOrders = () => {
  const { state } = useContext(AdminContext);
  const navigate = useNavigate()
  const [isLoading, setisLoading] = useState(false);

  const pdfView = useRef(null);
  const [filterDivExtended, setfilterDivExtended] = useState(false);
  const [exportBtnLoading, setexportBtnLoading] = useState(false)
  const [pdfBtnLoading, setpdfBtnLoading] = useState(false)

  const [search, setSearch] = useState("");
  const [allState, setallState] = useState([]);
  const [allEmployee, setallEmployee] = useState([]);
  const [allBeats, setallBeats] = useState([])
  const [secReport, setsecReport] = useState([]);
  const [reportSummery, setreportSummery] = useState({})
  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState();
  const [empSelected, setempSelected] = useState(false)
  const [totalDataCount, settotalDataCount] = useState();

  const [filterData, setfilterData] = useState({
    employee_id: "",
    beat_id: "",
    party_id: "",
    state: "",
    start_date: "",
    end_date: "",
    limit: "10",
    page: pageCount,
  })

  useEffect(() => {
    getStateFunc().then((res) => setallState(res.data.result));
    fetchAllBeat().then(res => setallBeats(res.data.result));
  }, []);

  useEffect(() => {
    if (filterData.employee_id) {
      getSecDataFunc({ ...filterData, page: pageCount })
    }
  }, [pageCount]);

  useEffect(() => {
    if (search !== "") {
      let ID = setTimeout(() => {
        getSecDataFunc({ ...filterData, search })
      }, 1000);

      return () => clearTimeout(ID);
    }
  }, [search]);

  const getSecDataFunc = async (filterData) => {
    setisLoading(true)
    if (!await isAllowed(SECONDARY_ORDER_MANAGEMENT)) {
        toast.error("Module is not purchased!");
        return setisLoading(false);
    }

    if (filterData.employee_id === "") {
      return toast.error("Please Select Employee First")
    }
    setisLoading(true)
    let { data } = await getSecOrders(filterData)
    // console.log(data);
    if (data.status) {
      setsecReport(data.result.list)
      setpageLength(data.pageLength);
      settotalDataCount(data.result?.count);
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

  const stateHandleInput = async (e) => {
    fetchAllEmployee({ state: e.target.value }).then((res) => {
      setallEmployee(res.data.result);
    })
    fetchAllBeat({ state: e.target.value }).then(res => setallBeats(res.data.result));
  };

  const filterFunc = () => {
    getSecDataFunc(filterData)
  }

  const employeeHandleInput = async (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value });
    fetchAllBeat({ employee_id: e.target.value }).then(res => setallBeats(res.data.result));
  }

  const topFilterHandleInput = (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value })
    getSecDataFunc({ ...filterData, [e.target.name]: e.target.value })
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
      if (secReport.length < 1) return toast.error("Report list is empty!");
      return saveToPdf(pdfView, "Secondary Orders");
    }
  }

  // Export
  let settings = {
    fileName: "Secondary Orders", // Name of the resulting spreadsheet
    extraLength: 3, // A bigger number means that columns will be wider
    writeMode: 'writeFile', // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
    writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
    RTL: false, // Display the columns from right-to-left (the default value is false)
  }

  const exportFunc = () => {
    // console.log(allEmployee);
    if (secReport.length < 1) return toast.error("Report list is empty!");

    let data = [
      {
        sheet: "Adults",
        columns: [
          { label: "Date", value: (row) => row.order_date || "" },
          { label: "Customer Type", value: (row) => row.customer_type || "" },
          { label: "Customer Name", value: (row) => row.retailer || "" },
          { label: "Beat Name", value: (row) => row.beat_name || "" },
          { label: "Order By", value: (row) => row.order_by || "" },
          { label: "Order Amount", value: (row) => row.total_amount || "" },
          { label: "Delivery Status", value: (row) => row.delivery_status || "" },
        ],
        content: secReport
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
      label: 'Date',
      key: 'order_date',
      type: "value",
      active: true,
      colspan: true,
    },
    {
      label: 'Customer Type',
      key: 'customer_type',
      type: "value",
      active: true,
      colspan: true
    },
    {
      label: 'Customer Name',
      key: "retailer",
      type: "value",
      active: true,
      colspan: true
    },
    {
      label: 'Beat Name',
      key: "beat_name",
      type: "value",
      active: true,
      colspan: true
    },
    {
      label: 'Order By',
      key: "order_by",
      type: "value",
      active: true,
      colspan: true
    },
    {
      label: 'Order Amount',
      key: "total_amount",
      type: "value",
      active: true,
    },
    {
      label: 'Delivery Status',
      key: "delivery_status",
      type: "component",
      active: true,
    },
    {
      label: 'Actions',
      key: "emp_id",
      type: "link",
      value: "View Order",
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
        <div className={`${row[col.key] === "Delivered" ? "active_beat" : row[col.key] === "Cancelled" ? "yellow_beat" : "inactive_beat"}`}>
          {row[col.key]}
        </div>
      </StyledTableCell >
    } else if (col.type === "link") {
      return (
        <StyledTableCell>
          <div onClick={() => navigate(`/view_secondary_order/${row.order_id}`, { state: { row } })} className="map_listing_assigned_col">
            <NavLink to="">{col.value}</NavLink>
          </div>
        </StyledTableCell>
      )
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
          <div className="title">Secondary Orders</div>
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
          <select
            name="employee_id"
            onChange={employeeHandleInput}
          >
            <option value="">All Employees</option>
            {allEmployee.length === 0 && <option disabled value="">No Employee Found</option>}
            {allEmployee?.map((employee) => (
              <option value={employee?.id} >
                {employee?.employeeName}
              </option>
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
          <div
            className="view_btn"
            onClick={() => getSecDataFunc(filterData)}
          >
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


      {isLoading ? (
        <div
          style={{
            margin: "auto",
          }}
        >
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
                {secReport?.map((row, i) => (
                  <StyledTableRow key={i} >
                    <StyledTableCell>{((pageCount * filterData.limit) - filterData.limit) + (i + 1)}</StyledTableCell>
                    {filterCols?.map(col => <TCComponent data={{ row, col }} />)}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {secReport?.length !== 0 && (
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
              Select Employee
            </div>
          )}
          {empSelected == true && secReport?.length === 0 && (
            <div className="no_data">
              No Data
            </div>
          )}

          {reportSummery && secReport?.length !== 0 && (
            <div className="mattendance_summery_section" style={{ backgroundColor: "#f0cfcf" }} >
              {/* <h2 className="report_summery_title">Summery</h2> */}
              <div className="report_summery_body">
                <div className="report_summery_left">
                  <div className="summery_column">
                    <div className="detail_title">Total Orders:</div>
                    <div className="detail">{reportSummery.total_orders}</div>
                  </div>
                  <div className="summery_column">
                    <div className="detail_title">Delivered Orders:</div>
                    <div className="detail">{reportSummery.delivered_orders}</div>
                  </div>
                </div>
                <div className="report_summery_right">
                  <div className="summery_column">
                    <div className="detail_title">Pending Orders:</div>
                    <div className="detail">{reportSummery.pending_order}</div>
                  </div>
                  <div className="summery_column">
                    <div className="detail_title">Cancelled Orders:</div>
                    <div className="detail">{reportSummery.cancelled_order}</div>
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
            <div className="pdf_selected_date">Secondary Orders ({reportSummery?.pdf_start_date || "NA"} - {reportSummery?.pdf_end_date || "NA"})</div>
          </div>
          <div className="pdf_head_right">
            <div>{reportSummery?.pdf_emp_name}</div>
            <div>{reportSummery?.pdf_emp_role}</div>
            <div>{reportSummery?.pdf_emp_code}</div>
            <div>{reportSummery?.pdf_emp_city}</div>
            <div>{reportSummery?.pdf_emp_state}</div>
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
            {secReport?.map((row, i) => (
              <PDFStyledTableRow key={i} >
                <PDFStyledTableCell>{((pageCount * filterData.limit) - filterData.limit) + (i + 1)}</PDFStyledTableCell>
                {filterCols?.map(col => <PDFTCComponent data={{ row, col }} />)}
              </PDFStyledTableRow>
            ))}
            <PDFStyledTableRow >
              <PDFStyledTableCell colspan={tableCols.filter(col => col.colspan == true).length + 1} style={{ fontSize: "1.2rem", fontWeight: "bold", textAlign: "end" }}>Total</PDFStyledTableCell>
              {tableCols[5]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_total_amount}</PDFStyledTableCell>}
            </PDFStyledTableRow>
          </TableBody>
        </Table>

        <div className="pdf_summery_section">
          {reportSummery && secReport?.length !== 0 && (
            <div className="mattendance_summery_section" style={{ backgroundColor: "#fff" }} >
              <h3 className="report_summery_title" style={{ color: "#000" }}>Summery</h3>
              <div className="report_summery_body">
                <div className="report_summery_left">
                  <div className="summery_column">
                    <div className="detail_title">Total Orders:</div>
                    <div className="detail">{reportSummery.total_orders}</div>
                  </div>
                  <div className="summery_column">
                    <div className="detail_title">Delivered Orders:</div>
                    <div className="detail">{reportSummery.delivered_orders}</div>
                  </div>
                </div>
                <div className="report_summery_right">
                  <div className="summery_column">
                    <div className="detail_title">Pending Orders:</div>
                    <div className="detail">{reportSummery.pending_order}</div>
                  </div>
                  <div className="summery_column">
                    <div className="detail_title">Cancelled Orders:</div>
                    <div className="detail">{reportSummery.cancelled_order}</div>
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

export default SecondaryOrders;