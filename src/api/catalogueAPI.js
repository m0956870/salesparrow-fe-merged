import axios from "axios";
import { getBaseUrl } from "../utils/baseUrl";

export const getCatalogueListing = async (data) => {
    const token = localStorage.getItem("token");
    let config = {
        method: "get",
        url: getBaseUrl() + `auth_api/catalogue/banner?page=${data.page}&limit=${data.limit}`,
        headers: { Authorization: `Bearer ${token}` },
        data,
    };
    try {
        return await axios(config);
    } catch (error) {
        console.log(error);
    }
};

export const addCatalogueBanner = async (profilePic, data) => {
    const token = localStorage.getItem("token");

    let formData = new FormData();
    formData.append("image", profilePic);
    formData.append("priority", data.priority);

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/catalogue/banner",
        headers: { Authorization: `Bearer ${token}` },
        data: formData,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error);
    }
};

export const updateCatalogueBanner = async (profilePic, data) => {
    const token = localStorage.getItem("token");

    let formData = new FormData();
    formData.append("image", profilePic);
    formData.append("id", data.id);
    formData.append("priority", data.priority);

    let config = {
        method: "patch",
        url: getBaseUrl() + "auth_api/catalogue/banner",
        headers: { Authorization: `Bearer ${token}` },
        data: formData,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error);
    }
};

export const deleteCatalogueBanner = async (id) => {
    const token = localStorage.getItem("token");
    let config = {
        method: "delete",
        url: getBaseUrl() + `auth_api/catalogue/banner/${id}`,
        headers: { Authorization: `Bearer ${token}` },
    };
    try {
        return await axios(config);
    } catch (error) {
        console.log(error);
    }
};


// Trending product
export const getTrendingProductListing = async (data) => {
    const token = localStorage.getItem("token");
    let config = {
        method: "get",
        url: getBaseUrl() + `auth_api/catalogue/trending_product?page=${data.page}&limit=${data.limit}`,
        headers: { Authorization: `Bearer ${token}` },
        data,
    };
    try {
        return await axios(config);
    } catch (error) {
        console.log(error);
    }
};

export const addTrendingProduct = async (data) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/catalogue/trending_product",
        headers: { Authorization: `Bearer ${token}` },
        data,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error);
    }
};

export const updateTrendingProduct = async (data) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "patch",
        url: getBaseUrl() + "auth_api/catalogue/trending_product",
        headers: { Authorization: `Bearer ${token}` },
        data,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error);
    }
};

export const deleteTrendingProduct = async (id) => {
    const token = localStorage.getItem("token");
    
    let config = {
        method: "delete",
        url: getBaseUrl() + `auth_api/catalogue/trending_product/${id}`,
        headers: { Authorization: `Bearer ${token}` },
    };
    try {
        return await axios(config);
    } catch (error) {
        console.log(error);
    }
};


// Catalogue Category
export const getCatalogueCategoryListing = async (data) => {
    const token = localStorage.getItem("token");
    let config = {
        method: "get",
        url: getBaseUrl() + `auth_api/catalogue/category?page=${data.page}&limit=${data.limit}`,
        headers: { Authorization: `Bearer ${token}` },
        data,
    };
    try {
        return await axios(config);
    } catch (error) {
        console.log(error);
    }
};

export const addCatalogueCategory = async (profilePic, data) => {
    const token = localStorage.getItem("token");

    let formData = new FormData();
    formData.append("image", profilePic);
    formData.append("category_id", data.category_id);
    formData.append("products", data.products);

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/catalogue/category",
        headers: { Authorization: `Bearer ${token}` },
        data: formData,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error);
    }
};

export const updateCatalogueCategory = async (profilePic, data) => {
    const token = localStorage.getItem("token");

    let formData = new FormData();
    formData.append("image", profilePic);
    formData.append("id", data.id);
    formData.append("category_id", data.category_id);
    formData.append("products", data.products);

    let config = {
        method: "patch",
        url: getBaseUrl() + "auth_api/catalogue/category",
        headers: { Authorization: `Bearer ${token}` },
        data: formData,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error);
    }
};

export const deleteCatalogueCategory = async (id) => {
    const token = localStorage.getItem("token");
    let config = {
        method: "delete",
        url: getBaseUrl() + `auth_api/catalogue/category/${id}`,
        headers: { Authorization: `Bearer ${token}` },
    };
    try {
        return await axios(config);
    } catch (error) {
        console.log(error);
    }
};