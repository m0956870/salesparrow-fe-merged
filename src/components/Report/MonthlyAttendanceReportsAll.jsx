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
import { getMonthlyAttendance } from "../../api/reportsAPI";
import { CircularProgress, Pagination } from "@mui/material";

import { useRef } from "react";
import { BsFilterLeft } from "react-icons/bs";
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
import { ATTENDANCE_EXPENSE_REPORT } from "../../constants";

const MonthlyAttendanceReportsAll = () => {
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
  const [mAttendanceReport, setmAttendanceReport] = useState([]);
  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState();
  const [reportSummery, setreportSummery] = useState({})
  const [totalDataCount, settotalDataCount] = useState();

  const [filterData, setfilterData] = useState({
    state: "",
    employee_id: "",
    start_date: "",
    end_date: "",
    limit: "10",
    page: pageCount,
    // month: String(new Date().getMonth() + 1).padStart(2, 0),
    // year: Number(new Date().getFullYear()),
  })

  useEffect(() => {
    getStateFunc().then((res) => setallState(res.data.result));
  }, []);

  useEffect(() => {
    getMonthlyAttendanceFunc({ ...filterData, page: pageCount });
  }, [pageCount]);

  useEffect(() => {
    if (search !== "") {
      let ID = setTimeout(() => {
        getMonthlyAttendanceFunc({ ...filterData, search })
      }, 1000);

      return () => clearTimeout(ID);
    }
  }, [search]);

  async function getMonthlyAttendanceFunc(filterData) {
    setisLoading(true)
    if (!await isAllowed(ATTENDANCE_EXPENSE_REPORT)) {
      toast.error("Module is not purchased!");
      return setisLoading(false);
    }

    let res = await getMonthlyAttendance(filterData)
    if (res.data.status) {
      setmAttendanceReport(res.data.result)
      setpageLength(res.data.pageLength);
      settotalDataCount(res.data.count);
      setisLoading(false)
      Object.keys(res.data).map(key => setreportSummery(reportSummery => {
        if (key !== "result") return { ...reportSummery, [key]: res.data[key] }
      }))
    }
  }

  const handleInput = (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value });
  };

  const stateHandleInput = (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value });
    fetchAllEmployee({ state: e.target.value }).then(res => setallEmployee(res.data.result));
  };

  const filterFunc = () => {
    getMonthlyAttendanceFunc(filterData)
  }

  const topFilterHandleInput = (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value })
    getMonthlyAttendanceFunc({ ...filterData, [e.target.name]: e.target.value })
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
      if (mAttendanceReport.length < 1) return toast.error("Report list is empty!");
      return saveToPdf(pdfView, "Monthly Attendence Report (All Employee)");
    }
  }

  // Export
  let settings = {
    fileName: "Monthly Attendence Report (All Employee)", // Name of the resulting spreadsheet
    extraLength: 3, // A bigger number means that columns will be wider
    writeMode: 'writeFile', // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
    writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
    RTL: false, // Display the columns from right-to-left (the default value is false)
  }

  const exportFunc = () => {
    // console.log(allEmployee);
    if (mAttendanceReport.length < 1) return toast.error("Report list is empty!");

    let data = [
      {
        sheet: "Adults",
        columns: [
          { label: "ID", value: (row) => row.emp_id ? row.emp_id : "-" },
          { label: "Employee Name", value: (row) => row.emp_name ?? "-" },
          { label: "Assigned State", value: (row) => row.assigned_state ?? "-" },
          { label: "Working Days", value: (row) => row.working_days ?? "-" },
          { label: "Leaves", value: (row) => row.leave ?? "-" },
          { label: "Absent", value: (row) => row.abscent ?? "-" },
          { label: "Night Stay", value: (row) => row.night_stay ?? "-" },
          { label: "Holidays", value: (row) => row.holidays ?? "-" },
        ],
        content: mAttendanceReport
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
      label: 'Employee Name',
      key: 'emp_name',
      type: "value",
      active: true,
      colspan: true,
    },
    {
      label: 'Assigned State',
      key: 'assigned_state',
      type: "value",
      active: true,
      colspan: true,
    },
    {
      label: 'Working Days',
      key: "working_days",
      type: "value",
      active: true,
    },
    {
      label: 'Leaves',
      key: "leave",
      type: "value",
      active: true,
    },
    {
      label: 'Absent',
      key: "abscent",
      type: "value",
      active: true,
    },
    {
      label: 'Night Stay',
      key: "night_stay",
      type: "value",
      active: true,
    },
    {
      label: 'Holidays',
      key: "holidays",
      type: "value",
      active: true,
    },
    {
      label: 'Actions',
      key: "emp_id",
      type: "link",
      value: "View Report",
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
    if (col.type === "link") {
      return (
        <StyledTableCell>
          <div onClick={() => navigate("/monthly_attendance_report_single", { state: { ...row, start_date: filterData.start_date, end_date: filterData.end_date } })} className="map_listing_assigned_col">
            <NavLink to="">View Report</NavLink>
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
          <div className="title" >Monthly Attendance Report of All Employee</div>
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
          {/* <select value={filterData.month} name="month" onChange={handleInput} >
            <option value="">Months</option>
            {monthsArr?.map(month => (
              <option key={month.value} value={month.value}>{month.name}</option>
            ))}
          </select>
          <select value={filterData.year} name="year" onChange={handleInput} >
            <option value="">Year</option>
            {yearsArr?.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select> */}
          <div
            className="view_btn_2"
            onClick={() => filterFunc()}
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
        <div style={{ margin: "auto", }} >
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
                {mAttendanceReport?.map((row, i) => (
                  <StyledTableRow key={i} >
                    <StyledTableCell>{((pageCount * filterData.limit) - filterData.limit) + (i + 1)}</StyledTableCell>
                    {filterCols?.map(col => <TCComponent data={{ row, col }} />)}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {mAttendanceReport?.length !== 0 && (
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
          {mAttendanceReport?.length === 0 && (
            <div className="no_data">
              No Data
            </div>
          )}
        </div >
      )}

      {/* <div id="pdf_container" ref={pdfView}> */}
      <div id="hide_pdf_container" ref={pdfView}>
        <div className="pdf_head_section">
          <div className="pdf_head_left">
            <div className="pdf_company_logo">
              <Avatar src={state?.result?.profileImage} sx={{ height: "9rem", width: "9rem" }} />
            </div>
            <div className="pdf_selected_date">Monthly Attendence Report (All Employee) ({reportSummery?.pdf_start_date || "NA"} - {reportSummery?.pdf_end_date || "NA"})</div>
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
            {mAttendanceReport?.map((row, i) => (
              <PDFStyledTableRow key={i} >
                <PDFStyledTableCell>{((pageCount * filterData.limit) - filterData.limit) + (i + 1)}</PDFStyledTableCell>
                {filterCols?.map(col => <PDFTCComponent data={{ row, col }} />)}
              </PDFStyledTableRow>
            ))}
            <PDFStyledTableRow >
              <PDFStyledTableCell colspan={tableCols.filter(col => col.colspan == true).length + 1} style={{ fontSize: "1.2rem", fontWeight: "bold", textAlign: "end" }}>Total</PDFStyledTableCell>
              {tableCols[3]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_working_days_total}</PDFStyledTableCell>}
              {tableCols[4]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_leave_total}</PDFStyledTableCell>}
              {tableCols[5]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_absent_total}</PDFStyledTableCell>}
              {tableCols[6]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_night_stay_total}</PDFStyledTableCell>}
              {tableCols[7]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_holidays_total}</PDFStyledTableCell>}
            </PDFStyledTableRow>
          </TableBody>
        </Table>
      </div>

    </div >
  );
};

export default MonthlyAttendanceReportsAll;
