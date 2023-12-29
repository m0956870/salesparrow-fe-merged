import axios from "axios";
import { getBaseUrl } from "../utils/baseUrl";

let C_ID;

async function getCID() {
  const token = localStorage.getItem("token");

  var config = {
    method: "get",
    url: getBaseUrl() + "auth_api/getadminprofile",
    headers: { authorization: `Bearer ${token}` },
  };

  try {
    let res = await axios(config);
    C_ID = res.data.result[0]?.country?.id
    return res.data.result[0]?.country?.id
  } catch (error) {
    console.log(error);
  }
}

export const getCountries = async () => {
  try {
    getCID();
    return await axios(getBaseUrl() + "auth_api/get_country");
  } catch (error) {
    console.log(error);
  }
};

const getStateFunc = async (countryID) => {
  C_ID = C_ID ? C_ID : await getCID()

  try {
    return await axios(getBaseUrl() + `auth_api/getLocation?country_id=${countryID || C_ID}`);
  } catch (error) {
    console.log(error);
  }
};

export const getCityFunc = async (stateID, countryID) => {
  C_ID = C_ID ? C_ID : await getCID()

  try {
    return await axios(getBaseUrl() + `auth_api/getLocation?country_id=${countryID || C_ID}&P_id=${stateID}`);
  } catch (error) {
    console.log(error);
  }
};

export const getDistrictFunc = async (state, district) => {
  // console.log(state, district);
  const p_id = state;
  const subp_id = district;
  const url = getBaseUrl() + `auth_api/getLocation?p_id=${p_id}&subp_id=${subp_id}`;

  try {
    let res = await axios.get(url);
    // console.log("api district's city", res);
    return res;
  } catch (error) {
    console.log(error);
  }
};


export default getStateFunc;