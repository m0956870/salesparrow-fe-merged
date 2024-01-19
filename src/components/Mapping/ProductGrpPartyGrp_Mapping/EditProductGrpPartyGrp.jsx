import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogTitle, DialogContent, CircularProgress } from "@mui/material";
// import CancelIcon from '@mui/icons-material/Cancel';

import { allProductGroup } from "../../../api/productAPI";
import { allPartyGroup } from "../../../api/partyAPI";
import { toast } from "react-toastify";
import { editPartyGrpProductGrp } from "../../../api/mappingAPI";


const EditProductGrpPartyGrp = (props) => {
    // console.log("props", props.data)
    const [btnLoading, setbtnLoading] = useState(false)

    const [productGroupList, setproductGroupList] = useState([]);

    const [editData, seteditData] = useState({
        partygrp_id: "",
        productgrp_id: props?.data?.products?.[0]?.productgrp_id,
    })

    useEffect(() => {
        allProductGroup().then((res) => setproductGroupList(res.data.result));
    }, []);


    const handleInput = (e) => {
        seteditData({ ...editData, [e.target.name]: e.target.value });
    };

    const editEmpGrpProductGrpFunc = async () => {
        // return console.log(editData)

        setbtnLoading(true)
        let { data } = await editPartyGrpProductGrp({...editData, partygrp_id: props.data.party_grp_id})
        if (data.status) {
            toast.success("Edited Successfully!")
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
                <DialogTitle className="dialog_title">Edit Party Group - Product Group Mapping</DialogTitle>

                <DialogContent className="content">
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div className="message_left">
                            <div className="message_form">
                                <div className="dual_select">
                                    <div className="select_div_name">Party Group - {props?.data?.party_grp_data}</div>
                                </div>
                            </div>
                        </div>
                        <div className="message_right">
                            <div className="message_form">
                                <div className="dual_select">
                                    <select name="productgrp_id" onChange={handleInput}>
                                        <option value="">{props?.data?.products?.[0]?.productgrp_name || "Product Group"}</option>
                                        {productGroupList.length === 0 && <option disabled value="">No Product Group Found</option>}
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

export default EditProductGrpPartyGrp;
