import axios from "axios";
import { getBaseUrl } from "../utils/baseUrl";

// const token = localStorage.getItem("token");
// console.log("token", token);

// const fetchAllEmployee = async (pageCount, statedID, cityID) => {
const fetchAllEmployee = async (filterData) => {
  const token = localStorage.getItem("token");
  try {
    let config = { headers: { Authorization: `Bearer ${token}` }, };
    let res = await axios.post(
      getBaseUrl() + "auth_api/getAllEmployee",
      // { page: pageCount, state: statedID, city: cityID, },
      filterData,
      config
    );
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getEmp = async (id) => {
  // console.log(id);
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/getEmp",
    headers: { Authorization: `Bearer ${token}` },
    data: {
      id
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

export const addEmployee = async (profilePic, employee) => {
  // console.log(profilePic, employee);
  const token = localStorage.getItem("token");
  try {
    let url = getBaseUrl() + "auth_api/addEmployee";
    const fd = new FormData();
    fd.append("Employee_image", profilePic);
    fd.append("employeeName", employee.employeeName);
    fd.append("phone", employee.phone);
    fd.append("email", employee.email);
    fd.append("address", employee.address);
    fd.append("city", employee.city);
    fd.append("pincode", employee.pincode);
    fd.append("state", employee.state);
    fd.append("district", employee.district);
    fd.append("experience", employee.experience);
    fd.append("qualification", employee.qualification);
    fd.append("headquarterCity", employee.headquarterCity);
    fd.append("headquarterState", employee.headquarterState);
    fd.append("esi_no", employee.esi_no);
    fd.append("pf_no", employee.pf_no);
    fd.append("account_no", employee.account_no);
    fd.append("ifsc_code", employee.ifsc_code);
    fd.append("bank_name", employee.bank_name);
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    let res = await axios.post(url, fd, config);
    // console.log("add employee api",res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const editEmployee = async (employee) => {
  // console.log(employee);
  const token = localStorage.getItem("token");
  try {
    let res = await axios.patch(
      getBaseUrl() + "auth_api/editEmployee",
      employee
    );
    // console.log("edit employee api",res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const editImageEmployee = async (profilePic, id) => {
  // console.log(profilePic, id);
  const token = localStorage.getItem("token");
  try {
    let url = getBaseUrl() + "auth_api/employeeProfileImage";
    const fd = new FormData();
    fd.append("Employee_image", profilePic);
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

export const deleteEmployee = async (id) => {
  // console.log(id);
  const token = localStorage.getItem("token");

  var config = {
    method: "delete",
    url: getBaseUrl() + "auth_api/deleteEmployee",
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

export const importEmployees = async (file) => {
  console.log(file);
  const token = localStorage.getItem("token");
  try {
    let url = getBaseUrl() + "auth_api/bulkImportEmployee";
    const fd = new FormData();
    fd.append("employee_excel", file);
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    let res = await axios.post(url, fd, config);
    // console.log("add employee api",res);
    return res;
  } catch (error) {
    console.log(error);
  }
};


//  -------------------  EMPLOYEE GROUPS --------------------------

export const allEmployeeGroup = async (pageCount, statedID) => {
  // console.log(pageCount);
  const token = localStorage.getItem("token");
  try {
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    let res = await axios.post(
      getBaseUrl() + "auth_api/empGrpList",
      {
        page: pageCount,
        state: statedID,
      },
      config
    );
    // console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const addEmployeeGrouping = async (group) => {
  // console.log( beat);
  const token = localStorage.getItem("token");
  try {
    let url = getBaseUrl() + "auth_api/addEmpGrp";
    const data = group;
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    let res = await axios.post(url, data, config);
    // console.log("add employee group api",res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getSingleGroup = async (id) => {
  // console.log(id);
  const token = localStorage.getItem("token");
  try {
    let url = getBaseUrl() + "auth_api/getGrpWiseEmpList";
    let res = await axios.post(url, { id });
    // console.log("add employee group api",res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const editSingleGroup = async (obj) => {
  // console.log(obj);
  const token = localStorage.getItem("token");
  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/editGrp",
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

export const deleteEmployeeGroup = async (id) => {
  // console.log(id);
  const token = localStorage.getItem("token");
  var config = {
    method: "delete",
    url: getBaseUrl() + "auth_api/deleteEmpGrp",
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


// Employee Target
export const allEmployeeTarget = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/get_all_employee_target",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };
  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
  }
};

export const addEmpTarget = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/addEmpTarget",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
  }
};

export const editEmpTarget = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/edit_emp_target",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
  }
};

export const deletEmpTarget = async (data) => {
  const token = localStorage.getItem("token");

  var config = {
    method: "delete",
    url: getBaseUrl() + "auth_api/delete_target",
    headers: { Authorization: `Bearer ${token}`, },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
  }
};

// Employee Config - View Reportees
export const viewEmpReportees = async (data) => {
  const token = localStorage.getItem("token");

  var config = {
    method: "post",
    url: getBaseUrl() + "auth_api/view_reportees",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error
  }
};

// Reset All Emp
export const resetAllDevice = async (data) => {
  const token = localStorage.getItem("token");

  var config = {
    method: "post",
    url: getBaseUrl() + "auth_api/reset_all_devices",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error
  }
};

// Employee Config - Reset Device
export const resetDevice = async (emp_id) => {
  const token = localStorage.getItem("token");

  var config = {
    method: "post",
    url: getBaseUrl() + "auth_api/reset_device",
    headers: { Authorization: `Bearer ${token}` },
    data: { emp_id },
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error
  }
};

// Employee Config - Device config
export const deviceConfig = async (data) => {
  const token = localStorage.getItem("token");

  var config = {
    method: "post",
    url: getBaseUrl() + "auth_api/device_config",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error
  }
};

export default fetchAllEmployee;