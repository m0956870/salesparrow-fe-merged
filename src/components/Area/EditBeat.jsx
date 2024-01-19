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
import isAllowed from "../../utils/isAllowed";
import { BEAT_ROUTE_MANAGEMENT } from "../../constants";

const AddBeat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location && location.state);
  const [btnLoading, setbtnLoading] = useState(false);
  const [permissionAllowed, setpermissionAllowed] = useState(false)

  const [allEmployee, setallEmployee] = useState([]);
  const [allRouts, setallRouts] = useState([]);
  const [selectedVal, setselectedVal] = useState([]);

  const [beat, setbeat] = useState({
    id: location.state && location.state.id,
    beatName: (location.state && location.state.beatName) || "",
    day: (location.state && location.state.day) || "",
    state: (location.state && location.state.state) || "",
    city: (location.state && location.state.city) || "",
    employee_name: (location.state && location.state.employee_name) || "",
    route: [],
  });

  const [error, setError] = useState({
    phone: {
      status: false,
    },
    address: {
      status: false,
    },
  });

  const handleInput = (e) => {
    setbeat({ ...beat, [e.target.name]: e.target.value });
  };

  const editBeatFunc = async () => {
    setbtnLoading(true);
    if (!await isAllowed(BEAT_ROUTE_MANAGEMENT)) {
      toast.error("Module is not purchased!");
      return setbtnLoading(false);
    }

    let res = await editBeat(beat);
    if (res.data.status) {
      toast.success("Beat edited Successfully!");
      navigate("/area");
    } else {
      toast.error(res.data.message);
    }

    setbtnLoading(false);
  };

  const [allState, setallState] = useState([]);
  const [allCity, setallCity] = useState([]);
  const [stateID, setstateID] = useState("");
  const [cityID, setcityID] = useState("");

  useEffect(() => {
    getStateFunc().then((res) => setallState(res.data.result));
    getCityFunc(location.state?.state?.id).then((res) => setallCity(res.data.result));
    // fetchAllRoute(1, location.state.state.id).then((res) => setallRouts(res.data.result));
    fetchAllRoute({ state: location.state?.state?.id }).then((res) => setallRouts(res.data.result));
    location.state?.route?.map((route) => {
      beat.route.push(route.id);

      let routeName = route.route_name;
      setselectedVal((prev) => [
        ...prev,
        {
          id: route.id,
          name: routeName,
        },
      ]);
    });
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

  const stateHandleInput = async (e) => {
    setstateID(e.target.value);
    setbeat({ ...beat, [e.target.name]: e.target.value });
    try {
      getCityFunc(e.target.value).then((res) => setallCity(res.data.result));
      fetchAllEmployee({ state: e.target.value }).then((res) =>
        setallEmployee(res.data.result)
      );
      // fetchAllRoute(1, e.target.value).then((res) =>
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
    console.log(stateID, cityID);
    // fetchAllEmployee(1, stateID, e.target.value).then((res) =>
    //   setallEmployee(res.data.result)
    // );
    fetchAllRoute({ state: stateID, city: e.target.value }).then((res) =>
      setallRouts(res.data.result)
    );
    try {
    } catch (error) {
      console.log(error);
      // toast.error("Internet Error!");
    }
  };

  const clickedSelect = () => {
    // console.log(stateID);
    try {
      getCityFunc(stateID).then((res) => setallCity(res.data.result));
      // fetchAllEmployee(1, stateID).then((res) =>
      fetchAllEmployee({ state: stateID }).then((res) =>
        setallEmployee(res.data.result)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const selectedValFunc = (e) => {
    Object.values(error).map(item => item.status = false)
    let route = JSON.parse(e.target.value);
    if (!beat.route?.includes(route.id)) {
      beat.route.push(route.id);
    }

    let routeName = route.route_name;

    let included = selectedVal.some(val => val.id === route.id)
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

  const removeItemFunc = (sItem) => {
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
          <div className="title">Edit Beat</div>
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
            <select name="state" onChange={stateHandleInput}>
              {location.state ? (
                <option value="">{beat?.state?.name}</option>
              ) : (
                <option value="">State</option>
              )}
              {allState?.map((state) => (
                <option key={state.id} value={state.id}>{state.name}</option>
              ))}
            </select>
            <select
              name="employee_id"
              // onClick={() => clickedSelect()}
              onChange={handleInput}
            >
              <option value="">{beat.employee_name}</option>
              {allEmployee.length === 0 && <option disabled value="">No Employee Found</option>}
              {allEmployee?.map((employee) => (
                <>
                  <option
                    // selected={console.log(employee)}
                    value={employee.id}
                  >
                    {employee.employeeName}
                  </option>
                </>
              ))}
            </select>
          </div>
          <div className="addbeat_right">
            <select name="day" onChange={handleInput}>
              {location.state ? (
                <option value="">{beat?.day}</option>
              ) : (
                <option value="">Day</option>
              )}
              <option value="Sunday">Sunday</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thrusday">Thrusday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
            <select
              name="city"
              value={beat.city}
              // onClick={() => clickedSelect()}
              onChange={cityHandleInput}
            >
              <option value="">{beat?.city?.name}</option>
              {allCity.length === 0 && <option disabled value="">No City Found</option>}
              {allCity?.map((city) => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
            {/* <select
              name="route_id"
              onClick={() => clickedSelect()}
              onChange={handleInput}
            >
              <option value="">
                {beat?.route_name?.start_point} -{" "}
                {beat?.route_name?.end_point}
              </option>
              {allRouts.length === 0 && <option disabled value="">No Routes Found</option>}
              {allRouts?.map((route) => (
                <option value={route.id}>{route.start_point}-{route.end_point}</option>
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
          </div>
        </div>

        <div onClick={() => editBeatFunc()} className="btn changepass_btn">
          {btnLoading ? (
            <CircularProgress style={{ color: "#fff" }} size={26} />
          ) : (
            "EDIT BEAT"
          )}
        </div>
      </div>
    </div>
  );
};

export default AddBeat;