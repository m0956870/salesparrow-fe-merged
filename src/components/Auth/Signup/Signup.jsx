import "./Signup.css";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Images
import logo from "../../../images/logo.png";
import logo_1 from "../../../images/logo_1.png";
import axios from "axios";

import { blankValidator, emailValidator } from "../../../utils/Validation";
import { getBaseUrl } from "../../../utils/baseUrl";

import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

import { FaEye } from "react-icons/fa";
import { BsFillEyeSlashFill } from "react-icons/bs";

import getStateFunc, { getCityFunc, getCountries } from "../../../api/locationAPI";

const Signup = () => {
  const navigate = useNavigate();

  const [btnLoading, setbtnLoading] = useState(false);

  const [allCountries, setallCountries] = useState([]);
  const [allState, setallState] = useState([]);
  const [allCity, setallCity] = useState([]);

  useEffect(() => {
    getCountries().then((res) => setallCountries(res.data.result));
  }, []);

  const [user, setUser] = useState({
    companyName: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    GSTNo: "",
    password: "",
    c_password: "",
  });

  const [showPass, setShowPass] = useState({
    pass: false,
    cpass: false,
  });

  const [error, setError] = useState({
    companyName: {
      status: false,
    },
    email: {
      status: false,
    },
    validEmail: {
      status: false,
    },
    phone: {
      status: false,
    },
    city: {
      status: false,
    },
    country: {
      status: false,
    },
    state: {
      status: false,
    },
    pincode: {
      status: false,
    },
    GSTNo: {
      status: false,
    },
    gst: {
      status: false,
    },
    password: {
      status: false,
    },
    shortpassword: {
      status: false,
    },
    c_password: {
      status: false,
    },
    c_passwordMatch: {
      status: false,
    },
  });

  const handleInput = (e) => {
    setbtnLoading(false);

    Object.values(error).map(item => item.status = false)
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const countryHandleInput = async (e) => {
    Object.values(error).map(item => item.status = false)
    setUser({ ...user, [e.target.name]: e.target.value });

    getStateFunc(e.target.value).then((res) => setallState(res.data.result));
  };

  const stateHandleInput = async (e) => {
    Object.values(error).map(item => item.status = false)
    setUser({ ...user, [e.target.name]: e.target.value });

    getCityFunc(e.target.value, user.country).then((res) => setallCity(res.data.result));
  };

  // console.log(user);
  // console.log(allState);
  // console.log(allCity);


  const signupFunc = async () => {
    if (!blankValidator(user.companyName)) {
      return setError({
        ...error,
        companyName: {
          status: true,
        },
      });
    }
    if (!blankValidator(user.email)) {
      return setError({
        ...error,
        email: {
          status: true,
        },
      });
    }
    if (!emailValidator(user.email)) {
      return setError({
        ...error,
        validEmail: {
          status: true,
        },
      });
    }
    if (!blankValidator(user.phone)) {
      return setError({
        ...error,
        phone: {
          status: true,
        },
      });
    }
    if (!blankValidator(user.country)) {
      return setError({
        ...error,
        country: {
          status: true,
        },
      });
    }
    if (!blankValidator(user.state)) {
      return setError({
        ...error,
        state: {
          status: true,
        },
      });
    }
    if (!blankValidator(user.city)) {
      return setError({
        ...error,
        city: {
          status: true,
        },
      });
    }
    if (!blankValidator(user.pincode)) {
      return setError({
        ...error,
        pincode: {
          status: true,
        },
      });
    }
    if (!blankValidator(user.GSTNo)) {
      return setError({
        ...error,
        GSTNo: {
          status: true,
        },
      });
    }

    let re = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    // console.log(re.test(details.GSTNo));
    if (!re.test(user.GSTNo)) {
      return setError({
        ...error,
        gst: {
          status: true,
        },
      });
    }
    if (!blankValidator(user.password)) {
      return setError({
        ...error,
        password: {
          status: true,
        },
      });
    }
    if (user.password.length < 6) {
      return setError({
        ...error,
        shortpassword: {
          status: true,
        },
      });
    }
    if (!blankValidator(user.c_password)) {
      return setError({
        ...error,
        c_password: {
          status: true,
        },
      });
    }
    if (user.password !== user.c_password) {
      return setError({
        ...error,
        c_passwordMatch: {
          status: true,
        },
      });
    }

    console.log(user);

    try {
      setbtnLoading(true);

      let res = await axios.post(getBaseUrl() + "auth_api/register", user);
      console.log(res.data);
      if (res.data.status) {
        toast.success("Signup Successfully!");
        // toast.success(res.data.message);
        navigate("/login");
        setbtnLoading(false);
      } else {
        setbtnLoading(false);
        toast.error(res.data.message);
      }
    } catch (error) {
      setbtnLoading(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <div id="signup_container">
        <div className="left">
          <div className="logo">
            <img src={logo} alt="salesparrow" />
          </div>
        </div>

        <div className="right">
          <div className="main">
            <div className="signup_head_img">
              <img src={logo_1} alt="salesparrow" />
            </div>
            <div className="signup_form">
              <input
                type="text"
                name="companyName"
                value={user.companyName}
                onChange={handleInput}
                placeholder="Company Name"
                autoComplete={false}
              />
              {error.companyName.status && (
                <p className="error_p">Please Enter Company Name</p>
              )}
              <input
                type="text"
                name="email"
                value={user.email}
                onChange={handleInput}
                placeholder="Email ID"
              />
              {error.email.status && (
                <p className="error_p">Please Enter Email</p>
              )}
              {error.validEmail.status && (
                <p className="error_p">Please Enter Valid Email</p>
              )}
              <input
                type="number"
                name="phone"
                value={user.phone}
                onChange={(e) => {
                  if (e.target.value.length > 10) return;
                  handleInput(e)
                }}
                placeholder="Enter Mobile Number"
              />
              {error.phone.status && (
                <p className="error_p">Enter Mobile Number</p>
              )}

              {/* Country & State */}
              <div className="half">
                <select name="country" onChange={countryHandleInput}>
                  <option value="">Country</option>
                  {allCountries?.map((country) => (
                    <option key={country.id} value={country.id}>{country.name}</option>
                  ))}
                </select>
                <select name="state" onChange={stateHandleInput}>
                  <option value="">State</option>
                  {allState?.length === 0 && <option disabled value="">No State Found</option>}
                  {allState?.map((state) => (
                    <option key={state.id} value={state.id}>{state.name}</option>
                  ))}
                </select>
              </div>
              <div className="half">
                <div>
                  {error.country.status && <p className="signup_p_error">Select Country</p>}
                </div>
                <div>
                  {error.state.status && <p className="signup_p_error">Enter State</p>}
                </div>
              </div>


              {/* City & Pincode */}
              <div className="half">
                <select name="city" onChange={handleInput}>
                  <option value="City">City</option>
                  {allCity?.map((city) => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  name="pincode"
                  value={user.pincode}
                  onChange={(e) => {
                    if (e.target.value.length > 6) return;
                    handleInput(e)
                  }}
                  placeholder="Pincode"
                />
              </div>
              <div className="half">
                <div>
                  {error.city.status && <p className="signup_p_error">Enter City</p>}
                </div>
                <div>
                  {error.pincode.status && <p className="signup_p_error">Enter Pincode</p>}
                </div>
              </div>

              <input
                type="text"
                name="GSTNo"
                value={user.GSTNo}
                onChange={(e) => {
                  if (e.target.value.length > 15) return;
                  handleInput(e)
                }}
                placeholder="GST No."
              />
              {error.GSTNo.status && (
                <p className="error_p">Enter GST Number</p>
              )}
              {error.gst.status && (
                <p className="error_p">Please Enter Valid GST Number</p>
              )}
              <div
                className="cp_parent"
                style={{ position: "relative", width: " 100%" }}
              >
                <input
                  type={showPass.pass ? "text" : "password"}
                  name="password"
                  value={user.password}
                  onChange={handleInput}
                  placeholder="Password"
                />
                <span className="pass_icon_signup">
                  {showPass.pass ? (
                    <BsFillEyeSlashFill
                      style={{
                        margin: "0 0.3rem",
                        fontSize: "1rem",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setShowPass({ ...showPass, pass: false });
                      }}
                    />
                  ) : (
                    <FaEye
                      style={{
                        margin: "0 0.3rem",
                        fontSize: "1rem",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setShowPass({ ...showPass, pass: true });
                      }}
                    />
                  )}
                </span>
              </div>
              {error.password.status && (
                <p className="error_p">Enter Password</p>
              )}
              {error.shortpassword.status && (
                <p className="error_p">Password length should be 6</p>
              )}

              <div
                className="cp_parent"
                style={{ position: "relative", width: " 100%" }}
              >
                <input
                  type={showPass.cpass ? "text" : "password"}
                  name="c_password"
                  value={user.c_password}
                  onChange={handleInput}
                  placeholder="Confirm Password"
                />
                <span className="pass_icon_signup">
                  {showPass.cpass ? (
                    <BsFillEyeSlashFill
                      style={{
                        margin: "0 0.3rem",
                        fontSize: "1rem",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setShowPass({ ...showPass, cpass: false });
                      }}
                    />
                  ) : (
                    <FaEye
                      style={{
                        margin: "0 0.3rem",
                        fontSize: "1rem",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setShowPass({ ...showPass, cpass: true });
                      }}
                    />
                  )}
                </span>
              </div>
              {error.c_password.status && (
                <p className="error_p">Enter Confirm Password</p>
              )}
              {error.c_passwordMatch.status && (
                <p className="error_p">Password Didn't Match</p>
              )}

              <button onClick={() => signupFunc()}>
                {btnLoading ? (
                  <CircularProgress style={{ color: "#fff" }} size={26} />
                ) : (
                  "SIGN UP"
                )}
              </button>
              <div className="signup_link_bottom">
                <span>
                  Already have an account?{" "}
                  <Link
                    className="fp_link"
                    to="/login"
                    style={{ display: "inline" }}
                  >
                    Sign in
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
