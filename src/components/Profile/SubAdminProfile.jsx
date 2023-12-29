import "./SubAdminProfile.css";
import React, { useEffect, useState } from "react";
import group from "../../images/group.png";

import Avatar from "@mui/material/Avatar";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import getStateFunc, {
  getCityFunc,
  getDistrictFunc,
} from "../../api/locationAPI";
import fetchAllRole from "../../api/roleAPI";
import { addSubAdmin } from "../../api/subAdminAPI";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate()
  const [btnLoading, setbtnLoading] = useState(false);
  const [profilePic, setprofilePic] = useState(null);
  const [demoProfilePic, setdemoProfilePic] = useState();

  const [allRole, setallRole] = useState([]);
  const [allState, setallState] = useState([]);
  const [allCity, setallCity] = useState([]);
  const [allDistrict, setallDistrict] = useState([]);
  const [stateID, setstateID] = useState("");

  const [subadmin, setsubadmin] = useState({
    name: "",
    email: "",
    state: "",
    district: "",
    role: "",
    phone: "",
    address: "",
    pincode: "",
    city: "",
    password: "",
  });

  const [error, setError] = useState({
    name: {
      status: false,
    },
    phone: {
      status: false,
    },
    password: {
      status: false,
    },
    email: {
      status: false,
    },
    address: {
      status: false,
    },
  });

  const handleInput = (e) => {
    setError({
      name: {
        status: false,
      },
      phone: {
        status: false,
      },
      password: {
        status: false,
      },
      email: {
        status: false,
      },
      address: {
        status: false,
      },
    });

    setsubadmin({ ...subadmin, [e.target.name]: e.target.value });
    console.log(subadmin);
  };

  const changePicFunc = (e) => {
    // console.log(e)

    let file = e.target.files[0];
    setprofilePic(file);
    setdemoProfilePic(URL.createObjectURL(file));
  };

  const addAdminFunc = async () => {
    if (!profilePic) {
      return toast.error("Please Select Profile Pic First");
    }

    // console.log(profilePic, subadmin);

    try {
      setbtnLoading(true);
      let res = await addSubAdmin(profilePic, subadmin);
      // console.log(res);
      if (res.data.status) {
        toast.success("Sub-Admin created Successfully!");
        navigate("/subadmin_list");
        setbtnLoading(false);
      } else {
        toast.error(res.data.message);
        setbtnLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Location API

  const stateHandleInput = async (e) => {
    setstateID(e.target.value);
    setsubadmin({ ...subadmin, [e.target.name]: e.target.value });
    try {
      getCityFunc(e.target.value).then((res) => setallCity(res.data.result));
    } catch (error) {
      console.log(error);
    }
  };

  const cityHandleInput = async (e) => {
    // console.log(e.target.value);
    setsubadmin({ ...subadmin, [e.target.name]: e.target.value });
    try {
      getDistrictFunc(stateID, e.target.value).then((res) =>
        setallDistrict(res.data.result)
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStateFunc().then((res) => setallState(res.data.result));
    fetchAllRole().then((res) => setallRole(res.data.result));
  }, []);

  return (
    <div className="container">
      <div className="dash_heading">
        <div className="icon">
          <img src={group} alt="icon" />
        </div>
        <div className="title">Sub -Admin</div>
      </div>
      <div className="subadmin_container">
        <h4>Company Details</h4>

        <div className="subadmin_form">
          <div className="left">
            <div className="avatar">
              <Avatar
                alt="Profile Pic"
                src={demoProfilePic || profilePic}
                style={{ height: "8rem", width: "8rem" }}
                // onClick={handleClick}
              />
              <label>
                <CameraAltIcon className="camera_icon" />
                <input
                  type="file"
                  onChange={(e) => changePicFunc(e)}
                  name="myfile"
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </div>

          <div className="right">
            <div className="input_form">
              <input
                type="text"
                name="name"
                value={subadmin.name}
                onChange={handleInput}
                placeholder="Name"
              />
              <input
                type="text"
                name="email"
                value={subadmin.email}
                onChange={handleInput}
                placeholder="Email ID"
              />

              <select name="state" onChange={stateHandleInput}>
                <option value="">State</option>
                {allState?.map((state) => (
                    <option key={state.id} value={state.id}>{state.name}</option>
                ))}
              </select>
              <select
                name="district"
                value={subadmin.district}
                onChange={handleInput}
              >
                <option value="">Locality</option>
                {allDistrict?.map((district) => (
                  <>
                    <option value={district._id}>{district.name}</option>
                  </>
                ))}
              </select>
              <select name="role" value={subadmin.role} onChange={handleInput}>
                <option value="">Role</option>
                {allRole?.map((role) => (
                  <option value={role._id}>{role.rolename}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="right">
            <div className="input_form">
              <input
                type="number"
                name="phone"
                value={subadmin.phone}
                onChange={handleInput}
                placeholder="Mobile Number"
              />
              <input
                type="text"
                name="address"
                value={subadmin.address}
                onChange={handleInput}
                placeholder="Address"
              />
              <select
                name="city"
                value={subadmin.city}
                onChange={cityHandleInput}
              >
                <option value="">City</option>

                {allCity?.map((city) => (
                  <>
                    <option value={city._id}>{city.name}</option>
                  </>
                ))}
              </select>
              <input
                type="number"
                name="pincode"
                value={subadmin.pincode}
                onChange={handleInput}
                placeholder="Pincode"
              />
              <input
                type="text"
                name="password"
                value={subadmin.password}
                onChange={handleInput}
                placeholder="Password"
              />
            </div>
          </div>
        </div>
        <div className="btn changepass_btn" onClick={() => addAdminFunc()}>
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

export default ChangePassword;
