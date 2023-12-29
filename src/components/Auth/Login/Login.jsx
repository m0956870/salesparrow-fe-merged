import "./Login.css";
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import logo from "../../../images/logo.png";
import logo_1 from "../../../images/logo_1.png";
import axios from "axios";
import { AdminContext } from "../../../App";

import { blankValidator, emailValidator, } from "../../../utils/Validation";
import { getBaseUrl } from "../../../utils/baseUrl"
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { FaEye } from "react-icons/fa";
import { BsFillEyeSlashFill } from "react-icons/bs";

const Login = () => {
  const { state, dispatch } = useContext(AdminContext);
  const navigate = useNavigate();
  const [btnLoading, setbtnLoading] = useState(false);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [showPass, setShowPass] = useState({
    pass: false,
  });

  const [error, setError] = useState({
    email: {
      status: false,
    },
    validEmail: {
      status: false,
    },
    password: {
      status: false,
    },
  });

  const handleInput = (e) => {
    setbtnLoading(false);
    setError({
      email: {
        status: false,
      },
      validEmail: {
        status: false,
      },
      password: {
        status: false,
      },
    });

    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const loginFunc = async () => {
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
    if (!blankValidator(user.password)) {
      return setError({
        ...error,
        password: {
          status: true,
        },
      });
    }

    try {
      setbtnLoading(true);
      var data = JSON.stringify(user);

      var config = {
        method: "post",
        url: getBaseUrl() + "auth_api/adminLogin",
        headers: { "Content-Type": "application/json", },
        data: data,
      };

      let res = await axios(config);
      // console.log(res.data);
      if (res.data.status) {
        dispatch({ type: "ADMIN", payload: { result: res.data.result } });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("auth", true);
        toast.success("Login Successfull!");
        navigate("/");
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
            <div className="form">
              <div className="login_parent">
                <input
                  type="text"
                  name="email"
                  value={user.email}
                  onChange={handleInput}
                  placeholder="Email ID"
                />
                {error.email.status && (
                  <p style={{ width: "72%", color: "red" }}>Please Enter Email</p>
                )}
                {error.validEmail.status && (
                  <p style={{ width: "72%", color: "red" }}>Please Enter Valid Email</p>
                )}
                <input
                  type={showPass.pass ? "text" : "password"}
                  name="password"
                  value={user.password}
                  onChange={handleInput}
                  placeholder="Password"
                />
                <span className="pass_icon">
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
              </div>
              <Link className="fp_link" to="/forgotpassword">
                Forget Password?
              </Link>
              <button onClick={() => loginFunc()}>
                {btnLoading ? (
                  <CircularProgress style={{ color: "#fff" }} size={26} />
                ) : (
                  "SIGN IN"
                )}
              </button>
              <div className="signup_link">
                <span>
                  Don't have an account?{" "}
                  <Link
                    className="fp_link"
                    to="/signup"
                    style={{ display: "inline" }}
                  >
                    Sign up
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

export default Login;
