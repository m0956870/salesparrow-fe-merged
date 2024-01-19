import "./Beat.css";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import fetchAllBeat, { editBeat, deleteBeat } from "../../api/beatAPI";
import { CircularProgress, Pagination } from "@mui/material";

import { useRef } from "react";
import { BsFilterLeft } from "react-icons/bs"
import { saveToPdf } from "../../utils/saveToPdf";
import xlsx from "json-as-xlsx";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import getStateFunc, { getCityFunc } from "../../api/locationAPI";
import fetchAllRoute from "../../api/routeAPI";
// import { AdminContext } from '../../App.js';
// import usePermission fro/m "../../hooks/usePermission.js";
import isAllowed from "../../utils/isAllowed.js";
import { BEAT_ROUTE_MANAGEMENT } from "../../constants.js";

const Beat = () => {
  // const { state } = useContext(AdminContext);
  // console.log("beat state", state)
  // const permissionData = usePermission("Beat & Route Management");
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);

  const pdfView = useRef(null);
  const [filterDivExtended, setfilterDivExtended] = useState(false);
  const [exportBtnLoading, setexportBtnLoading] = useState(false)
  const [pdfBtnLoading, setpdfBtnLoading] = useState(false)
  const [permissionAllowed, setpermissionAllowed] = useState(false)

  const [allState, setallState] = useState([]);
  const [allCity, setallCity] = useState([]);
  const [allRouts, setallRouts] = useState([]);

  const [search, setSearch] = useState("");
  const [allBeat, setAllBeat] = useState([]);
  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState();
  const [totalDataCount, settotalDataCount] = useState();

  const [deletePopup, setdeletePopup] = useState(false);
  const [currentGroup, setcurrentGroup] = useState({});

  const [filterData, setfilterData] = useState({
    state: "",
    city: "",
    route: "",
    limit: "10",
    page: pageCount,
  })

  useEffect(() => {
    getStateFunc().then((res) => setallState(res.data.result));
  }, []);

  // useEffect(() => {
  //   if (state) fetchAllBeatFunc({ ...filterData, page: pageCount });
  // }, [pageCount, state]);
  useEffect(() => {
    fetchAllBeatFunc({ ...filterData, page: pageCount });
  }, [pageCount]);

  // useEffect(() => {
  //   fetchAllBeatFunc({ ...filterData, page: pageCount });
  // }, [permissionData]);
  // console.log("permissionData --------------", permissionData);

  // useEffect(() => {
  //   if (permissionData.stateLoaded) {
  //     if (permissionData.permissionAllowed) {
  //       fetchAllBeatFunc({ ...filterData, page: pageCount });
  //     } else {
  //       // toast.error("Not allowed!")
  //     }
  //   }
  // }, [pageCount, permissionData])

  useEffect(() => {
    if (search !== "") {
      let ID = setTimeout(() => {
        fetchAllBeatFunc({ ...filterData, search })
      }, 1000);

      return () => clearTimeout(ID);
    }
  }, [search]);

  const fetchAllBeatFunc = async (filterData) => {
    setisLoading(true);
    if (!await isAllowed(BEAT_ROUTE_MANAGEMENT)) {
      setpermissionAllowed(false);
      toast.error("Module is not purchased!")
      return setisLoading(false);
    } else {
      setpermissionAllowed(true);
    }

    fetchAllBeat(filterData).then((res) => {
      if (res.data.status) {
        setAllBeat(res.data.result);
        setpageLength(res.data.pageLength);
        settotalDataCount(res.data.count);
      } else {
        toast.error(res.data.message);
      }
      return setisLoading(false);
    });
  };

  // const fetchAllBeatFunc = async (filterData) => {
  //   console.log('outside')
  //   if (permissionData?.stateLoaded) {
  //     console.log('permissionData?.stateLoaded')
  //     if (permissionData?.permissionAllowed) {
  //       console.log('permissionData?.permissionAllowed')
  //       setisLoading(true);
  //       fetchAllBeat(filterData).then((res) => {
  //         if (res.data.status) {
  //           // console.log(res);
  //           setAllBeat(res.data.result);
  //           setpageLength(res.data.pageLength);
  //           settotalDataCount(res.data.count);
  //         } else {
  //           toast.error(res.data.message);
  //         }
  //         return setisLoading(false);
  //       });
  //     } else {
  //       console.log('permissionData? else')
  //       return toast.error("Module is not purchased!")
  //     }
  //   } else {
  //     console.log(' else')
  //     // fetchAllBeatFunc(filterData)
  //   }
  //   // if(!permissionData.permissionAllowed && !permissionData.permissionAllowed != "undefined") return toast.error("Permission required!")
  // };

  const editBeatStatus = async (e, id) => {
    setisLoading(true);

    let data = { id, status: e.target.value, };
    let res = await editBeat(data);
    if (res.data.status) {
      toast.success("Beat edited Successfully!");
      fetchAllBeatFunc(filterData);
    } else {
      toast.error(res.data.message);
    }
  };

  const deleteBeatFunc = async () => {
    let res = await deleteBeat(currentGroup.id);
    // console.log(res);
    if (res.data.status) {
      toast.success("Beat deleted Successfully!");
      setdeletePopup(false);
      setisLoading(true);
      fetchAllBeatFunc(filterData);
    } else {
      toast.error(res.data.message);
      setisLoading(false);
    }
  };

  const stateHandleInput = async (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value });
    getCityFunc(e.target.value).then((res) => setallCity(res.data.result));
  };

  const cityHandleInput = async (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value });
    // fetchAllRoute(null, filterData.state, e.target.value).then((res) =>
    fetchAllRoute({ state: filterData.state, city: e.target.value }).then((res) =>
      setallRouts(res.data.result)
    );
  };
  const handleInput = async (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value });
  };

  const topFilterHandleInput = (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value })
    fetchAllBeatFunc({ ...filterData, [e.target.name]: e.target.value })
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
      if (allRouts.length < 1) return toast.error("Report list is empty!");
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
    if (allRouts.length < 1) {
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
        content: allRouts
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
      label: 'Beat Name',
      key: 'beatName',
      type: "value",
      active: true,
    },
    {
      label: 'State',
      key: 'name',
      type: "state_value",
      active: true,
    },
    {
      label: 'Employee',
      key: 'employee_name',
      type: "value",
      active: true,
    },
    {
      label: 'Day',
      key: "day",
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
    if (col.type === "state_value") {
      return <StyledTableCell>{row.state?.[col.key]}</StyledTableCell>;
    } else if (col.type === "city_value") {
      return <StyledTableCell>{row.city?.[col.key]}</StyledTableCell>;
    } else if (col.type === "status") {
      return (
        <StyledTableCell>
          <div className={`${row.status === "Active" || row.status === "Approved" ? "active_beat" : "inactive_beat"}`}>
            <select name="day" onChange={(e) => editBeatStatus(e, row.id)}            >
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
          {permissionAllowed && (
            <BorderColorIcon
              onClick={() => navigate("/edit_beat", { state: row })}
              style={{ fontSize: "1rem", color: "var(--main-color)", marginLeft: "0.5rem", }}
            />
          )}
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
          <div className="title">Beat</div>
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
          {/* <div className="add_btn" onClick={() => navigate("/add_beat")}>
            Add New
          </div> */}
        </div>
      </div>

      <div class="tracking_tabs" style={{ marginBottom: "1.5rem" }}>
        <div className="tarcking_tab_left">
          <select
            name="state"
            className="select_btn new_state_select"
            onChange={stateHandleInput}
            style={{ color: "#000" }}
          >
            <option value="">All State</option>
            {allState?.map((state) => (
              <option key={state.id} value={state.id}>{state.name}</option>
            ))}
          </select>
          <select
            name="city"
            onChange={cityHandleInput}
          // onClick={() => cityClicked()}
          >
            <option value="">City</option>
            {allCity.length === 0 && <option disabled value="">No City Found</option>}
            {allCity?.map((city) => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
          <select name="route" onChange={handleInput}>
            <option value="">Route</option>
            {allRouts.length === 0 && <option disabled value="">No Routes Found</option>}
            {allRouts?.map((route) => (
              <option value={route.id}>
                {route.route_name}
              </option>
            ))}
          </select>
          <div
            className="view_btn"
            onClick={() => fetchAllBeatFunc(filterData)}
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
            {permissionAllowed && <div className="add_new_side_btn" onClick={() => navigate("/add_beat")}>
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
                {allBeat?.map((row, i) => (
                  <StyledTableRow key={i} >
                    <StyledTableCell>{((pageCount * filterData.limit) - filterData.limit) + (i + 1)}</StyledTableCell>
                    {filterCols?.map(col => <TCComponent data={{ row, col }} />)}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {allBeat?.length !== 0 && (
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

          {allBeat?.length === 0 && (
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
          <div>Do you want to delete {currentGroup.beatName}?</div>
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
              onClick={() => deleteBeatFunc()}
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

export default Beat;