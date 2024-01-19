import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';

import getStateFunc from "../../../api/locationAPI";
import fetchAllEmployee from "../../../api/employeeAPI";
import fetchAllBeat from "../../../api/beatAPI";
import { addEmployeeBeat } from "../../../api/mappingAPI";
import { toast } from "react-toastify";

const AddEmpBeatDialog = (props) => {

    const [allState, setallState] = useState([]);
    const [allEmployee, setallEmployee] = useState([]);
    const [allBeats, setallBeats] = useState([])
    const [selectedBeats, setselectedBeats] = useState([]);

    const [addData, setaddData] = useState({
        emp_id: "",
        beat_id_arr: [],
    })

    useEffect(() => {
        setaddData({ emp_id: "", beat_id_arr: [] })
        setselectedBeats([])
    }, [props.open])

    useEffect(() => {
        getStateFunc().then((res) => setallState(res.data.result));
        fetchAllEmployee().then((res) => setallEmployee(res.data.result));
        fetchAllBeat().then(res => setallBeats(res.data.result));
    }, []);

    // console.log("addData", addData)

    const handleInput = (e) => {
        setaddData({ ...addData, [e.target.name]: e.target.value });
    };

    const stateHandleInput = async (e) => {
        fetchAllEmployee({ state: e.target.value }).then((res) => {
            setallEmployee(res.data.result);
        });
    };

    const beatHandleInput = (e) => {
        let beat = JSON.parse(e.target.value)
        const { beatName, id } = beat

        if (!addData.beat_id_arr.includes(id)) {
            addData.beat_id_arr.push(id)
        }

        let included = selectedBeats.some(beat => beat.id === id)
        if (!included) {
            setselectedBeats((selectedBeats) => [
                ...selectedBeats, { id, beatName }
            ])
        }
    }

    const removeItemFunc = (sItem) => {
        const filtered = selectedBeats.filter((item) => item !== sItem);
        setselectedBeats(filtered);

        let beat_id_arr = addData.beat_id_arr.filter((item) => item != sItem.id);
        setaddData({ ...addData, beat_id_arr });
    };

    const addEmpBeatFunc = async () => {

        let { data } = await addEmployeeBeat(addData)
        if (data.status) {
            toast.success("Employee Beat Mapped Successfully!")
            return props.close()
        } else {
            toast.error("Some Error!")
            console.log("API Error!")
            return props.close()
        }
    }


    return (
        <div>
            <Dialog
                open={props.open}
                aria-labelledby="form-dialog-title"
                maxWidth="md"
                fullWidth={true}
                onClose={props.close}
            >
                <DialogTitle className="dialog_title"> Distributor - Beat Mapping </DialogTitle>

                <DialogContent className="content">
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div className="message_left">
                            <div className="message_form">
                                <div className="dual_select">
                                    <select onChange={stateHandleInput}>
                                        <option value="">All States</option>
                                        {allState?.map((state) => (
                                            <option key={state.id} value={state.id}>{state.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <select onChange={beatHandleInput}>
                                    <option value="">All Beats</option>
                                    {allBeats.length === 0 && <option disabled value="">No Beats Found</option>}
                                    {allBeats?.map((beat) => (
                                        <option value={JSON.stringify(beat)}>{beat.beatName}</option>
                                    ))}
                                </select>
                                {selectedBeats?.length !== 0 &&
                                    <div className="seleced">
                                        {selectedBeats?.map((item) => (
                                            <span className="seleced_item">
                                                {item.beatName}
                                                <CancelIcon
                                                    onClick={() => removeItemFunc(item)}
                                                    style={{ color: "var(--main-color)", marginLeft: "0.3rem", }}
                                                />
                                            </span>
                                        ))}
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="message_right">
                            <div className="message_form">
                                <div className="dual_select">
                                    <select name="emp_id" onChange={handleInput}  >
                                        <option value="">All Employees</option>
                                        {allEmployee.length === 0 && <option disabled value="">No Employee Found</option>}
                                        {allEmployee?.map((employee) => (
                                            <option value={employee?.id} >
                                                {employee?.employeeName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div onClick={() => addEmpBeatFunc()} className="message_btn">SAVE</div>
                </DialogContent>
                <DialogActions></DialogActions>
            </Dialog>
        </div>
    );
};

export default AddEmpBeatDialog;
