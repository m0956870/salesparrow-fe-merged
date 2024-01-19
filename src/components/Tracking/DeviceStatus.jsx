import "./Tracking.css";
import React, { useEffect, useState } from "react";
import group from "../../images/group.png";
// import SearchIcon from "@mui/icons-material/Search";

// import img1 from "../../images/column_filter.png"
// import img2 from "../../images/excel_import.png"
// import img3 from "../../images/excel_export.png"
// import img4 from "../../images/pdf_download.png"

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";
import { getDeviceStatus } from "../../api/tracking";
import getStateFunc from "../../api/locationAPI";
import fetchAllEmployee from "../../api/employeeAPI";
import { CircularProgress, Pagination } from "@mui/material";

const DeviceStatus = () => {
  const [isLoading, setisLoading] = useState(false)

  const [allState, setallState] = useState([]);
  const [allEmployee, setallEmployee] = useState([]);

  const [deviceStatusData, setdeviceStatusData] = useState([])
  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState();
  const [totalDataCount, settotalDataCount] = useState();

  const [filterData, setfilterData] = useState({
    employee_id: "",
    date: "",
    limit: "10",
    page: pageCount,
  })

  useEffect(() => {
    getDeviceStatusFunc(filterData);
    getStateFunc().then((res) => setallState(res.data.result));
    fetchAllEmployee().then((res) => setallEmployee(res.data.result));
  }, [])

  useEffect(() => {
    if (filterData.emp_id !== "") {
      getDeviceStatusFunc({ ...filterData, page: pageCount })
    }
  }, [pageCount]);

  async function getDeviceStatusFunc(filterData) {
    setisLoading(true)

    let { data } = await getDeviceStatus(filterData)
    if (data.status) {
      setdeviceStatusData(data.result)
      setpageLength(data.page_length)
      settotalDataCount(data.total)
      setisLoading(false)
    } else {
      console.log("Some Error!")
      setisLoading(false)
    }
  }

  const handleInput = (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value });
  };

  const stateHandleInput = async (e) => {
    fetchAllEmployee({ state: e.target.value }).then((res) => {
      setallEmployee(res.data.result);
    });
  };

  const topFilterHandleInput = async (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value })
    getDeviceStatusFunc({ ...filterData, [e.target.name]: e.target.value })
  }

  const filterFunc = async () => {
    getDeviceStatusFunc(filterData)
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
      borderLeft: "2px solid #00000011",
      '&:last-child': {
        borderRight: "2px solid #00000011",
      },
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    borderBottom: "2px solid #00000011",
  }));


  //   filter col
  const [filterDivExtended, setfilterDivExtended] = useState(false);
  const [tableCols, setTableCols] = useState([
    {
      label: 'Name',
      key: 'emp_name',
      type: "value",
      active: true,
    },
    {
      label: 'Assigned State',
      key: 'state',
      type: "value",
      active: true,
    },
    {
      label: 'Mobile',
      key: "mobileName",
      type: "value",
      active: true,
    },
    {
      label: 'Android Version',
      key: "androidVersion",
      type: "value",
      active: true,
    },
    {
      label: 'GPS',
      key: "gps",
      component: GPSComp,
      type: "component",
      active: true,
    },
    {
      label: 'Internet',
      key: "internet",
      component: IntComp,
      type: "component",
      active: true,
    },
    {
      label: 'App Version',
      key: "appVersion",
      type: "value",
      active: true,
    },
    {
      label: 'Battery',
      key: "battery",
      type: "value",
      active: true,
    },
    {
      label: 'Phone Number',
      key: "phone",
      type: "value",
      active: true,
    },
    {
      label: 'Updated At',
      key: "updated_date",
      type: "value",
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

  const CusTCComponent = ({ data }) => {
    let { row, col } = data;

    if (col.key === "gps") {
      return (
        <StyledTableCell>
          <col.component gps={row[col.key]} />
        </StyledTableCell>
      )
    } else if (col.key === "internet") {
      return (
        <StyledTableCell>
          <col.component internet={row[col.key]} />
        </StyledTableCell>
      )
    }
    return <StyledTableCell>{row.key}</StyledTableCell>
  }

  const TCComponent = ({ data }) => {
    let { row, col } = data;
    if (col.type === "component") return <CusTCComponent data={{ row, col }} />;
    else if (col.key === "updated_date") return <StyledTableCell>{row.updated_date ? `${new Date(row[col.key]).toLocaleDateString()}, ${new Date(row[col.key]).toLocaleTimeString()}` : "-"} </StyledTableCell>;
    return <StyledTableCell>{row[col.key]}</StyledTableCell>;
  }

  return (
    <div className="container">
      <div className="beat_heading">
        <div className="beat_left">
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">All User's Device Status</div>
        </div>
        <div className="beat_right">
        </div>
      </div>

      <div className="top_filter_section" style={{ marginBottom: "1rem" }}>
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
            <div className="section_options" onClick={() => setfilterDivExtended(!filterDivExtended)}>Filter</div>
            <div className="section_options">Export</div>
            <div className="section_options">PDF</div>
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

      <div className="tracking_tabs">
        <div className="tarcking_tab_left">
          <select onChange={stateHandleInput}>
            <option value="">All States</option>
            {allState?.map((state) => (
              <option key={state.id} value={state.id}>{state.name}</option>
            ))}
          </select>
          <select name="employee_id" onChange={handleInput} >
            <option value="">All Employees</option>
            {allEmployee.length === 0 && <option disabled value="">No Employee Found</option>}
            {allEmployee?.map((employee) => (
              <option key={employee.id} value={employee.id}>{employee.employeeName}</option>
            ))}
          </select>
          {/* <input
            type="text"
            onClick={(e) => (e.target.type = "date")}
            onBlur={(e) => (e.target.type = "text")}
            name="date"
            onChange={handleInput}
            placeholder="Date"
          /> */}
          <div className="view_btn"
            onClick={() => filterFunc()}
          >
            View
          </div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ margin: "auto", }} >
          <CircularProgress />
        </div>
      ) : (
        <>
          {deviceStatusData?.length !== 0 ? (
            <>
              <div style={{ margin: "1rem 0" }}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      {filterCols?.map(col => <StyledTableCell>{col.label}</StyledTableCell>)}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {deviceStatusData?.map((row, i) => (
                      <StyledTableRow key={i}>
                        {filterCols?.map(col => <TCComponent data={{ row, col }} />)}
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="top_filter_section" style={{ marginBottom: "1rem" }} >
                <div className="limit_bottom_info">Showing {((pageCount * filterData.limit) - filterData.limit) + 1} to {totalDataCount > pageCount * filterData.limit ? pageCount * filterData.limit : totalDataCount} of {totalDataCount} entries</div>
                <div>
                  <Pagination
                    count={pageLength}
                    size="medium"
                    color="primary"
                    shape="rounded"
                    onChange={(e, value) => setpageCount(value)}
                    page={pageCount}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="no_data">
              No data
            </div>
          )}
        </>
      )}
    </div>
  );
};

function IntComp({ internet }) {
  return (
    <>
      {internet ? (
        <div className={`${internet === "ONLINE" ? "active_beat" : "inactive_beat"}`}>
          {internet}
        </div>
      ) : (
        "-"
      )}
    </>
  )
}
function GPSComp({ gps }) {
  return (
    <>
      {gps ? (
        <div className={`${gps === "ON" ? "active_beat" : "inactive_beat"}`}>
          {gps}
        </div>
      ) : (
        "-"
      )}
    </>
  )
}

export default DeviceStatus;