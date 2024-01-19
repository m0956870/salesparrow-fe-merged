import axios from "axios";
import { getBaseUrl } from "../utils/baseUrl";


// Employee Dashboard 
export const getEmpDashboardData = async (type) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/employee_dashboard",
        headers: { Authorization: `Bearer ${token}` },
        data: { type },
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error);
        return error.response
    }
};

// Party Dashboard 
export const getPartyDashboardData = async (type) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/party_dashboard",
        headers: { Authorization: `Bearer ${token}` },
        data: { type },
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error);
        return error.response
    }
};