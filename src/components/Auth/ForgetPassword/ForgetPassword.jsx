import "./ForgetPassword.css";
import React, { useState } from "react";

// Images
import logo from "../../../images/logo.png";
import logo_1 from "../../../images/logo_1.png";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  blankValidator,
  emailValidator,
} from "../../../utils/Validation";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { getBaseUrl } from "../../../utils/baseUrl";

const ForgetPassword = () => {
  const navigate = useNavigate();

  const [btnLoading, setbtnLoading] = useState(false);
  const [email, setemail] = useState("");

  const [error, setError] = useState({
    email: {
      status: false,
    },
    validEmail: {
      status: false,
    },
  });

  const forgetEmailFunc = async () => {
    // console.log(email)

    if (!blankValidator(email)) {
      return setError({
        ...error,
        email: {
          status: true,
        },
      });
    }
    if (!emailValidator(email)) {
      return setError({
        ...error,
        validEmail: {
          status: true,
        },
      });
    }

    try {
      setbtnLoading(true);
      var config = {
        method: "post",
        url: getBaseUrl() + "auth_api/forgotPasswordAdmin",
        // headers: {
        //   "Content-Type": "application/json",
        // },
        data: { email: email },
      };
      let res = await axios(config);
      console.log(res.data);
      if (res.data.status) {
        setbtnLoading(false);
        setemail("")
        localStorage.setItem("token", res.data.token);
        toast.success("Check Your Email!");
        navigate("/resetpassword")
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
          <div className="heading">Forgot Your Password</div>
          <p className="sub_heading">
            Enter your email address below and we'll get you back on track
          </p>
          <div className="form forget">
            <input
              className="input_center"
              name="email"
              value={email}
              onChange={(e) => {
                setbtnLoading(false);
                setError({
                  email: {
                    status: false,
                  },
                  validEmail: {
                    status: false,
                  },
                });
                setemail(e.target.value);
              }}
              type="text"
              placeholder="Your e-mail address"
            />
            {error.email.status && (
              <p style={{ width: "72%", color: "red" }}>Please Enter Email</p>
            )}
            {error.validEmail.status && (
              <p style={{ width: "72%", color: "red" }}>
                Please Enter Valid Email
              </p>
            )}
            <button onClick={() => forgetEmailFunc()}>
              {btnLoading ? (
                <CircularProgress style={{ color: "#fff" }} size={26} />
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
