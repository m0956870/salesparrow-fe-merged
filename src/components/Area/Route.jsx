// import "./Employees.css";
import React, { useEffect, useState } from "react";
import group from "../../images/group.png";
import { useNavigate } from "react-router-dom";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";
import { CircularProgress, Pagination } from "@mui/material";

// Icon
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Dialog, DialogActions, DialogTitle, DialogContent, } from "@mui/material";
import fetchAllRoute, { deleteRoute, editRoute, importRoutes } from "../../api/routeAPI";
import getStateFunc, { getCityFunc } from "../../api/locationAPI";

import { useRef } from "react";
import { BsFilterLeft } from "react-icons/bs"
import { saveToPdf } from "../../utils/saveToPdf";
import xlsx from "json-as-xlsx";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import isAllowed from "../../utils/isAllowed";
import { BEAT_ROUTE_MANAGEMENT } from "../../constants";

const Route = () => {
  const navigate = useNavigate()
  const [isLoading, setisLoading] = useState(false);

  const pdfView = useRef(null);
  const [filterDivExtended, setfilterDivExtended] = useState(false);
  const [exportBtnLoading, setexportBtnLoading] = useState(false)
  const [pdfBtnLoading, setpdfBtnLoading] = useState(false)
  const [permissionAllowed, setpermissionAllowed] = useState(false)

  const [allState, setallState] = useState([]);
  const [allCity, setallCity] = useState([]);

  const [search, setSearch] = useState("");
  const [allRouts, setallRouts] = useState([]);
  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState();
  const [totalDataCount, settotalDataCount] = useState();

  const [deletePopup, setdeletePopup] = useState(false);
  const [currentGroup, setcurrentGroup] = useState({});

  const [filterData, setfilterData] = useState({
    state: "",
    city: "",
    limit: "10",
    page: pageCount,
  })

  useEffect(() => {
    getStateFunc().then((res) => setallState(res.data.result));
  }, []);

  useEffect(() => {
    fetchAllRouteFunc({ ...filterData, page: pageCount })
  }, [pageCount]);

  useEffect(() => {
    if (search !== "") {
      let ID = setTimeout(() => {
        fetchAllRouteFunc({ ...filterData, search })
      }, 1000);

      return () => clearTimeout(ID);
    }
  }, [search]);

  const fetchAllRouteFunc = async (filterData) => {
    setisLoading(true);

    if (!await isAllowed(BEAT_ROUTE_MANAGEMENT)) {
      setpermissionAllowed(false);
      toast.error("Module is not purchased!")
      return setisLoading(false);
    } else {
      setpermissionAllowed(true);
    }

    let res = await fetchAllRoute(filterData)
    // console.log(res);
    if (res.data.status) {
      setallRouts(res.data.result);
      setpageLength(res.data.pageLength);
      settotalDataCount(res.data.count);
      setisLoading(false);
    } else {
      setisLoading(false);
      // toast.error(res.data.message);
    }
  }
  // const fetchAllRouteFunc = async (pageCount, statedID, cityID) => {
  //   try {
  //     setisLoading(true);
  //     let res = await fetchAllRoute(pageCount, statedID, cityID)
  //     // console.log(res);
  //     if (res.data.status) {
  //       setallRouts(res.data.result);
  //       setpageLength(res.data.pageLength);
  //       settotalDataCount(res.data.count);
  //       setisLoading(false);
  //     } else {
  //       setisLoading(false);
  //       // toast.error(res.data.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const [titlename, settitlename] = useState("");
  const filterSearch = allRouts?.filter((event) => {
    return (
      event.city.name.toLowerCase().indexOf(titlename.toLowerCase()) !== -1
    );
  });

  const editRouteStatus = async (e, id) => {
    // console.log(e.target.value, id);
    let data = {
      id,
      status: e.target.value,
    };
    // console.log(data);
    try {
      // setisLoading(true);
      // let res = await editRoute(data);
      // if (res.data.status) {
      //   // console.log(res);
      //   toast.success("Route edited Successfully!");
      //    fetchAllRouteFunc()
      // } else {
      //   toast.error(res.data.message);
      //   setisLoading(false);
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteRouteFunc = async () => {
    try {
      let res = await deleteRoute(currentGroup.id);
      // console.log(res);

      if (res.data.status) {
        toast.success("Route deleted Successfully!");
        setdeletePopup(false);
        setisLoading(true);
        fetchAllRouteFunc(filterData)
      } else {
        // toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInput = (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value });
  };

  const stateHandleInput = async (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value });
    getCityFunc(e.target.value).then((res) => setallCity(res.data.result));
  };

  const cityHandleInput = async (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value });
  };

  const topFilterHandleInput = (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value })
    fetchAllRouteFunc({ ...filterData, [e.target.name]: e.target.value })
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
          { label: "State", value: (row) => row.state.name ? row.state.name : "" },
          { label: "City", value: (row) => row.city.name ? row.city.name : "" },
          { label: "Area", value: (row) => row.area.name ? row.area.name : "" },
          { label: "Start_Point", value: (row) => row.start_point ? row.start_point : "" },
          { label: "End_Point", value: (row) => row.end_point ? row.end_point : "" },
          { label: "Distance", value: (row) => row.distance ? row.distance : "" },
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
      label: 'Route Name',
      key: 'route_name',
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
      label: 'City',
      key: "name",
      type: "city_value",
      active: true,
    },
    {
      label: 'Start Point',
      key: "start_point",
      type: "value",
      active: true,
    },
    {
      label: 'End Point',
      key: "end_point",
      type: "value",
      active: true,
    },
    {
      label: 'Distance',
      key: "distance",
      type: "value",
      active: true,
    },
    {
      label: 'Assigned Party',
      key: "parties",
      type: "value",
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
    } else if (col.type === "action") {
      return (
        <StyledTableCell style={{ whiteSpace: "nowrap" }} >
          {permissionAllowed && (
            <BorderColorIcon
              onClick={() => navigate("/edit_route", { state: row })}
              className="emp_grp_icons"
              style={{ fontSize: "1rem", color: "var(--main-color)", marginLeft: "0.5rem", }}
            />
          )}
          {/* <DeleteIcon
            className="emp_grp_icons"
            style={{ fontSize: "1rem", color: "red", marginLeft: "0.5rem", }}
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
          <div className="title">Route</div>
        </div>
        <div className="beat_right employee_head">
          {/* <label>
            <img src={excel_in} className="excel_icon" alt="icon" />
            <input type="file" accept=".xlsx, .xls, .csv" onChange={importFunc} name="file" style={{ display: "none" }} />
          </label> */}
          {/* <img src={excel_out} className="excel_icon" onClick={() => exportFunc()} alt="icon" /> */}
          {/* <div className="add_btn" onClick={() => navigate("/create_route")}>
              Add New
            </div> */}
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
          <div
            className="view_btn"
            onClick={() => fetchAllRouteFunc(filterData)}
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
              </div>
            </div>
            {permissionAllowed && <div className="add_new_side_btn" onClick={() => navigate("/create_route")}>
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
        <div ref={pdfView}>
          <div className="table_scroll_container">
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>S. No.</StyledTableCell>
                  {filterCols?.map(col => <StyledTableCell>{col.label}</StyledTableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {allRouts?.map((row, i) => (
                  <StyledTableRow key={i} >
                    <StyledTableCell>{((pageCount * filterData.limit) - filterData.limit) + (i + 1)}</StyledTableCell>
                    {filterCols?.map(col => <TCComponent data={{ row, col }} />)}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {allRouts?.length !== 0 && (
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

          {allRouts?.length === 0 && (
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
          <div>Do you want to delete this route?</div>
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
              onClick={() => deleteRouteFunc()}
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

export default Route;
