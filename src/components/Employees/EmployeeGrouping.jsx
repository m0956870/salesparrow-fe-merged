// import "./EmployeeGrouping.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import group from "../../images/group.png";

import Slider from "@mui/material/Slider";
import getStateFunc from "../../api/locationAPI";
import fetchAllEmployee, { addEmployeeGrouping } from "../../api/employeeAPI";
import { toast } from "react-toastify";
import { blankValidator } from "../../utils/Validation";
import { CircularProgress } from "@mui/material";
import isAllowed from "../../utils/isAllowed";
import { EMPLOYEE_MANAGEMENT } from "../../constants";

const EmployeeGrouping = () => {
  const navigate = useNavigate();

  const sliderHandleChange = (e, value) => {
    console.log(value);
  };

  const [error, setError] = useState({
    gname: {
      status: false,
    },
    gdesc: {
      status: false,
    },
  });

  const [btnLoading, setbtnLoading] = useState(false);

  const [allState, setallState] = useState([]);
  const [allEmployeeList, setallEmployeeList] = useState([]);

  const [groupEmp, setgroupEmp] = useState([]);
  const [currentState, setCurrentState] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  const [selectedName, setselectedName] = useState([]);

  useEffect(() => {
    getStateFunc().then((res) => setallState(res.data.result));
  }, []);

  const stateHandleInput = async (e) => {
    setCurrentState(e.target.value);
    try {
      fetchAllEmployee({ state: e.target.value }).then((res) =>
        setallEmployeeList(res.data.result)
      );
    } catch (error) {
      console.log(error);
      toast.error("Internet Error!");
    }
  };

  const toggleEmpGroup = (e) => {
    const shouldAdd = e.target.checked;
    const empId = e.target.value;
    if (shouldAdd) {
      setgroupEmp([...groupEmp, empId]);
      setselectedName([...selectedName, e.target.name]);
      return;
    }
    setgroupEmp(groupEmp.filter((id) => id !== empId));
    setselectedName(selectedName.filter((name) => name !== e.target.name));
  };

  // useEffect(() => {
  //   console.log(groupEmp.join(","));
  // }, [groupEmp]);

  const handleCreateEmpGroup = async () => {
    setbtnLoading(true);
    if (!await isAllowed(EMPLOYEE_MANAGEMENT)) {
      toast.error("Module is not purchased!");
      return setbtnLoading(false);
    }

    if (!blankValidator(groupName)) {
      return setError({
        ...error,
        gname: {
          status: true,
        },
      });
    }
    if (!blankValidator(groupDescription)) {
      return setError({
        ...error,
        gdesc: {
          status: true,
        },
      });
    }

    const empIds = groupEmp.join(",").trim();
    // console.log(empIds);

    let groupData = {
      grp_name: groupName,
      grp_description: groupDescription,
      empIdStr: empIds,
      state: currentState,
    };

    let res = await addEmployeeGrouping(groupData);
    // console.log(res);
    if (res.data.status) {
      toast.success("Employee created Successfully!");
      navigate("/employee_grouping_list");
      setbtnLoading(false);
    } else {
      toast.error(res.data.message);
      setbtnLoading(false);
    }
  };

  // console.log(groupEmp);
  // console.log(allEmployeeList);

  return (
    <div className="container">
      <div className="dash_heading">
        <div className="icon">
          <img src={group} alt="icon" />
        </div>
        <div className="title">Employee Grouping</div>
      </div>

      <div className="party_container">
        <div className="grouping_title">Employee List</div>
        <select style={{ width: "50%" }} name="state" onChange={stateHandleInput}>
          <option value="State">State</option>
          {allState?.map((state) => (
            <option key={state.id} value={state.id}>{state.name}</option>
          ))}
        </select>
        <div className="grouping_checkbox">
          {allEmployeeList?.map((employee) => (
            <div className="grouping_row">
              <input
                type="checkbox"
                value={employee.id}
                name={employee.employeeName}
                onChange={toggleEmpGroup}
                checked={groupEmp.includes(employee.id)}
              />
              <label htmlFor="">{employee.employeeName}</label>
            </div>
          ))}
        </div>
        <div className="grouping_slider">
          {allEmployeeList.length > 0 && (
            <Slider
              defaultValue={2}
              onChange={sliderHandleChange}
              aria-label="Default"
              valueLabelDisplay="auto"
              style={{ color: "var(--main-color)" }}
            />
          )}
        </div>
      </div>

      <div className="party_container">
        <div className="grouping_title">Selected Employees</div>

        <div className="grouping_checkbox grouping_select">
          {selectedName?.map((i, name) => (
            <div className="grouping_row">
              <div>
                {name + 1}. {i}
              </div>
            </div>
          ))}
        </div>
        <div className="grouping_slider">
          {selectedName.length > 0 && (
            <Slider
              defaultValue={2}
              onChange={sliderHandleChange}
              aria-label="Default"
              valueLabelDisplay="auto"
              style={{ color: "var(--main-color)" }}
            />
          )}
        </div>
      </div>

      <div className="party_container">
        <div className="grouping_submit">
          <div className="message_left">
            <div className="message_form">
              <input
                type="text"
                name="group_name"
                value={groupName}
                onChange={(e) => {
                  setError({
                    ...error,
                    gname: {
                      status: false,
                    },
                  });
                  setGroupName(e.target.value);
                }}
                placeholder="Employee Group Name"
              />
              {error.gname.status && (
                <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                  Please Employee Group Name
                </p>
              )}
            </div>
          </div>
          <div className="message_right">
            <div className="message_form">
              <input
                type="text"
                name="group_desc"
                value={groupDescription}
                onChange={(e) => {
                  setError({
                    ...error,
                    gdesc: {
                      status: false,
                    },
                  });
                  setGroupDescription(e.target.value);
                }}
                placeholder="Group Description"
              />
              {error.gdesc.status && (
                <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                  Please Employee Group Description
                </p>
              )}
            </div>
          </div>
        </div>

        <div
          className="message_btn submit_btn"
          onClick={() => handleCreateEmpGroup()}
        >
          {btnLoading ? (
            <CircularProgress style={{ color: "#fff" }} size={26} />
          ) : (
            "SUBMIT"
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeGrouping;
