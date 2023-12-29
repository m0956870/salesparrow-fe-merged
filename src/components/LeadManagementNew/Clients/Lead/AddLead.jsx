import { CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import fetchAllEmployee from '../../../../api/employeeAPI';
import { addLead, getGroups } from '../../../../api/leadApi';
import getStateFunc, { getCityFunc } from '../../../../api/locationAPI';
import group from '../../../../images/group.png';

const AddLead = () => {
    const navigateTo = useNavigate();

    const [btnLoading, setbtnLoading] = useState(false)
    const [allState, setAllState] = useState([]);
    const [allCity, setAllCity] = useState([]);
    const [allEmployee, setallEmployee] = useState([]);
    const [allLeadGroups, setallLeadGroups] = useState([]);

    //form state
    const [leadName, setLeadName] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [mob, setMob] = useState('');
    const [email, setEmail] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [assignTo, setAssignTo] = useState('');
    const [leadStage, setleadStage] = useState('');
    const [leadGrp, setleadGrp] = useState('');
    const [dealValue, setdealValue] = useState('');
    const [currency, setcurrency] = useState('');
    const [leadPotential, setleadPotential] = useState('');
    const [leadSource, setLeadSource] = useState('');
    const [note, setNote] = useState('');

    const [errors, setErrors] = useState({});

    useEffect(() => {
        getStateFunc().then((res) => setAllState(res.data.result));
        getGroups().then((res) => setallLeadGroups(res.data.result));
    }, []);

    async function addLeadHandler() {
        let tempErrs = {};
        const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!leadName) tempErrs.leadName = 'LeadName is required';
        if (!state) tempErrs.state = 'State is required';
        if (!city) tempErrs.city = 'City is required';
        if (!dealValue) tempErrs.dealValue = 'Deal Value is required';
        if (!leadStage) tempErrs.leadStage = 'Lead Stage is required';
        if (!leadGrp) tempErrs.leadGrp = 'Lead Group is required';
        if (!leadPotential) tempErrs.leadPotential = 'Lead Potental is required';
        if (!leadSource) tempErrs.leadSource = 'Lead source is required';
        if (!assignTo) tempErrs.assignTo = 'Assign to is required';
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
            state,
            city,
            pincode,
            leadSource,
            assignToEmp: assignTo,
            deal_value: dealValue,
            customer_grp: leadGrp,
            lead_potential: leadPotential,
            lead_stage: leadStage,
            currency,
            note,
        };

        // console.log(data)
        try {
            const res = await addLead(data);
            if (res.data.status) {
                toast.success(res.data.message);
                navigateTo('/lead_management_clients', { state: { tab: "Leads" } });
                setbtnLoading(false)
            } else {
                toast.error(res.data.message);
                setbtnLoading(false)
            }
        } catch (error) {
            toast.error(error.message);
        }
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
                <div className="beat_right"></div>
            </div>
            <div className="subadmin_container">
                <div className="subadmin_form">
                    <div className="right">
                        <div className="input_form">
                            <input
                                type="text"
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
                                value={mob}
                                onChange={(e) => {
                                    if (isNaN(e.target.value)) return;
                                    if (e.target.value.length > 10) return;
                                    setMob(e.target.value.trim());
                                    setValidField('mob');
                                }}
                                placeholder="Mobile Number"
                            />
                            {/* {errors.mob && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.mob}</p>} */}

                            <select
                                value={state}
                                onChange={(e) => {
                                    setValidField('state');
                                    setState(e.target.value);
                                    getCityFunc(e.target.value).then(res => setAllCity(res.data.result))
                                }}
                            >
                                <option value="">Select State</option>
                                {allState?.map((st, i) => (
                                    <option value={st.id} key={i}> {st.name} </option>
                                ))}
                            </select>
                            {errors.state && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.state}</p>}

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
                            {/* {errors.pincode && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.pincode}</p>} */}

                            <select
                                onChange={(e) => {
                                    setleadStage(e.target.value.trim());
                                    setValidField('leadStage');
                                }}
                            >
                                <option value="">Select Lead Stage</option>
                                <option value="Open">Open</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Qualified">Qualified</option>
                                <option value="Won">Won</option>
                                <option value="Loose">Loose</option>
                            </select>
                            {errors.leadStage && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.leadStage}</p>}

                            <input
                                type="text"
                                value={dealValue}
                                onChange={(e) => {
                                    if (isNaN(e.target.value)) return;
                                    if (e.target.value.length > 6) return;
                                    setdealValue(e.target.value.trim());
                                    setValidField('dealValue');
                                }}
                                placeholder="Deal (Value)"
                            />
                            {errors.dealValue && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.dealValue}</p>}

                            <select
                                onChange={(e) => {
                                    setleadPotential(e.target.value.trim());
                                    setValidField('leadPotential');
                                }}
                            >
                                <option value="">Select Lead Potential</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                            {errors.leadPotential && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.leadPotential}</p>}

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
                                value={email}
                                onChange={(e) => {
                                    setValidField('email');
                                    setEmail(e.target.value);
                                }}
                                placeholder="Email ID"
                            />
                            {errors.email && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.email}</p>}

                            <select
                                value={city}
                                onChange={(e) => {
                                    setValidField('city');
                                    setCity(e.target.value);
                                    fetchAllEmployee({ state, city: e.target.value }).then(res => setallEmployee(res.data.result))
                                }}
                            >
                                <option value="">Select City</option>
                                {allCity?.map((cty) => (
                                    <option key={cty.id} value={cty.id}>{cty.name}</option>
                                ))}
                            </select>
                            {errors.city && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.city}</p>}

                            <select
                                value={assignTo}
                                onChange={(e) => {
                                    setValidField('assignTo');
                                    setAssignTo(e.target.value);
                                }}
                            >
                                <option value="">Assign to Employee</option>
                                {allEmployee.length === 0 && <option disabled value="">No Employee Found</option>}
                                {allEmployee?.map((emp) => (
                                    <option key={emp.id} value={emp.id}>{emp.employeeName}</option>
                                ))}
                            </select>
                            {errors.assignTo && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.assignTo}</p>}

                            <select
                                value={leadGrp}
                                onChange={(e) => {
                                    setValidField('leadGrp');
                                    setleadGrp(e.target.value);
                                }}
                            >
                                <option value="">Select Lead Group</option>
                                {allLeadGroups.length === 0 && <option disabled value="">No Lead Found Found</option>}
                                {allLeadGroups?.map((grp) => (
                                    <option key={grp.id} value={grp.id}>{grp.lead_grp_name}</option>
                                ))}
                            </select>
                            {errors.leadGrp && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.leadGrp}</p>}

                            <select
                                value={currency}
                                onChange={(e) => {
                                    setcurrency(e.target.value);
                                    setValidField('currency');
                                }}
                            >
                                <option value="">Select Currency</option>
                                <option value="INR">INR</option>
                                <option value="USD">USD</option>
                                <option value="Pound">Pound</option>
                            </select>
                            {errors.currency && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.currency}</p>}

                            <select
                                name="leadSource"
                                value={leadSource}
                                onChange={(e) => {
                                    setLeadSource(e.target.value);
                                    setValidField('leadSource');
                                }}
                            >
                                <option value="">Select Lead Source</option>
                                <option value="Facebook">Facebook</option>
                                <option value="Instagram">Instagram</option>
                                <option value="IndiaMart">IndiaMart</option>
                                <option value="TradeIndia">Trade India</option>
                                <option value="Website">Website</option>
                                <option value="Manual">Manual</option>
                            </select>
                            {errors.leadSource && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.leadSource}</p>}

                        </div>
                    </div>
                </div>
                <div className="btn changepass_btn" onClick={(e) => !btnLoading && addLeadHandler()}>
                    {btnLoading ? <CircularProgress style={{ color: '#fff' }} size={26} /> : 'SAVE'}
                </div>
            </div>
        </div>
    );
};

export default AddLead;
