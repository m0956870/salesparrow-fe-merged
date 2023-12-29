import axios from "axios";
import { getBaseUrl } from "../utils/baseUrl";
// const token = localStorage.getItem("token");
// console.log("token", token);

// const fetchAllRoute = async (pageCount, statedID, cityID) => {
const fetchAllRoute = async (data) => {
  // console.log(pageCount);

  const token = localStorage.getItem("token");
  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/routeListing",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    let res = await axios(config);
    // console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const fetchPartyRoute = async (statedID, cityID) => {
  // console.log(statedID, cityID);
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/unmapped_routeListing",
    headers: { Authorization: `Bearer ${token}` },
    data: {
      state: statedID,
      city: cityID,
    },
  };

  try {
    let res = await axios(config);
    // console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const addRoute = async (data) => {
  //   console.log(data);

  const token = localStorage.getItem("token");
  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/addRoute",
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

export const editRoute = async (data) => {
  // console.log(data);

  const token = localStorage.getItem("token");
  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/edit_route",
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

export const deleteRoute = async (id) => {
  // console.log(id);

  const token = localStorage.getItem("token");
  var config = {
    method: "delete",
    url: getBaseUrl() + "auth_api/deleteRoute",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { id: id },
  };

  try {
    let res = await axios(config);
    // console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const importRoutes = async (file) => {
  // console.log(file);
  const token = localStorage.getItem("token");
  try {
    let url = getBaseUrl() + "auth_api/bulkImport";
    const fd = new FormData();
    fd.append("route_excel", file);
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    let res = await axios.post(url, fd, config);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export default fetchAllRoute;