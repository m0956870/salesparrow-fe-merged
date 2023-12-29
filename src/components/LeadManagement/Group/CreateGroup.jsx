import './CreateGroup.css';
import React, { useState } from 'react';
import group from '../../../images/group.png';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createGroup } from '../../../api/leadApi';
import { toast } from 'react-toastify';

const CreateGroup = () => {
  const navigateTo = useNavigate();
  const [apiRes, setApiRes] = useState({ loading: false, error: '' });
  const [errors, setErrors] = useState({});

  const [groupName, setgroupName] = useState('');
  const [groupColor, setGroupColor] = useState('');

  const groupColours = ['#006397', '#12a763', '#fcac63', '#f678c2', '#3e7a44', '#c37932', '#ab418b', '#aa4040', '#006397', '#fa4e64', '#43516c', '#12a763', '#fcac63', '#43516c', '#3e7a44', '#ab418b',];

  async function createGroupHandler() {
    console.log(groupName, groupColor);
    let tempErrs = {};
    if (!groupName) {
      tempErrs.groupName = 'Group name is required';
    }
    if (!groupColor) {
      tempErrs.groupColor = 'Group color is required';
    }
    setErrors(tempErrs);
    if (Object.keys(tempErrs).length) return;
    const data = {
      colours: groupColor,
      name: groupName,
    };
    setApiRes({ loading: true, error: '' });
    try {
      const res = await createGroup(data);
      console.log(res.data);
      if (res.data.status) {
        toast.success(res.data.message);
        setApiRes({ loading: false, error: '' });
        navigateTo('/group_list');
      } else {
        toast.error(res.data.message);
        setApiRes({ loading: false, error: res.data.message });
      }
    } catch (error) {
      toast.error(error.message);
      // setApiRes({ loading: false, error: res.data.message });
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
          {errors.groupName && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.groupName}</p>}
          <div className="group_colours_container">
            <div className="colour_title">Group Colours</div>
            {errors.groupColor && <span style={{ fontSize: '0.9rem', color: 'red' }}>{errors.groupColor}</span>}
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

          <div className="btn changepass_btn" onClick={(e) => !apiRes.loading && createGroupHandler()}>
            {apiRes.loading ? <CircularProgress style={{ color: '#fff' }} size={26} /> : 'CREATE GROUP'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
