import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
} from "@mui/material";

const MappingEmployeeGroupListDialog = (props) => {
    // console.log(props.dialogData);

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
                    {props.dialogData === undefined ? "Employee Group & Product Group Mapping" : "Edit Employee Group & Product Group Mapping"}
                </DialogTitle>

                <DialogContent className="content">
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div className="message_left">
                            <div className="message_form">
                                <div className="dual_select">
                                    <select name="city">
                                        <option value="City">
                                            {props.dialogData === undefined ? "Select Employee Group" : `${props.dialogData.employee_group_name}`}
                                        </option>
                                        <option value="saab">Saab</option>
                                        <option value="mercedes">Mercedes</option>
                                        <option value="audi">Audi</option>
                                    </select>
                                </div>
                                <div className="dialog_link" style={{width:"95%", textDecoration:"underline", fontWeight:"500"}}>View</div>


                            </div>
                        </div>
                        <div className="message_right">
                            <div className="message_form">
                                <div className="dual_select">
                                    <select name="city">
                                        <option value="City">
                                            {props.dialogData === undefined ? "Select Product Group" : `Select Product Group`}
                                        </option>
                                        <option value="saab">Saab</option>
                                        <option value="mercedes">Mercedes</option>
                                        <option value="audi">Audi</option>
                                    </select>
                                </div>
                                <div className="dialog_link" style={{width:"95%", textDecoration:"underline", fontWeight:"500"}}>View</div>


                            </div>
                        </div>
                    </div>
                    <div className="message_btn">ASSIGN</div>
                </DialogContent>
                <DialogActions></DialogActions>
            </Dialog>
        </div>
    );
};

export default MappingEmployeeGroupListDialog;
