// import "./AddParty.css";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import group from "../../images/group.png";
import Avatar from "@mui/material/Avatar";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

import { blankValidator, emailValidator } from "../../utils/Validation";
import { CircularProgress } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

import getStateFunc, {
  getCityFunc,
  getDistrictFunc,
} from "../../api/locationAPI";
import { editImageParty, editParty, editPartyPic, getPartyType, getSingleParty } from "../../api/partyAPI";
import { toast } from "react-toastify";
import fetchAllRoute, { fetchPartyRoute } from "../../api/routeAPI";
import isAllowed from "../../utils/isAllowed";
import { PARTY_MANAGEMENT } from "../../constants";

const AddParty = () => {
  const location = useLocation();
  // console.log(location && location.state);
  const navigate = useNavigate();

  const [partyTypes, setpartyTypes] = useState()

  const [party, setparty] = useState({
    id: location.state && location.state.id,
    partyType: "",
    GSTNo: location.state?.GSTNo || undefined,
    mobileNo: location.state?.mobileNo || undefined,
    pincode: location.state?.pincode || undefined,
    district: "",
    address1: "",
    address2: "",
    DOA: location.state?.DOA || "",

    firmName: location.state?.firmName || "",
    contactPersonName: location.state?.contactPersonName || "",
    email: location.state?.email || "",
    state: "",
    city: "",
    DOB: location.state?.DOB || "",
    route: [],
  });

  const [error, setError] = useState({
    email: {
      status: false,
    },
    validEmail: {
      status: false,
    },
    gst: {
      status: false,
    },
  });

  const handleInput = (e) => {
    setError({
      email: {
        status: false,
      },
      validEmail: {
        status: false,
      },
      gst: {
        status: false,
      },
    });
    setparty({ ...party, [e.target.name]: e.target.value });
    // console.log(party);
  };

  const [btnLoading, setbtnLoading] = useState(false);

  const [allState, setallState] = useState([]);
  const [allCity, setallCity] = useState([]);
  const [allDistrict, setallDistrict] = useState([]);

  const [stateID, setstateID] = useState(location.state?.state?.id);
  const [cityID, setcityID] = useState(location.state?.city?.id);
  const [districtID, setdistrictID] = useState(location.state?.district?.id);

  const [allRouts, setallRouts] = useState([]);

  const [profilePic, setprofilePic] = useState(location.state?.image);
  const [demoProfilePic, setdemoProfilePic] = useState();

  const [selectedVal, setselectedVal] = useState([]);

  const selectedValFunc = (e) => {
    let route = JSON.parse(e.target.value);
    // console.log(route);

    if (!party.route.includes(route.id)) {
      party.route.push(route.id);
    }

    let routeName = route.route_name;
    // console.log(routeName);

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

  const removeItemFunc = (sItem) => {
    // console.log(sItem);
    const filtered = selectedVal.filter((item) => item !== sItem);
    setselectedVal(filtered);
    let rest = party.route.filter((item) => item != sItem.id);
    setparty({ ...party, route: rest });
  };

  // useEffect(() => {
  //   fetchAllRoute().then((res) => setallRouts(res.data.result));
  // }, []);
  useEffect(() => {
    // fetchAllRoute(1, stateID).then((res) => setallRouts(res.data.result));
    // fetchPartyRoute(stateID, cityID).then(res => setallRouts(res.data.result))
    fetchPartyRoute({ state: stateID, city: cityID }).then(res => setallRouts(res.data.result))
  }, [stateID]);

  const editPartyFunc = async () => {
    // return console.log(party)
    setbtnLoading(true)
    if (!await isAllowed(PARTY_MANAGEMENT)) {
      toast.error("Module is not purchased!");
      return setbtnLoading(false);
    }

    let re = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    // console.log(re.test(details.GSTNo));
    if (!re.test(party.GSTNo)) {
      return setError({
        ...error,
        gst: {
          status: true,
        },
      });
    }

    if (!blankValidator(party.email)) {
      return setError({
        ...error,
        email: {
          status: true,
        },
      });
    }
    if (!emailValidator(party.email)) {
      return setError({
        ...error,
        validEmail: {
          status: true,
        },
      });
    }

    // console.log(party);

    let routeStr = party.route.join(",").trim();
    // console.log(routeStr);
    let newParty = { ...party, route: routeStr };
    // console.log(newParty);

    let res = await editParty(newParty);
    if (res.data.status) {
      toast.success("Party edited successfully!");
      navigate("/party");
      setbtnLoading(false);
    } else {
      toast.error(res.data.message);
      setbtnLoading(false);
    }
  };

  // const addPartyPicFunc = async (e) => {
  //   console.log("add", party);
  //   let file = e.target.files[0];
  //   setprofilePic(file);
  //   setdemoProfilePic(URL.createObjectURL(file));
  // };

  const editPartyPicFunc = async (e) => {
    const file = e.target.files[0];
    // console.log(file);
    try {
      let res = await editPartyPic(file, location.state.id);
      // console.log(res);
      if (res.data.status) {
        setprofilePic(res.data.result.image);
      } else {
        toast.error("Error while uploading image!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Internet Error!");
    }
  };

  // Location API
  const stateHandleInput = async (e) => {
    setparty({ ...party, [e.target.name]: e.target.value });
    setstateID(e.target.value);
    try {
      getCityFunc(e.target.value).then((res) => setallCity(res.data.result));
    } catch (error) {
      console.log(error);
      // toast.error("Internet Error!");
    }
  };

  const cityHandleInput = async (e) => {
    // console.log(e.target.value);
    setcityID(e.target.value)
    setparty({ ...party, [e.target.name]: e.target.value });
    try {
      getDistrictFunc(stateID, e.target.value).then((res) =>
        setallDistrict(res.data.result)
      );
      fetchPartyRoute(stateID, e.target.value).then(res => setallRouts(res.data.result))
    } catch (error) {
      console.log(error);
      // toast.error("Internet Error!");
    }
  };

  let stateClicked = () => {
    getCityFunc(stateID).then((res) => setallCity(res.data.result));
  };

  const districtClicked = () => {
    getDistrictFunc(stateID, cityID).then((res) =>
      setallDistrict(res.data.result)
    );
  };

  const routeClicked = () => {
    fetchPartyRoute(stateID, cityID).then(res => setallRouts(res.data.result))
  };

  // console.log(party);

  const getPartyFunc = async () => {
    try {
      let res = await getSingleParty(location.state.id);
      // console.log(res.data.result);


      if (res.data.status) {
        let { address1, address2 } = res.data.result
        setparty({ ...party, address1, address2 })

        res.data.result.route.map((route) => {
          party.route.push(route.id);

          let routeName = route.route_name;
          // console.log(routeName);

          setselectedVal((prev) => [
            ...prev,
            {
              id: route.id,
              name: routeName,
            },
          ]);
        });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPartyFunc();
    getPartyTypeFunc()
    getStateFunc().then((res) => setallState(res.data.result));
  }, []);

  const getPartyTypeFunc = async () => {
    try {
      let res = await getPartyType()
      // console.log(res)
      if (res.data.status) {
        setpartyTypes(res.data.result)
      }
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
            {location.state === null ? "Add Party" : "Edit Party"}
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
            // onClick={editPartyPicFunc}
            />
            <label>
              <CameraAltIcon className="camera_icon" />
              <input
                type="file"
                onChange={editPartyPicFunc}
                name="myfile"
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>

        <div className="addbeat_form addemployee_form">
          <div className="addbeat_left">
            <select
              name="partyType"
              value={party.partyType}
              onChange={handleInput}
            >
              <option value="">{location.state.partyType}</option>
              {partyTypes?.map((type) => (
                <option key={type._id} value={type._id}>{type.party_type}</option>
              ))}
            </select>
            <input
              type="text"
              name="GSTNo"
              value={party.GSTNo}
              onChange={(e) => {
                if (e.target.value.length > 15) return;
                handleInput(e)
              }}
              placeholder="GST Number"
            />
            {error.gst.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please enter valid GST number
              </p>
            )}
            <input
              type="number"
              name="mobileNo"
              value={party.mobileNo}
              onChange={(e) => {
                if (e.target.value.length > 10) return;
                handleInput(e)
              }}
              placeholder="Mobile Number"
            />
            <input
              type="number"
              name="pincode"
              value={party.pincode}
              onChange={(e) => {
                if (e.target.value.length > 6) return;
                handleInput(e)
              }}
              placeholder="Pincode"
            />
            <select
              name="city"
              value={party.city}
              onChange={cityHandleInput}
            // onClick={() => stateClicked()}
            >
              <option value="">{location.state.city.name}</option>
              {allCity.length === 0 && <option disabled value="">No City Found</option>}
              {allCity?.map((city) => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
            <input
              type="text"
              name="address1"
              value={party.address1}
              onChange={handleInput}
              placeholder="Address 1"
            />
            <input
              type="text"
              onClick={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              name="DOA"
              value={party.DOA}
              onChange={handleInput}
              placeholder="D.O.A"
            />
          </div>

          <div className="addbeat_right" style={{ alignSelf: "flex-start" }}>
            <input
              type="text"
              name="firmName"
              value={party.firmName}
              onChange={handleInput}
              placeholder="firm Name"
            />
            <input
              type="text"
              name="contactPersonName"
              value={party.contactPersonName}
              onChange={handleInput}
              placeholder="Contact Person Name (Dealer/SS)"
            />
            <input
              type="text"
              name="email"
              value={party.email}
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
              name="state"
              value={party.state}
              onChange={stateHandleInput}
            >
              <option value="">{location.state.state.name}</option>
              {allState?.map((state) => (
                <option key={state.id} value={state.id}>{state.name}</option>
              ))}
            </select>

            {/* <select
              name="district"
              value={party.district}
              onChange={handleInput}
              onClick={() => districtClicked()}
            >
              <option value="">{location.state.district.name}</option>
              {allDistrict.length === 0 && <option disabled value="">No District Found</option>}
              {allDistrict?.map((district) => (
                <>
                  <option value={district._id}>{district.name}</option>
                </>
              ))}
            </select> */}
            <input
              type="text"
              name="address2"
              value={party.address2}
              onChange={handleInput}
              placeholder="Address 2"
            />
            <input
              type="text"
              onClick={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              name="DOB"
              value={party.DOB}
              onChange={handleInput}
              placeholder="D.O.B"
            />
            <select
              name="route"
              onClick={() => routeClicked()}
              onChange={selectedValFunc}
            >
              <option value="">Route</option>
              {allRouts.length === 0 && <option disabled value="">No Routes Found</option>}
              {allRouts?.map((route) => (
                <option key={route.id} value={JSON.stringify(route)}>{route.route_name}</option>
              ))}
            </select>
            <div className="seleced">
              {selectedVal &&
                selectedVal.map((item) => (
                  <span className="seleced_item">
                    {item.name}{" "}
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

        <div onClick={() => editPartyFunc()} className="btn changepass_btn">
          {btnLoading ? (
            <CircularProgress style={{ color: "#fff" }} size={26} />
          ) : (
            "EDIT PARTY"
          )}
        </div>
      </div>
    </div>
  );
};

export default AddParty;
