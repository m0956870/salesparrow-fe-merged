import axios from "axios";
import { getBaseUrl } from "../utils/baseUrl";

const getProfile = async () => {
  const token = localStorage.getItem("token");
  // console.log(token);

  try {
    var config = {
      method: "get",
      url: getBaseUrl() + "auth_api/getadminprofile",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };

    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (data) => {
  const token = localStorage.getItem("token");
  try {
    var config = {
      method: "post",
      url: getBaseUrl() + "auth_api/updateProfile",
      headers: { authorization: `Bearer ${token}` },
      data,
    };
    return await axios(config);
  } catch (error) {
    console.log(error);
  }
};

export default getProfile;
