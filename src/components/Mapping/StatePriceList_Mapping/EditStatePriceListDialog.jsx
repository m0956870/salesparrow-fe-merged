import "../Mapping.css"
import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogTitle, DialogContent, CircularProgress } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';

import getStateFunc from "../../../api/locationAPI";
import { fetchPriceListing } from "../../../api/productAPI";
import { editStatePriceList } from "../../../api/mappingAPI";
import { toast } from "react-toastify";

const EditStatePriceListDialog = (props) => {
    // console.log("prop", props.data)

    const [btnLoading, setbtnLoading] = useState(false)

    const [allPriceList, setallPriceList] = useState([])
    const [allState, setallState] = useState([]);
    const [selectedStates, setselectedStates] = useState([])

    const [editData, seteditData] = useState({
        pricelist_id: "",
        state_id_arr: [],
    })

    useEffect(() => {
        getStateFunc().then((res) => setallState(res.data.result));
        fetchPriceListing().then((res) => setallPriceList(res.data.result));
    }, []);

    useEffect(() => {
        let { parties, pricelist_id } = props.data
        let arr = []
        parties?.map(state => arr.push(state.id))
        seteditData({ pricelist_id, state_id_arr: arr })
        setselectedStates(parties)
    }, [props.open])

    const stateHandleInput = async (e) => {
        let state = JSON.parse(e.target.value)
        const { name, id } = state

        if (!editData.state_id_arr.includes(id)) {
            editData.state_id_arr.push(id)
        }

        let included = selectedStates.some(dis => dis.id === id)
        if (!included) {
            setselectedStates((setselectedStates) => [
                ...setselectedStates, { id, state_name: name }
            ])
        }
    };

    const removeItemFunc = (sItem) => {
        const filtered = selectedStates.filter((item) => item !== sItem);
        setselectedStates(filtered);

        let state_id_arr = editData.state_id_arr.filter((item) => item != sItem.id);
        seteditData({ ...editData, state_id_arr });
    };

    const editEmpPriceListFunc = async () => {
        // if (editData.state_id_arr.length === 0) return toast.error("Please Select States!")

        setbtnLoading(true)
        let { data } = await editStatePriceList(editData)
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
                <DialogTitle className="dialog_title">Edit Party - PriceList Mapping </DialogTitle>

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
                                    <select onChange={stateHandleInput}>
                                        <option value="">Select States</option>
                                        {allState?.map((state) => (
                                            <option key={state.id} value={JSON.stringify(state)}>{state.name}</option>
                                        ))}
                                    </select>
                                </div>
                                {selectedStates?.length !== 0 &&
                                    <div className="seleced">
                                        {selectedStates?.map((item) => (
                                            <span className="seleced_item">
                                                {item.state_name}
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

export default EditStatePriceListDialog;
