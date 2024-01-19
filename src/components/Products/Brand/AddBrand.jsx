import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

import group from "../../../images/group.png";
import { toast } from "react-toastify";

import { blankValidator } from "../../../utils/Validation";
import { CircularProgress } from "@mui/material";
import { addBrand } from "../../../api/productAPI";
import isAllowed from "../../../utils/isAllowed";
import { PRODUCT_MANAGEMENT } from "../../../constants";

const AddBrand = () => {
    const navigate = useNavigate();

    const [btnLoading, setbtnLoading] = useState(false);

    const [profilePic, setprofilePic] = useState("");
    const [demoProfilePic, setdemoProfilePic] = useState();

    const [brand, setbrand] = useState({
        brandName: "",
        status: "Active",
    });

    const [error, setError] = useState({
        brandName: {
            status: false,
        },
    });

    const handleInput = (e) => {
        setError({
            brandName: {
                status: false,
            },
        });
        setbrand({ ...brand, [e.target.name]: e.target.value });
    };

    const addBrandFunc = async () => {
        setbtnLoading(true);
        if (!await isAllowed(PRODUCT_MANAGEMENT)) {
            toast.error("Module is not purchased!");
            return setbtnLoading(false);
        }

        if (!blankValidator(brand.brandName)) {
            return setError({
                ...error,
                brandName: {
                    status: true,
                },
            });
        }

        if (!profilePic) return toast.error("Please Select Brand Image");

        let res = await addBrand(profilePic, brand);
        // console.log(res);
        if (res.data.status) {
            toast.success("Brand created Successfully!");
            navigate("/brands");
            setbtnLoading(false);
        } else {
            toast.error(res.data.message);
            setbtnLoading(false);
        }
    };

    const addPicFunc = async (e) => {
        let file = e.target.files[0];
        setprofilePic(file);
        setdemoProfilePic(URL.createObjectURL(file));
    };

    return (
        <div className="container">
            <div className="beat_heading">
                <div
                    className="beat_left"
                >
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title"> Add Brand </div>
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
                            name="brandName"
                            value={brand.brandName}
                            onChange={handleInput}
                            placeholder="Brand Name"
                        />
                        {error.brandName.status && (
                            <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                                Please Enter Brand Name
                            </p>
                        )}
                    </div>
                    <div className="addbeat_right">
                        <select name="status" onChange={handleInput}>
                            <option value="">Status</option>
                            <option value="Active">Active</option>
                            <option value="InActive">InActive</option>
                        </select>
                    </div>
                </div>
                <div onClick={() => addBrandFunc()} className="btn changepass_btn">
                    {btnLoading ? (
                        <CircularProgress style={{ color: "#fff" }} size={26} />
                    ) : (
                        "ADD Brand"
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddBrand;