import "./CreateGroup.css";
import React, { useState } from "react";
import group from "../../images/group.png";

const CreateGroup = () => {
    const [groupName, setgroupName] = useState("")
    const [colorActive, setcolorActive] = useState("#006397")

    const groupColours = ["#006397", "#12a763", "#fcac63", "#f678c2",
        "#3e7a44", "#c37932", "#ab418b", "#aa4040",
        "#006397", "#fa4e64", "#43516c", "#12a763",
        "#fcac63", "#43516c", "#3e7a44", "#ab418b"
    ]

    const createGroupName = () => {
        console.log(groupName, colorActive);
    }

    return (
        <div className="container">
            <div className="dash_heading">
                <div className="icon">
                    <img src={group} alt="icon" />
                </div>
                <div className="title">Create Group</div>
            </div>

            <div className="changepass_container">
                <div className="changepass_form">
                    <input
                        type="text"
                        name="company_name"
                        value={groupName}
                        onChange={(e) => setgroupName(e.target.value)}
                        placeholder="Group Name"
                    />

                    <div className="group_colours_container">
                        <div className="colour_title">Group Colours</div>

                        <div className="group_colours">
                            {groupColours.map(colour =>
                                <div onClick={() => setcolorActive(colour)} style={{ backgroundColor: colour }} className={`${colorActive === colour ? "colour active_colour" : "colour"}`}></div>
                            )}

                        </div>
                    </div>

                    <div className="btn changepass_btn" onClick={() => createGroupName()} >CREATE GROUP</div>
                </div>
            </div>
        </div>
    );
};

export default CreateGroup;
