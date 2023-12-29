import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogTitle, DialogContent, CircularProgress } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';

import { fetchPriceListing } from "../../../api/productAPI";
import { toast } from "react-toastify";
import { addPartyGrpPriceList, addStatePriceList } from "../../../api/mappingAPI";
import { allPartyGroup } from "../../../api/partyAPI";

const AddPartyGrpPriceListDialog = (props) => {
    const [btnLoading, setbtnLoading] = useState(false)

    const [allPriceList, setallPriceList] = useState([])
    const [partyGroupList, setpartyGroupList] = useState([]);
    const [selectedpartyGroup, setselectedpartyGroup] = useState([])

    const [addData, setaddData] = useState({
        pricelist_id: "",
        partygrp_id_arr: [],
    })

    useEffect(() => {
        setaddData({ partygrp_id_arr: [], pricelist_id: "" })
        setselectedpartyGroup([])
    }, [props.open])

    useEffect(() => {
        fetchPriceListing().then((res) => setallPriceList(res.data.result));
        allPartyGroup().then((res) => setpartyGroupList(res.data.result));
    }, []);

    // console.log("partyGroupList", partyGroupList)

    const partyGrpHandleInput = async (e) => {
        let partyGrp = JSON.parse(e.target.value)
        const { grp_name, id } = partyGrp

        if (!addData.partygrp_id_arr.includes(id)) {
            addData.partygrp_id_arr.push(id)
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

        let partygrp_id_arr = addData.partygrp_id_arr.filter((item) => item != sItem.id);
        setaddData({ ...addData, partygrp_id_arr });
    };

    const addStatePriceListFunc = async () => {
        console.log(addData)

        if (addData.pricelist_id === "") return toast.error("Please Select Pricelist!")
        if (selectedpartyGroup.length === 0) return toast.error("Please Select Party Groups!")

        setbtnLoading(true)
        let { data } = await addPartyGrpPriceList(addData)
        if (data.status) {
            toast.success("PriceList Party Group Mapped Successfully!")
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
                <DialogTitle className="dialog_title">PriceList - Party Group Mapping </DialogTitle>

                <DialogContent className="content">
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div className="message_left">
                            <div className="message_form">
                                <select name="pricelist_id" onChange={(e) => setaddData({ ...addData, [e.target.name]: e.target.value })} >
                                    <option value="">Price List</option>
                                    {allPriceList.length === 0 && <option disabled value="">No Price List Found</option>}
                                    {allPriceList?.map((priceList) => (
                                        <option key={priceList._id} value={priceList._id}>{priceList.price_list_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="message_right">
                            <div className="message_form">
                                <div className="dual_select">
                                    <select onChange={partyGrpHandleInput}>
                                        <option value="">Select Party Groups</option>
                                        {partyGroupList?.map((partyGrp) => (
                                            <option key={partyGrp.id} value={JSON.stringify(partyGrp)}>{partyGrp.grp_name}</option>
                                        ))}
                                    </select>
                                </div>
                                {selectedpartyGroup?.length !== 0 &&
                                    <div className="seleced">
                                        {selectedpartyGroup?.map((item) => (
                                            <span className="seleced_item">
                                                {item.grp_name}
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
                    <div onClick={() => addStatePriceListFunc()} className="message_btn">
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

export default AddPartyGrpPriceListDialog;
