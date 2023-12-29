import "./Profile.css";
import React, { useContext, useState } from "react";
import group from "../../images/group.png";

import Avatar from "@mui/material/Avatar";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { AdminContext } from "../../App";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

import { blankValidator, emailValidator } from "../../utils/Validation";
import { getBaseUrl } from "../../utils/baseUrl";

import { FaCloudUploadAlt } from "react-icons/fa";
import getStateFunc, { getCityFunc, getCountries, getDistrictFunc, } from "../../api/locationAPI";

const Profile = () => {
  const { state, dispatch } = useContext(AdminContext);
  console.log("Profile State", state && state);

  const [btnLoading, setbtnLoading] = useState(false);

  const [allCountries, setallCountries] = useState([]);
  const [allState, setallState] = useState([]);
  const [allCity, setallCity] = useState([]);
  const [allDistrict, setallDistrict] = useState([]);

  const [stateID, setstateID] = useState("");
  const [cityID, setcityID] = useState("");
  const [districtID, setdistrictID] = useState("");

  const [countryName, setcountryName] = useState("");
  const [stateName, setstateName] = useState("");
  const [cityName, setcityName] = useState("");
  const [districtName, setdistrictName] = useState("");

  let [details, setdetails] = useState({
    companyName: state?.result?.company_name || "",
    contactPersonName: state?.result?.contactPersonName || "",
    email: state?.result?.email || "",
    phone: state?.result?.phone || "",
    companyAddress: state?.result?.companyAddress || "",
    pincode: state?.result?.pincode || "",
    country: state?.result?.country?.id || "",
    state: state?.result?.state?.id || "",
    city: state?.result?.city?.id || "",
    district: state?.result?.district?.id || "",

    GSTNo: state?.result?.GSTNo || "",
    companyCatagory: state?.result?.companyCatagory || "",
    companyShortCode: state?.result?.companyShortCode || "",
    companyDescription: state?.result?.companyDescription || "",
    companyType: state?.result?.companyType || "",
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
    Object.values(error).map(item => item.status = false)
    setdetails({ ...details, [e.target.name]: e.target.value });
  };

  const [profilePic, setprofilePic] = useState(state?.result?.profileImage);
  const [signaturePic, setsignaturePic] = useState(
    state?.result?.signatureImage || false
  );

  const changePicFunc = async (e) => {
    const token = localStorage.getItem("token");

    const file = e.target.files[0];
    // setprofilePic(URL.createObjectURL(file));

    let url = getBaseUrl() + "auth_api/profileImage";
    const fd = new FormData();
    fd.append("profile_image", file);
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    try {
      let res = await axios.post(url, fd, config);
      // console.log(res);
      if (res.data.status) {
        setprofilePic(res.data.result.profileImage);
        getadminprofile();
        toast.success("Profile Pic Updated Successfully!");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addSignaturePicFunc = async (e) => {
    const token = localStorage.getItem("token");

    const file = e.target.files[0];
    // console.log(file);
    // setprofilePic(URL.createObjectURL(file));

    let url = getBaseUrl() + "auth_api/addSignature";
    const fd = new FormData();
    fd.append("signature_image", file);
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    try {
      let res = await axios.post(url, fd, config);
      // console.log(res);
      if (res.data.status) {
        setsignaturePic(res.data.result.signatureImage);
        getadminprofile();
        toast.success("Signature Pic Updated Successfully!");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeSignaturePicFunc = async () => {
    const token = localStorage.getItem("token");

    let url = getBaseUrl() + "auth_api/removeSignature";
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    try {
      let res = await axios.get(url, config);
      // console.log(res);
      if (res.data.status) {
        setsignaturePic(false);
        getadminprofile();
        toast.success("Signature Pic Deleted Successfully!");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log("de", details)

  const updateProfileFunc = async () => {
    const token = localStorage.getItem("token");

    let re = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    // console.log(re.test(details.GSTNo));

    if (!re.test(details.GSTNo)) {
      return setError({
        ...error,
        gst: {
          status: true,
        },
      });
    }
    if (!blankValidator(details.email)) {
      return setError({
        ...error,
        email: {
          status: true,
        },
      });
    }
    if (!emailValidator(details.email)) {
      return setError({
        ...error,
        validEmail: {
          status: true,
        },
      });
    }

    // return console.log(details);

    try {
      setbtnLoading(true);
      var data = JSON.stringify(details);

      var config = {
        method: "post",
        url: getBaseUrl() + "auth_api/updateProfile",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        data: details,
      };
      let res = await axios(config);
      // console.log(res);

      if (res.data.status) {
        getadminprofile();
        setbtnLoading(false);
        toast.success("Profile Updated Successfully!");
      } else {
        setbtnLoading(false);
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      setbtnLoading(false);
      // toast.error(error.message);
    }
  };

  const getadminprofile = async () => {
    const token = localStorage.getItem("token");

    try {
      var config = {
        method: "get",
        url: getBaseUrl() + "auth_api/getadminprofile",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      };
      let res = await axios(config);
      if (res.data.status) {
        setstateID(res.data.result[0].state.id);
        setcityID(res.data.result[0].city.id);
        setcountryName(res.data.result[0].country.name);
        setstateName(res.data.result[0].state.name);
        setcityName(res.data.result[0].city.name);
        setdistrictName(res.data.result[0].district?.name);
        // console.log("profile", res);
        setdetails({
          companyName: res.data.result[0].company_name || "",
          contactPersonName: res.data.result[0].contactPersonName || "",
          email: res.data.result[0].email || "",
          phone: res.data.result[0].phone || "",
          companyAddress: res.data.result[0].companyAddress || "",
          pincode: res.data.result[0].pincode || "",
          state: res.data.result[0].state?.id || "",
          city: res.data.result[0].city?.id || "",
          district: res.data.result[0].district?.id || "",

          GSTNo: res.data.result[0].GSTNo || "",
          companyCatagory: res.data.result[0].companyCatagory || "",
          companyShortCode: res.data.result[0].companyShortCode || "",
          companyDescription: res.data.result[0].companyDescription || "",
          // companyType: res.data.result[0].companyType || "",
        });
        setprofilePic(res.data.result[0].profileImage);
        setsignaturePic(res.data.result[0].signatureImage);

        dispatch({
          type: "ADMIN",
          payload: { ...state, result: res.data.result[0] },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const countryHandleInput = async (e) => {
    setdetails({ ...details, [e.target.name]: e.target.value });
    try {
      getStateFunc(e.target.value).then((res) => setallState(res.data.result));
    } catch (error) {
      console.log(error);
    }
  };

  const stateHandleInput = async (e) => {
    setdetails({ ...details, [e.target.name]: e.target.value });
    setstateID(e.target.value);
    try {
      getCityFunc(e.target.value).then((res) => setallCity(res.data.result));
    } catch (error) {
      console.log(error);
    }
  };

  const districtHandleInput = async (e) => {
    // console.log(e.target.value);
    setcityID(e.target.value);
    setdetails({ ...details, [e.target.name]: e.target.value });
    try {
      getDistrictFunc(stateID, e.target.value).then((res) =>
        setallDistrict(res.data.result)
      );
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(allCity);
  // console.log(allDistrict);

  useEffect(() => {
    getadminprofile();
    // getStateFunc().then((res) => setallState(res.data.result));
    getCountries().then((res) => setallCountries(res.data.result));
  }, []);

  const stateClicked = () => {
    getCityFunc(stateID).then((res) => setallCity(res.data.result));
  };

  const districtClicked = () => {
    getDistrictFunc(stateID, cityID).then((res) =>
      setallDistrict(res.data.result)
    );
  };

  return (
    <>
      {state && (
        <div className="container">
          <div className="dash_heading">
            <div className="icon">
              <img style={{ height: 40, width: 40 }} src={group} alt="icon" />
            </div>
            <div className="title">Profile</div>
          </div>
          <div className="profile_container">
            <h4>Basic Details</h4>
            <div className="profile_details">
              <div className="avatar">
                <Avatar
                  alt="Profile Pic"
                  src={profilePic}
                  style={{ height: "8rem", width: "8rem" }}
                // onClick={handleClick}
                />
                <label>
                  <CameraAltIcon className="camera_icon" />
                  <input
                    type="file"
                    onChange={(e) => changePicFunc(e)}
                    name="myfile"
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>

            <div className="profile_feilds">
              <div className="left">
                <div className="profile_form">
                  <input
                    type="text"
                    name="companyName"
                    value={details.companyName}
                    onChange={handleInput}
                    placeholder="Company Name"
                  />
                  {/* <input
                    type="text"
                    name="email"
                    value={details.email}
                    // onChange={handleInput}
                    placeholder="Email ID"
                  /> */}
                  <div className="email_input">{details.email}</div>
                  {error.email.status && (
                    <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}  >
                      Please Enter Email
                    </p>
                  )}
                  {error.validEmail.status && (
                    <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }} >
                      Please Enter Valid Email
                    </p>
                  )}
                  {/* <select disabled name="country" onChange={countryHandleInput}>
                    <option value="">{countryName || "Country"}</option>
                    {allCountries?.map((country) => (
                      <option key={country.id} value={country.id}>{country.name}</option>
                    ))}
                  </select> */}
                  <input disabled type="text" value={countryName || "Country"}/>
                  <select
                    name="city"
                    value={details.city}
                    onChange={districtHandleInput}
                    onClick={() => stateClicked()}
                  >
                    <option value="">{cityName || "City"}</option>
                    {allCity?.map((city) => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="companyAddress"
                    value={details.companyAddress}
                    onChange={handleInput}
                    placeholder="Company Address"
                  />
                  {/* <select
                    name="district"
                    value={details.district}
                    onChange={handleInput}
                    onClick={() => districtClicked()}
                  >
                    <option disabled value="">{districtName || "Locality"}</option>
                    {allDistrict.length === 0 && <option value="">No District Found</option>}
                    {allDistrict?.map((district) => (
                        <option key={district._id} value={district._id}>{district.name}</option>
                    ))}
                  </select> */}
                </div>
              </div>
              <div className="right">
                <div className="profile_form">
                  <input
                    type="text"
                    name="contactPersonName"
                    value={details.contactPersonName}
                    onChange={handleInput}
                    placeholder="Contact Person Name"
                  />
                  <input
                    type="number"
                    name="phone"
                    value={details.phone}
                    onChange={(e) => {
                      if (e.target.value.length > 10) return;
                      handleInput(e)
                    }}
                    placeholder="Mobile Number"
                  />
                  <select name="state" onChange={stateHandleInput}>
                    <option value="">{stateName || "State"}</option>
                    {allState.length === 0 && <option disabled value="">No State Found</option>}
                    {allState?.map(state => (
                      <option key={state.id} value={state.id}>{state.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    name="pincode"
                    value={details.pincode}
                    onChange={(e) => {
                      if (e.target.value.length > 6) return;
                      handleInput(e)
                    }}
                    placeholder="Pincode"
                  />

                  <div className="input">
                    <span style={{ marginLeft: "-4rem" }}>
                      {signaturePic ? (
                        <img
                          style={{ height: "3rem", width: "10rem" }}
                          src={signaturePic}
                          alt="signature"
                        />
                      ) : (
                        "SIGNATURE"
                      )}
                    </span>
                    <label>
                      <FaCloudUploadAlt className="signature_icon" />
                      <input
                        type="file"
                        onChange={(e) => addSignaturePicFunc(e)}
                        name="myfile"
                        accept="image/*"
                        style={{ display: "none" }}
                      />
                      <div className="signature_actions">
                        <div
                          className="dialog_link"
                          style={{ fontWeight: 600, cursor: "pointer" }}
                        >
                          Change
                        </div>
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            if (!signaturePic) {
                              return toast.error("No Signaute Image found!");
                            }
                            removeSignaturePicFunc();
                          }}
                          className="dialog_link"
                          style={{ fontWeight: 600, cursor: "pointer" }}
                        >
                          Remove
                        </div>
                      </div>
                    </label>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div className="profile_container">
            <h4>Company Details</h4>
            <div className="profile_feilds profile_feilds_2">
              <div className="left">
                <div className="profile_form">
                  <input
                    type="text"
                    name="GSTNo"
                    value={details.GSTNo}
                    onChange={(e) => {
                      if (e.target.value.length > 15) return;
                      handleInput(e)
                    }}
                    placeholder="GST No."
                  />
                  {error.gst.status && (
                    <p
                      style={{ width: "98%", fontSize: "0.9rem", color: "red" }}
                    >
                      Please Enter Valid GST Number
                    </p>
                  )}

                  {/* <select
                    name="companyCatagory"
                    value={details.companyCatagory}
                    onChange={handleInput}
                  >
                    <option value="">Company Category</option>
                    <option>IT</option>
                    <option>E-Commerce</option>
                  </select> */}
                </div>
              </div>
              <div className="right">
                <div className="profile_form">
                  <input
                    type="text"
                    name="company_name"
                    value={details.companyShortCode}
                    onChange={handleInput}
                    placeholder="Short Code (Autogenerated)"
                  />
                  {/* <input
                    type="text"
                    name="companyType"
                    value={details.companyType}
                    onChange={handleInput}
                    placeholder="Company Type"
                  /> */}
                </div>
              </div>
            </div>
            <div className="profile_feilds profile_feilds_2">
              <div className="left profile_form_2">
                <div className="profile_form profile_form_2">
                  <select
                    name="companyCatagory"
                    value={details.companyCatagory}
                    onChange={handleInput}
                  >
                    <option value="">Company Category</option>
                    <option>IT</option>
                    <option>E-Commerce</option>
                  </select>
                  <textarea
                    type="text"
                    name="companyDescription"
                    value={details.companyDescription}
                    onChange={handleInput}
                    placeholder="Company Description"
                    className="company_desc"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="btn" onClick={() => updateProfileFunc()}>
            {btnLoading ? (
              <CircularProgress style={{ color: "#fff" }} size={26} />
            ) : (
              "SUBMIT"
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
