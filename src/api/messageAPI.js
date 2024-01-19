import axios from "axios";
import { getBaseUrl } from "../utils/baseUrl";

export const sendNotification = async (data) => {
    const token = localStorage.getItem("token");
    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/sendNotification",
        headers: { Authorization: `Bearer ${token}` },
        data: data,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error);
    }
};