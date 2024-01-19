import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogTitle, DialogContent, CircularProgress } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';

import { allEmployeeGroup } from "../../../api/employeeAPI";
import { addEmpGrpProductGrp, editEmpGrpProductGrp } from "../../../api/mappingAPI";
import { allProductGroup } from "../../../api/productAPI";
import { toast } from "react-toastify";

const EditEmpGrpProductGrp = (props) => {
    // console.log("props", props.data)

    const [btnLoading, setbtnLoading] = useState(false)
    const [empGroupList, setempGroupList] = useState([]);
    const [productGroupList, setproductGroupList] = useState([]);

    const [editData, seteditData] = useState({
        emp_grp_id: "",
        productgrp_id: "",
    })

    useEffect(() => {
        seteditData({ emp_grp_id: "", productgrp_id: "" })
    }, [props.open])

    useEffect(() => {
        allEmployeeGroup().then((res) => setempGroupList(res.data.result));
        allProductGroup().then((res) => setproductGroupList(res.data.result));
    }, []);

    // console.log("empGroupList", empGroupList)
    // console.log("productGroupList", productGroupList)

    const handleInput = (e) => {
        seteditData({ ...editData, [e.target.name]: e.target.value });
    };

    const editEmpGrpProductGrpFunc = async () => {
        setbtnLoading(true)
        let { data } = await editEmpGrpProductGrp({ ...editData, emp_grp_id: props.data.emp_grp_id })
        if (data.status) {
            toast.success("Employee Group Product Group Edited Successfully!")
            props.close()
            setbtnLoading(false)
        } else {
            toast.error("Some Error!")
            props.close()
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
                <DialogTitle className="dialog_title">Edit Employee Group - Product Group Mapping</DialogTitle>

                <DialogContent className="content">
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div className="message_left">
                            <div className="message_form">
                                <div className="dual_select">
                                    <select name="emp_grp_id" onChange={handleInput}>
                                        <option value="">{props.data.emp_grp_name || "Employee Group"}</option>
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
                                        <option value="">{props.data.products?.[0]?.productgrp_name || "Product Group"}</option>
                                        {productGroupList?.map((grp) => (
                                            <option key={grp.id} value={grp.id}>{grp.grp_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div onClick={() => editEmpGrpProductGrpFunc()} className="message_btn">
                        {btnLoading ? (
                            <CircularProgress style={{ color: "#fff" }} size={26} />
                        ) : (
                            "ADD"
                        )}
                    </div>
                </DialogContent>
                <DialogActions></DialogActions>
            </Dialog>
        </div>
    );
};

export default EditEmpGrpProductGrp;
