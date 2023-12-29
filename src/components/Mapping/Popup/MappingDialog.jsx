import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
} from "@mui/material";

import CancelIcon from '@mui/icons-material/Cancel';

const MappingDialog = (props) => {
    // console.log(props.dialogData);
    const [selectedVal, setselectedVal] = useState([])

    const selectedValFunc = (e) => {
        if (selectedVal.includes(e.target.value)) {
            return;
        }
        setselectedVal((prev) => [...prev, e.target.value])
    }

    const removeItemFunc = (sItem) => {
        const filtered = selectedVal.filter(item => item !== sItem)
        setselectedVal(filtered)
    }

    useEffect(() => {
        setselectedVal([])
        if (props.dialogData) {
            let beat = props.dialogData.beat.split(",")
            // console.log(beat);
            setselectedVal(beat)
        }
    }, [props])


    return (
        <div>
            <Dialog
                open={props.open}
                aria-labelledby="form-dialog-title"
                maxWidth="md"
                fullWidth={true}
                onClose={props.close}
            >
                <DialogTitle className="dialog_title">
                    {props.dialogData === undefined ? "Distributor - Beat Mapping" : "Edit Distributor - Beat Mapping"}
                </DialogTitle>

                <DialogContent className="content">
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div className="message_left">
                            <div className="message_form">
                                <div className="dual_select">
                                    <select name="city">
                                        <option value="City">
                                            {props.dialogData === undefined ? "Select Employee " : `${props.dialogData.employee}`}
                                        </option>
                                        <option value="saab">Saab</option>
                                        <option value="mercedes">Mercedes</option>
                                        <option value="audi">Audi</option>
                                    </select>
                                </div>


                                <div className="dual_select">
                                    <select name="city" onChange={selectedValFunc}>
                                        <option value="City">
                                            {props.dialogData === undefined ? "Select Beat" : "Select Beat" }
                                        </option>
                                        <option value="saab">Saab</option>
                                        <option value="mercedes">Mercedes</option>
                                        <option value="audi">Audi</option>
                                    </select>

                                </div>
                                <div className="seleced">
                                    {selectedVal && selectedVal.map((item) => (
                                        <span className="seleced_item" >{item} <CancelIcon onClick={() => removeItemFunc(item)} style={{ color: "var(--main-color)", marginLeft: "0.3rem" }} /></span>
                                    ))}
                                </div>

                            </div>
                        </div>
                        <div className="message_right">
                            <div className="message_form">
                                <div className="dual_select">
                                    <select name="city">
                                        <option value="City">
                                            {props.dialogData === undefined ? "Select Distributor" : `${props.dialogData.distributor}`}
                                        </option>
                                        <option value="saab">Saab</option>
                                        <option value="mercedes">Mercedes</option>
                                        <option value="audi">Audi</option>
                                    </select>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="message_btn">SAVE</div>
                </DialogContent>
                <DialogActions></DialogActions>
            </Dialog>
        </div>
    );
};

export default MappingDialog;
