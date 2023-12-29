// import "./Employees.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import group from "../../images/group.png";
import getStateFunc from "../../api/locationAPI";
import fetchAllEmployee, { addEmpTarget } from "../../api/employeeAPI";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { getEmpAssignedParties } from "../../api/mappingAPI";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";
import isAllowed from "../../utils/isAllowed";
import { EMPLOYEE_MANAGEMENT } from "../../constants";

const AddEmployeeTarget = () => {
  const navigate = useNavigate()
  const [btnLoading, setbtnLoading] = useState(false);

  const [allState, setallState] = useState([]);
  const [stateID, setstateID] = useState("");
  const [allEmployeeList, setallEmployeeList] = useState([]);

  const [empAssignedParties, setempAssignedParties] = useState([]);

  const [empTarget, setempTarget] = useState({
    state: "",
    employee: "",
    month: "",
    year: "",
    target: "",
    total_visit: "",
    total_secondary: "",
    total_primary: "",
  });

  useEffect(() => {
    getStateFunc().then((res) => setallState(res.data.result));
  }, []);

  const handleInput = (e) => {
    setempTarget({ ...empTarget, [e.target.name]: e.target.value });
  };

  const stateHandleInput = async (e) => {
    setstateID(e.target.value);
    setempTarget({ ...empTarget, [e.target.name]: e.target.value });
    fetchAllEmployee({ state: e.target.value }).then(res => setallEmployeeList(res.data.result));
  };

  const emphandleInput = async (e) => {
    setempTarget({ ...empTarget, [e.target.name]: e.target.value });
    getEmpAssignedParties({ emp_id: e.target.value }).then(res => setempAssignedParties(res.data.result[0].parties));
  };

  const empTargetFunc = async () => {
    setbtnLoading(true)
    if (!await isAllowed(EMPLOYEE_MANAGEMENT)) {
      toast.error("Module is not purchased!");
      return setbtnLoading(true);
    }

    let total_visit = 0, total_secondary = 0, total_primary = 0;
    for (let i = 0; i < empAssignedParties.length; i++) {
      total_visit += Number(empAssignedParties[i].number_of_visit || 0)
      total_secondary += Number(empAssignedParties[i].secondary_target || 0)
      total_primary += Number(empAssignedParties[i].primary_target || 0)
    }
    let reqObj = {
      ...empTarget,
      target: empAssignedParties,
      total_visit: String(total_visit),
      total_secondary: String(total_secondary),
      total_primary: String(total_primary)
    };

    let res = await addEmpTarget(reqObj);
    if (res.data.status) {
      toast.success("Employee Target created Succ essfully!");
      navigate("/employee_target");
    } else {
      toast.error(res.data.message);
    }
    setbtnLoading(false);
  };


  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "var(--main-color)",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      backgroundColor: "#fff",
      padding: 10,
      // borderRadius: "0.5rem",
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    borderBottom: "2px solid #00000011",
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
          <div className="title">Add Employee Target</div>
        </div>
        <div className="beat_right">
        </div>
      </div>

      <div className="addbeat_container">
        <div className="addbeat_form">
          <div className="employee_target_inputs">
            <select
              name="state"
              value={empTarget.state}
              onChange={stateHandleInput}
            >
              <option value="">State</option>
              {allState?.map((state) => (
                <option key={state.id} value={state.id}>{state.name}</option>
              ))}
            </select>
            <select value={empTarget.month} name="month" onChange={handleInput} >
              <option value="">Months</option>
              {monthsArr?.map(month => (
                <option key={month.value} value={month.value}>{month.name}</option>
              ))}
            </select>
          </div>
          <div className="employee_target_inputs">
            <select name="employee" onChange={emphandleInput}>
              <option value="">Select Employee</option>
              {allEmployeeList.length === 0 && <option disabled value="">No Employee Found</option>}
              {allEmployeeList?.map((employee) => (
                <option value={employee.id}>{employee.employeeName}</option>
              ))}
            </select>
            <select value={empTarget.year} name="year" onChange={handleInput} >
              <option value="">Year</option>
              {yearsArr?.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {empAssignedParties.length !== 0 && (
          <div className="" style={{ width: "100%", margin: "3rem 0rem 1rem 0rem" }}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell >Assigned Party Name</StyledTableCell>
                  <StyledTableCell align="center">No. of Visits</StyledTableCell>
                  <StyledTableCell align="center">Secondary Target</StyledTableCell>
                  <StyledTableCell align="center">Primary Target</StyledTableCell>
                </TableRow>
              </TableHead>

              {empAssignedParties?.length === 0 ? (
                <div className="no_data" style={{ width: "100%" }}>
                  No data
                </div>
              ) : (
                <TableBody>
                  {empAssignedParties?.map((row) => (
                    <>
                      <StyledTableRow key={row.id}>
                        <StyledTableCell>
                          {row.firmName}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <NoOfVisitInput row={row} empAssignedParties={empAssignedParties} />
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <SecondaryTargetInput row={row} empAssignedParties={empAssignedParties} />
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <PrimaryTargetInput row={row} empAssignedParties={empAssignedParties} />
                        </StyledTableCell>
                      </StyledTableRow>
                    </>
                  ))}
                </TableBody>
              )}
            </Table>
          </div>
        )}

        <div onClick={() => empTargetFunc()} className="btn changepass_btn">
          {btnLoading ? (
            <CircularProgress style={{ color: "#fff" }} size={26} />
          ) : (
            "SAVE"
          )}
        </div>
      </div>
    </div>
  );
};

const NoOfVisitInput = ({ row, empAssignedParties }) => {
  const [inputVal, setinputVal] = useState(row.number_of_visit || 0)

  const handleInput = (e, selectedParty) => {
    if (isNaN(e.target.value.trim())) return;
    let party = empAssignedParties.filter(party => party.id === selectedParty.id)[0]
    party.number_of_visit = e.target.value
    setinputVal(e.target.value)
  }

  return (
    <input
      type="text"
      value={inputVal}
      className="partyType_pricelist"
      onChange={(e) => handleInput(e, row)}
      placeholder="0"
    />
  )
}

const SecondaryTargetInput = ({ row, empAssignedParties }) => {
  const [inputVal, setinputVal] = useState(row.secondary_target || 0)

  const handleInput = (e, selectedParty) => {
    if (isNaN(e.target.value.trim())) return;
    let party = empAssignedParties.filter(party => party.id === selectedParty.id)[0]
    party.secondary_target = e.target.value
    setinputVal(e.target.value)
  }

  return (
    <input
      type="text"
      value={inputVal}
      className="partyType_pricelist"
      onChange={(e) => handleInput(e, row)}
      placeholder="0"
    />
  )
}

const PrimaryTargetInput = ({ row, empAssignedParties }) => {
  const [inputVal, setinputVal] = useState(row.primary_target || 0)

  const handleInput = (e, selectedParty) => {
    if (isNaN(e.target.value.trim())) return;
    let party = empAssignedParties.filter(party => party.id === selectedParty.id)[0]
    party.primary_target = e.target.value
    setinputVal(e.target.value)
  }

  return (
    <input
      type="text"
      value={inputVal}
      className="partyType_pricelist"
      onChange={(e) => handleInput(e, row)}
      placeholder="0"
    />
  )
}

export default AddEmployeeTarget;
