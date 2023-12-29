import axios from "axios";
import { getBaseUrl } from "../utils/baseUrl";

export const getEmpSalaryConfig = async (data) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "get",
        url: getBaseUrl() + "auth_api/get_salary_percentage",
        headers: { Authorization: `Bearer ${token}` },
        data,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error);
    }
};
export const addEmpSalaryConfig = async (data) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/add_salary_percentage",
        headers: { Authorization: `Bearer ${token}` },
        data,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error);
    }
};

export const editEmpSalaryConfig = async (data) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/edit_salary_percentage",
        headers: { Authorization: `Bearer ${token}` },
        data,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error);
    }
};