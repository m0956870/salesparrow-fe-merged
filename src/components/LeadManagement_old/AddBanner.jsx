import "./AddBanner.css";
import React, { useState } from "react";
import group from "../../images/group.png";

import bannerImage from "../../images/add_banner.jpg"

const AddBanner = () => {

    const [bannerImage2, setbannerImage2] = useState("")

    const changePicFunc = (e) => {
        // console.log(e)

        const file = e.target.files[0];
        // console.log(file)
        // console.log(URL.createObjectURL(file))
        setbannerImage2(URL.createObjectURL(file))
    }

    return (
        <div className="container">
            <div className="dash_heading">
                <div className="icon">
                    <img src={group} alt="icon" />
                </div>
                <div className="title">Add Banner</div>
            </div>

            <div className="changepass_container">
                <div className="changepass_form">
                    <select name="" id="">
                        <option value="">Occassion Type</option>
                    </select>
                    <input
                        type="text"
                        name="company_name"
                        // value={groupName}
                        // onChange={(e) => setgroupName(e.target.value)}
                        placeholder="Group Name"
                    />
                    <input type="date" />

                    <div className="banner_image">
                        <a href="#">Banner Template Upload</a>

                        <label>
                            <img src={bannerImage2 || bannerImage} alt="banner" />

                            <input
                                type="file"
                                onChange={(e) => changePicFunc(e)}
                                name="myfile"
                                style={{ display: "none" }}
                            />
                        </label>


                    </div>


                    <div className="btn changepass_btn" >SAVE</div>
                </div>
            </div>
        </div>
    );
};

export default AddBanner;
