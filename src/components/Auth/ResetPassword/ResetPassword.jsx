import "./ResetPassword.css";
import React, { useState } from "react";

// Images
import logo from "../../../images/logo.png";
import logo_1 from "../../../images/logo_1.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { blankValidator } from "../../../utils/Validation";
import { getBaseUrl } from "../../../utils/baseUrl";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

import { FaEye } from "react-icons/fa";
import { BsFillEyeSlashFill } from "react-icons/bs";

let token = localStorage.getItem("token");
// console.log("token", token);

const ResetPassword = () => {
  const navigate = useNavigate();
  const [btnLoading, setbtnLoading] = useState(false);

  const [user, setUser] = useState({
    password: "",
    c_password: "",
  });

  const [error, setError] = useState({
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
    setError({
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
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const [showPass, setShowPass] = useState({
    pass: false,
    cpass: false,
  });

  const resetPassFunc = async () => {
    console.log(user);

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
    let data = {
      password: user.password,
    };

    try {
      setbtnLoading(true);
      let token = localStorage.getItem("token");
      var config = {
        method: "post",
        url: getBaseUrl() + "auth_api/resetPasswordAdmin",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        data: data,
      };
      console.log(config);
      let res = await axios(config);
      console.log(res.data);

      if (res.data.status) {
        setbtnLoading(false);
        toast.success("Password Reset Successfully!");
        navigate("/login");
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
    <div id="login_container">
      <div className="left">
        <div className="logo">
          <img src={logo} alt="salesparrow" />
        </div>
      </div>

      <div className="right">
        <div className="main">
          <div className="head_img">
            <img src={logo_1} alt="salesparrow" />
          </div>
          <div className="heading">Reset Password</div>
          <div className="form">
            <div className="login_parent" style={{ marginTop: 0 }}>
              <input
                type={showPass.pass ? "text" : "password"}
                name="password"
                value={user.password}
                onChange={handleInput}
                placeholder="Password"
              />
              <span className="cpass_icon">
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
              {error.password.status && (
                <p style={{ width: "72%", color: "red" }}>Enter Password</p>
              )}
              {error.shortpassword.status && (
                <p style={{ width: "72%", color: "red" }}>Password length should be 6</p>
              )}
              <input
                type={showPass.cpass ? "text" : "password"}
                name="c_password"
                value={user.c_password}
                onChange={handleInput}
                placeholder="Confirm New Password"
              />
              <span className="cpass_icon2">
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
              {error.c_password.status && (
                <p style={{ width: "72%", color: "red" }}>
                  Enter Confirm Password
                </p>
              )}
              {error.c_passwordMatch.status && (
                <p style={{ width: "72%", color: "red" }}>
                  Password Didn't Match
                </p>
              )}
              <button onClick={() => resetPassFunc()}>
                {btnLoading ? (
                  <CircularProgress style={{ color: "#fff" }} size={26} />
                ) : (
                  "Change Password"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
