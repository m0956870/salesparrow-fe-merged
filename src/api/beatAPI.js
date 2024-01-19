import axios from "axios";
import { getBaseUrl } from "../utils/baseUrl";

// const token = localStorage.getItem("token");
// console.log("token", token);

const fetchAllBeat = async (data) => {
  // console.log(pageCount);

  const token = localStorage.getItem("token");
  let config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    let res = await axios.post(
      getBaseUrl() + "auth_api/getAllBeat",
      data,
      config
    );
    // console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getBeat = async (id) => {
  // console.log(id);
  const token = localStorage.getItem("token");
  let config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    let res = await axios.post(
      getBaseUrl() + "auth_api/getBeat",
      {
        id: id,
      },
      config
    );
    // console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const addBeat = async (beat) => {
  // console.log( beat);
  const token = localStorage.getItem("token");
  try {
    let url = getBaseUrl() + "auth_api/addBeat";
    const fd = beat;
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    let res = await axios.post(url, fd, config);
    // console.log("add beat api",res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const editBeat = async (beat) => {
  // console.log(beat);
  const token = localStorage.getItem("token");
  try {
    let res = await axios.post(getBaseUrl() + "auth_api/editbeat", beat);
    // console.log("edit beat api",res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteBeat = async (id) => {
  // console.log(id);
  const token = localStorage.getItem("token");

  var config = {
    method: "delete",
    url: getBaseUrl() + "auth_api/deleteBeat",
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

export default fetchAllBeat;
