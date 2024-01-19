import "../Mapping.css"
import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogTitle, DialogContent, CircularProgress } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';

import { toast } from "react-toastify";
import { allPartyGroup } from "../../../api/partyAPI";
import { editPartyGrpPriceList } from "../../../api/mappingAPI";

const EditPartyGrpPriceListDialog = (props) => {
    // console.log("prop", props.data)

    const [btnLoading, setbtnLoading] = useState(false)

    const [allPriceList, setallPriceList] = useState([])
    const [partyGroupList, setpartyGroupList] = useState([]);
    const [selectedpartyGroup, setselectedpartyGroup] = useState([])

    const [editData, seteditData] = useState({
        pricelist_id: "",
        partygrp_id_arr: [],
    })

    useEffect(() => {
        allPartyGroup().then((res) => setpartyGroupList(res.data.result));
    }, []);

    useEffect(() => {
        let { partygrps, pricelist_id } = props.data
        let arr = []
        partygrps?.map(grp => arr.push(grp.id))
        seteditData({ pricelist_id, partygrp_id_arr: arr })
        setselectedpartyGroup(partygrps)
    }, [props.open])

    // console.log("selectedpartyGroup", selectedpartyGroup)

    const partyGrpHandleInput = async (e) => {
        let partyGrp = JSON.parse(e.target.value)
        const { grp_name, id } = partyGrp

        if (!editData.partygrp_id_arr.includes(id)) {
            editData.partygrp_id_arr.push(id)
        }

        let included = selectedpartyGroup.some(dis => dis.id === id)
        if (!included) {
            setselectedpartyGroup((setselectedpartyGroup) => [
                ...setselectedpartyGroup, { id, grp_name }
            ])
        }
    };

    const removeItemFunc = (sItem) => {
        const filtered = selectedpartyGroup.filter((item) => item !== sItem);
        setselectedpartyGroup(filtered);

        let partygrp_id_arr = editData.partygrp_id_arr.filter((item) => item != sItem.id);
        seteditData({ ...editData, partygrp_id_arr });
    };

    const editEmpPriceListFunc = async () => {
        console.log(editData)
        // if (editData.partygrp_id_arr.length === 0) return toast.error("Please Select States!")

        setbtnLoading(true)
        let { data } = await editPartyGrpPriceList(editData)
        if (data.status) {
            toast.success("Mapping Edited Successfully!")
            props.close()
            setbtnLoading(false)
        } else {
            toast.error(data.message)
            console.log("API Error!")
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
                <DialogTitle className="dialog_title">Edit PriceList - Party Group Mapping </DialogTitle>

                <DialogContent className="content">
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div className="message_left">
                            <div className="message_form">
                                <div className="select_div_name">Pricelist - {props?.data?.pricelist_name}</div>
                            </div>
                        </div>
                        <div className="message_right">
                            <div className="message_form">
                                <div className="dual_select">
                                    <select onChange={partyGrpHandleInput}>
                                        <option value="">Select Party Group</option>
                                        {partyGroupList?.map((partyGrp) => (
                                            <option key={partyGrp.id} value={JSON.stringify(partyGrp)}>{partyGrp.grp_name}</option>
                                        ))}
                                    </select>
                                </div>
                                {selectedpartyGroup?.length !== 0 &&
                                    <div className="seleced">
                                        {selectedpartyGroup?.map((item) => (
                                            <span className="seleced_item">
                                                {item.grp_name || item.partygrp_name}
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
                    </div>
                    <div onClick={() => editEmpPriceListFunc()} className="message_btn">
                        {btnLoading ? (
                            <CircularProgress style={{ color: "#fff" }} size={26} />
                        ) : (
                            "ADD"
                        )}
                    </div>
                </DialogContent>
                <DialogActions></DialogActions>
            </Dialog>
        </div >
    );
};

export default EditPartyGrpPriceListDialog;
