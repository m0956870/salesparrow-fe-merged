import "./AddEmployee.css";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

import group from "../../images/group.png";
import { toast } from "react-toastify";
import { addEmployee } from "../../api/employeeAPI";

import getStateFunc, {
  getCityFunc,
  getDistrictFunc,
} from "../../api/locationAPI";
import { blankValidator, emailValidator } from "../../utils/Validation";
import { CircularProgress } from "@mui/material";
import isAllowed from "../../utils/isAllowed";
import { EMPLOYEE_MANAGEMENT } from "../../constants";

const AddEmployee = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // console.log(location && location.state);

  const [btnLoading, setbtnLoading] = useState(false);

  const [allState, setallState] = useState([]);
  const [allCity, setallCity] = useState([]);
  const [allDistrict, setallDistrict] = useState([]);
  const [stateID, setstateID] = useState("");
  const [cityID, setcityID] = useState("");

  const [allHQCity, setallHQCity] = useState([]);

  const [employee, setemployee] = useState({
    id: location.state && location.state.id,
    employeeName: (location.state && location.state.employeeName) || "",
    phone: (location.state && location.state.phone) || "",
    email: (location.state && location.state.email) || "",
    address: (location.state && location.state.address) || "",
    pincode: (location.state && location.state.pincode) || "",
    state: "",
    district: "",
    city: "",
    experience: (location.state && location.state.experience) || "",
    qualification: (location.state && location.state.qualification) || "",
    headquarterState: "",
    headquarterCity: "",
    status: "Active",

    esi_no: "",
    pf_no: "",
    account_no: "",
    ifsc_code: "",
    bank_name: "",
  });

  const [profilePic, setprofilePic] = useState(location.state?.image);
  const [demoProfilePic, setdemoProfilePic] = useState();

  const [error, setError] = useState({
    email: { status: false, },
    validEmail: { status: false, },
    employeeName: { status: false, },
    phone: { status: false, },
    address: { status: false, },
    state: { status: false, },
    city: { status: false, },
    district: { status: false, },
    headquarterState: { status: false, },
    headquarterCity: { status: false, },
  });

  const handleInput = (e) => {
    Object.values(error).map(item => item.status = false)
    setemployee({ ...employee, [e.target.name]: e.target.value });
  };

  const addEmployeeFunc = async () => {
    setbtnLoading(true);
    if (!await isAllowed(EMPLOYEE_MANAGEMENT)) {
      toast.error("Module is not purchased!");
      return setbtnLoading(false);
    }

    // console.log(profilePic, employee);
    if (!blankValidator(employee.employeeName)) {
      return setError({
        ...error,
        employeeName: {
          status: true,
        },
      });
    }
    // if (!blankValidator(employee.email)) {
    //   return setError({
    //     ...error,
    //     email: {
    //       status: true,
    //     },
    //   });
    // }
    // if (!emailValidator(employee.email)) {
    //   return setError({
    //     ...error,
    //     validEmail: {
    //       status: true,
    //     },
    //   });
    // }
    if (!blankValidator(employee.phone)) {
      return setError({
        ...error,
        phone: {
          status: true,
        },
      });
    }
    if (!blankValidator(employee.address)) {
      return setError({
        ...error,
        address: {
          status: true,
        },
      });
    }
    if (!blankValidator(employee.state)) {
      return setError({
        ...error,
        state: {
          status: true,
        },
      });
    }
    if (!blankValidator(employee.city)) {
      return setError({
        ...error,
        city: {
          status: true,
        },
      });
    }
    // if (!blankValidator(employee.district)) {
    //   return setError({
    //     ...error,
    //     district: {
    //       status: true,
    //     },
    //   });
    // }
    if (!blankValidator(employee.headquarterState)) {
      return setError({
        ...error,
        headquarterState: {
          status: true,
        },
      });
    }
    if (!blankValidator(employee.headquarterCity)) {
      return setError({
        ...error,
        headquarterCity: {
          status: true,
        },
      });
    }

    if (!profilePic) {
      return toast.error("Please Select Employee Profile Pic");
    }

    // console.log(employee);
    let res = await addEmployee(profilePic, employee);
    // console.log(res);
    if (res.data.status) {
      toast.success("Employee created Successfully!");
      navigate("/employees");
      setbtnLoading(false);
    } else {
      toast.error(res.data.message);
      setbtnLoading(false);
    }
  };

  const addEmployeePic = async (e) => {
    let file = e.target.files[0];
    setprofilePic(file);
    setdemoProfilePic(URL.createObjectURL(file));
  };

  const stateHandleInput = async (e) => {
    Object.values(error).map(item => item.status = false)
    setemployee({ ...employee, [e.target.name]: e.target.value });
    setstateID(e.target.value);
    try {
      getCityFunc(e.target.value).then((res) => setallCity(res.data.result));
    } catch (error) {
      console.log(error);
      toast.error("Internet Error!");
    }
  };

  const cityHandleInput = async (e) => {
    Object.values(error).map(item => item.status = false)
    setcityID(e.target.value);
    setemployee({ ...employee, [e.target.name]: e.target.value });
    try {
      getDistrictFunc(stateID, e.target.value).then((res) =>
        setallDistrict(res.data.result)
      );
    } catch (error) {
      console.log(error);
      toast.error("Internet Error!");
    }
  };

  useEffect(() => {
    getStateFunc().then((res) => setallState(res.data.result));
  }, []);

  const hqStateFunc = async (e) => {
    Object.values(error).map(item => item.status = false)
    setemployee({ ...employee, [e.target.name]: e.target.value });
    try {
      getCityFunc(e.target.value).then((res) => setallHQCity(res.data.result));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container">
      <div className="beat_heading">
        <div
          className="beat_left"
        // onClick={() => setbeatTab("beat")}
        >
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">
            {location.state === null ? "Add Employee" : "Edit Employee"}
          </div>
        </div>
      </div>
      <div className="addbeat_container">
        <div className="profile_details" style={{ marginTop: "1rem" }}>
          <div className="avatar">
            <Avatar
              alt="Profile Pic"
              src={demoProfilePic || profilePic}
              style={{ height: "9rem", width: "9rem" }}
            // onClick={handleClick}
            />
            <label>
              <CameraAltIcon className="camera_icon" />
              <input
                type="file"
                onChange={addEmployeePic}
                name="myfile"
                accept="image/*"
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>
        <div className="addbeat_form addemployee_form">
          <div className="addbeat_left">
            <input
              type="text"
              name="employeeName"
              value={employee.employeeName}
              onChange={handleInput}
              placeholder="Employee Name"
            />
            {error.employeeName.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please Enter Employee Name
              </p>
            )}
            <input
              type="text"
              name="email"
              value={employee.email}
              onChange={handleInput}
              placeholder="Email ID"
            />
            {error.email.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please Enter Email
              </p>
            )}
            {error.validEmail.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please Enter Valid Email
              </p>
            )}
            <select
              name="city"
              value={employee.city}
              onChange={cityHandleInput}
            // onClick={() => cityClicked()}
            >
              <option value="">City</option>
              {allCity.length === 0 && <option disabled value="">No City Found</option>}
              {allCity?.map((city) => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
            {error.city.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please enter city
              </p>
            )}
            <input
              type="text"
              name="address"
              value={employee.address}
              onChange={handleInput}
              placeholder="Address"
            />
            {error.address.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please enter address
              </p>
            )}
            <input
              type="text"
              name="experience"
              value={employee.experience}
              onChange={handleInput}
              placeholder="Experience"
            />

            <select
              name="headquarterCity"
              // value={employee.headquarterCity}
              onChange={handleInput}
            // onClick={() => cityClicked()}
            >
              <option value="">Headquarter City</option>
              {allHQCity.length === 0 && <option disabled value="">No Headquarter City Found</option>}
              {allHQCity?.map((city) => (
                <>
                  <option value={city.id}>{city.name}</option>
                </>
              ))}
            </select>
            {error.headquarterCity.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please select Headquarter city
              </p>
            )}

          </div>
          <div className="addbeat_right">
            <input
              type="number"
              name="phone"
              value={employee.phone}
              onChange={(e) => {
                if (e.target.value.length > 10) return;
                handleInput(e)
              }}
              placeholder="Mobile Number"
            />
            {error.phone.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please Enter Phone Number
              </p>
            )}
            <select name="state" onChange={stateHandleInput}>
              <option value="">State</option>
              {allState?.map((state) => (
                <option key={state.id} value={state.id}>{state.name}</option>
              ))}
            </select>
            {error.state.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please Enter State
              </p>
            )}

            {/* <select
              name="district"
              value={employee.district}
              onChange={handleInput}
            >
              <option value="">Locality</option>
              {allDistrict.length === 0 && <option disabled value="">No District Found</option>}
              {allDistrict?.map((district) => (
                <>
                  <option value={district._id}>{district.name}</option>
                </>
              ))}
            </select>
            {error.district.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please select district
              </p>
            )} */}

            <input
              type="number"
              name="pincode"
              value={employee.pincode}
              onChange={(e) => {
                if (e.target.value.length > 6) return;
                handleInput(e)
              }}
              placeholder="Pincode"
            />
            <input
              type="text"
              name="qualification"
              value={employee.qualification}
              onChange={handleInput}
              placeholder="Qualification"
            />

            <select name="headquarterState" onChange={hqStateFunc}>
              <option value="">Headquarter State</option>
              {allState?.map((state) => (
                <option key={state.id} value={state.id}>{state.name}</option>
              ))}
            </select>
            {error.headquarterState.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please select Headquarter state
              </p>
            )}
          </div>
        </div>

        <h3 style={{ marginTop: "1rem", width: "79.5%" }} >Bank Details</h3>
        <div className="addbeat_form addemployee_form">
          <div className="addbeat_left">
            <input
              type="text"
              name="esi_no"
              value={employee.esi_no}
              onChange={handleInput}
              placeholder="ESI No."
            />
            <input
              type="text"
              name="bank_name"
              value={employee.bank_name}
              onChange={handleInput}
              placeholder="Bank Name"
            />
            <input
              type="text"
              name="ifsc_code"
              value={employee.ifsc_code}
              onChange={handleInput}
              placeholder="IFSC Code"
            />
          </div>
          <div className="addbeat_right">
            <input
              type="text"
              name="pf_no"
              value={employee.pf_no}
              onChange={handleInput}
              placeholder="PF NO."
            />
            <input
              type="text"
              name="account_no"
              value={employee.account_no}
              onChange={handleInput}
              placeholder="Account No."
            />
          </div>
        </div>

        <div onClick={() => addEmployeeFunc()} className="btn changepass_btn">
          {btnLoading ? (
            <CircularProgress style={{ color: "#fff" }} size={26} />
          ) : (
            "ADD EMPLOYEE"
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;