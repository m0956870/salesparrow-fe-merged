import axios from "axios";
import { getBaseUrl } from "../utils/baseUrl";

const fetchSubAdmin = async (pageCount, statedID, cityID) => {
    // console.log(pageCount);

    const token = localStorage.getItem("token");
    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/routeListing",
        headers: { Authorization: `Bearer ${token}` },
        data: {
            page: pageCount,
            state: statedID,
            city: cityID,
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

export const addSubAdmin = async (profilePic, subadmin) => {
    console.log(profilePic, subadmin);

    let formData = new FormData();
    formData.append("subAdmin_image", profilePic);
    formData.append("name", subadmin.name);
    formData.append("email", subadmin.email);
    formData.append("state", subadmin.state);
    formData.append("district", subadmin.district);
    formData.append("role", subadmin.role);
    formData.append("phone", subadmin.phone);
    formData.append("address", subadmin.address);
    formData.append("pincode", subadmin.pincode);
    formData.append("city", subadmin.city);
    formData.append("password", subadmin.password);

    const token = localStorage.getItem("token");
    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/addSubAdmin",
        headers: { Authorization: `Bearer ${token}` },
        data: formData,
    };

    try {
        let res = await axios(config);
        // console.log(res);
        return res;
    } catch (error) {
        console.log(error);
    }
};

// export const editSubAdmin = async (data) => {
//     // console.log(data);

//     const token = localStorage.getItem("token");
//     let config = {
//         method: "post",
//         url: getBaseUrl() + "auth_api/edit_route",
//         headers: { Authorization: `Bearer ${token}` },
//         data: data,
//     };

//     try {
//         let res = await axios(config);
//         // console.log(res);
//         return res;
//     } catch (error) {
//         console.log(error);
//     }
// };

// export const deleteSubAdmin = async (id) => {
//     // console.log(id);

//     const token = localStorage.getItem("token");
//     var config = {
//         method: "delete",
//         url: getBaseUrl() + "auth_api/deleteRoute",
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//         data: { id: id },
//     };

//     try {
//         let res = await axios(config);
//         // console.log(res);
//         return res;
//     } catch (error) {
//         console.log(error);
//     }
// };

export default fetchSubAdmin