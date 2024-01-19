import "./ChangePassword.css";
import React, { useState } from "react";
import group from "../../images/group.png";
import axios from "axios";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { blankValidator } from "../../utils/Validation";
import { getBaseUrl } from "../../utils/baseUrl";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [btnLoading, setbtnLoading] = useState(false);

  const [showPass, setShowPass] = useState({
    opass: false,
    pass: false,
    cpass: false,
  });

  const [user, setUser] = useState({
    oldPassword: "",
    newPassword: "",
    cPassword: "",
  });

  const [error, setError] = useState({
    oldPassword: { status: false, },
    newPassword: { status: false, },
    shortpassword: { status: false, },
    cPassword: { status: false, },
    cPasswordMatch: { status: false, },
  });

  const handleInput = (e) => {
    setError({
      oldPassword: { status: false, },
      newPassword: { status: false, },
      shortpassword: { status: false, },
      cPassword: { status: false, },
      cPasswordMatch: { status: false, },
    });
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const changePassFunc = async () => {
    if (!blankValidator(user.oldPassword)) return setError({ ...error, oldPassword: { status: true } });
    if (!blankValidator(user.newPassword)) return setError({ ...error, newPassword: { status: true, }, });
    if (user.newPassword.length < 6) return setError({ ...error, shortpassword: { status: true, }, });
    if (!blankValidator(user.cPassword)) return setError({ ...error, cPassword: { status: true, }, });
    if (user.newPassword !== user.cPassword) return setError({ ...error, cPasswordMatch: { status: true, }, });

    let data = { oldPassword: user.oldPassword, newPassword: user.newPassword, };
    try {
      setbtnLoading(true);
      const token = localStorage.getItem("token");
      var config = {
        method: "post",
        url: getBaseUrl() + "auth_api/changePassword",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        data,
      };
      let res = await axios(config);
      console.log(res.data);
      if (res.data.status) {
        navigate("/");
        toast.success("Password Updated Successfully!");
      } else {
        toast.error(res.data.message);
      }
      setbtnLoading(false);
    } catch (error) {
      setbtnLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="dash_heading">
        <div className="icon">
          <img src={group} alt="icon" />
        </div>
        <div className="title">Change Password</div>
      </div>
      <div className="changepass_container">
        <div className="changepass_form">
          <div className="cp_parent">
            <input
              type={showPass.opass ? "text" : "password"}
              name="oldPassword"
              value={user.oldPassword}
              onChange={handleInput}
              placeholder="Current Password"
              autoComplete="off"
            />
            <span className="pass_icon_cp">
              {showPass.opass ? (
                <BsFillEyeSlashFill
                  style={{ margin: "0 0.3rem", fontSize: "1rem", cursor: "pointer", }}
                  onClick={() => setShowPass({ ...showPass, opass: false })}
                />
              ) : (
                <FaEye
                  style={{ margin: "0 0.3rem", fontSize: "1rem", cursor: "pointer", }}
                  onClick={() => setShowPass({ ...showPass, opass: true })}
                />
              )}
            </span>
          </div>
          {error.oldPassword.status && (
            <p style={{ width: "99%", color: "red" }}>Enter Old Password</p>
          )}
          <div className="cp_parent">
            <input
              type={showPass.pass ? "text" : "password"}
              name="newPassword"
              value={user.newPassword}
              onChange={handleInput}
              placeholder="New Password"
            />
            <span className="pass_icon_cp">
              {showPass.pass ? (
                <BsFillEyeSlashFill
                  style={{ margin: "0 0.3rem", fontSize: "1rem", cursor: "pointer", }}
                  onClick={() => setShowPass({ ...showPass, pass: false })}
                />
              ) : (
                <FaEye
                  style={{ margin: "0 0.3rem", fontSize: "1rem", cursor: "pointer", }}
                  onClick={() => setShowPass({ ...showPass, pass: true })}
                />
              )}
            </span>
          </div>
          {error.newPassword.status && (
            <p style={{ width: "99%", color: "red" }}>Enter New Password</p>
          )}
          {error.shortpassword.status && (
            <p style={{ width: "99%", color: "red" }}>
              Password length should be 6
            </p>
          )}
          <div className="cp_parent">
            <input
              type={showPass.cpass ? "text" : "password"}
              name="cPassword"
              value={user.cPassword}
              onChange={handleInput}
              placeholder="Confirm Password"
            />
            <span className="pass_icon_cp">
              {showPass.cpass ? (
                <BsFillEyeSlashFill
                  style={{ margin: "0 0.3rem", fontSize: "1rem", cursor: "pointer", }}
                  onClick={() => setShowPass({ ...showPass, cpass: false })}
                />
              ) : (
                <FaEye
                  style={{ margin: "0 0.3rem", fontSize: "1rem", cursor: "pointer", }}
                  onClick={() => setShowPass({ ...showPass, cpass: true })}
                />
              )}
            </span>
          </div>

          {error.cPassword.status && (
            <p style={{ width: "99%", color: "red" }}>Enter Confirm Password</p>
          )}
          {error.cPasswordMatch.status && (
            <p style={{ width: "99%", color: "red" }}>Password Didn't Match</p>
          )}

          <div className="btn changepass_btn" onClick={() => changePassFunc()}>
            {btnLoading ? (
              <CircularProgress style={{ color: "#fff" }} size={26} />
            ) : (
              "SUBMIT"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
