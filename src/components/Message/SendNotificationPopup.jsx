import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogTitle, DialogContent, CircularProgress, } from "@mui/material";
import fetchAllEmployee from "../../api/employeeAPI";
import getStateFunc from "../../api/locationAPI";
import { IoIosArrowDown } from "react-icons/io"
import { sendNotification } from "../../api/messageAPI";
import { toast } from "react-toastify";
import { blankValidator } from "../../utils/Validation";

const SendNotificationPopup = (props) => {
    const [allState, setallState] = useState([]);
    const [allEmployee, setallEmployee] = useState([]);
    const [selectedEmpArr, setselectedEmpArr] = useState([])

    const [notification, setnotification] = useState({
        title: "",
        body: "",
    })
    const [titleError, settitleError] = useState("")
    const [bodyError, setbodyError] = useState("")

    useEffect(() => {
        getStateFunc().then((res) => setallState(res.data.result));
        fetchAllEmployee().then((res) => setallEmployee(res.data.result));
    }, [])

    useEffect(() => {
        if (!props.open) {
            setselectedEmpArr([]);
            setnotification({
                title: "",
                body: "",
            })
            settitleError("");
            setbodyError("");
        }
    }, [props])
    // console.log("selectedEmpArr", selectedEmpArr)

    const inputHandler = async (e) => {
        if (e.target.name === "title") settitleError("")
        if (e.target.name === "body") setbodyError("")
        setnotification({ ...notification, [e.target.name]: e.target.value });
    };

    const stateHandleInput = async (e) => {
        fetchAllEmployee({ state: e.target.value }).then((res) => setallEmployee(res.data.result));
    };

    const empSelectedHandler = (emp) => {
        if (!selectedEmpArr.includes(emp.id)) setselectedEmpArr([...selectedEmpArr, emp.id])
        else setselectedEmpArr(selectedEmpArr.filter(id => id !== emp.id))
    }

    const sendNotificationFunc = async () => {
        if (selectedEmpArr.length < 1) return toast.error("Please select employees!")
        if (!blankValidator(notification.title)) settitleError("title is required!")
        if (!blankValidator(notification.body)) return setbodyError("message is required!")

        let temp = { ...notification, employee_id: selectedEmpArr.join(",") }

        let { data } = await sendNotification(temp);
        if (data.status) {
            toast.success(data.message)
            props.close()
        } else {
            toast.error("Some Error!")
            props.close()
        }
    }

    let expanded = false;
    const empDivFunc = async (e) => {
        var checkboxes = document.getElementById("checkboxes");
        if (!expanded) {
            checkboxes.style.display = "none";
            expanded = true;
        } else {
            checkboxes.style.display = "block";
            expanded = false;
        }
    };


    return (
        <Dialog
            open={props.open}
            aria-labelledby="form-dialog-title"
            maxWidth="sm"
            fullWidth={true}
            onClose={props.close}
        >
            <DialogContent style={{ padding: 0 }} >
                <div className="content_create_msg_popup" >
                    <div className="msg_body_section">
                        <select className="select_input" onChange={stateHandleInput}>
                            <option value="">State</option>
                            {allState?.map((state) => (
                                <option key={state.id} value={state.id}>{state.name}</option>
                            ))}
                        </select>
                        <div style={{ position: "relative" }} >
                            <div onClick={() => empDivFunc()} >
                                <div className="select_input" >
                                    <div>Select Employee</div>
                                    <div><IoIosArrowDown /> </div>
                                </div>
                            </div>
                            <div id="checkboxes" className="option_custom_input">
                                <div className="custom_emp_listing">
                                    {allEmployee.length === 0 && <div>No Employee Found</div>}
                                    {allEmployee?.map((emp) => (
                                        <label >
                                            <input type="checkbox" onChange={() => empSelectedHandler(emp)} />
                                            <span onChange={() => empSelectedHandler(emp)}>{emp.employeeName}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="msg_body_title">Title</div>
                        <textarea
                            className="msg_body_txtarea_title"
                            name="title"
                            value={notification.title}
                            onChange={inputHandler}
                        />
                        {titleError.length > 0 && (
                            <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                                {titleError}
                            </p>
                        )}
                        <div className="msg_body_title">Type your message here</div>
                        <textarea
                            className="msg_body_txtarea_msg"
                            name="body"
                            value={notification.body}
                            onChange={inputHandler}
                        />
                        {bodyError.length > 0 && (
                            <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                                {bodyError}
                            </p>
                        )}
                    </div>
                    <div className="content_create_msg_btn" onClick={() => sendNotificationFunc()} >SEND</div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SendNotificationPopup