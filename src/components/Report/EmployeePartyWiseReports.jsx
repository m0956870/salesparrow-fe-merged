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
import { getEmpPartyWiseReport } from "../../api/reportsAPI";
import { CircularProgress, Pagination } from "@mui/material";
import getStateFunc from "../../api/locationAPI";
import fetchAllEmployee from "../../api/employeeAPI";
import { toast } from "react-toastify";
import isAllowed from "../../utils/isAllowed";
import { DYNAMIC_REPORT } from "../../constants";

const EmployeePartyWiseReports = () => {
  const [isLoading, setisLoading] = useState(false);

  const [allState, setallState] = useState([]);
  const [allEmployee, setallEmployee] = useState([]);

  const [empSelected, setempSelected] = useState(false)
  const [allReports, setallReports] = useState([]);

  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState();

  const [filterData, setfilterData] = useState({
    employee_id: "",
    page: pageCount,
  })

  useEffect(() => {
    getStateFunc().then(res => setallState(res.data.result));
    fetchAllEmployee().then(res => setallEmployee(res.data.result));
  }, [pageCount]);

  const employeeHandleInput = async (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value });

    setisLoading(true)
    if (!await isAllowed(DYNAMIC_REPORT)) {
      toast.error("Module is not purchased!");
      return setisLoading(false);
  }

    getEmpPartyWiseReport({ employee_id: e.target.value }).then(res => {
      setallReports(res.data.result)
      setpageLength(res.data.pageLength);

      setempSelected(true)
      setisLoading(false)
    })
  }

  // console.log(reportSummery);

  const stateHandleInput = async (e) => {
    // console.log(e.target.value);
    fetchAllEmployee({ state: e.target.value }).then((res) => {
      setallEmployee(res.data.result);
    });
  };

  // console.log(allReports)

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
      borderLeft: "2px solid #00000011",
      '&:last-child': {
        borderRight: "2px solid #00000011",
      },
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    borderBottom: "2px solid #00000011",
  }));

  return (
    <div className="container">
      <div className="beat_heading">
        <div className="beat_left">
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Employee Party Wise Reports</div>
        </div>
        <div className="beat_right">
        </div>
      </div>

      <div class="party_container party" style={{ marginBottom: "0rem" }}>
        <div class="grouping_submit">
          <div class="message_left">
            <div class="message_form">
              <select onChange={stateHandleInput}>
                <option value="">Select State</option>
                {allState?.map((state) => (
                  <option key={state.id} value={state.id}>{state.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div class="message_right">
            <div class="message_form">
              <select name="employee_id" onChange={employeeHandleInput}>
                <option value="">Select Employee</option>
                {allEmployee.length === 0 && <option disabled value="">No Employee Found</option>}
                {allEmployee?.map((employee) => (
                  <option value={employee?.id} >{employee?.employeeName} </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ margin: "auto", }} >
          <CircularProgress />
        </div>
      ) : (
        <div className="device_table">
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow style={{ display: "flex" }}>
                <StyledTableCell>S. No.</StyledTableCell>
                <StyledTableCell style={{ flex: 1 }} >Party Name</StyledTableCell>
                <StyledTableCell style={{ flex: 1 }} align="center">Collection</StyledTableCell>
                <StyledTableCell style={{ flex: 1 }} align="center">Outstanding</StyledTableCell>
                <StyledTableCell style={{ flex: 1 }} align="center">Sale</StyledTableCell>
                <StyledTableCell style={{ flex: 1 }} align="center">Stock</StyledTableCell>
                <StyledTableCell style={{ flex: 1 }} align="center">Party Status</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allReports?.map((row, i) => (
                <StyledTableRow key={i} style={{ display: "flex" }} >
                  <StyledTableCell>{((pageCount * filterData.limit) - filterData.limit) + (i + 1)}</StyledTableCell>
                  <StyledTableCell style={{ flex: 1 }}>{row.party}</StyledTableCell>
                  <StyledTableCell style={{ flex: 1 }} align="center">{row.collection} </StyledTableCell>
                  <StyledTableCell style={{ flex: 1 }} align="center">{row.out_standing}</StyledTableCell>
                  <StyledTableCell style={{ flex: 1 }} align="center">{row.sale}</StyledTableCell>
                  <StyledTableCell style={{ flex: 1 }} align="center">{row.stock}</StyledTableCell>
                  <StyledTableCell style={{ flex: 1 }} align="center">
                    <div className={`${row.status === "Approved" ? "active_beat" : "inactive_beat"}`}>
                      {row.status}
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>

          {allReports?.length !== 0 && (
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
          {empSelected == false && (
            <div className="no_data">
              Select Employee
            </div>
          )}
          {empSelected == true && allReports?.length === 0 && (
            <div className="no_data">
              No Data
            </div>
          )}
        </div >
      )}
    </div >
  );
};

export default EmployeePartyWiseReports;
