import axios from "axios";
import { getBaseUrl } from "../utils/baseUrl";


// BRAND
const fetchAllBrands = async (pageCount) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/get_all_brands",
    headers: { Authorization: `Bearer ${token}` },
    data: { page: pageCount },
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const searchBrand = async (search, page) => {
  // return console.log(search, page);
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/brand_search",
    headers: { Authorization: `Bearer ${token}` },
    data: { search, page },
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const addBrand = async (profilePic, brand) => {
  // console.log(profilePic, brand);
  const token = localStorage.getItem("token");

  let formData = new FormData();
  formData.append("brand_image", profilePic);
  formData.append("name", brand.brandName);
  formData.append("status", brand.status);

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/add_brand",
    headers: { Authorization: `Bearer ${token}` },
    data: formData,
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const editBrand = async (profilePic, brand) => {
  // console.log(profilePic, brand);
  const token = localStorage.getItem("token");

  let formData = new FormData();
  formData.append("brand_image", profilePic);
  formData.append("id", brand.id);
  formData.append("name", brand.brandName || "");
  formData.append("status", brand.status || "");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/edit_brand",
    headers: { Authorization: `Bearer ${token}` },
    data: formData,
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteBrand = async (id) => {
  // console.log(id);
  const token = localStorage.getItem("token");

  var config = {
    method: "delete",
    url: getBaseUrl() + "auth_api/delete_brand",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { id: id },
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
  }
};


// Category
export const fetchAllCategory = async (pageCount, id) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/get_all_product_catagory",
    headers: { Authorization: `Bearer ${token}` },
    data: { page: pageCount, p_id: id },
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const searchCategory = async (search, page) => {
  // return console.log(search, page);
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/catagory_search",
    headers: { Authorization: `Bearer ${token}` },
    data: { search, page },
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const addCategory = async (profilePic, category) => {
  // console.log(profilePic, category);
  const token = localStorage.getItem("token");

  let formData = new FormData();
  formData.append("catagory_image", profilePic);
  formData.append("p_id", category.p_id || "");
  formData.append("name", category.name);
  formData.append("gst", category.gst);
  formData.append("status", category.status);

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/addProductCatagory",
    headers: { Authorization: `Bearer ${token}` },
    data: formData,
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const editCategory = async (profilePic, category) => {
  // console.log(profilePic, category);
  const token = localStorage.getItem("token");

  let formData = new FormData();
  formData.append("catagory_image", profilePic);
  formData.append("id", category.id);
  formData.append("name", category.name || "");
  formData.append("p_id", category.p_id || "");
  formData.append("gst", category.gst || "");
  formData.append("status", category.status || "");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/editProductCatagory",
    headers: { Authorization: `Bearer ${token}` },
    data: formData,
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteCategory = async (id) => {
  // console.log(id);
  const token = localStorage.getItem("token");

  var config = {
    method: "delete",
    url: getBaseUrl() + "auth_api/delete_catagory",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { id: id },
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteSubCategory = async (id) => {
  const token = localStorage.getItem("token");

  var config = {
    method: "delete",
    url: getBaseUrl() + "auth_api/delete_sub_catagory",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { id: id },
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
  }
};


// PRODUCT

export const fetchAllProduct = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/get_all_products",
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

export const searchProduct = async (search, page) => {
  // return console.log(search, page);
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/product_search",
    headers: { Authorization: `Bearer ${token}` },
    data: { search, page },
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const addProduct = async (profilePic, product) => {
  // console.log(profilePic, product);
  const token = localStorage.getItem("token");

  let formData = new FormData();
  formData.append("product_image", profilePic);
  formData.append("productName", product.productName);
  formData.append("brand_id", product.brand_id);
  formData.append("catagory_id", product.catagory_id);
  formData.append("gst", product.gst);
  formData.append("description", product.description);
  formData.append("hsn_code", product.hsn_code);
  formData.append("sku_id", product.sku_id);

  formData.append("mrp", product.mrp);
  formData.append("price", product.price);
  formData.append("packing_details", JSON.stringify(product.packing_details))

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/addProduct",
    headers: { Authorization: `Bearer ${token}` },
    data: formData,
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const editProduct = async (profilePic, product) => {
  // console.log(profilePic, product);
  const token = localStorage.getItem("token");

  let formData = new FormData();
  formData.append("product_image", profilePic);
  formData.append("id", product.id);
  formData.append("productName", product.productName || "");
  formData.append("brand_id", product.brand_id || "");
  formData.append("catagory_id", product.catagory_id || "");
  formData.append("gst", product.gst || "");
  formData.append("status", product.status || "");
  formData.append("description", product.description || "");
  formData.append("hsn_code", product.hsn_code || "");
  formData.append("sku_id", product.sku_id || "");

  formData.append("mrp", product.mrp || "");
  formData.append("price", product.price || "");
  formData.append("packing_details", product.packing_details ? JSON.stringify(product.packing_details) : "");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/edit_product",
    headers: { Authorization: `Bearer ${token}` },
    data: formData,
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteProduct = async (id) => {
  // console.log(id);
  const token = localStorage.getItem("token");

  var config = {
    method: "delete",
    url: getBaseUrl() + "auth_api/delete_product",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { id: id },
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
  }
};


// PRODUCT Varient

export const fetchAllProductVarient = async (pageCount, id) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/get_all_product_varients",
    headers: { Authorization: `Bearer ${token}` },
    data: { page: pageCount, product_id: id },
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const addProductVarient = async (profilePic, product) => {
  // console.log(profilePic, product);
  const token = localStorage.getItem("token");

  let formData = new FormData();
  formData.append("product_varient_image", profilePic);
  formData.append("product_id", product.product_id);
  formData.append("varient_name", product.varient_name);
  formData.append("mrp", product.mrp);
  formData.append("price", product.price);
  formData.append("packing_details", JSON.stringify(product.packing_details));

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/add_product_varient",
    headers: { Authorization: `Bearer ${token}` },
    data: formData,
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const editProductVarient = async (profilePic, product) => {
  // console.log(profilePic, product);
  const token = localStorage.getItem("token");

  let formData = new FormData();
  formData.append("product_varient_image", profilePic);
  formData.append("id", product.id);
  formData.append("varient_name", product.varient_name || "");
  formData.append("mrp", product.mrp || "");
  formData.append("price", product.price || "");
  formData.append("status", product.status || "");
  formData.append("packing_details", product.packing_details ? JSON.stringify(product.packing_details) : "");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/edit_product_varient",
    headers: { Authorization: `Bearer ${token}` },
    data: formData,
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteProductVarient = async (id) => {
  // console.log(id);
  const token = localStorage.getItem("token");

  var config = {
    method: "delete",
    url: getBaseUrl() + "auth_api/delete_product_varient",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { id: id },
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
  }
};


//  -------------------  PRODUCT GROUPS --------------------------

export const allProductGroup = async (pageCount, categoryID) => {
  // console.log(pageCount, categoryID);
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/get_product_grp_list",
    headers: { Authorization: `Bearer ${token}` },
    data: { page: pageCount, catagory_id: categoryID },
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getSinglePGroup = async (id) => {
  // console.log(id);
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/get_grp_data",
    headers: { Authorization: `Bearer ${token}` },
    data: { id },
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const addProductGrouping = async (group) => {
  // console.log(group);
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/add_product_grp",
    headers: { Authorization: `Bearer ${token}` },
    data: group,
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const editProductGrouping = async (obj) => {
  // console.log(obj);
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/edit_product_group",
    headers: { Authorization: `Bearer ${token}` },
    data: obj,
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteProductGroup = async (id) => {
  // console.log(id);
  const token = localStorage.getItem("token");

  var config = {
    method: "delete",
    url: getBaseUrl() + "auth_api/delete_product_grp",
    headers: { Authorization: `Bearer ${token}` },
    data: { id: id },
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
  }
};

// Unit

export const fetchAllUnit = async (pageCount) => {
  // console.log(pageCount, categoryID);
  const token = localStorage.getItem("token");

  let config = {
    method: "get",
    url: getBaseUrl() + "auth_api/get_all_units",
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const addUnit = async (group) => {
  // console.log(group);
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/add_unit",
    headers: { Authorization: `Bearer ${token}` },
    data: group,
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const editUnit = async (obj) => {
  // console.log(obj);
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/edit_unit",
    headers: { Authorization: `Bearer ${token}` },
    data: obj,
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteUnit = async (id) => {
  // console.log(id);
  const token = localStorage.getItem("token");

  var config = {
    method: "delete",
    url: getBaseUrl() + "auth_api/delete_unit",
    headers: { Authorization: `Bearer ${token}` },
    data: { id },
  };
  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
  }
};


// Price List

export const fetchPriceListing = async (data) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/get_all_pricelist",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
  }
};

export const proVarPriceListing = async (filterData) => {
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/products_and_varients",
    headers: { Authorization: `Bearer ${token}` },
    data: filterData,
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const addPriceList = async (pricelist) => {
  // console.log(pricelist);
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/add_price_list",
    headers: { Authorization: `Bearer ${token}` },
    data: pricelist,
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const editPriceList = async (pricelist) => {
  // console.log(pricelist);
  const token = localStorage.getItem("token");

  let config = {
    method: "post",
    url: getBaseUrl() + "auth_api/edit_price_list",
    headers: { Authorization: `Bearer ${token}` },
    data: pricelist,
  };

  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
    return error.response
  }
};

export const deletePriceList = async (id) => {
  // console.log(id);
  const token = localStorage.getItem("token");

  var config = {
    method: "delete",
    url: getBaseUrl() + "auth_api/delete_price_list",
    headers: { Authorization: `Bearer ${token}` },
    data: { id },
  };
  try {
    let res = await axios(config);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export default fetchAllBrands;