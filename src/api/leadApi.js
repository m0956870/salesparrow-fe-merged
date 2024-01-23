import axios from 'axios';
import { getBaseUrl } from '../utils/baseUrl';


// Lead
// export const addNewLead = async (data) => {
//   const token = localStorage.getItem('token');
//   return await axios({
//     url: getBaseUrl() + 'lead_api/add_lead',
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     data: data,
//   });
// };

export const getLeads = async (data) => {
  const token = localStorage.getItem('token');
  return await axios({
    url: getBaseUrl() + 'lead_api/lead_list',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: data,
  });
};
// export const editLead = async (data) => {
//   const token = localStorage.getItem('token');
//   return await axios({
//     url: getBaseUrl() + 'lead_api/update_lead',
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     data: data,
//   });
// };


// Banner
export const addBanner = async (data) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('type', data.type);
  formData.append('name', data.name);
  formData.append('date', data.date);
  formData.append('file', data.file);
  return await axios({
    url: getBaseUrl() + 'lead_api/add_leadBanner',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  });
};
export const editBanner = async (data) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('leadBanner_id', data.leadBanner_id);
  formData.append('file', data.file);
  formData.append('type', data.type);
  formData.append('name', data.name);
  formData.append('date', data.date);
  formData.append('is_delete', data.is_delete);
  return await axios({
    url: getBaseUrl() + 'lead_api/update_lead_banner',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  });
};

export const getBanners = async (data) => {
  const token = localStorage.getItem('token');
  return await axios({
    url: getBaseUrl() + 'lead_api/leadBanner_list',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: data,
  });
};

// Group
// export const createGroup = async (data) => {
//   const token = localStorage.getItem('token');
//   return await axios({
//     url: getBaseUrl() + 'lead_api/add_leadGroup',
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     data: data,
//   });
// };
export const updateGroup = async (data) => {
  const token = localStorage.getItem('token');
  return await axios({
    url: getBaseUrl() + 'lead_api/update_lead_group',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: data,
  });
};
// export const getGroups = async (data) => {
//   const token = localStorage.getItem('token');
//   return await axios({
//     url: getBaseUrl() + 'lead_api/leadGroup_list',
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     data: data,
//   });
// };



// --------- NEW ----------

// Home
export const getHomeTabsData = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "lead_api/get_leads",
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

// Client - Lead
export const addLead = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "lead_api/add_lead",
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

export const editLead = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "lead_api/update_lead",
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

export const deleteLead = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "delete",
    url: getBaseUrl() + "lead_api/delete_lead",
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

export const deleteMultipleLead = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "delete",
    url: getBaseUrl() + "lead_api/delete_multiple_leads",
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

// Clients
// customers

export const getCustomers = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "lead_api/get_clients",
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

export const deleteParty = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "delete",
    url: getBaseUrl() + "auth_api/deleteParty",
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

export const deleteCustomer = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "delete",
    url: getBaseUrl() + "auth_api/deleteCustomer",
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

// Client - Group
export const createGroup = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "lead_api/add_lead_group",
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

export const getGroups = async () => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "lead_api/get_clients",
    headers: { Authorization: `Bearer ${token}` },
    data: { type: "groups" },
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error)
    return error.response
  }
}

// group leads
export const getGroupData = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "lead_api/get_grp_wise_leads",
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

export const editLeadGroup = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "lead_api/edit_lead_grp",
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

export const manageLeadGroup = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "lead_api/manage_grp",
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

export const manageLeadGroupFromLead = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "lead_api/manage_grp_lead",
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

export const deleteLeadGroup = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "delete",
    url: getBaseUrl() + "lead_api/delete_lead_grp",
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

// assign to emp function
export const assignToEmp = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "lead_api/assign_to_team",
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

// Vivek updadhyay , work on lead management  , content page ............................................

export const createMessage = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "lead_api/message",
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

export const updateMessage = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "put",
    url: getBaseUrl() + "lead_api/message",
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

export const getMessageData = async (queryParams) => {
  const token = localStorage.getItem('token');
  return await axios({
    url: getBaseUrl() + 'lead_api/messages',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // params: queryParams,
  });
};

export const deleteMessage = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "DELETE",
    url: getBaseUrl() + "lead_api/message",
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

// File lead api ..............................................

export const createFile = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "lead_api/file",
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

export const updateFile = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "put",
    url: getBaseUrl() + "lead_api/file",
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

export const getFileData = async (queryParams) => {
  const token = localStorage.getItem('token');
  return await axios({
    url: getBaseUrl() + 'lead_api/file',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // params: queryParams,
  });
};

export const getHistory_data = async (queryParams) => {
  const token = localStorage.getItem('token');
  return await axios({
    url: getBaseUrl() + `lead_api/sharedHistory/${queryParams}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // params: queryParams,
  });
};

export const deleteFile = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "DELETE",
    url: `${getBaseUrl()}lead_api/file/${data.id}`,
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error)
    return error.response
  }
}

// Banner ...............................................................................

export const getBannerData = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/getBanner_listing",
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

export const getCatBannerData = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/get_category_banner",
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


// FollowsUps .............................

export const getFollowupd_data = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "lead_api/listFollowUpLogs",
    headers: { Authorization: `Bearer ${token}` },
    data
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error)
    return error.response
  }
}

export const getLead_follwups = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "lead_api/listFollowUp",
    headers: { Authorization: `Bearer ${token}` },
    data
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error)
    return error.response
  }
}

export const saveFollowup_lead = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "lead_api/followUp",
    headers: { Authorization: `Bearer ${token}` },
    data
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error)
    return error.response
  }
}

export const updateFollowup_lead = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "put",
    url: getBaseUrl() + "lead_api/followUp",
    headers: { Authorization: `Bearer ${token}` },
    data
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error)
    return error.response
  }
}

export const createSharedMedia_lead = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "lead_api/sharedMedia",
    headers: { Authorization: `Bearer ${token}` },
    data
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error)
    return error.response
  }
}



