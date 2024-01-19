// import "./Employee.css";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import group from "../../images/group.png";

import Slider from "@mui/material/Slider";
import getStateFunc from "../../api/locationAPI";
import fetchAllEmployee, {
  editSingleGroup,
  getSingleGroup,
} from "../../api/employeeAPI";
import { toast } from "react-toastify";
import { blankValidator } from "../../utils/Validation";
import { CircularProgress } from "@mui/material";
import isAllowed from "../../utils/isAllowed";
import { EMPLOYEE_MANAGEMENT } from "../../constants";

const EditEmployeeGrouping = () => {
  const location = useLocation();
  // console.log(location.state);

  const navigate = useNavigate();

  const sliderHandleChange = (e, value) => {
    // console.log(value);
  };

  const [error, setError] = useState({
    gname: {
      status: false,
    },
    gdesc: {
      status: false,
    },
  });

  const [isLoading, setisLoading] = useState(false);
  const [btnLoading, setbtnLoading] = useState(false);

  const [allState, setallState] = useState([]);
  const [allEmployeeList, setallEmployeeList] = useState([]);

  const [groupEmp, setgroupEmp] = useState([]);
  const [currentState, setCurrentState] = useState("");
  const [groupName, setGroupName] = useState(location.state.grp_name);
  const [groupDescription, setGroupDescription] = useState(
    location.state.grp_description
  );

  const [selectedName, setselectedName] = useState([]);

  const [groupData, setgroupData] = useState({});

  useEffect(() => {
    getStateFunc().then((res) => setallState(res.data.result));
    getEmployeeData();
  }, []);

  const stateHandleInput = async (e) => {
    setCurrentState(e.target.value);
    try {
      fetchAllEmployee({ state: e.target.value }).then((res) => {
        // console.log(res);
        setallEmployeeList(res.data.result);
      });
    } catch (error) {
      console.log(error);
      toast.error("Internet Error!");
    }
  };

  const toggleEmpGroup = (e) => {
    // console.log(e.target.value);
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

  const handleCreateEmpGroup = async () => {
    setbtnLoading(true);

    if (!await isAllowed(EMPLOYEE_MANAGEMENT)) {
      toast.error("Module is not purchased!");
      return setbtnLoading(true);
    }

    const empIds = groupEmp.join(",").trim();
    // console.log(empIds);

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

    let groupData = {
      grp_name: groupName,
      grp_description: groupDescription,
      empIdStr: empIds,
      id: location.state.id,
    };

    let res = await editSingleGroup(groupData);
    console.log(res);
    if (res.data.status) {
      toast.success("Employee updated Successfully!");
      navigate("/employee_grouping_list");
      setbtnLoading(false);
    } else {
      toast.error(res.data.message);
      setbtnLoading(false);
    }
  };

  const getEmployeeData = async () => {
    // console.log(location.state.id);
    try {
      let res = await getSingleGroup(location.state.id);
      // console.log(res);

      if (res.data.status) {
        setgroupData(res.data.result);
        setallEmployeeList(res.data.result.emp_data);
        res.data.result.emp_data.map((data) => {
          if (groupEmp.length === 0) {
            if (groupEmp.includes(data.emp_id)) return console.log("included");
            setgroupEmp((groupEmp) => [...groupEmp, data.emp_id]);
            setselectedName((selectedName) => [
              ...selectedName,
              data.employeeName,
            ]);
          }
        });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(groupEmp);
  // console.log(groupData);
  // console.log(allEmployeeList);

  return (
    <div className="container">
      <div className="dash_heading">
        <div className="icon">
          <img src={group} alt="icon" />
        </div>
        <div className="title">Edit - {groupData?.grp_name}</div>
      </div>

      <div className="party_container">
        <div className="grouping_title">Employee List</div>
        <select style={{ width: "50%" }} name="state" onChange={stateHandleInput}>
          <option value="">{groupData?.state || "State"}</option>
          {allState?.map((state) => (
            <option key={state.id} value={state.id}>{state.name}</option>
          ))}
        </select>

        {allEmployeeList?.length === 0 || !allEmployeeList ? (
          <div style={{ padding: "1rem", fontWeight: 600 }} >No employee found</div>
        ) : (
          <div className="grouping_checkbox">
            {allEmployeeList?.map((employee) => (
              <div className="grouping_row">
                <input
                  type="checkbox"
                  value={employee.emp_id || employee.id}
                  name={employee.employeeName}
                  onChange={toggleEmpGroup}
                  checked={groupEmp.includes(employee.emp_id || employee.id)}
                />
                <label htmlFor="">{employee.employeeName}</label>
                {/* <button onClick={() => console.log(employee) } >detail</button> */}
              </div>
            ))}
          </div>
        )}

        <div className="grouping_slider">
          {allEmployeeList?.length > 0 && (
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

export default EditEmployeeGrouping;