import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import group from "../../../images/group.png";

import { toast } from "react-toastify";
import { Avatar, CircularProgress } from "@mui/material";
import { fetchAllCategory, fetchAllProduct, getSinglePGroup } from "../../../api/productAPI";
import isAllowed from "../../../utils/isAllowed";
import { VIEW_CATALOGUE } from "../../../constants";
import { updateCatalogueCategory } from "../../../api/catalogueAPI";
import CameraAltIcon from "@mui/icons-material/CameraAlt";


const EditCategory = () => {
    const navigate = useNavigate();
    const location = useLocation()
    // console.log("location.state", location.state)

    const [btnLoading, setbtnLoading] = useState(false);
    const [allCategory, setallCategory] = useState([]);
    const [allProduct, setallProduct] = useState([]);

    const [groupID, setgroupID] = useState("");
    const [groupEmp, setgroupEmp] = useState([]);
    const [selectedName, setselectedName] = useState([]);

    const [profilePic, setprofilePic] = useState("");
    const [demoProfilePic, setdemoProfilePic] = useState(location.state?.banner_img);

    useEffect(() => {
        fetchAllCategory().then((res) => setallCategory(res.data.result));
    }, [])

    useEffect(() => {
        setgroupID(location.state?.category_id._id)
        setallProduct(location.state?.products)
        location.state?.products?.map(data => {
            if (groupEmp.length === 0) {
                if (groupEmp.includes(data.id)) return console.log("included");
                setgroupEmp((groupEmp) => [...groupEmp, data._id]);
                setselectedName((selectedName) => [
                    ...selectedName,
                    data.productName,
                ]);
            }
        })
    }, [location.state])


    const categoryHandleInput = async (e) => {
        setgroupID(e.target.value);
        let res = await fetchAllProduct({ catagory_id: e.target.value, brand_id: "", sub_catagory_id: "" })
        if (res.data.status) {
            setallProduct(res.data.result);
            setgroupEmp([])
            setselectedName([])
<<<<<<< HEAD
=======
            setgroupEmp(res.data.result.map(res => res.id));
>>>>>>> 04fedc3911e1dd3321940bd01676f64ef01e52f2
        } else {
            console.log(res.data.message);
            toast.error("Some Error!");
        }
    }

    const toggleEmpGroup = (e) => {
        const shouldAdd = e.target.checked;
        const empId = e.target.value;
        if (shouldAdd) {
            setgroupEmp([...groupEmp, empId]);
            setselectedName([...selectedName, e.target.name]);
            return;
        }
        setgroupEmp(groupEmp.filter((id) => id !== empId));
        setselectedName(selectedName.filter((name) => name !== e.target.name));
    };

    const editProductGroupFunc = async () => {
        setbtnLoading(true);
        if (!await isAllowed(VIEW_CATALOGUE)) {
            toast.error("Module is not purchased!");
            return setbtnLoading(false);
        }

        let groupData = {
            id: location.state._id,
            category_id: groupID,
            products: groupEmp,
        };

        let res = await updateCatalogueCategory(profilePic, groupData);
        if (res.data.status) {
            toast.success("Catogery Edited Successfully!");
            navigate("/catalogue_category");
        } else {
            toast.error(res.data.message);
        }
        setbtnLoading(false);
    };

    const addPicFunc = async (e) => {
        let file = e.target.files[0];
        setprofilePic(file);
        setdemoProfilePic(URL.createObjectURL(file));
    };

    return (
        <div className="container">
            <div className="dash_heading">
                <div className="icon">
                    <img src={group} alt="icon" />
                </div>
                <div className="title">Edit Category</div>
            </div>

<<<<<<< HEAD
            <div className="party_container">
=======
            {/* <div className="party_container">
>>>>>>> 04fedc3911e1dd3321940bd01676f64ef01e52f2
                <div className="profile_details">
                    <div className="avatar">
                        <Avatar
                            alt="Profile Pic"
                            src={demoProfilePic || profilePic}
                            style={{ height: "9rem", width: "9rem" }}
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
<<<<<<< HEAD
            </div>
=======
            </div> */}
>>>>>>> 04fedc3911e1dd3321940bd01676f64ef01e52f2

            <div className="party_container">
                <div className="grouping_title">Product List</div>
                <select value={groupID} style={{ width: "50%" }} onChange={categoryHandleInput} >
                    <option value="">Selected Category - {location.state.catagory_id}</option>
                    {allCategory.length === 0 && <option disabled value="">No Category Found</option>}
                    {allCategory?.map((category) => (
                        <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                </select>

                {allProduct?.length === 0 || !allProduct ? (
                    <div style={{ padding: "1rem", fontWeight: 600 }} >No product found</div>
                ) : (
                    <div className="grouping_checkbox">
                        {allProduct?.map((product) => (
                            <div className="grouping_row">
                                <input
                                    type="checkbox"
                                    value={product.id || product._id}
                                    name={product.name}
                                    onChange={toggleEmpGroup}
                                    checked={groupEmp.includes(product.id || product._id)}
                                />
                                <label htmlFor="">{product.name || product.productName}</label>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="party_container" style={{ background: "none", boxShadow: "none" }}>
                <div className="message_btn submit_btn" onClick={() => editProductGroupFunc()}        >
                    {btnLoading ? (
                        <CircularProgress style={{ color: "#fff" }} size={26} />
                    ) : (
                        "EDIT"
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditCategory;