import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout = () => {
  const navigate = useNavigate();

  const logoutFunc = () => {
    // console.log("logout func");
    localStorage.setItem("token", null);
    localStorage.setItem("auth", false);
    toast.success("Logout Successfully!");
    navigate("/login");
  };
  useEffect(() => {
    logoutFunc();
  }, []);

  return <div>Logout</div>;
};

export default Logout;
