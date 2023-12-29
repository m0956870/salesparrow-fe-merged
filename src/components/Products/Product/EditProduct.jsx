import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

import group from "../../../images/group.png";
import { toast } from "react-toastify";

import { blankValidator } from "../../../utils/Validation";
import { CircularProgress } from "@mui/material";
import fetchAllBrands, { editProduct, fetchAllCategory, fetchAllUnit } from "../../../api/productAPI";
import isAllowed from "../../../utils/isAllowed";
import { PRODUCT_MANAGEMENT } from "../../../constants";

const EditProduct = () => {
    const navigate = useNavigate();
    const location = useLocation()
    // console.log(location.state)

    const [btnLoading, setbtnLoading] = useState(false);

    const [allBrand, setallBrand] = useState([]);
    const [allCategory, setallCategory] = useState([]);
    const [allSubCategory, setallSubCategory] = useState([]);

    const [profilePic, setprofilePic] = useState("");
    const [demoProfilePic, setdemoProfilePic] = useState(location.state.image);

    const [product, setproduct] = useState({
        id: location.state.id,
        productName: location.state.name,
        brand_id: "",
        catagory_id: "",
        sub_catagory_id: "",
        gst: location.state.gst,
        hsn_code: location.state.hsn_code,
        description: location.state.description,

        mrp: location.state.mrp,
        price: location.state.price,
        sku_id: location.state.sku_id,
    });

    const [error, setError] = useState({
        productName: {
            status: false,
        },
        brand_id: {
            status: false,
        },
        catagory_id: {
            status: false,
        },
        sub_catagory_id: {
            status: false,
        },
        gst: {
            status: false,
        },
        hsn_code: {
            status: false,
        },
        mrp: {
            status: false,
        },
        price: {
            status: false,
        },
    });

    const handleInput = (e) => {
        Object.values(error).map(item => item.status = false)
        setproduct({ ...product, [e.target.name]: e.target.value });
    };

    const allPackageDetail = location.state.packing_details?.[0] && JSON.parse(location.state.packing_details?.[0])
    // console.log(allPackageDetail)

    const [allUnits, setallUnits] = useState([])

    const [unit1, setunit1] = useState({
        unitName: allPackageDetail?.[0].unitName,
        unitValue: allPackageDetail?.[0].unitValue,
      })
      const [unit2, setunit2] = useState({
        unitName: allPackageDetail?.[1].unitName,
        unitValue: allPackageDetail?.[1].unitValue,
      })

    const unithandleInput = (e, type) => {
        // console.log(type)

        if (type === "unit1") {
            return setunit1({ ...unit1, [e.target.name]: e.target.value });
        }
        setunit2({ ...unit2, [e.target.name]: e.target.value });
    };

    const addPicFunc = async (e) => {
        let file = e.target.files[0];
        setprofilePic(file);
        setdemoProfilePic(URL.createObjectURL(file));
    };

    const editProductFunc = async () => {
        setbtnLoading(true)
        if (!await isAllowed(PRODUCT_MANAGEMENT)) {
            toast.error("Module is not purchased!");
            return setbtnLoading(false);
        }

        if (!blankValidator(product.productName)) {
            return setError({
                ...error,
                productName: {
                    status: true,
                },
            });
        }

        if (!blankValidator(product.gst)) {
            return setError({
                ...error,
                gst: {
                    status: true,
                }
            })
        }

        if (!blankValidator(product.mrp)) {
            return setError({
                ...error,
                mrp: {
                    status: true,
                },
            });
        }

        if (!blankValidator(product.price)) {
            return setError({
                ...error,
                price: {
                    status: true,
                },
            });
        }

        let allData = {
            ...product,
            packing_details: [unit1, unit2]
        }

        // console.log(profilePic, allData);

        try {
            let res = await editProduct(profilePic, allData);
            // console.log(res);
            if (res.data.status) {
                toast.success("Product Edited Successfully!");
                navigate("/products");
                setbtnLoading(false);
            } else {
                toast.error(res.data.message);
                setbtnLoading(false);
            }
        } catch (error) {
            console.log(error);
            toast.error("Internet Error!")
            setbtnLoading(false);
        }
    };

    // const categoryHandleInput = async (e) => {
    //     // console.log(e.target.value);
    //     setproduct({ ...product, [e.target.name]: e.target.value });
    //     try {
    //         fetchAllCategory(1, e.target.value).then((res) => setallSubCategory(res.data.result))
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    useEffect(() => {
        fetchAllBrands().then((res) => setallBrand(res.data.result));
        fetchAllCategory().then((res) => setallCategory(res.data.result));
        fetchAllUnit().then(res => setallUnits(res.data.result))
    }, [])

    // console.log(allBrand);
    // console.log(allCategory);
    // console.log(allSubCategory);

    return (
        <div className="container">
            <div className="beat_heading">
                <div
                    className="beat_left"
                >
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title"> Edit Product </div>
                </div>
            </div>
            <div className="addbeat_container">
                <div className="profile_details" style={{ marginTop: "1rem" }}>
                    <div className="avatar">
                        <Avatar
                            alt="Profile Pic"
                            src={demoProfilePic || profilePic}
                            style={{ height: "9rem", width: "9rem" }}
                        // onClick={handleClick}
                        />
                        <label>
                            <CameraAltIcon className="camera_icon" />
                            <input
                                type="file"
                                onChange={addPicFunc}
                                name="myfile"
                                accept="image/*"
                                style={{ display: "none" }}
                            />
                        </label>
                    </div>
                </div>

                <div className="addbeat_form addemployee_form">
                    <div className="addbeat_left">
                        <input
                            type="text"
                            name="productName"
                            value={product.productName}
                            onChange={handleInput}
                            placeholder="Product Name"
                        />
                        {error.productName.status && (
                            <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                                Please Enter Product Name
                            </p>
                        )}
                        <select name="catagory_id" onChange={handleInput} >
                            <option value="">{location.state.catagory_name}</option>
                            {allCategory.length === 0 && <option disabled value="">No Category Found</option>}
                            {allCategory?.map((category) => (
                                <option key={category._id} value={category._id}>{category.name}</option>
                            ))}
                        </select>
                        {error.catagory_id.status && (
                            <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                                Please Select Product Category
                            </p>
                        )}
                        {error.gst.status && (
                            <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }} >
                                Please Enter GST Percentage
                            </p>
                        )}
                        <input
                            type="text"
                            name="hsn_code"
                            value={product.hsn_code}
                            onChange={handleInput}
                            placeholder="HSN Code"
                        />
                        <input
                            type="number"
                            name="mrp"
                            value={product.mrp}
                            onChange={handleInput}
                            placeholder="MRP"
                        />
                        {error.mrp.status && (
                            <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }} >
                                Please Enter MRP
                            </p>
                        )}
                        <textarea
                            type="text"
                            name="description"
                            value={product.description}
                            onChange={handleInput}
                            placeholder="Product Description"
                            className="company_desc"
                            style={{ minHeight: "6.5rem" }}
                        />
                    </div>

                    <div className="addbeat_right">
                        <select name="brand_id" onChange={handleInput} >
                            <option value="">{location.state.brand_name}</option>
                            {allBrand.length === 0 && <option disabled value="">No Brand Found</option>}
                            {allBrand?.map((brand) => (
                                <option key={brand._id} value={brand._id}>{brand.name}</option>
                            ))}
                        </select>
                        {error.brand_id.status && (
                            <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                                Please Select Product Brand
                            </p>
                        )}

                        <input
                            type="number"
                            name="gst"
                            value={product.gst}
                            onChange={handleInput}
                            placeholder="GST (%)"
                        />
                        {error.gst.status && (
                            <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }} >
                                Please Enter GST Percentage
                            </p>
                        )}
                        <input
                            type="text"
                            name="sku_id"
                            value={product.sku_id}
                            onChange={handleInput}
                            placeholder="SKU ID"
                        />
                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleInput}
                            placeholder="Retail Price"
                        />
                    </div>
                </div>

                <h3 style={{ margin: "1rem 0" }} >Packing Details</h3>
                <div className="packeging_details">
                    <div className="flex_1">
                        <div className="details" style={{ background: "#f2f7fb" }} >
                            <div>Select Unit 1</div>
                        </div>
                    </div>
                    <div className="flex_half">
                        <select name="unitName" onChange={(e) => unithandleInput(e, "unit1")} >
                            <option value="">{allPackageDetail?.[0].unitName}</option>
                            {allUnits.length === 0 && <option disabled value="">No Unit Found</option>}
                            {allUnits?.map((unit) => (
                                <option key={unit._id} value={unit.unit}>{unit.unit}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex" >=</div>
                    <div className="flex_1">
                        <input
                            type="number"
                            name="unitValue"
                            value={unit1.unitValue}
                            onChange={(e) => unithandleInput(e, "unit1")}
                            placeholder="Enter Unit"
                        />
                    </div>
                    <div className="flex_1">
                        <div className="details" >
                            <div>Pcs</div>
                        </div>
                    </div>
                </div>

                <div className="packeging_details">
                    <div className="flex_1">
                        <div className="details" style={{ background: "#f2f7fb" }} >
                            <div>Select Unit 2</div>
                        </div>
                    </div>
                    <div className="flex_half">
                        <select name="unitName" onChange={(e) => unithandleInput(e, "unit2")} >
                            <option value="">{allPackageDetail?.[1].unitName}</option>
                            {allUnits.length === 0 && <option disabled value="">No Unit Found</option>}
                            {allUnits?.map((unit) => (
                                <option key={unit._id} value={unit.unit}>{unit.unit}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex" >=</div>
                    <div className="flex_1">
                        <input
                            type="number"
                            name="unitValue"
                            value={unit2.unitValue}
                            onChange={(e) => unithandleInput(e, "unit2")}
                            placeholder="Enter Unit"
                        />
                    </div>
                    <div className="flex_1">
                        <div className="details" >
                            <div>{unit2.unitValue} {unit1.unitName || "kg"}</div>
                            <div>=</div>
                            <div>{unit1.unitValue * unit2.unitValue} pcs</div>
                        </div>
                    </div>
                </div>

                <div onClick={() => editProductFunc()} className="btn changepass_btn">
                    {btnLoading ? (
                        <CircularProgress style={{ color: "#fff" }} size={26} />
                    ) : (
                        "EDIT PRODUCT"
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditProduct;