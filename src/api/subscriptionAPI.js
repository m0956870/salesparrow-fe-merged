import axios from "axios";
import { getBaseUrl } from "../utils/baseUrl";

const fetchAllPlans = async () => {
  const token = localStorage.getItem("token");

  let config = {
    method: "get",
    url: getBaseUrl() + "auth_api/listAllSubs",
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

export const purchasePlan = async (data) => {
  // console.log(data);

  const token = localStorage.getItem("token");
  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/addPurchasePlan",
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

export const fetchPurchasePlan = async () => {
  const token = localStorage.getItem("token");

  let config = {
    method: "get",
    url: getBaseUrl() + "auth_api/getPurchasePlan",
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


// new
export const getAllPlans = async () => {
  const token = localStorage.getItem("token");

  let config = {
    method: "get",
    url: getBaseUrl() + "root/plan",
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const newPurchasePlan = async (data) => {
  const token = localStorage.getItem("token");
  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/purchase_plan",
    headers: { Authorization: `Bearer ${token}` },
    data: data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
  }
};

export default fetchAllPlans;