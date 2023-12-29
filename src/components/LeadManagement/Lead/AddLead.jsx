import { CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import fetchAllEmployee from '../../../api/employeeAPI';
import { addNewLead } from '../../../api/leadApi';
import getStateFunc, { getCityFunc } from '../../../api/locationAPI';
import group from '../../../images/group.png';

const AddLead = () => {
  const navigateTo = useNavigate();
  const [allState, setAllState] = useState([]);
  const [allCity, setAllCity] = useState([]);
  const [allEmp, setAllEmp] = useState([]);
  const [errors, setErrors] = useState({});
  const [apiRes, setApiRes] = useState({ loading: false, error: '' });
  //form state
  const [leadName, setLeadName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [mob, setMob] = useState('');
  const [email, setEmail] = useState('');
  const [pincode, setPincode] = useState('');
  const [leadSource, setLeadSource] = useState('manual');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [addBy, setAddBy] = useState('');
  const [note, setNote] = useState('');
  const [assignTo, setAssignTo] = useState('');

  useEffect(() => {
    getStateFunc().then((res) => setAllState(res.data.result));
  }, []);

  useEffect(() => {
    if (!state) {
      setAllCity([]);
      setAllEmp([]);
      return;
    }
    getCityFunc(state).then((res) => setAllCity(res.data.result));
    fetchAllEmployee({ state }).then((res) => setAllEmp(res.data.result));
  }, [state]);

  console.log(errors);

  async function addLeadHandler() {
    let tempErrs = {};
    const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!leadName) tempErrs.leadName = 'LeadName is required';
    if (!mob) tempErrs.mob = 'Mobile number is required';
    if (!leadSource) tempErrs.leadSource = 'Lead source is required';
    if (!displayName) tempErrs.displayName = 'Display name is required';
    if (!state) tempErrs.state = 'State is required';
    if (!city) tempErrs.city = 'City is required';
    if (!addBy) tempErrs.addBy = 'Add by is required';
    if (!assignTo) tempErrs.assignTo = 'Assign to is required';
    if (!pincode) {
      tempErrs.pincode = 'Pincode is required';
    } else if (pincode.length < 6) {
      tempErrs.pincode = 'Pincode is invalid';
    }
    if (!email) {
      tempErrs.email = 'Email is required';
    } else if (!validEmailRegex.test(email)) {
      tempErrs.email = 'Invalid email ID';
    }
    setErrors(tempErrs);
    if (Object.keys(tempErrs).length) return;
    const data = {
      leadName,
      displayName,
      mobileNumber: mob,
      email,
      pincode,
      state,
      city,
      leadSource,
      note,
      addBy,
      assignToEmp: assignTo,
    };

    setApiRes({ loading: true, error: '' });
    console.log(data)
    // try {
    //   const res = await addNewLead(data);
    //   if (res.data.status) {
    //     console.log(res.data);
    //     toast.success(res.data.message);
    //     setApiRes({ loading: false, error: '' });
    //     navigateTo('/lead_list');
    //   } else {
    //     console.log(res.data);
    //     toast.error(res.data.message);
    //     setApiRes({ loading: false, error: res.data.message });
    //   }
    // } catch (error) {
    //   toast.error(error.message);
    //   setApiRes({ loading: false, error: error.message });
    // }
  }

  function setValidField(field) {
    if (!errors[field]) return;
    setErrors((prev) => {
      delete prev[field];
      return prev;
    });
  }

  function setInvalidField(field, msg = 'Invalid') {
    setErrors({
      ...errors,
      [field]: msg,
    });
  }

  return (
    <div className="container">
      <div className="beat_heading">
        <div className="beat_left">
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Add New Lead (Manual)</div>
        </div>
        {/* <div className="beat_right">
          <div
            className="add_btn"
            // onClick={() => navigate("/add_lead")}
          >
            Add New
          </div>
        </div> */}
      </div>
      <div className="subadmin_container">
        <div className="subadmin_form">
          <div className="right">
            <div className="input_form">
              <input
                type="text"
                name="lead_name"
                value={leadName}
                onChange={(e) => {
                  setValidField('leadName');
                  setLeadName(e.target.value);
                }}
                placeholder="Lead Name"
              />
              {errors.leadName && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.leadName}</p>}

              <input
                type="text"
                name="phone"
                value={mob}
                onChange={(e) => {
                  if (isNaN(e.target.value)) return;
                  if (e.target.value.length > 10) return;
                  setMob(e.target.value.trim());
                  setValidField('mob');
                }}
                placeholder="Mobile Number"
              />
              {errors.mob && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.mob}</p>}

              <input
                type="text"
                name="pincode"
                value={pincode}
                onChange={(e) => {
                  if (isNaN(e.target.value)) return;
                  if (e.target.value.length > 6) return;
                  setPincode(e.target.value.trim());
                  setValidField('pincode');
                }}
                placeholder="Pincode"
              />
              {errors.pincode && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.pincode}</p>}

              <select
                name="leadSource"
                value={leadSource}
                onChange={(e) => {
                  setValidField('leadSource');
                  setLeadSource(e.target.value);
                }}
              >
                <option value="">Select Lead Source</option>
                <option value="manual">Manual</option>
              </select>
              {errors.leadSource && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.leadSource}</p>}

              <input
                type="text"
                name="note"
                value={note}
                onChange={(e) => {
                  setValidField('note');
                  setNote(e.target.value);
                }}
                placeholder="Note"
              />
              {errors.note && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.note}</p>}
            </div>
          </div>
          <div className="right">
            <div className="input_form">
              <input
                type="text"
                name="displayname"
                value={displayName}
                onChange={(e) => {
                  setValidField('displayName');
                  setDisplayName(e.target.value);
                }}
                placeholder="Display Name"
              />
              {errors.displayName && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.displayName}</p>}

              <input
                type="text"
                name="email"
                value={email}
                onChange={(e) => {
                  setValidField('email');
                  setEmail(e.target.value);
                }}
                placeholder="Email ID"
              />
              {errors.email && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.email}</p>}

              <select
                name="state"
                value={state}
                onChange={(e) => {
                  setValidField('state');
                  setState(e.target.value);
                }}
              >
                <option value="">Select State</option>
                {allState?.map((st, i) => (
                  <option value={st._id} key={i}>
                    {st.name}
                  </option>
                ))}
              </select>
              {errors.state && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.state}</p>}

              <select
                name="city"
                value={city}
                onChange={(e) => {
                  setValidField('city');
                  setCity(e.target.value);
                }}
              >
                <option value="">Select City</option>
                {allCity?.map((cty) => (
                  <option value={cty._id}>{cty.name}</option>
                ))}
              </select>
              {errors.city && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.city}</p>}

              <input
                type="text"
                name="addby"
                value={addBy}
                onChange={(e) => {
                  setValidField('addBy');
                  setAddBy(e.target.value);
                }}
                placeholder="Add by Admin/Employee"
              />
              {errors.addBy && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.addBy}</p>}

              <select
                name="assignto"
                value={assignTo}
                onChange={(e) => {
                  setValidField('assignTo');
                  setAssignTo(e.target.value);
                }}
              >
                <option value="">Assign to Employee</option>
                {allEmp?.map((emp) => (
                  <option value={emp.id}>{emp.employeeName}</option>
                ))}
              </select>
              {errors.assignTo && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.assignTo}</p>}
            </div>
          </div>
        </div>
        <div className="btn changepass_btn" onClick={(e) => !apiRes.loading && addLeadHandler()}>
          {apiRes.loading ? <CircularProgress style={{ color: '#fff' }} size={26} /> : 'SAVE'}
        </div>
      </div>
    </div>
  );
};

export default AddLead;
