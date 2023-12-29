import '../LMClients.css';
import React, { useState } from 'react';
import group from '../../../../images/group.png';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createGroup } from '../../../../api/leadApi';

const CreateLeadGroup = () => {
    const navigateTo = useNavigate();

    const [btnLoading, setbtnLoading] = useState(false)

    const [groupName, setgroupName] = useState('');
    const [groupColor, setGroupColor] = useState('#006397');

    const groupColours = ['#006397', '#12a763', '#fcac63', '#f678c2', '#3e7a44', '#c37932', '#ab418b', '#aa4040', '#006397', '#fa4e64', '#43516c', '#12a763', '#fcac63', '#43516c', '#3e7a44', '#ab418b',];

    async function createGroupHandler() {
        if (!groupName) return toast.error("Group Name Is Required!")

        const data = {
            colour: groupColor,
            grp_name: groupName,
        };
        // console.log(data)

        try {
            setbtnLoading(true)
            const res = await createGroup(data);
            console.log(res.data);
            if (res.data.status) {
                toast.success(res.data.message);
                setbtnLoading(false)
                // navigateTo('/group_list');
            } else {
                toast.error(res.data.message);
                setbtnLoading(false)
            }
        } catch (error) {
            toast.error(error.message);
            setbtnLoading(false)
        }
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

                    <div className="btn changepass_btn" onClick={(e) => createGroupHandler()}>
                        {btnLoading ? <CircularProgress style={{ color: '#fff' }} size={26} /> : 'CREATE GROUP'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateLeadGroup;
