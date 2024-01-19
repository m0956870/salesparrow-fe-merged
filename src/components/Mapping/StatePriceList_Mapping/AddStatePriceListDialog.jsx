import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogTitle, DialogContent, CircularProgress } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';

import getStateFunc from "../../../api/locationAPI";
import { fetchPriceListing } from "../../../api/productAPI";
import { toast } from "react-toastify";
import { addStatePriceList } from "../../../api/mappingAPI";

const AddStatePriceListDialog = (props) => {
    const [btnLoading, setbtnLoading] = useState(false)

    const [allPriceList, setallPriceList] = useState([])
    const [allState, setallState] = useState([]);
    const [selectedStates, setselectedStates] = useState([])

    const [addData, setaddData] = useState({
        pricelist_id: "",
        state_id_arr: [],
    })

    useEffect(() => {
        setaddData({ state_id_arr: [], pricelist_id: "" })
        setselectedStates([])
    }, [props.open])

    useEffect(() => {
        getStateFunc().then((res) => setallState(res.data.result));
        fetchPriceListing().then((res) => setallPriceList(res.data.result));
    }, []);

    const stateHandleInput = async (e) => {
        let state = JSON.parse(e.target.value)
        const { name, id } = state

        if (!addData.state_id_arr.includes(id)) {
            addData.state_id_arr.push(id)
        }

        let included = selectedStates.some(dis => dis.id === id)
        if (!included) {
            setselectedStates((setselectedStates) => [
                ...setselectedStates, { id, name }
            ])
        }
    };

    const removeItemFunc = (sItem) => {
        const filtered = selectedStates.filter((item) => item !== sItem);
        setselectedStates(filtered);

        let state_id_arr = addData.state_id_arr.filter((item) => item != sItem.id);
        setaddData({ ...addData, state_id_arr });
    };

    const addStatePriceListFunc = async () => {
        // console.log(addData)

        setbtnLoading(true)
        let { data } = await addStatePriceList(addData)
        if (data.status) {
            toast.success("State PriceList Mapped Successfully!")
            props.close()
            setbtnLoading(false)
        } else {
            toast.error(data.message)
            console.log("API Error!")
            // props.close()
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
                <DialogTitle className="dialog_title">PriceList - State Mapping </DialogTitle>

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
                                                {item.name}
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

export default AddStatePriceListDialog;
