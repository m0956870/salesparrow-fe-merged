import "../Product.css";
import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    CircularProgress,
} from "@mui/material";

import { toast } from "react-toastify";
import { blankValidator } from "../../../utils/Validation";
import { editUnit } from "../../../api/productAPI";
import isAllowed from "../../../utils/isAllowed";
import { PRODUCT_MANAGEMENT } from "../../../constants";

const EditUnitDialog = (props) => {
    // console.log(props)
    const [btnLoading, setbtnLoading] = useState(false);

    const [unit, setunit] = useState({
        unit: "",
        status: "",
    });

    const [error, setError] = useState({
        unit: {
            status: false,
        },
    });

    const handleInput = (e) => {
        Object.values(error).map(item => item.status = false)
        setunit({ ...unit, [e.target.name]: e.target.value });
    };

    const editUnitFunc = async () => {
        setbtnLoading(true);
        if (!await isAllowed(PRODUCT_MANAGEMENT)) {
            toast.error("Module is not purchased!");
            return setbtnLoading(false);
        }

        if (!blankValidator(unit.unit)) {
            return setError({
                ...error,
                unit: {
                    status: true,
                },
            });
        }

        console.log(unit);

        try {
            let res = await editUnit(unit);
            console.log(res);
            if (res.data.status) {
                props.close()
                toast.success("Unit Edited Successfully!");
                setbtnLoading(false);
                setunit({
                    name: "",
                    status: "",
                })
            } else {
                toast.error(res.data.message);
                setbtnLoading(false);
            }
        } catch (error) {
            console.log(error);
            toast.error("Internet Error!")
            setbtnLoading(false);
        }
    };

    useEffect(() => {
        setunit({
            id: props.currCardData._id,
            unit: props.currCardData.unit,
            status: props.currCardData.status,
        })
    }, [props.open])


    return (
        <div>
            <Dialog
                open={props.open}
                aria-labelledby="form-dialog-title"
                maxWidth="xs"
                fullWidth={true}
                onClose={props.close}
            >
                <DialogTitle className="dialog_title">
                    <div>Edit Unit</div>
                </DialogTitle>
                <DialogContent className="cardpopup_content">
                    <input
                        type="text"
                        name="unit"
                        value={unit.unit}
                        onChange={handleInput}
                        placeholder="Unit Name"
                    />
                    {error.unit.status && (
                        <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }} >
                            Please Enter Unit Name
                        </p>
                    )}

                    <select name="status" onChange={handleInput}>
                        <option value="">{unit.status}</option>
                        <option value="Active">Active</option>
                        <option value="InActive">InActive</option>
                    </select>
                    <div className="cardpopup_btn" onClick={() => editUnitFunc()}>
                        {btnLoading ? (
                            <CircularProgress style={{ color: "#fff" }} size={22} />
                        ) : (
                            "EDIT"
                        )}
                    </div>
                </DialogContent>
                <DialogActions></DialogActions>
            </Dialog>
        </div>
    );
};

export default EditUnitDialog;
