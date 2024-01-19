import axios from "axios";
import { getBaseUrl } from "../utils/baseUrl";

const fetchAllRole = async () => {
  const token = localStorage.getItem("token");

  let config = {
    method: "get",
    url: getBaseUrl() + "auth_api/getAllRoles",
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    let res = await axios(config);
    // console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const fetchHierarcyRole = async (roleID) => {
  const token = localStorage.getItem("token");

  let data = {
    role_id: roleID
  }

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/reportingTo",
    headers: { Authorization: `Bearer ${token}` },
    data: data,
  };

  try {
    let res = await axios(config);
    // console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const createRole = async (role) => {
  // console.log(role);
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/addRole",
    headers: { Authorization: `Bearer ${token}` },
    data: role,
  };

  try {
    let res = await axios(config);
    // console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export default fetchAllRole;
