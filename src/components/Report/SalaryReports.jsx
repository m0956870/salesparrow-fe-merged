import "./Report.css";
import logo_white from "../../images/logo_1.png";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import group from "../../images/group.png";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";
import { CircularProgress, Pagination } from "@mui/material";
import { getSalary, getSalaryReport } from "../../api/reportsAPI";
// import { IoMdDownload, IoPrintSharp } from "react-icons/io"
// import { IoPrintSharp } from "react-icons/ai"

import { useRef } from "react";
import { BsFilterLeft } from "react-icons/bs"
import { saveToPdf } from "../../utils/saveToPdf";
import getStateFunc from "../../api/locationAPI";
import fetchAllEmployee from "../../api/employeeAPI";
import xlsx from "json-as-xlsx";
import { toast } from "react-toastify";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import ReactToPrint from 'react-to-print';
import { useContext } from "react";
import { AdminContext } from "../../App";
import { Avatar } from "@mui/material";
import isAllowed from "../../utils/isAllowed";
import { DYNAMIC_REPORT } from "../../constants";

const SalaryReports = () => {
  const { state } = useContext(AdminContext);
  const navigate = useNavigate();
  const pdfView = useRef(null);
  const salaryPDFView = useRef(null);
  const [isLoading, setisLoading] = useState(false);
  const [exportBtnLoading, setexportBtnLoading] = useState(false)
  const [pdfBtnLoading, setpdfBtnLoading] = useState(false)
  const [filterDivExtended, setfilterDivExtended] = useState(false);

  const [search, setSearch] = useState("");
  const [allState, setallState] = useState([]);
  const [allEmployee, setallEmployee] = useState([]);
  const [salaryReport, setsalaryReport] = useState([]);
  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState();
  const [totalDataCount, settotalDataCount] = useState();
  const [reportSummery, setreportSummery] = useState({})
  const [salary, setsalary] = useState()

  const [filterData, setfilterData] = useState({
    state: "",
    employee_id: "",
    start_date: "",
    end_date: "",
    limit: "10",
    page: pageCount,
    month: String(new Date().getMonth()).padStart(2, 0),
    year: new Date().getFullYear(),
  })

  useEffect(() => {
    getStateFunc().then((res) => setallState(res.data.result));
  }, []);
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

  const getReportFunc = async (filterData) => {
    setisLoading(true)
    if (!await isAllowed(DYNAMIC_REPORT)) {
      toast.error("Module is not purchased!");
      return setisLoading(false);
  }
    let res = await getSalaryReport(filterData)
    if (res.data.status) {
      setsalaryReport(res.data.result)
      setpageLength(res.data.pageLength)
      settotalDataCount(res.data.count)
      setreportSummery(res.data)
      setisLoading(false)
    }
  }

  const handleInput = (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value });
  };

  const stateHandleInput = async (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value });
    fetchAllEmployee({ state: e.target.value }).then((res) => {
      setallEmployee(res.data.result);
    });
  };

  const topFilterHandleInput = async (e) => {
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
      if (salaryReport.length < 1) return toast.error("Report list is empty!");
      return saveToPdf(pdfView, "Salary Report");
    }
  }

  const downloadPDFFunc = async (row) => {
    console.log(row)
    let res = await getSalary({ employee_id: row.id, month: String(new Date().getMonth() + 1).padStart(2, 0), year: new Date().getFullYear(), })
    if (res.data.status) {
      setsalary(res.data.result)
      // let interval = setInterval(() => {
      //   let salary_div = document.getElementById("salary_div")
      //   salary_div.style.display = "block"
      //   if (res.data.result) {
      saveToPdf(salaryPDFView, "Salary Slip")
      //     clearInterval(interval)
      //     setTimeout(() => {
      //       document.getElementById("salary_div").style.display = "none"
      //     }, 500);
      //   }
      // }, 1000);
    }
  }

  const printFunc = async (row) => {
    let res = await getSalary({ employee_id: row.id, month: String(new Date().getMonth() + 1).padStart(2, 0), year: new Date().getFullYear(), })
    if (res.data.status) {
      setsalary(res.data.result)
      let interval = setTimeout(() => {
        var printContents = document.getElementById("salary_div").innerHTML;
        var originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        return clearTimeout(interval)
      }, 1000);
    }
  }

  // Filter
  const [tableCols, setTableCols] = useState([
    {
      label: 'Employee Name',
      key: 'name',
      type: "row",
      active: true,
      colspan: true,
    },
    {
      label: 'Assigned State',
      key: 'state',
      type: "row",
      active: true,
      colspan: true,
    },
    {
      label: 'Working Days',
      key: 'working_days',
      type: "row",
      active: true,
    },
    {
      label: 'Leaves',
      key: 'leave',
      type: "row",
      active: true,
    },
    // {
    //   label: 'Night Stay Count',
    //   key: "night_stay",
    //   type: "row",
    //   active: true,
    // },
    {
      label: 'Holidays',
      key: 'holidays',
      type: "row",
      active: true,
    },
    {
      label: 'Absent',
      key: 'abscent',
      type: "row",
      active: true,
    },
    {
      label: 'Company Working Days',
      key: "company_working_days",
      type: "row",
      active: true,
    },
    {
      label: 'Weekly Off',
      key: 'week_off',
      type: "row",
      active: true,
    },
    {
      label: 'Gross Salary',
      key: 'gross_salary',
      type: "row",
      active: true,
    },
    {
      label: 'LOP Days',
      key: "lop_days",
      type: "row",
      active: true,
    },
    {
      label: 'LOP Deduction',
      key: 'lop_deduction',
      type: "row",
      active: true,
    },
    {
      label: 'Net Salary',
      key: "net_salary",
      type: "row",
      active: true,
    },
    {
      label: 'Salary (Deduction)',
      key: 'deduction',
      type: "row",
      active: true,
    },
    {
      label: 'Net Payable',
      key: 'net_payable',
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
          <div className="map_listing_assigned_col">
            <NavLink to={`/salary_slip/${row.id}`} style={{ textDecoration: "none" }}>Salary Slip</NavLink>
            <span onClick={() => downloadPDFFunc(row)} style={{ marginLeft: "0.5rem", color: "var(--main-color)" }} ><DownloadIcon /></span>
            {/* <span style={{ marginLeft: "0.5rem", color: "var(--main-color)" }} ><PrintIcon /></span> */}
            <span onClick={() => printFunc(row)}
              style={{ marginLeft: "0.5rem", color: "var(--main-color)" }} ><PrintIcon /></span>
            {/* <span style={{ marginLeft: "0.5rem", color: "var(--main-color)" }} >
              <ReactToPrint
                trigger={() => {
                  return <PrintIcon />;
                }}
                content={async () => salaryPDFView.current}
              />
            </span> */}
          </div>
        </StyledTableCell >
      )
    }
    return <StyledTableCell>{row[col.key]}</StyledTableCell>;
  }
  const PDFTCComponent = ({ data }) => {
    let { row, col } = data;
    if (col.type === "row") {
      return <PDFStyledTableCell>{row[col.key]}</PDFStyledTableCell>;
    }
  }

  // Export
  let settings = {
    fileName: "Salary Reports of All Employee", // Name of the resulting spreadsheet
    extraLength: 3, // A bigger number means that columns will be wider
    writeMode: 'writeFile', // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
    writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
    RTL: false, // Display the columns from right-to-left (the default value is false)
  }

  const exportFunc = () => {
    // console.log(allEmployee);
    if (salaryReport.length < 1) {
      return toast.error("Report list is empty!")
    }
    let data = [
      {
        sheet: "Adults",
        columns: [
          { label: "ID", value: (row) => row.id ? row.id : "" },
          { label: "Employee_Name", value: (row) => row.employeeName || "" },
        ],
        content: salaryReport
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


  // Month & Year Filter
  const monthsArr = [
    { name: "January", value: "01" },
    { name: "February", value: "02" },
    { name: "March", value: "03" },
    { name: "April", value: "04" },
    { name: "May", value: "05" },
    { name: "June", value: "06" },
    { name: "July", value: "07" },
    { name: "August", value: "08" },
    { name: "September", value: "09" },
    { name: "October", value: "10" },
    { name: "November", value: "11" },
    { name: "December", value: "12" },
  ]

  const yearsArr = [];
  const defaultYear = 2020;
  const currentYear = new Date().getFullYear();

  function getAllYears() {
    for (let i = defaultYear; i <= currentYear; i++) {
      yearsArr.push(i);
    }
  }
  getAllYears();

  return (
    <div className="container">
      <div className="beat_heading">
        <div className="beat_left">
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Salary Reports of All Employee</div>
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
          {/* <select name="employee_id" onChange={handleInput} 
              <option value="">All Employees</option>
            {allEmployee.length === 0 && <option disabled value="">No Employee Found</option>}
            {allEmployee?.map((employee) => (
              <option value={employee?.id} >
                {employee?.employeeName}
              </option>
            ))}
          </select> */}
          <select value={filterData.month} name="month" onClick={() => console.log(new Date().getFullYear(), Number(filterData.year))} onChange={handleInput} >
            <option value="">Months</option>
            {monthsArr?.map(month => (
              <>
                {new Date().getFullYear() > Number(filterData.year)
                  ? <option key={month.value} value={month.value}>{month.name}</option >
                  : new Date().getFullYear() === Number(filterData.year) && new Date().getMonth() + 1 > Number(month.value)
                    ? <option key={month.value} value={month.value}>{month.name}</option>
                    : null}
              </>
            ))}
          </select>
          <select value={filterData.year} name="year" onChange={handleInput} >
            <option value="">Year</option>
            {yearsArr?.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          {/* <input
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
          /> */}
          <div className="view_btn" onClick={() => getReportFunc(filterData)}>View</div>
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
        <div style={{ margin: "auto", }}        >
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
                {salaryReport?.map((row, i) => (
                  <StyledTableRow key={i} >
                    <StyledTableCell>{((pageCount * filterData.limit) - filterData.limit) + (i + 1)}</StyledTableCell>
                    {filterCols?.map(col => <TCComponent data={{ row, col }} />)}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {salaryReport?.length !== 0 && (
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

          {salaryReport?.length === 0 && (
            <div className="no_data">
              No Data
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
            <div className="pdf_selected_date">Salary Reports of All Employee ({reportSummery?.pdf_start_date || "NA"} - {reportSummery?.pdf_end_date || "NA"})</div>
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
            {salaryReport?.map((row, i) => (
              <PDFStyledTableRow key={i} >
                <PDFStyledTableCell>{((pageCount * filterData.limit) - filterData.limit) + (i + 1)}</PDFStyledTableCell>
                {filterCols?.map(col => <PDFTCComponent data={{ row, col }} />)}
              </PDFStyledTableRow>
            ))}
            <PDFStyledTableRow >
              <PDFStyledTableCell colspan={tableCols.filter(col => col.colspan == true).length + 1} style={{ fontSize: "1.2rem", fontWeight: "bold", textAlign: "end" }}>Total</PDFStyledTableCell>
              {tableCols[2]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_working_days}</PDFStyledTableCell>}
              {tableCols[3]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_leave}</PDFStyledTableCell>}
              {tableCols[4]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_holidays}</PDFStyledTableCell>}
              {tableCols[5]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_abscent}</PDFStyledTableCell>}
              {tableCols[6]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_company_working_days}</PDFStyledTableCell>}
              {tableCols[7]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_weekly_off}</PDFStyledTableCell>}
              {tableCols[8]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_gross}</PDFStyledTableCell>}
              {tableCols[9]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_lop_days}</PDFStyledTableCell>}
              {tableCols[10]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_lop_deduction}</PDFStyledTableCell>}
              {tableCols[11]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_net_salary}</PDFStyledTableCell>}
              {tableCols[12]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_salary_deduction}</PDFStyledTableCell>}
              {tableCols[13]?.active && <PDFStyledTableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{reportSummery?.pdf_net_payable}</PDFStyledTableCell>}
            </PDFStyledTableRow>
          </TableBody>
        </Table>
        {/* <div className="pdf_summery_section"></div> */}
      </div>

      {/* salary ui */}
      {salary && (
        <div ref={salaryPDFView} id="salary_div" style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }} className="ss_section">
          <div>
            <div className="slip-header">
              <div className="Slip_logo">
                <img src={logo_white} alt="icon" />
              </div>
              <div className="slip-date">
                <p>Payslip for the months</p>
                <h4>{salary?.pay_period}</h4>
              </div>
            </div>
          </div>
          <hr />
          <div className="container">
            <div className="slip-row">
              <div className="slip-col">
                <h3>Employee summmary</h3>
                <div className="">
                  <div className="slip-detail ">
                    <h4>Employee Name</h4>:<h3>{salary?.pay_period}</h3>
                  </div>
                  <div className="slip-detail ">
                    <h4>Employee ID</h4>:<h3>{salary?.employee_id}</h3>
                  </div>
                  <div className="slip-detail ">
                    <h4>Pay Period</h4>:<h3>{salary?.pay_period}</h3>
                  </div>
                  <div className="slip-detail ">
                    <h4>Pay Date</h4>:<h3>{salary?.pay_date}</h3>
                  </div>
                  <div className="slip-detail ">
                    <h4>Designation</h4>:<h3>{salary?.designation}</h3>
                  </div>
                  <div className="slip-detail ">
                    <h4>PF No.</h4>:<h3>{salary?.pf_no}</h3>
                  </div>
                  <div className="slip-detail ">
                    <h4>ESI</h4>:<h3>{salary?.esi_no}</h3>
                  </div>
                </div>
              </div>
              <div className="slip-col">
                <div className="salary-box">
                  <div className="salary-amt">
                    <div className="ruppee">
                      <p>&#x20b9; {salary?.net_salary}</p>
                    </div>
                    <p className="ruppee-p">Employee Net Salary</p>
                  </div>
                  <hr />
                  <div className="slip-detail ">
                    <h3 style={{ width: "100px" }}>Paid Days</h3>:<h3>{salary?.paid_days}</h3>
                  </div>
                  <div className="slip-detail ">
                    <h3 style={{ width: "100px" }}>LOP Days</h3>:<h3>{salary?.lop_days}</h3>
                  </div>
                </div>
                <div className="slip-detail ">
                  <h4>Account No</h4>:<h3>{salary?.account_number}</h3>
                </div>
                <div className="slip-detail ">
                  <h4>Bank Name</h4>:<h3>{salary?.bank_name}</h3>
                </div>
                <div className="slip-detail ">
                  <h4>IFSC Code</h4>:<h3>{salary?.ifsc}</h3>
                </div>
              </div>
            </div>
            <hr />
            <div className="salary-desc-box">
              <div className="salary-desc-head">
                <div className="salary-desc-row">
                  <h3>EARNINGS</h3>
                  <h3>AMOUNT</h3>
                </div>
                <div className="salary-desc-row">
                  <h3>DEDUCTION</h3>
                  <h3>AMOUNT</h3>
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div className="salary-details">
                  <div className="slip-detail salary-desc">
                    <h3>Basic</h3><h3>&#x20b9;{salary?.basic}</h3>
                  </div>
                  <div className="slip-detail salary-desc ">
                    <h3>House Rent Allowance</h3><h3>&#x20b9;{salary?.house_rent}</h3>
                  </div>
                  <div className="slip-detail salary-desc ">
                    <h3>Other Earnings</h3><h3>&#x20b9;{salary?.other_earning}</h3>
                  </div>
                </div>
                <div className="salary-details">
                  <div className="slip-detail salary-desc ">
                    <h3>Income Tax</h3><h3>&#x20b9;{salary?.income_tax}</h3>
                  </div>
                  <div className="slip-detail salary-desc ">
                    <h3>Provident Fund</h3><h3>&#x20b9;{salary?.pf}</h3>
                  </div>
                  <div className="slip-detail salary-desc ">
                    <h3></h3><h3></h3>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", backgroundColor: "#c9e3ef" }}>
                <div className="slip-detail salary-desc salary-details ">
                  <h3>Geoss Earnings</h3><h3>&#x20b9;{salary?.gross}</h3>
                </div>
                <div className="slip-detail salary-desc salary-details">
                  <h3>Total Deduction</h3><h3>&#x20b9;{salary?.deduction}</h3>
                </div>
              </div>
            </div>
            <div className="salary-desc-box">
              <div style={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
                <div>
                  <h3>TOTAL NET PAYABLE</h3>
                  <p>Gross Earnings - Total Deduction</p>
                </div>
                <h2>&#x20b9; {salary?.net_salary}</h2>
              </div>
            </div>
          </div>
        </div>
      )}
    </div >
  );
};

export default SalaryReports;