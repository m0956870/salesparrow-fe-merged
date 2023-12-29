import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogTitle, DialogContent, CircularProgress } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';

import { allEmployeeGroup } from "../../../api/employeeAPI";
import { addEmpGrpProductGrp } from "../../../api/mappingAPI";
import { allProductGroup } from "../../../api/productAPI";
import { toast } from "react-toastify";

const AddEmpGrpProductGrp = (props) => {
    const [btnLoading, setbtnLoading] = useState(false)

    const [empGroupList, setempGroupList] = useState([]);
    const [productGroupList, setproductGroupList] = useState([]);

    const [addData, setaddData] = useState({
        empgrp_id: "",
        productgrp_id: "",
    })

    useEffect(() => {
        setaddData({ empgrp_id: "", productgrp_id: "" })
    }, [props.open])

    useEffect(() => {
        allEmployeeGroup().then((res) => setempGroupList(res.data.result));
        allProductGroup().then((res) => setproductGroupList(res.data.result));
    }, []);

    // console.log("empGroupList", empGroupList)
    // console.log("productGroupList", productGroupList)

    const handleInput = (e) => {
        setaddData({ ...addData, [e.target.name]: e.target.value });
    };

    const addEmpGrpProductGrpFunc = async () => {
        setbtnLoading(true)
        let { data } = await addEmpGrpProductGrp(addData)
        if (data.status) {
            toast.success("Employee Group Product Group Mapped Successfully!")
            props.close()
            setbtnLoading(false)
        } else {
            toast.error("Some Error!")
            setbtnLoading(false)
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
                <DialogTitle className="dialog_title">Employee Group - Product Group Mapping </DialogTitle>

                <DialogContent className="content">
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div className="message_left">
                            <div className="message_form">
                                <div className="dual_select">
                                    <select name="empgrp_id" onChange={handleInput}>
                                        <option value="">Employee Group</option>
                                        {empGroupList?.map((grp) => (
                                            <option key={grp.id} value={grp.id}>{grp.grp_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="message_right">
                            <div className="message_form">
                                <div className="dual_select">
                                    <select name="productgrp_id" onChange={handleInput}>
                                        <option value="">Product Group</option>
                                        {productGroupList?.map((grp) => (
                                            <option key={grp.id} value={grp.id}>{grp.grp_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div onClick={() => addEmpGrpProductGrpFunc()} className="message_btn">
                        {btnLoading ? (
                            <CircularProgress style={{ color: "#fff" }} size={26} />
                        ) : (
                            "SAVE"
                        )}
                    </div>
                </DialogContent>
                <DialogActions></DialogActions>
            </Dialog>
        </div>
    );
};

export default AddEmpGrpProductGrp;
