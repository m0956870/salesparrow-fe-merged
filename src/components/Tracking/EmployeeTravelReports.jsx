import "./Tracking.css";
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
import { getAllEmpPath, getEmpPath } from "../../api/tracking";
import { CircularProgress, Pagination } from "@mui/material";
import getStateFunc from "../../api/locationAPI";
import fetchAllEmployee from "../../api/employeeAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EmployeeTravelReports = () => {
  const navigate = useNavigate()
  const [isLoading, setisLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [allState, setallState] = useState([]);
  const [allEmployee, setallEmployee] = useState([]);

  const [empSelected, setempSelected] = useState(false)
  const [allEmpPath, setallEmpPath] = useState([]);
  const [outerData, setOuterData] = useState()
  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState();

  const [filterData, setfilterData] = useState({
    emp_id: "",
    page: pageCount,
    start_date: "",
    end_date: "",
  })

  useEffect(() => {
    getStateFunc().then((res) => setallState(res.data.result));
    fetchAllEmployee().then((res) => setallEmployee(res.data.result));
  }, []);

  useEffect(() => {
    getAllEmpPathFirstFunc({ ...filterData, page: pageCount })
  }, [pageCount]);

  useEffect(() => {
    if (search !== '') {
      let ID = setTimeout(() => {
        getAllEmpPathFirstFunc({ ...filterData, search })
      }, 1000);
      return () => clearTimeout(ID);
    }
  }, [search]);

  const handleInput = (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value });
  };

  async function getAllEmpPathFirstFunc(filterData) {
    setisLoading(true)
    let { data } = await getAllEmpPath(filterData)
    if (data.status) {
      setallEmpPath(data.result)
      setpageLength(data.pageLength)
    }
    else console.log("Error!")
    setisLoading(false)
  }

  async function getAllEmpPathFunc(filterData) {
    if (filterData.emp_id === "") return toast.error("Select Employee First!")

    setisLoading(true)
    let { data } = await getAllEmpPath(filterData)
    if (data.status) {
      setallEmpPath(data.result)
      setpageLength(data.pageLength)
      setOuterData({
        total_days: data.total_days,
        total_distance_travelled: data.total_distance_travelled
      })
      setempSelected(true)
    }
    else console.log("Error!")
    setisLoading(false)
  }

  const stateHandleInput = async (e) => {
    fetchAllEmployee({ state: e.target.value }).then((res) => setallEmployee(res.data.result));
  };

  const showTravelPathFunc = async (emp) => {
    let { data } = await getEmpPath({ emp_id: emp.employee.id, date: emp.date })
    if (data.status) {
      if (data.result[0].location.length === 0) return toast.error("No Location Availabe!")
      navigate("/employee_travel_path", { state: data.result[0] })
    } else {
      console.log("Some Error!")
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
    <div className="container" >
      <div className="beat_heading">
        <div className="beat_left">
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Employee Travel Reports</div>
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

      <div className="tracking_tabs">
        <div className="tarcking_tab_left">
          <select
            name="state"
            onChange={stateHandleInput}
          >
            <option value="">All State</option>
            {allState?.map((state) => (
              <option key={state.id} value={state.id}>{state.name}</option>
            ))}
          </select>
          <select
            name="emp_id"
            onChange={handleInput}
          >
            <option value="">Select Employee</option>
            {allEmployee.length === 0 && <option disabled value="">No Employee Found</option>}
            {allEmployee?.map((employee) => (
              <option key={employee.id} value={employee.id} >{employee.employeeName} </option>
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
            onClick={() => getAllEmpPathFunc(filterData)}
          >
            View
          </div>
        </div>
      </div>

      {outerData && (
        <div className="etr_summery_count" >
          <div><span style={{ color: "grey" }} >Total Days:</span> {outerData?.total_days ?? "NA"}</div>
          <div><span style={{ color: "grey" }} >Total Distance Travelled:</span> {outerData?.total_distance_travelled ?? "NA"}</div>
        </div>
      )}

      {
        isLoading ? (
          <div
            style={{
              margin: "auto",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <div className="device_table">
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell align="left">Employee Name</StyledTableCell>
                  <StyledTableCell align="left">Beat</StyledTableCell>
                  <StyledTableCell align="left">Distance Travelled</StyledTableCell>
                  <StyledTableCell align="left">Travel Path</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!allEmpPath || allEmpPath?.length !== 0 && allEmpPath?.map((row) => (
                  <StyledTableRow key={row.name}>
                    <StyledTableCell>{row.date || "-"}</StyledTableCell>
                    <StyledTableCell align="left">{row.employee.name}</StyledTableCell>
                    <StyledTableCell align="left">{row.beat.name}</StyledTableCell>
                    <StyledTableCell align="left">{row.distance_travelled}km</StyledTableCell>
                    <StyledTableCell align="left">
                      <a href="#" onClick={() => showTravelPathFunc(row)} >See the location</a>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
            {!allEmpPath || allEmpPath?.length !== 0 && (
              <div className="pagination">
                <Pagination
                  count={pageLength}
                  size="large"
                  color="primary"
                  onChange={(e, value) => setpageCount(value)}
                  page={pageCount}
                />
              </div>
            )}
            {!allEmpPath || allEmpPath?.length === 0 && empSelected == true ? (
              <div className="no_data">
                No Data
              </div>
            ) : null}
          </div>
        )
      }

    </div >
  );
};

export default EmployeeTravelReports;