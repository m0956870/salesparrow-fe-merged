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
import isAllowed from "../../utils/isAllowed";
import { BEAT_ROUTE_MANAGEMENT } from "../../constants";

const EditRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // console.log(location.state);

  const [btnLoading, setbtnLoading] = useState(false);

  const [route, setroute] = useState({
    state: "",
    city: "",
    area: "",
    route_name: location.state?.route_name || "",
    start_point: location.state?.start_point || "",
    end_point: location.state?.end_point || "",
    distance: location.state?.distance || "",
  });

  const handleInput = (e) => {
    setroute({ ...route, [e.target.name]: e.target.value });
  };

  const editRouteFunc = async () => {
    setbtnLoading(true);
    if (!await isAllowed(BEAT_ROUTE_MANAGEMENT)) {
      toast.error("Module is not purchased!");
      return setbtnLoading(false);
    }

    // console.log(route);
    let data = {
      ...route,
      id: location.state.id,
    };

    let res = await editRoute(data);
    // console.log(res);

    if (res.data.status) {
      toast.success("Route edited Successfully!");
      navigate("/route");
      setbtnLoading(false);
    } else {
      toast.error(res.data.message);
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
    setroute({ ...route, [e.target.name]: e.target.value });
    // try {
    //   getDistrictFunc(stateID, e.target.value).then((res) => {
    //     // console.log(res.data.result);
    //     setallDistrict(res.data.result)
    //   }
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
    setstateID(location.state.state.id);
    setcityID(location.state.city.id);
  }, []);

  // const cityClicked = () => {
  //   getCityFunc(stateID).then((res) => setallCity(res.data.result));
  //   getDistrictFunc(stateID, cityID).then((res) =>
  //     setallDistrict(res.data.result)
  //   );
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
          <div className="title">Edit Route</div>
        </div>
      </div>

      <div className="addbeat_container">
        <div className="create_route">
          <div className="select">
            <select name="state" onChange={stateHandleInput}>
              {location.state ? (
                <option value="">{location.state.state.name}</option>
              ) : (
                <option value="">State</option>
              )}
              {allState?.map((state) => (
                <option key={state.id} value={state.id}>{state.name}</option>
              ))}
            </select>
          </div>
          <div className="select">
            <select
              name="city"
              value={route.city}
              onChange={cityHandleInput}
            // onClick={() => cityClicked()}
            >
              <option value="">{location.state.city.name}</option>
              {allCity.length === 0 && <option disabled value="">No City Found</option>}
              {allCity?.map((city) => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
          </div>
          {/* <div className="select">
            <select
              name="area"
              value={route.area}
              onChange={handleInput}
            // onClick={() => districtClicked()}
            >
              <option value="">{location.state.area.name}</option>
              {allDistrict.length === 0 && <option disabled value="">No District Found</option>}
              {allDistrict?.map((district) => (
                  <option value={district._id}>{district.name}</option>
              ))}
            </select>
          </div> */}
          <div className="select">
            <input
              type="text"
              name="route_name"
              value={route.route_name}
              onChange={handleInput}
              placeholder="Route Name"
            />
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
          </div>
          <div className="select">
            <input
              type="text"
              name="end_point"
              value={route.end_point}
              onChange={handleInput}
              placeholder="End Point"
            />
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
        <div className="btn changepass_btn" onClick={() => editRouteFunc()}>
          {btnLoading ? (
            <CircularProgress style={{ color: "#fff" }} size={26} />
          ) : (
            "Edit Route"
          )}
        </div>
      </div>
    </div>
  );
};

export default EditRoute;
