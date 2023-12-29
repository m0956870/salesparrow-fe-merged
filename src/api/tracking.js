import axios from 'axios';
import { getBaseUrl } from '../utils/baseUrl';

export const getDeviceStatus = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "get",
    url: getBaseUrl() + "auth_api/get_employees_device_status",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error)
    return error.response
  }
}

export const getDayStatus = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/day_status",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error)
    return error.response
  }
}

export const getAllEmpLocation = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/get_employees_current_location",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error)
    return error.response
  }
}

export const getAllEmpPath = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/employee_tracking_report",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error)
    return error.response
  }
}

export const getEmpPath = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/get_employees_current_location",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error)
    return error.response
  }
}