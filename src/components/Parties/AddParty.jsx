// import "./AddParty.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
import { addParty, getPartyType } from "../../api/partyAPI";
import { toast } from "react-toastify";
import fetchAllRoute, { fetchPartyRoute } from "../../api/routeAPI";
import isAllowed from "../../utils/isAllowed";
import { PARTY_MANAGEMENT } from "../../constants";

const AddParty = () => {
  const navigate = useNavigate();

  const [partyTypes, setpartyTypes] = useState()
  const [party, setparty] = useState({
    partyType: "",
    GSTNo: undefined,
    mobileNo: undefined,
    pincode: undefined,
    district: "",
    address1: "",
    address2: "",
    DOA: "",
    firmName: "",
    contactPersonName: "",
    email: "",
    state: "",
    city: "",
    DOB: "",
    route: [],
    status: "Active",
  });

  const [btnLoading, setbtnLoading] = useState(false);

  const [allState, setallState] = useState([]);
  const [allCity, setallCity] = useState([]);
  const [allDistrict, setallDistrict] = useState([]);
  const [stateID, setstateID] = useState("");
  const [cityID, setcityID] = useState("");

  const [allRouts, setallRouts] = useState([]);

  const [profilePic, setprofilePic] = useState();
  const [demoProfilePic, setdemoProfilePic] = useState();

  const [selectedVal, setselectedVal] = useState([]);

  const [error, setError] = useState({
    email: {
      status: false,
    },
    validEmail: {
      status: false,
    },
    partyType: {
      status: false,
    },
    firmName: {
      status: false,
    },
    mobileNo: {
      status: false,
    },
    pincode: {
      status: false,
    },
    city: {
      status: false,
    },
    state: {
      status: false,
    },
    district: {
      status: false,
    },
    address: {
      status: false,
    },
    gst: {
      status: false,
    },
  });

  useEffect(() => {
    getStateFunc().then((res) => setallState(res.data.result));
    getPartyTypeFunc()
  }, []);

  const handleInput = (e) => {
    Object.values(error).map(item => item.status = false)
    setparty({ ...party, [e.target.name]: e.target.value });
    // console.log(party);
  };

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

  const addPartyFunc = async () => {
    // return console.log(party);
    setbtnLoading(true)
    if (!await isAllowed(PARTY_MANAGEMENT)) {
      toast.error("Module is not purchased!");
      return setbtnLoading(false);
    }

    if (!blankValidator(party.partyType)) {
      return setError({
        ...error,
        partyType: {
          status: true,
        },
      });
    }
    if (!blankValidator(party.firmName)) {
      return setError({
        ...error,
        firmName: {
          status: true,
        },
      });
    }
    // let re = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    // // console.log(re.test(details.GSTNo));
    // if (!re.test(party.GSTNo)) {
    //   return setError({
    //     ...error,
    //     gst: {
    //       status: true,
    //     },
    //   });
    // }
    if (!blankValidator(party.mobileNo)) {
      return setError({
        ...error,
        mobileNo: {
          status: true,
        },
      });
    }
    // if (!blankValidator(party.email)) {
    //   return setError({
    //     ...error,
    //     email: {
    //       status: true,
    //     },
    //   });
    // }
    // if (!emailValidator(party.email)) {
    //   return setError({
    //     ...error,
    //     validEmail: {
    //       status: true,
    //     },
    //   });
    // }

    if (!blankValidator(party.pincode)) {
      return setError({
        ...error,
        pincode: {
          status: true,
        },
      });
    }
    if (!blankValidator(party.state)) {
      return setError({
        ...error,
        state: {
          status: true,
        },
      });
    }
    if (!blankValidator(party.city)) {
      return setError({
        ...error,
        city: {
          status: true,
        },
      });
    }
    // if (!blankValidator(party.district)) {
    //   return setError({
    //     ...error,
    //     district: {
    //       status: true,
    //     },
    //   });
    // }
    if (!blankValidator(party.address1)) {
      return setError({
        ...error,
        address: {
          status: true,
        },
      });
    }

    if (!profilePic) {
      return toast.error("Please Select Party Profile Pic");
    }

    // console.log(party);

    // let routeStr = party.route.join(",").trim();
    // console.log(routeStr);
    // let newParty = { ...party, route: routeStr };
    // console.log(newParty);

    let res = await addParty(profilePic, party);
    // console.log(res);
    if (res.data.status) {
      toast.success("Party created successfully!");
      navigate("/party");
      setbtnLoading(false);
    } else {
      toast.error(res.data.message);
      setbtnLoading(false);
    }
  };

  const addPartyPicFunc = async (e) => {
    // console.log("add", party);
    let file = e.target.files[0];
    setprofilePic(file);
    setdemoProfilePic(URL.createObjectURL(file));
  };

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

  // Location API
  const stateHandleInput = async (e) => {
    Object.values(error).map(item => item.status = false)
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
    Object.values(error).map(item => item.status = false)
    // console.log(e.target.value);
    setparty({ ...party, [e.target.name]: e.target.value });
    try {
      getDistrictFunc(stateID, e.target.value).then((res) => setallDistrict(res.data.result));
      fetchPartyRoute(stateID, e.target.value).then(res => setallRouts(res.data.result))
    } catch (error) {
      console.log(error);
      // toast.error("Internet Error!");
    }
  };


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
          <div className="title">Add Party</div>
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
                onChange={addPartyPicFunc}
                name="myfile"
                accept="image/*"
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
              <option value="">Party Type</option>
              {partyTypes?.map((type) => (
                <option key={type._id} value={type._id}>{type.party_type}</option>
              ))}
            </select>
            {error.partyType.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please enter party type
              </p>
            )}
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
            {error.mobileNo.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please enter mobile number
              </p>
            )}
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
            {error.pincode.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please enter pincode
              </p>
            )}
            <select
              name="city"
              value={party.city}
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
                Please enter city
              </p>
            )}
            {/* <select
              name="district"
              value={party.district}
              onChange={handleInput}
            >
              <option value="">Locality</option>
              {allDistrict.length === 0 && <option disabled value="">No District Found</option>}
              {allDistrict?.map((district) => (
                <>
                  <option value={district._id}>{district.name}</option>
                </>
              ))}
            </select> */}
            {error.district.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please enter district
              </p>
            )}
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
          </div>

          <div className="addbeat_right" style={{ alignSelf: "flex-start" }}>
            <input
              type="text"
              name="firmName"
              value={party.firmName}
              onChange={handleInput}
              placeholder="Firm Name"
            />
            {error.firmName.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please enter firm name
              </p>
            )}
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
              <option value="">State</option>
              {allState?.map((state) => (
                <option key={state.id} value={state.id}>{state.name}</option>
              ))}
            </select>
            {error.state.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please enter state
              </p>
            )}
            <input
              type="text"
              name="address1"
              value={party.address1}
              onChange={handleInput}
              placeholder="Address 1"
            />
            {error.address.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please enter address
              </p>
            )}

            <input
              type="text"
              onClick={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              name="DOA"
              value={party.DOA}
              onChange={handleInput}
              placeholder="D.O.A"
            />
            <select name="route" onChange={selectedValFunc}>
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
        <div onClick={() => addPartyFunc()} className="btn changepass_btn">
          {btnLoading ? (
            <CircularProgress style={{ color: "#fff" }} size={26} />
          ) : (
            "ADD PARTY"
          )}
        </div>
      </div>
    </div>
  );
};

export default AddParty;
