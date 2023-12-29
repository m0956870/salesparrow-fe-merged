import "./Settings.css"
import React, { useState, useEffect, useContext } from "react";
import group from "../../images/group.png";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { AdminContext } from "../../App";
import { updateProfile } from "../../api/auth";

const FeaturedSelection = () => {
    const navigate = useNavigate();
    const [btnLoading, setbtnLoading] = useState(false);
    const { state, dispatch } = useContext(AdminContext);
    // console.log("state", state.result)
    let { attendance_feature, approval_feature, expense_feature, location_tracking_feature } = state?.result;

    const [selection, setselection] = useState({
        attendance_feature: {
            selfie: attendance_feature.selfie,
            distributor_name: attendance_feature.distributor_name,
            beat_name: attendance_feature.beat_name,
            punch_location: attendance_feature.punch_location,
            activity: attendance_feature.activity,
            sales_report_compulsory: attendance_feature.sales_report_compulsory,
            expense_report_compulsory: attendance_feature.expense_report_compulsory,
        },
        approval_feature: {
            beat_plan_approval: approval_feature.beat_plan_approval,
            expense_report_approval: approval_feature.expense_report_approval,
            employee_target_approval: approval_feature.employee_target_approval,
        },
        expense_feature: expense_feature,
        location_tracking_feature: {
            attendance_type: location_tracking_feature.attendance_type,
            start_time: location_tracking_feature.start_time,
            end_time: location_tracking_feature.end_time,
        },
    });

    const handleInput = (e, type, subtype) => {
        if (type === "attendance_feature" || type === "approval_feature") {
            selection[type][e.target.name] = e.target.checked;
        } else if (type === "expense_feature") {
            selection[e.target.name] = subtype;
        } else if (type === "location_tracking") {
            selection[e.target.name]["attendance_type"] = subtype;
        } else if (type === "location_tracking_feature") {
            selection[type][e.target.name] = e.target.value;
        }
        setselection({ ...selection })
    };

    const saveSelectionFunc = async () => {
        let { start_time, end_time } = selection.location_tracking_feature;
        if (Number(start_time.split(":").join("")) > Number(end_time.split(":").join(""))) return toast.error("Start time should be lower than end time!")

        setbtnLoading(true);
        let res = await updateProfile(selection);
        if (res.data.status) {
            let { attendance_feature, approval_feature, expense_feature, location_tracking_feature } = res.data.details;
            toast.success("Selection saved successfully!");
            dispatch({ type: "ADMIN", payload: { ...state, result: { ...state.result, attendance_feature, approval_feature, expense_feature, location_tracking_feature } }, });
        } else {
            toast.error(res.data.message);
        }
        setbtnLoading(false);
    };


    return (
        <div className="container">
            <div className="beat_heading">
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">Featured Selection</div>
                </div>
            </div>

            <div className="addbeat_container">
                <div className="selection_form">
                    <div className="selection_left">
                        <h3 style={{ color: "#fe7658" }} >Attendance</h3>
                        <div className="selection_container">
                            <label>
                                <span>Selfie</span>
                                <input
                                    type="checkbox"
                                    name="selfie"
                                    checked={selection.attendance_feature.selfie}
                                    onChange={e => handleInput(e, "attendance_feature")}
                                />
                            </label>
                            <label>
                                <span>Distributor Name</span>
                                <input
                                    type="checkbox"
                                    name="distributor_name"
                                    checked={selection.attendance_feature.distributor_name}
                                    onChange={e => handleInput(e, "attendance_feature")}
                                />
                            </label>
                            <label>
                                <span>Beat Name</span>
                                <input
                                    type="checkbox"
                                    name="beat_name"
                                    checked={selection.attendance_feature.beat_name}
                                    onChange={e => handleInput(e, "attendance_feature")}
                                />
                            </label>
                            <label>
                                <span>Punch Location</span>
                                <input
                                    type="checkbox"
                                    name="punch_location"
                                    checked={selection.attendance_feature.punch_location}
                                    onChange={e => handleInput(e, "attendance_feature")}
                                />
                            </label>
                            <label>
                                <span>Select Actitvity</span>
                                <input
                                    type="checkbox"
                                    name="activity"
                                    checked={selection.attendance_feature.activity}
                                    onChange={e => handleInput(e, "attendance_feature")}
                                />
                            </label>
                            <label>
                                <span>Report Compulsory Last Date</span>
                            </label>
                            <div className="compulsory_selection_left" >
                                <label>
                                    <span>Sales</span>
                                    <input
                                        type="checkbox"
                                        name="sales_report_compulsory"
                                        checked={selection.attendance_feature.sales_report_compulsory}
                                        onChange={e => handleInput(e, "attendance_feature")}
                                    />
                                </label>
                                <label>
                                    <span>Expense</span>
                                    <input
                                        type="checkbox"
                                        name="expense_report_compulsory"
                                        checked={selection.attendance_feature.expense_report_compulsory}
                                        onChange={e => handleInput(e, "attendance_feature")}
                                    />
                                </label>
                            </div>
                        </div>
                        <h3 style={{ color: "#7f66ff" }} >Other Approval Features</h3>
                        <div className="selection_container">
                            <label>
                                <span>Beat Plan Approval</span>
                                <input
                                    type="checkbox"
                                    name="beat_plan_approval"
                                    checked={selection.approval_feature.beat_plan_approval}
                                    onChange={e => handleInput(e, "approval_feature")}
                                />
                            </label>
                            <label>
                                <span>Expense Report Approval</span>
                                <input
                                    type="checkbox"
                                    name="expense_report_approval"
                                    checked={selection.approval_feature.expense_report_approval}
                                    onChange={e => handleInput(e, "approval_feature")}
                                />
                            </label>
                            <label>
                                <span>Employee Target Approval</span>
                                <input
                                    type="checkbox"
                                    name="employee_target_approval"
                                    checked={selection.approval_feature.employee_target_approval}
                                    onChange={e => handleInput(e, "approval_feature")}
                                />
                            </label>
                        </div>
                    </div>
                    <div className="selection_right">
                        <h3 style={{ color: "#79eca8" }} >Expense Report</h3>
                        <div className="selection_container">
                            <label>
                                <span>From/ to (Location)</span>
                                <input
                                    type="radio"
                                    name="expense_feature"
                                    checked={selection.expense_feature === "location"}
                                    onChange={e => handleInput(e, "expense_feature", "location")}
                                />
                            </label>
                            <label>
                                <span>From/ to (City) </span>
                                <input
                                    type="radio"
                                    name="expense_feature"
                                    checked={selection.expense_feature !== "location"}
                                    onChange={e => handleInput(e, "expense_feature", "city")}
                                />
                            </label>
                        </div>
                        <h3 style={{ color: "#fe7658" }} >Location Tracking </h3>
                        <div className="selection_container">
                            <label>
                                <span>Attendance Based</span>
                                <input
                                    type="radio"
                                    name="location_tracking_feature"
                                    checked={selection.location_tracking_feature.attendance_type === "attendance"}
                                    onChange={(e) => handleInput(e, "location_tracking", "attendance")}
                                />
                            </label>
                            <label>
                                <span>Fixed Time</span>
                                <input
                                    type="radio"
                                    name="location_tracking_feature"
                                    checked={selection.location_tracking_feature.attendance_type === "fixed"}
                                    onChange={(e) => handleInput(e, "location_tracking", "fixed")}
                                />
                            </label>
                            {selection.location_tracking_feature.attendance_type === "fixed" && (
                                <div className="fixed_attendance_container" >
                                    <input
                                        type="time"
                                        className="start_time_input"
                                        name="start_time"
                                        value={selection.location_tracking_feature.start_time}
                                        onChange={(e) => handleInput(e, "location_tracking_feature", "time")}
                                    />
                                    <input
                                        type="time"
                                        className="end_time_input"
                                        name="end_time"
                                        value={selection.location_tracking_feature.end_time}
                                        onChange={(e) => handleInput(e, "location_tracking_feature", "time")}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div onClick={() => saveSelectionFunc()} className="btn changepass_btn">
                    {btnLoading ? (
                        <CircularProgress style={{ color: "#fff" }} size={26} />
                    ) : (
                        "SAVE"
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeaturedSelection;
