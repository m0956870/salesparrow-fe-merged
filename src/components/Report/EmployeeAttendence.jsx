import React, { useEffect, useState } from 'react'
import fetchAllEmployee, { getEmp } from '../../api/employeeAPI';
import getStateFunc from '../../api/locationAPI';
import group from "../../images/group.png";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";
import { CircularProgress, Pagination } from "@mui/material";
import { fetchEmpAttendence } from '../../api/reportsAPI';

const EmployeeAttendence = () => {

  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState();
  const [isLoading, setisLoading] = useState(false);

  const [allState, setallState] = useState([]);
  const [allEmployeeList, setallEmployeeList] = useState([]);
  const [currentEmployee, setcurrentEmployee] = useState(null);

  const [attendenceData, setattendenceData] = useState([])

  const [employeeConfig, setemployeeConfig] = useState({
    stateID: "",
    employeeID: "",
  });

  const fetchEmpAttendenceFunc = async (id) => {
    // console.log(id);
    try {
      let res = await fetchEmpAttendence(id);
      if (res.data.status) {
        console.log(res.data.result);
        setattendenceData(res.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(attendenceData);

  // Location API

  const stateHandleInput = async (e) => {
    setemployeeConfig({ ...employeeConfig, [e.target.name]: e.target.value });
    try {
      fetchAllEmployee({ state: e.target.value }).then((res) => {
        // console.log(res.data);
        setallEmployeeList(res.data.result)
      }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStateFunc().then((res) => setallState(res.data.result));
  }, []);


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
          <div className="title">Employee Attendence Report</div>
        </div>
        <div className="beat_right employee_head">
        </div>
      </div>

      <div class="party_container party">
        <div class="grouping_submit">
          <div class="message_left">
            <div class="message_form">
              <select
                name="stateID"
                value={employeeConfig.stateID}
                onChange={stateHandleInput}
              >
                <option value="">State</option>
                {allState?.map((state) => (
                  <option value={state.id}>{state.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div class="message_right">
            <div class="message_form">
              <select
                class="grouping_select"
                name="employeeID"
                // value={employeeConfig.employeeID}
                onChange={(e) => {
                  setemployeeConfig({
                    ...employeeConfig,
                    [e.target.name]: e.target.value,
                  });
                  fetchEmpAttendenceFunc(e.target.value);
                }}
              >
                <option value="">Select an Employee</option>
                {allEmployeeList.length === 0 && <option disabled value="">No Employee Found</option>}
                {allEmployeeList?.map((state) => (
                  <option value={state.id}>{state.employeeName}</option>
                ))}
              </select>
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
        <div className="beat_table">
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Employees Name</StyledTableCell>
                <StyledTableCell align="left">Beat</StyledTableCell>
                <StyledTableCell align="left">Party</StyledTableCell>
                <StyledTableCell align="left">Date</StyledTableCell>
                <StyledTableCell align="left">Latitude </StyledTableCell>
                <StyledTableCell align="left">Longitude </StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
              </TableRow>
            </TableHead>
            {/* <div style={{ margin: "0.5rem 0" }}></div> */}
            {attendenceData?.length === 0 ? (
              <div className="no_data" style={{ width: "400%" }}>
                No data
              </div>
            ) : (
              <TableBody>
                {attendenceData?.map((row) => (
                  <>
                    <StyledTableRow key={row.id}>
                      <StyledTableCell component="th" scope="row">
                        {row.employee?.name}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {row.beat?.name}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {row.party?.name}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {row.date}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {row.location?.latitude}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {row.location?.longitude}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {row.status}
                      </StyledTableCell>

                    </StyledTableRow>
                    {/* <div style={{ margin: "0.2rem 0" }}></div> */}
                  </>
                ))}
              </TableBody>
            )}
          </Table>
          {attendenceData?.length !== 0 && (
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
        </div>
      )}

    </div>
  )
}

export default EmployeeAttendence