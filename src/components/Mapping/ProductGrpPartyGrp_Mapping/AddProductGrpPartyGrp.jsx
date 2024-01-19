import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogTitle, DialogContent, CircularProgress } from "@mui/material";
// import CancelIcon from '@mui/icons-material/Cancel';
import { toast } from "react-toastify";

import { allProductGroup } from "../../../api/productAPI";
import { allPartyGroup } from "../../../api/partyAPI";
import { addPartyGrpProductGrp } from "../../../api/mappingAPI";

const AddProductGrpPartyGrp = (props) => {
    const [btnLoading, setbtnLoading] = useState(false)

    const [productGroupList, setproductGroupList] = useState([]);
    const [partyGroupList, setpartyGroupList] = useState([]);

    const [addData, setaddData] = useState({
        partygrp_id: "",
        productgrp_id: "",
    })

    useEffect(() => {
        setaddData({ partygrp_id: "", productgrp_id: "" })
    }, [props.open])

    useEffect(() => {
        allProductGroup().then((res) => setproductGroupList(res.data.result));
        allPartyGroup().then((res) => setpartyGroupList(res.data.result));
    }, []);

    // console.log("productGroupList", productGroupList)
    // console.log("partyGroupList", partyGroupList)

    const handleInput = (e) => {
        setaddData({ ...addData, [e.target.name]: e.target.value });
    };

    const addPartyGrpProductGrpFunc = async () => {
        setbtnLoading(true)
        let { data } = await addPartyGrpProductGrp(addData)
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
                <DialogTitle className="dialog_title">Party Group - Product Group Mapping </DialogTitle>

                <DialogContent className="content">
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div className="message_left">
                            <div className="message_form">
                                <div className="dual_select">
                                    <select name="partygrp_id" onChange={handleInput}>
                                        <option value="">Party Group</option>
                                        {partyGroupList.length === 0 && <option disabled value="">No Party Group Found</option>}
                                        {partyGroupList?.map((grp) => (
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
                                        {productGroupList.length === 0 && <option disabled value="">No Product Group Found</option>}
                                        {productGroupList?.map((grp) => (
                                            <option key={grp.id} value={grp.id}>{grp.grp_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div onClick={() => addPartyGrpProductGrpFunc()} className="message_btn">
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

export default AddProductGrpPartyGrp;
