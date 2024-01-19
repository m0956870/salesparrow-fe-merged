import "./Employees.css";
import React, { useEffect, useState } from "react";
import group from "../../images/group.png";
import SearchIcon from "@mui/icons-material/Search";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";
import { Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";
import fetchAllEmployee, { allEmployeeTarget, deletEmpTarget, editEmpTarget } from "../../api/employeeAPI";
import { CircularProgress, Pagination } from "@mui/material";
import getStateFunc from "../../api/locationAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { useRef } from "react";
import { BsFilterLeft } from "react-icons/bs"
import { saveToPdf } from "../../utils/saveToPdf";
import xlsx from "json-as-xlsx";
import isAllowed from "../../utils/isAllowed";
import { EMPLOYEE_MANAGEMENT } from "../../constants";

const EmployeeTarget = () => {
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const [permissionAllowed, setpermissionAllowed] = useState(false)

  const pdfView = useRef(null);
  const [filterDivExtended, setfilterDivExtended] = useState(false);
  const [exportBtnLoading, setexportBtnLoading] = useState(false)
  const [pdfBtnLoading, setpdfBtnLoading] = useState(false)

  const [search, setSearch] = useState("");
  const [allState, setallState] = useState([]);
  const [stateID, setstateID] = useState("");
  const [allEmployee, setallEmployee] = useState([]);

  const [empTargetList, setempTargetList] = useState([]);
  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState();
  const [totalDataCount, settotalDataCount] = useState();

  const [deletePopup, setdeletePopup] = useState(false);
  const [currentGroup, setcurrentGroup] = useState({});

  const [filterData, setfilterData] = useState({
    state: "",
    employee_id: "",
    month: "",
    year: "",
    limit: "10",
    page: pageCount,
  })

  useEffect(() => {
    getStateFunc().then((res) => setallState(res.data.result));
  }, []);
  useEffect(() => {
    getEmployeeTargetFunc({ ...filterData, page: pageCount });
  }, [pageCount]);
  useEffect(() => {
    if (search !== "") {
      let ID = setTimeout(() => {
        getEmployeeTargetFunc({ ...filterData, search })
      }, 1000);

      return () => clearTimeout(ID);
    }
  }, [search]);

  const getEmployeeTargetFunc = async (filterData) => {
    setisLoading(true);
    if (!await isAllowed(EMPLOYEE_MANAGEMENT)) {
      setpermissionAllowed(false);
      toast.error("Module is not purchased!")
      return setisLoading(false);
    } else {
      setpermissionAllowed(true);
    }

    let res = await allEmployeeTarget(filterData);
    if (res.data.status) {
      setempTargetList(res.data.result);
      setpageLength(res.data.pageLength);
      settotalDataCount(res.data.count);
      setisLoading(false);
    } else {
      setisLoading(false);
      toast.error(res.data.message);
    }
  };

  const editEmpStatus = async (e, target_id) => {
    let data = { target_id, status: e.target.value, };
    setisLoading(true);
    let res = await editEmpTarget(data);
    if (res.data.status) {
      toast.success("Employee Target Status Edited Successfully!");
      getEmployeeTargetFunc(filterData)
    } else {
      toast.error(res.data.message);
    }
  };

  const editEmpTargetStatus = async (e, target_id) => {
    let data = { target_id, target_status: e.target.value, };
    setisLoading(true);
    let res = await editEmpTarget(data);
    if (res.data.status) {
      toast.success("Employee Target Status Edited Successfully!");
      getEmployeeTargetFunc(filterData)
    } else {
      toast.error(res.data.message);
      setisLoading(false)
    }
  };

  const deleteGroupFunc = async () => {
    let res = await deletEmpTarget(currentGroup.id);
    if (res.data.status) {
      toast.success("Employee deleted Successfully!");
      setdeletePopup(false);
      setisLoading(true);
      getEmployeeTargetFunc(filterData);
    } else {
      toast.error(res.data.message);
      setisLoading(false);
    }
  };

  const handleInput = (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value });
  }
  const stateHandleInput = (e) => {
    fetchAllEmployee({ state: e.target.value }).then(res => setallEmployee(res.data.result));
  }
  const filterFunc = () => {
    getEmployeeTargetFunc(filterData)
  }

  const topFilterHandleInput = (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value })
    getEmployeeTargetFunc({ ...filterData, [e.target.name]: e.target.value })
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
      if (empTargetList.length < 1) return toast.error("Report list is empty!");
      return saveToPdf(pdfView, "Monthly Expense Report (All Employee)");
    }
  }

  // Export
  let settings = {
    fileName: "Monthly Sales Plan", // Name of the resulting spreadsheet
    extraLength: 3, // A bigger number means that columns will be wider
    writeMode: 'writeFile', // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
    writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
    RTL: false, // Display the columns from right-to-left (the default value is false)
  }

  const exportFunc = () => {
    if (empTargetList.length < 1) {
      return toast.error("All route list is empty!")
    }
    let data = [
      {
        sheet: "Adults",
        columns: [
          { label: "ID", value: (row) => row.id ? row.id : "" },
          { label: "Beat Name", value: (row) => row.beatName ? row.beatName : "" },
          { label: "State", value: (row) => row.state.name ? row.state.name : "" },
          { label: "Employee", value: (row) => row.employee_name ? row.employee_name : "" },
          { label: "Day", value: (row) => row.day ? row.day : "" },
          { label: "Status", value: (row) => row.status ? row.status : "" },
        ],
        content: empTargetList
      },
    ]
    console.log(data);
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
      key: 'employee_name',
      type: "value",
      active: true,
    },
    {
      label: 'State',
      key: 'state_name',
      type: "value",
      active: true,
    },
    // {
    //   label: 'City',
    //   key: 'employee_name',
    //   type: "value",
    //   active: true,
    // },
    {
      label: 'Visit Plan',
      key: "total_visit",
      type: "value",
      active: true,
    },
    {
      label: 'Secondary Target',
      key: "total_secondary",
      type: "value",
      active: true,
    },
    {
      label: 'Primary Target',
      key: "total_primary",
      type: "value",
      active: true,
    },
    {
      label: 'Created By',
      key: "created_by",
      type: "value",
      active: true,
    },
    {
      label: 'Status',
      key: "status",
      type: "status",
      active: true,
    },
    {
      label: 'Action',
      key: "abscent",
      type: "action",
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
    if (col.type === "status") {
      return (
        <StyledTableCell>
          <div className={`${row.status === "Active" || row.status === "Approved" ? "active_beat" : "inactive_beat"}`}>
            <select name="day" onChange={(e) => editEmpStatus(e, row.id)}            >
              <option value="">{row.status}</option>
              <option value="Active">Active</option>
              <option value="InActive">InActive</option>
              <option value="Approved">Approved</option>
              <option value="UnApproved">UnApproved</option>
            </select>
          </div>
        </StyledTableCell>
      )
    } else if (col.type === "action") {
      return (
        <StyledTableCell style={{ whiteSpace: "nowrap" }} >
          <BorderColorIcon
            onClick={() => navigate("/edit_employee_target", { state: row })}
            style={{ fontSize: "1rem", color: "var(--main-color)", marginLeft: "0.5rem", }}
          />
          <DeleteIcon
            style={{ fontSize: "1rem", color: "red", marginLeft: "0.5rem", }}
            className="emp_grp_icons"
            onClick={() => {
              setdeletePopup(true);
              setcurrentGroup(row);
            }}
          />
        </StyledTableCell>
      )
    }
    return <StyledTableCell>{row[col.key]}</StyledTableCell>;
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

  const yearsArr = []
  const defaultYear = 2023
  const currentYear = new Date().getFullYear()

  function getAllYears() {
    for (let i = defaultYear; i <= currentYear; i++) {
      yearsArr.push(i)
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
          <div className="title">Employee Target</div>
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
          {/* <div className="add_btn" onClick={() => navigate("/add_employee_target")}          >
            Add New
          </div> */}
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
          <select value={filterData.month} name="month" onChange={handleInput} >
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
          </select>
          <div className="view_btn_2" onClick={() => filterFunc()}>
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
          <div className="new_add_btn_top_filter">
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
                {permissionAllowed && <div className="add_new_side_btn" style={{ marginLeft: "1rem" }} onClick={() => navigate("/add_employee_target")}>
                  Add New
                </div>}
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
                {empTargetList?.map((row, i) => (
                  <StyledTableRow key={i} >
                    <StyledTableCell>{((pageCount * filterData.limit) - filterData.limit) + (i + 1)}</StyledTableCell>
                    {filterCols?.map(col => <TCComponent data={{ row, col }} />)}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {empTargetList?.length !== 0 && (
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

          {empTargetList?.length === 0 && (
            <div className="no_data">
              No data
            </div>
          )}
        </div>
      )}
      <Dialog
        open={deletePopup}
        aria-labelledby="form-dialog-title"
        maxWidth="xs"
        fullWidth="true"
        onClose={() => setdeletePopup(false)}
      >
        <DialogTitle className="dialog_title">
          <div>Do you want to delete this group?</div>
        </DialogTitle>
        <DialogContent className="cardpopup_content">
          <div style={{ display: "flex", gap: "1rem" }}>
            <div
              className="employee_gl_popup"
              onClick={() => setdeletePopup(false)}
            >
              Cancel
            </div>
            <div
              className="employee_gl_popup_del"
              onClick={() => deleteGroupFunc()}
            >
              Delete
            </div>
          </div>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
};

export default EmployeeTarget;
