import "./Employees.css";
import React, { useEffect, useState } from "react";
import group from "../../images/group.png";
// import excel_in from "../../images/excel_in.png";
// import excel_out from "../../images/excel_out.png";
import SearchIcon from "@mui/icons-material/Search";
// import VisibilityIcon from "@mui/icons-material/Visibility";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";
import { CircularProgress, Pagination } from "@mui/material";
import { Dialog, DialogActions, DialogTitle, DialogContent, } from "@mui/material";
import fetchAllEmployee, { deleteEmployee, editEmployee, importEmployees, } from "../../api/employeeAPI";

import { useRef } from "react";
import { BsFilterLeft } from "react-icons/bs"
import { saveToPdf } from "../../utils/saveToPdf";
import getStateFunc from "../../api/locationAPI";
import xlsx from "json-as-xlsx";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import isAllowed from "../../utils/isAllowed";
import { BEAT_ROUTE_MANAGEMENT } from "../../constants";

const Employees = () => {
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);

  const pdfView = useRef(null);
  const [filterDivExtended, setfilterDivExtended] = useState(false);
  const [exportBtnLoading, setexportBtnLoading] = useState(false)
  const [pdfBtnLoading, setpdfBtnLoading] = useState(false)
  const [permissionAllowed, setpermissionAllowed] = useState(false)

  const [search, setSearch] = useState("");
  const [allState, setallState] = useState([]);
  const [stateID, setstateID] = useState("");
  const [allEmployee, setallEmployee] = useState([]);
  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState();
  const [totalDataCount, settotalDataCount] = useState();

  const [deletePopup, setdeletePopup] = useState(false);
  const [currentGroup, setcurrentGroup] = useState({});

  const [filterData, setfilterData] = useState({
    state: "",
    // employee_id: "",
    start_date: "",
    end_date: "",
    limit: "10",
    page: pageCount,
  })

  useEffect(() => {
    getStateFunc().then((res) => setallState(res.data.result));
  }, []);
  useEffect(() => {
    fetchAllEmployeeFunc({ ...filterData, page: pageCount })
  }, [pageCount]);

  const fetchAllEmployeeFunc = async (filterData) => {
    setisLoading(true);

    if (!await isAllowed(BEAT_ROUTE_MANAGEMENT)) {
      setpermissionAllowed(false);
      toast.error("Module is not purchased!")
      return setisLoading(false);
    } else {
      setpermissionAllowed(true);
    }

    fetchAllEmployee(filterData).then((res) => {
      setallEmployee(res.data.result);
      setpageLength(res.data.pageLength);
      settotalDataCount(res.data.count);
      setisLoading(false);
    });
  }

  const handleInput = (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value });
  }

  const stateHandleInput = (e) => {
    setstateID(e.target.value);
    setfilterData({ ...filterData, [e.target.name]: e.target.value });
    // fetchAllEmployee({ state: e.target.value }).then(res => setallEmployee(res.data.result));
    // fetchAllEmployeeFunc({ ...filterData, [e.target.name]: e.target.value })
  }

  const filterFunc = () => {
    fetchAllEmployeeFunc(filterData)
  }

  const topFilterHandleInput = (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value })
    fetchAllEmployeeFunc({ ...filterData, [e.target.name]: e.target.value })
  }

  const editStatus = async (e, id) => {
    let data = { id, status: e.target.value, };
    setisLoading(true);
    let res = await editEmployee(data);
    if (res.data.status) {
      toast.success("Employee status edited Successfully!");
      fetchAllEmployeeFunc(filterData)
    } else {
      console.log(res.data.message);
      setisLoading(false);
    }
  };

  const deleteEmployeeFunc = async () => {
    let res = await deleteEmployee(currentGroup.id);
    if (res.data.status) {
      toast.success("Employee deleted Successfully!");
      setdeletePopup(false);
      setisLoading(true);
      fetchAllEmployeeFunc(filterData)
    } else {
      toast.error(res.data.message);
      setisLoading(false);
    }
  };

  let importFunc = async (e) => {
    const file = e.target.files[0];
    // console.log(file);
    try {
      let res = await importEmployees(file)
      console.log(res);
    } catch (error) {
      console.log(error);
    }
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
      if (allEmployee.length < 1) return toast.error("Report list is empty!");
      return saveToPdf(pdfView, "Monthly Expense Report (All Employee)");
    }
  }

  let settings = {
    fileName: "SaleSparrow Employees", // Name of the resulting spreadsheet
    extraLength: 3, // A bigger number means that columns will be wider
    writeMode: 'writeFile', // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
    writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
    RTL: false, // Display the columns from right-to-left (the default value is false)
  }

  const exportFunc = () => {
    // console.log(allEmployee);
    if (allEmployee.length < 1) {
      return toast.error("All employee list is empty!")
    }
    let data = [
      {
        sheet: "Adults",
        columns: [
          { label: "ID", value: (row) => row.id ? row.id : "" },
          { label: "Employee_Name", value: (row) => row.employeeName ? row.employeeName : "" },
          { label: "Role", value: (row) => row.role ? row.role : "" },
          { label: "Email", value: (row) => row.email ? row.email : "" },
          { label: "Phone_Number", value: (row) => row.phone ? row.phone : "" },
          // { label: "State_ID", value: (row) => row.state.id ? row.state.id : "" },
          { label: "State", value: (row) => row.state.name ? row.state.name : "" },
          // { label: "City_ID", value: (row) => row.city.id ? row.city.id : "" },
          { label: "City", value: (row) => row.city.name ? row.city.name : "" },
          { label: "Address", value: (row) => row.address ? row.address : "" },
          { label: "Pincode", value: (row) => row.pincode ? row.pincode : "" },
          { label: "Experience", value: (row) => row.experience ? row.experience : "" },
          // { label: "Headquarter_State_ID", value: (row) => row.headquarterState.id ? row.headquarterState.id : "" },
          { label: "Headquarter_State", value: (row) => row.headquarterState.name ? row.headquarterState.name : "" },
          // { label: "Headquarter_City_ID", value: (row) => row.headquarterCity.id ? row.headquarterCity.id : "" },
          { label: "Headquarter_City", value: (row) => row.headquarterCity.name ? row.headquarterCity.name : "" },
          { label: "Qualification", value: (row) => row.qualification ? row.qualification : "" },
          { label: "Profile_Image", value: (row) => row.image ? row.image : "" },
          { label: "Status", value: (row) => row.status ? row.status : "" },

          // acc details
          { label: "Bank_Name", value: (row) => row.bank_name ? row.bank_name : "" },
          { label: "Account_Number", value: (row) => row.account_no ? row.account_no : "" },
          { label: "IFSC_Code", value: (row) => row.ifsc_code ? row.ifsc_code : "" },
          { label: "ESI_Number", value: (row) => row.esi_no ? row.esi_no : "" },
          { label: "PF_Number", value: (row) => row.pf_no ? row.pf_no : "" },
        ],
        content: allEmployee
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
      key: 'employeeName',
      type: "row",
      active: true,
    },
    {
      label: 'Employee Id',
      key: 'employee_unique_id',
      type: "row",
      active: true,
    },
    {
      label: 'Employee Role',
      key: 'role',
      type: "row",
      active: true,
    },
    {
      label: 'HQ State',
      key: "name",
      type: "state_row",
      active: true,
    },
    {
      label: 'Headquarter City',
      key: "name",
      type: "hqc_row",
      active: true,
    },
    {
      label: 'Contact No.',
      key: "phone",
      type: "row",
      active: true,
    },
    {
      label: 'Email',
      key: "email",
      type: "row",
      active: true,
    },
    {
      label: 'Assigned Beat',
      key: "beats",
      type: "beat_row",
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
    if (col.type === "state_row") {
      return <StyledTableCell>{row.headquarterState?.[col.key]}</StyledTableCell>;
    } else if (col.type === "hqc_row") {
      return <StyledTableCell>{row.headquarterCity?.[col.key]}</StyledTableCell>;
    } else if (col.type === "beat_row") {
      return (
        <StyledTableCell>
          {/* {row.beats?.length === 0 ? "-" :
            row.beats?.map(beat => (
              <div>
                {beat.beat_name}
              </div>
            ))} */}
          {row.beats?.length === 0 ? "-" :
            row.beats?.length === 1 ? (
              <span>{row.beats?.[0]?.beat_name}</span>
            ) : (
              <span>{row.beats?.[0]?.beat_name}
                <span style={{ color: "var(--main-color)", fontWeight: "600", marginLeft: "0.7rem" }} >{row.beats?.length - 1}+</span>
              </span>
            )}
        </StyledTableCell>
      )
    } else if (col.type === "status") {
      return (
        <StyledTableCell>
          <div className={`${row.status == "Active" || row.status === "Approved" ? "active_beat" : "inactive_beat"}`}          >
            <select name="status" onChange={(e) => editStatus(e, row.id)} >
              <option value="">{row.status}</option>
              <option value="Active">Active</option>
              <option value="InActive">InActive</option>
              <option value="Approved">Approved</option>
              <option value="UnApproved">UnApproved</option>
            </select>
          </div>
        </StyledTableCell >
      )
    } else if (col.type === "action") {
      return (
        <StyledTableCell style={{ whiteSpace: "nowrap" }} >
          <BorderColorIcon
            onClick={() => navigate("/edit_employee", { state: row })}
            style={{ fontSize: "1rem", color: "var(--main-color)", marginLeft: "0.5rem", }}
          />
          {/* <DeleteIcon
            style={{ fontSize: "1rem", color: "red", marginLeft: "0.5rem", }}
            className="emp_grp_icons"
            onClick={() => {
              setdeletePopup(true);
              setcurrentGroup(row);
            }}
          /> */}
        </StyledTableCell>
      )
    } else {
      return <StyledTableCell>{row[col.key]}</StyledTableCell>;
    }
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

  return (
    <div className="container">
      <div className="beat_heading">
        <div className="beat_left">
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Employees</div>
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

      <div class="tracking_tabs" style={{ marginBottom: "1.5rem" }}>
        <div className="tarcking_tab_left">
          <select name="state" onChange={stateHandleInput}>
            <option value="">All States</option>
            {allState?.map((state) => (
              <option key={state.id} value={state.id}>{state.name}</option>
            ))}
          </select>
          <div
            className="view_btn"
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
          <div className="new_add_btn_top_filter" >
            <div className="top_right_filter">
              <div className="other_functionality_section" style={{ marginRight: 0 }}>
                <div className="section_options" onClick={() => filterAndExportFunc("column_filter")}>
                  <span className="filter_icon" ><BsFilterLeft size={22} /></span> Filter
                </div>
                <div className="section_options">
                  <label>
                    <span>Import</span>
                    <input type="file" accept=".xlsx, .xls, .csv" onChange={importFunc} name="file" style={{ display: "none" }} />
                  </label>
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
            {permissionAllowed && <div className="add_new_side_btn" onClick={() => navigate("/add_employees")}>
              Add New
            </div>}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ margin: "auto", }} >
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
                {allEmployee?.map((row, i) => (
                  <StyledTableRow key={i} >
                    <StyledTableCell>{((pageCount * filterData.limit) - filterData.limit) + (i + 1)}</StyledTableCell>
                    {filterCols?.map(col => <TCComponent data={{ row, col }} />)}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {allEmployee?.length !== 0 && (
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

          {allEmployee?.length === 0 && (
            <div className="no_data">
              No data
            </div>
          )}
        </div>
      )
      }
      <Dialog
        open={deletePopup}
        aria-labelledby="form-dialog-title"
        maxWidth="xs"
        fullWidth="true"
        onClose={() => setdeletePopup(false)}
      >
        <DialogTitle className="dialog_title">
          <div>Do you want to delete {currentGroup.employeeName}?</div>
        </DialogTitle>
        <DialogContent className="cardpopup_content">
          <div style={{ display: "flex", gap: "1rem" }}>
            <div className="employee_gl_popup" onClick={() => setdeletePopup(false)}>
              Cancel
            </div>
            <div className="employee_gl_popup_del" onClick={() => deleteEmployeeFunc()}>
              Delete
            </div>
          </div>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div >
  );
};

export default Employees;