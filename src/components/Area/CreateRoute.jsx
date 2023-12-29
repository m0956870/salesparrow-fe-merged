import "./CreateRoute.css";
import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import group from "../../images/group.png";

import getStateFunc, {
  getCityFunc,
  getDistrictFunc,
} from "../../api/locationAPI";
import { addRoute, editRoute } from "../../api/routeAPI";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { blankValidator } from "../../utils/Validation";
import isAllowed from "../../utils/isAllowed";
import { BEAT_ROUTE_MANAGEMENT } from "../../constants";

const CreateRoute = () => {
  const navigate = useNavigate();
  const [btnLoading, setbtnLoading] = useState(false);

  const [route, setroute] = useState({
    state: "",
    city: "",
    // area: "",
    route_name: "",
    start_point: "",
    end_point: "",
    distance: "",
  });

  const [error, setError] = useState({
    state: {
      status: false,
    },
    city: {
      status: false,
    },
    // area: {
    //   status: false,
    // },
    route_name: {
      status: false,
    },
    start_point: {
      status: false,
    },
    end_point: {
      status: false,
    },
  });

  const handleInput = (e) => {
    Object.values(error).map(item => item.status = false)
    setroute({ ...route, [e.target.name]: e.target.value });
  };

  const createRouteFunc = async () => {
    setbtnLoading(true);
    if (!await isAllowed(BEAT_ROUTE_MANAGEMENT)) {
      toast.error("Module is not purchased!");
      return setbtnLoading(false);
    }

    if (!blankValidator(route.state)) {
      return setError({
        ...error,
        state: {
          status: true,
        },
      });
    }
    if (!blankValidator(route.city)) {
      return setError({
        ...error,
        city: {
          status: true,
        },
      });
    }
    // if (!blankValidator(route.area)) {
    //   return setError({
    //     ...error,
    //     area: {
    //       status: true,
    //     },
    //   });
    // }
    if (!blankValidator(route.route_name)) {
      return setError({
        ...error,
        route_name: {
          status: true,
        },
      });
    }
    // if (!blankValidator(route.start_point)) {
    //   return setError({
    //     ...error,
    //     start_point: {
    //       status: true,
    //     },
    //   });
    // }
    // if (!blankValidator(route.end_point)) {
    //   return setError({
    //     ...error,
    //     end_point: {
    //       status: true,
    //     },
    //   });
    // }

    // return console.log(route);

    try {
      let res = await addRoute(route);
      // console.log(res);

      if (res.data.status) {
        toast.success("Route created Successfully!");
        navigate("/route");
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
  // const [allDistrict, setallDistrict] = useState([]);
  const [stateID, setstateID] = useState("");
  const [cityID, setcityID] = useState("");

  const cityHandleInput = async (e) => {
    // console.log(e.target.value);
    Object.values(error).map(item => item.status = false)
    setroute({ ...route, [e.target.name]: e.target.value });
    // try {
    //   getDistrictFunc(stateID, e.target.value).then((res) =>
    //     setallDistrict(res.data.result)
    //   );
    // } catch (error) {
    //   console.log(error);
    //   // toast.error("Internet Error!");
    // }
  };

  const stateHandleInput = async (e) => {
    setstateID(e.target.value);
    setroute({ ...route, [e.target.name]: e.target.value });
    try {
      getCityFunc(e.target.value).then((res) => setallCity(res.data.result));
    } catch (error) {
      console.log(error);
      // toast.error("Internet Error!");
    }
  };

  useEffect(() => {
    getStateFunc().then((res) => setallState(res.data.result));
  }, []);

  // const cityClicked = () => {
  //   getCityFunc(stateID).then((res) => setallCity(res.data.result));
  // };

  // const districtClicked = () => {
  //   getDistrictFunc(stateID, cityID).then((res) =>
  //     setallDistrict(res.data.result)
  //   );
  // };

  return (
    <div className="container">
      <div className="beat_heading">
        <div className="beat_left">
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Create Route</div>
        </div>
      </div>

      <div className="addbeat_container">
        <div className="create_route">
          <div className="select">
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
          </div>
          <div className="select">
            <select name="city" value={route.city} onChange={cityHandleInput} >
              <option value="">City</option>
              {allCity.length === 0 && <option disabled value="">No City Found</option>}
              {allCity?.map((city) => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
            {error.city.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please Enter City
              </p>
            )}
          </div>
          {/* <div className="select" >
            <select name="area" value={route.area} onChange={handleInput}>
              <option value="">Locality</option>
              {allDistrict.length === 0 && <option disabled value="">No District Found</option>}
              {allDistrict?.map((district) => (
                <option key={district._id} value={district._id}>{district.name}</option>
              ))}
            </select>
            {error.area.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please Enter Locality
              </p>
            )}
          </div> */}
          <div className="select">
            <input
              type="text"
              name="route_name"
              value={route.route_name}
              onChange={handleInput}
              placeholder="Route Name"
            />
            {error.route_name.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please Enter Route Name
              </p>
            )}
          </div>
        </div>
        <div className="create_route" style={{ paddingTop: 0 }}>
          <div className="select">
            <input
              type="text"
              name="start_point"
              value={route.start_point}
              onChange={handleInput}
              placeholder="Start Point"
            />
            {error.start_point.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please Enter Start Point
              </p>
            )}
          </div>
          <div className="select">
            <input
              type="text"
              name="end_point"
              value={route.end_point}
              onChange={handleInput}
              placeholder="End Point"
            />
            {error.end_point.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please Enter End Point
              </p>
            )}
          </div>
          <div className="select">
            <input
              type="text"
              name="distance"
              value={route.distance}
              onChange={handleInput}
              placeholder="Distance in km"
            />
          </div>
        </div>

        <div className="btn changepass_btn" onClick={() => createRouteFunc()}>
          {btnLoading ? (
            <CircularProgress style={{ color: "#fff" }} size={20} />
          ) : (
            "Create Route"
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateRoute;
