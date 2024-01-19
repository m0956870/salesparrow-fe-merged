// import "./CreateRoute.css";
import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import group from "../../images/group.png";

import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { createRole } from "../../api/roleAPI";

const CreateRole = () => {
  const navigate = useNavigate();

  const location = useLocation();
  // console.log(location.state);

  const [btnLoading, setbtnLoading] = useState(false);

  const [role, setrole] = useState({
    rolename: "",
    hierarchy_level: "",
    status: "Active",
  });

  const handleInput = (e) => {
    setrole({ ...role, [e.target.name]: e.target.value });
  };

  const createRoleFunc = async () => {
    // console.log(role);
    try {
      setbtnLoading(true);
      let res = await createRole(role);
      // console.log(res);

      if (res.data.status) {
        toast.success("Route created Successfully!");
        navigate("/all_roles")
        setbtnLoading(false);
      } else {
        toast.error(res.data.message);
        setbtnLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Internet Error!");
      setbtnLoading(false);
    }
  };

  const editRoleFunc = async () => {
    console.log(role);
    let data = {
      ...role,
      id: location.state.id,
    };
    try {
      setbtnLoading(true);
      //   let res = await editRoute(data);
      //   console.log(res);

      //   if (res.data.status) {
      //     toast.success("Route edited Successfully!");
      //     navigate("/role");
      //     setbtnLoading(false);
      //   } else {
      //     toast.error(res.data.message);
      //     setbtnLoading(false);
      //   }
    } catch (error) {
      console.log(error);
      toast.error("Internet Error!");
      setbtnLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="beat_heading">
        <div className="beat_left">
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Create Role</div>
        </div>
      </div>

      <div className="addbeat_container">
        <div className="addbeat_form">
          <div className="addbeat_left">
            <input
              type="text"
              name="rolename"
              value={role.rolename}
              onChange={handleInput}
              placeholder="Role"
            />
            <select name="hierarchy_level" value={role.hierarchy_level} onChange={handleInput}>
              <option value="">Hierarchy Level</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div className="addbeat_right">
            <select name="status" value={role.status} onChange={handleInput}>
              <option value="">Status</option>
              <option value="Active">Active</option>
              <option value="InActive">InActive</option>
            </select>
          </div>
        </div>
        {location.state ? (
          <div className="btn changepass_btn" onClick={() => editRoleFunc()}>
            {btnLoading ? (
              <CircularProgress style={{ color: "#fff" }} size={26} />
            ) : (
              "Edit Role"
            )}
          </div>
        ) : (
          <div className="btn changepass_btn" onClick={() => createRoleFunc()}>
            {btnLoading ? (
              <CircularProgress style={{ color: "#fff" }} size={26} />
            ) : (
              "Create Role"
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateRole;
