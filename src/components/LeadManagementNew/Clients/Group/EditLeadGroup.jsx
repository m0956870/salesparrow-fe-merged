import '../LMClients.css';
import React, { useState } from 'react';
import group from '../../../../images/group.png';
import { CircularProgress } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { editLeadGroup } from '../../../../api/leadApi';

const EditLeadGroup = () => {
    const navigateTo = useNavigate();
    const { state: sGroup } = useLocation()

    console.log("sGroup", sGroup)

    const [btnLoading, setbtnLoading] = useState(false)

    const [groupName, setgroupName] = useState(sGroup.lead_grp_name);
    const [groupColor, setGroupColor] = useState(sGroup.lead_grp_color);

    const groupColours = ['#006397', '#12a763', '#fcac63', '#f678c2', '#3e7a44', '#c37932', '#ab418b', '#aa4040', '#006397', '#fa4e64', '#43516c', '#12a763', '#fcac63', '#43516c', '#3e7a44', '#ab418b',];

    async function editGroupHandler() {
        if (!groupName) return toast.error("Group Name Is Required!")

        const data = {
            lead_grp_id: sGroup.id,
            colour: groupColor,
            grp_name: groupName,
        };

        setbtnLoading(true)
        const res = await editLeadGroup(data);
        console.log(res.data);
        if (res.data.status) {
            toast.success(res.data.message);
            setbtnLoading(false)
            navigateTo('/lead_management_clients');
        } else {
            toast.error(res.data.message);
            setbtnLoading(false)
        }
    }

    return (
        <div className="container">
            <div className="dash_heading">
                <div className="icon">
                    <img src={group} alt="icon" />
                </div>
                <div className="title">Edit Group</div>
            </div>

            <div className="changepass_container">
                <div className="changepass_form">
                    <input type="text" name="company_name" value={groupName} onChange={(e) => setgroupName(e.target.value)} placeholder="Group Name" />
                    <div className="group_colours_container">
                        <div className="colour_title">Group Colours</div>
                        <div className="group_colours">
                            {groupColours.map((colour) => (
                                <div
                                    onClick={() => setGroupColor(colour)}
                                    style={{ backgroundColor: colour }}
                                    className={`${groupColor === colour ? 'colour active_colour' : 'colour'}`}
                                ></div>
                            ))}
                        </div>
                    </div>

                    <div className="btn changepass_btn" onClick={(e) => editGroupHandler()}>
                        {btnLoading ? <CircularProgress style={{ color: '#fff' }} size={26} /> : 'EDIT GROUP'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditLeadGroup;