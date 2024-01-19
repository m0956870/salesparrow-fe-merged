import "./AddBeat.css";
import React, { useState, useEffect } from "react";
import group from "../../images/group.png";
import SearchIcon from "@mui/icons-material/Search";
import { useLocation, useNavigate } from "react-router-dom";

import { CircularProgress } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

import getStateFunc, {
  getCityFunc,
  getDistrictFunc,
} from "../../api/locationAPI";
import { addBeat, editBeat, getBeat } from "../../api/beatAPI";
import { toast } from "react-toastify";
import fetchAllEmployee from "../../api/employeeAPI";
import fetchAllRoute from "../../api/routeAPI";
import { blankValidator } from "../../utils/Validation";
import isAllowed from "../../utils/isAllowed";
import { BEAT_ROUTE_MANAGEMENT } from "../../constants";

const AddBeat = () => {
  const navigate = useNavigate();
  const [btnLoading, setbtnLoading] = useState(false);
  const [permissionAllowed, setpermissionAllowed] = useState(false)

  const [allEmployee, setallEmployee] = useState([]);
  const [allRouts, setallRouts] = useState([]);

  const [selectedVal, setselectedVal] = useState([]);

  const [beat, setbeat] = useState({
    beatName: "",
    day: "",
    state: "",
    city: "",
    employee_id: "",
    route: []
  });

  const [error, setError] = useState({
    beatName: {
      status: false,
    },
    day: {
      status: false,
    },
    state: {
      status: false,
    },
    city: {
      status: false,
    },
    employee_id: {
      status: false,
    },
    route: {
      status: false,
    },
  });

  useEffect(() => {
    getStateFunc().then((res) => setallState(res.data.result));
    // isAllowedFunc()
  }, []);

  // const isAllowedFunc = async () => {
  //   if (!await isAllowed("Beat & Route Management")) {
  //     setpermissionAllowed(false);
  //     return toast.error("Module is not purchased!");
  //   } else {
  //     setpermissionAllowed(true);
  //   }
  // }

  const handleInput = (e) => {
    Object.values(error).map(item => item.status = false)
    setbeat({ ...beat, [e.target.name]: e.target.value });
  };

  const addBeatFunc = async () => {
    // if (!permissionAllowed) return toast.error("Module is not purchased!");

    setbtnLoading(true);
    if (!await isAllowed(BEAT_ROUTE_MANAGEMENT)) {
      toast.error("Module is not purchased!");
      return setbtnLoading(false);
    }

    if (!blankValidator(beat.beatName)) {
      return setError({
        ...error,
        beatName: {
          status: true,
        },
      });
    }
    if (!blankValidator(beat.day)) {
      return setError({
        ...error,
        day: {
          status: true,
        },
      });
    }
    if (!blankValidator(beat.state)) {
      return setError({
        ...error,
        state: {
          status: true,
        },
      });
    }
    if (!blankValidator(beat.city)) {
      return setError({
        ...error,
        city: {
          status: true,
        },
      });
    }
    if (!blankValidator(beat.employee_id)) {
      return setError({
        ...error,
        employee_id: {
          status: true,
        },
      });
    }
    if (beat.route.length === 0) {
      return setError({
        ...error,
        route: {
          status: true,
        },
      });
    }

    // return console.log(beat);

    try {
      setbtnLoading(true);
      let res = await addBeat(beat);
      // console.log(res);
      if (res.data.status) {
        toast.success("Beat created Successfully!");
        navigate("/area");
        setbtnLoading(false);
      } else {
        toast.error(res.data.message);
        setbtnLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Internet Error!");
      setbtnLoading(false);
    }
  };

  const [allState, setallState] = useState([]);
  const [allCity, setallCity] = useState([]);
  const [stateID, setstateID] = useState("");
  const [cityID, setcityID] = useState("");

  const stateHandleInput = async (e) => {
    setstateID(e.target.value);
    setbeat({ ...beat, [e.target.name]: e.target.value });
    Object.values(error).map(item => item.status = false)
    try {
      getCityFunc(e.target.value).then((res) => setallCity(res.data.result));
      // fetchAllEmployee({ state: e.target.value }).then((res) =>
      fetchAllEmployee({ state: e.target.value }).then((res) =>
        setallEmployee(res.data.result)
      );
      fetchAllRoute({ state: e.target.value }).then((res) =>
        setallRouts(res.data.result)
      );
    } catch (error) {
      console.log(error);
      // toast.error("Internet Error!");
    }
  };

  const cityHandleInput = async (e) => {
    setcityID(e.target.value);
    setbeat({ ...beat, [e.target.name]: e.target.value });
    Object.values(error).map(item => item.status = false)
    // console.log(stateID, cityID);
    try {
      // fetchAllEmployee(1, stateID, e.target.value).then((res) =>
      //   setallEmployee(res.data.result)
      // );
      // fetchAllRoute(1, stateID, e.target.value).then((res) =>
      fetchAllRoute({ state: stateID, city: e.target.value }).then((res) =>
        setallRouts(res.data.result)
      );
    } catch (error) {
      console.log(error);
      // toast.error("Internet Error!");
    }
  };

  const clickedSelect = () => {
    // console.log(stateID);
    try {
      // getCityFunc(stateID).then((res) => setallCity(res.data.result));
      // fetchAllEmployee(1, stateID).then((res) =>
      //   setallEmployee(res.data.result)
      // );
      // fetchAllRoute(1, stateID).then((res) => setallRouts(res.data.result));
    } catch (error) {
      console.log(error);
    }
  };


  const selectedValFunc = (e) => {
    Object.values(error).map(item => item.status = false)

    let route = JSON.parse(e.target.value);
    // console.log(route);

    if (!beat.route.includes(route.id)) {
      beat.route.push(route.id);
    }

    let routeName = route.route_name;

    let included = selectedVal.some(val => val.id === route.id)
    // console.log("included", included)
    if (!included) {
      setselectedVal((prev) => [
        ...prev,
        {
          id: route.id,
          name: routeName,
        },
      ]);
    }
  };

  // console.log(selectedVal);

  const removeItemFunc = (sItem) => {
    // console.log(sItem);
    Object.values(error).map(item => item.status = false)

    const filtered = selectedVal.filter((item) => item !== sItem);
    setselectedVal(filtered);
    let rest = beat.route.filter((item) => item != sItem.id);
    setbeat({ ...beat, route: rest });
  };

  return (
    <div className="container">
      <div className="beat_heading">
        <div className="beat_left">
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Add Beat</div>
        </div>
      </div>

      <div className="addbeat_container">
        <div className="addbeat_form">
          <div className="addbeat_left">
            <input
              type="text"
              name="beatName"
              value={beat.beatName}
              onChange={handleInput}
              placeholder="Beat Name"
            />
            {error.beatName.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please Select Beat
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
                Please Select State
              </p>
            )}
            <select
              name="employee_id"
              onClick={() => clickedSelect()}
              onChange={handleInput}
            >
              <option value="">Employee</option>
              {allEmployee.length === 0 && <option disabled value="">No Employee Found</option>}
              {allEmployee?.map((employee) => (
                <option value={employee?.id} >
                  {employee?.employeeName}
                </option>
              ))}
            </select>
            {error.employee_id.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please Select Employee
              </p>
            )}
          </div>

          <div className="addbeat_right">
            <select name="day" onChange={handleInput}>
              <option value="">Day</option>
              <option value="Sunday">Sunday</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thrusday">Thrusday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
            {error.day.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please Select Day
              </p>
            )}

            <select
              name="city"
              value={beat.city}
              onClick={() => clickedSelect()}
              onChange={cityHandleInput}
            >
              <option value="">City</option>
              {allCity.length === 0 && <option disabled value="">No City Found</option>}
              {allCity?.map((city) => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
            {error.city.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please Select City
              </p>
            )}

            {/* Route */}
            {/* <select
              name="route"
              onClick={() => clickedSelect()}
              onChange={handleInput}
            >
              <option value="">Route</option>
              {allRouts.length === 0 && <option disabled value="">No Routes Found</option>}
              {allRouts?.map((route) => (
                  <option value={route?.id}>{route?.start_point}-{route?.end_point}</option>
              ))}
            </select> */}
            <select name="route" onChange={selectedValFunc}>
              <option value="">Route</option>
              {allRouts.length === 0 && <option disabled value="">No Routes Found</option>}
              {allRouts?.map((route) => (
                <option value={JSON.stringify(route)}>
                  {route.route_name}
                </option>
              ))}
            </select>
            <div className="seleced">
              {selectedVal &&
                selectedVal.map((item) => (
                  <span className="seleced_item">
                    {item.name}
                    <CancelIcon
                      onClick={() => removeItemFunc(item)}
                      style={{
                        color: "var(--main-color)",
                        marginLeft: "0.3rem",
                      }}
                    />
                  </span>
                ))}
            </div>
            {error.route.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please Select Route
              </p>
            )}

          </div>
        </div>
        <div onClick={() => addBeatFunc()} className="btn changepass_btn">
          {btnLoading ? (
            <CircularProgress style={{ color: "#fff" }} size={26} />
          ) : (
            "ADD BEAT"
          )}
        </div>
      </div>
    </div>
  );
};

export default AddBeat;
