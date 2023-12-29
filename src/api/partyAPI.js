import axios from "axios";
import { getBaseUrl } from "../utils/baseUrl";


// const fetchAllParty = async (pageCount, stateID, partyType, search) => {
const fetchAllParty = async (filterData) => {
  const token = localStorage.getItem("token");

  let url = getBaseUrl() + "auth_api/getAllParty";
  // let data = { page: pageCount, state: stateID, partyType, search };
  let data = filterData;
  let config = { headers: { Authorization: `Bearer ${token}` }, };
  try {
    return await axios.post(url, data, config);
  } catch (error) {
    console.log(error);
  }
}

export const fetchAllUnmappedParty = async (data) => {
  const token = localStorage.getItem("token");

  let url = getBaseUrl() + "auth_api/unmapped_parties";
  let config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    let res = await axios.post(url, data, config);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getPartyType = async () => {
  let url = getBaseUrl() + "auth_api/getPartyType"
  try {
    let res = await axios.get(url)
    return res;
  } catch (error) {
    console.log(error);
    return error.response
  }
}

export const getSingleParty = async (id) => {
  // console.log(id);
  const token = localStorage.getItem("token");

  try {
    let url = getBaseUrl() + "auth_api/getParty";
    let res = await axios.post(url, { id });
    // console.log("add employee group api",res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const addParty = async (profilePic, party) => {
  // console.log(profilePic, party);
  const token = localStorage.getItem("token");

  try {
    let url = getBaseUrl() + "auth_api/addParty";
    const fd = new FormData();
    fd.append("Party_image", profilePic);
    fd.append("partyType", party.partyType);
    fd.append("GSTNo", party.GSTNo);
    fd.append("mobileNo", party.mobileNo);
    fd.append("pincode", party.pincode);
    fd.append("district", party.district);
    fd.append("address1", party.address1);
    fd.append("address2", party.address2);
    fd.append("DOA", party.DOA);
    fd.append("firmName", party.firmName);
    fd.append("contactPersonName", party.contactPersonName);
    fd.append("email", party.email);
    fd.append("city", party.city);
    fd.append("state", party.state);
    fd.append("DOB", party.DOB);
    fd.append("route", party.route);
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    let res = await axios.post(url, fd, config);
    // console.log("add party api",res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const editParty = async (party) => {
  // console.log(party);
  const token = localStorage.getItem("token");

  try {
    let url = getBaseUrl() + "auth_api/editParty";
    const fd = party;

    // const fd = new FormData();
    // fd.append("Party_image", profilePic);
    // fd.append("id", party.id);
    // fd.append("partyType", party.partyType);
    // fd.append("GSTNo", party.GSTNo);
    // fd.append("mobileNo", party.mobileNo);
    // fd.append("pincode", party.pincode);
    // fd.append("district", party.district);
    // fd.append("address", party.address);
    // fd.append("DOA", party.DOA);

    // fd.append("firmName", party.firmName);
    // fd.append("contactPersonName", party.contactPersonName);
    // fd.append("email", party.email);
    // fd.append("city", party.city);
    // fd.append("state", party.state);
    // fd.append("DOB", party.DOB);
    // fd.append("route", party.route);
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    let res = await axios.post(url, fd, config);
    // console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const editPartyPic = async (profilePic, id) => {
  // console.log(profilePic, id);
  const token = localStorage.getItem("token");
  try {
    let url = getBaseUrl() + "auth_api/partyProfileImage";
    const fd = new FormData();
    fd.append("party_image", profilePic);
    fd.append("id", id);
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    let res = await axios.post(url, fd, config);
    // console.log("edit employee image api",res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteParty = async (id) => {
  // console.log(id);
  const token = localStorage.getItem("token");

  var config = {
    method: "delete",
    url: getBaseUrl() + "auth_api/deleteParty",
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

export const importParties = async (file) => {
  // console.log(file);
  const token = localStorage.getItem("token");
  try {
    let url = getBaseUrl() + "auth_api/bulkImport";
    const fd = new FormData();
    fd.append("party_excel", file);
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    let res = await axios.post(url, fd, config);
    return res;
  } catch (error) {
    console.log(error);
  }
};

// Party Group

export const allPartyGroup = async (pageCount, statedID) => {
  // console.log(pageCount);
  const token = localStorage.getItem("token");

  let url = getBaseUrl() + "auth_api/partyGrpList";
  let data = {
    page: pageCount,
    state: statedID,
  };
  let config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    let res = await axios.post(url, data, config);
    // console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const addPartyGrouping = async (group) => {
  // console.log(group);
  const token = localStorage.getItem("token");

  let url = getBaseUrl() + "auth_api/add_party_grp";
  const data = group;
  let config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    let res = await axios.post(url, data, config);
    // console.log("add employee group api",res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getSinglePartyGroup = async (id) => {
  // console.log(id);
  const token = localStorage.getItem("token");

  try {
    let url = getBaseUrl() + "auth_api/getGrpWisePartyList";
    let res = await axios.post(url, { id });
    // console.log("add employee group api",res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const editPartyGroup = async (obj) => {
  // console.log(obj);
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/edit_party_grp",
    headers: { Authorization: `Bearer ${token}` },
    data: obj,
  };

  try {
    let res = await axios(config);
    // console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deletePartyGroup = async (id) => {
  // console.log(id);
  const token = localStorage.getItem("token");

  var config = {
    method: "delete",
    url: getBaseUrl() + "auth_api/deletePartyGrp",
    headers: { Authorization: `Bearer ${token}` },
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

export default fetchAllParty;
