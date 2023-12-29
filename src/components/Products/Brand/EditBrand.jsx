import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

import group from "../../../images/group.png";
import { toast } from "react-toastify";

import { blankValidator } from "../../../utils/Validation";
import { CircularProgress } from "@mui/material";
import { editBrand } from "../../../api/productAPI";
import isAllowed from "../../../utils/isAllowed";
import { PRODUCT_MANAGEMENT } from "../../../constants";

const EditBrand = () => {
    const navigate = useNavigate();
    const location = useLocation()
    console.log(location.state)

    const [btnLoading, setbtnLoading] = useState(false);

    const [profilePic, setprofilePic] = useState("");
    const [demoProfilePic, setdemoProfilePic] = useState(location.state?.image);

    const [brand, setbrand] = useState({
        brandName: location.state?.name,
        status: location.state?.status,
        id: location.state?._id,
    });

    const [error, setError] = useState({
        brandName: {
            status: false,
        },
    });

    const handleInput = (e) => {
        Object.values(error).map(item => item.status = false)
        setbrand({ ...brand, [e.target.name]: e.target.value });
    };

    const editBrandFunc = async () => {
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

        console.log(profilePic, brand);

        try {
            let res = await editBrand(profilePic, brand);
            console.log(res);
            if (res.data.status) {
                toast.success("Brand Edited Successfully!");
                navigate("/brands");
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

    const editEmployeePic = async (e) => {
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
                    <div className="title"> Edit Brand </div>
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
                                onChange={editEmployeePic}
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
                            <option value="">{location.state?.status}</option>
                            <option value="Active">Active</option>
                            <option value="InActive">InActive</option>
                        </select>
                    </div>
                </div>
                <div onClick={() => editBrandFunc()} className="btn changepass_btn">
                    {btnLoading ? (
                        <CircularProgress style={{ color: "#fff" }} size={26} />
                    ) : (
                        "EDIT BRAND"
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditBrand;