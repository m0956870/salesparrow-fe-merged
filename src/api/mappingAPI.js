import axios from "axios";
import { getBaseUrl } from "../utils/baseUrl";


// Employee / Beat Mapping
export const addEmployeeBeat = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/emp_beat_mapping",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
    return error.response
  }
};


// State / PriceList Mapping
export const getStatePriceList = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/get_mapped_state_pricelist",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const addStatePriceList = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/state_pricelist_mapping",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const editStatePriceList = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/edit_mapped_state_pricelist",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const deleteStatePriceList = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "delete",
    url: getBaseUrl() + "auth_api/delete_mapped_state_pricelist",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};


// PriceList / Party Group Mapping
export const getPartyGrpPriceList = async (page) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/get_mapped_partygrp_pricelist",
    headers: { Authorization: `Bearer ${token}` },
    data: { page }
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const addPartyGrpPriceList = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/partygrp_pricelist_mapping",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const editPartyGrpPriceList = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/edit_mapped_partygrp_pricelist",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const deletePartyGrpPriceList = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "delete",
    url: getBaseUrl() + "auth_api/delete_mapped_partygrp_pricelist",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};


// EmployeeGroup / ProductGroup Mapping
export const getEmpGrpProductGrp = async (page) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/get_mapped_emp_productgrp",
    headers: { Authorization: `Bearer ${token}` },
    data: { page }
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const addEmpGrpProductGrp = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/empgrp_productgrp_mapping",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const editEmpGrpProductGrp = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/edit_mapped_emp_productgrp",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const deleteEmpGrpProductGrp = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "delete",
    url: getBaseUrl() + "auth_api/delete_mapped_emp_productgrp",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};


// Employee / Party Mapping
export const getEmpPartyMapping = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/get_mapped_emp_party",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const getEmpAssignedParties = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/get_parties_mapped_to_emp",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const addEmpPartyMapping = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/emp_party_mapping",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const editEmpPartyMapping = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/edit_mapped_emp_party",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const deleteEmpPartyMapping = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "delete",
    url: getBaseUrl() + "auth_api/delete_mapped_emp_party",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};


// Product Group / Party Group Mapping
export const getProductGrpPartyGrp = async (page) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "get",
    url: getBaseUrl() + "auth_api/get_mapped_emp_party",
    headers: { Authorization: `Bearer ${token}` },
    data: { page }
  };

  try {
    // return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const addProductGrpPartyGrp = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/emp_party_mapping",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    // return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const editProductGrpPartyGrp = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/edit_mapped_emp_party",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    // return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const deleteProductGrpPartyGrp = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "delete",
    url: getBaseUrl() + "auth_api/delete_mapped_emp_party",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    // return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};


// SS / Distributor Mapping
export const getSSDistributorList = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/get_mapped_ss_distributor",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const getSSAssignedDistributors = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/distributor_acc_to_ss",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const addSSDistributor = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/ss_distributor_mapping",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const editSSDistributor = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/edit_mapped_ss_distributor",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const deleteSSDistributor = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "delete",
    url: getBaseUrl() + "auth_api/delete_mapped_ss_distributor",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};


// Party Group / Product Group Mapping
export const getPartyGrpProductGrp = async (page) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/get_mapped_partygrp_productgrp",
    headers: { Authorization: `Bearer ${token}` },
    data: { page }
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const addPartyGrpProductGrp = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/partygrp_productgrp_mapping",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const editPartyGrpProductGrp = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/edit_mapped_partygrp_productgrp",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const deletePartyGrpProductGrp = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "delete",
    url: getBaseUrl() + "auth_api/delete_mapped_partygrp_productgrp",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response
  }
};
