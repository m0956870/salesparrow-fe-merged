import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogTitle, DialogContent, CircularProgress, } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { blankValidator } from "../../utils/Validation";

const GenerateInvoiceModel = ({ open, close, rowData }) => {
    // console.log("rowData", rowData);
    const navigate = useNavigate()
    const [btnLoading, setbtnLoading] = useState(false);

    const [model, setmodel] = useState({
        order_id: rowData?.order_id,
        date: new Date().toISOString().substr(0, 10),
        invoice_no: undefined,
        vehicle_no: undefined,
        transporter_name: "",
        tax_type: "",
        ewaybill_no: "",
        total_nug: "",
    })

    const [error, setError] = useState({
        date: { status: false, },
        invoice_no: { status: false, },
        vehicle_no: { status: false, },
        transporter_name: { status: false, },
        tax_type: { status: false, },
        ewaybill_no: { status: false, },
        total_nug: { status: false, },
    });

    const handleInput = (e) => {
        Object.values(error).map(item => item.status = false)
        setmodel({ ...model, [e.target.name]: e.target.value });
    };


    const generateInvoiceFunc = async () => {
        if (!blankValidator(model.date)) return setError({ ...error, date: { status: true, } });
        if (!blankValidator(model.invoice_no)) return setError({ ...error, invoice_no: { status: true, } });
        // if (!blankValidator(model.vehicle_no)) return setError({ ...error, vehicle_no: { status: true, }, });
        // if (!blankValidator(model.transporter_name)) return setError({ ...error, transporter_name: { status: true, } });
        if (!blankValidator(model.tax_type)) return setError({ ...error, tax_type: { status: true, } });
        // if (!blankValidator(model.ewaybill_no)) return setError({ ...error, ewaybill_no: { status: true, } });
        // if (!blankValidator(model.total_nug)) return setError({ ...error, total_nug: { status: true, }, });

        // return console.log("model", model);
        navigate(`/invoice/${rowData.order_id}`, { state: model })
    };


    return (
        <div>
            <Dialog
                open={open}
                aria-labelledby="form-dialog-title"
                maxWidth="xs"
                fullWidth={true}
                onClose={close}
            >
                <DialogTitle className="dialog_title">
                    <div>Invoice Details</div>
                </DialogTitle>
                <DialogContent className="cardpopup_content">
                    <input
                        type="date"
                        name="date"
                        // onClick={(e) => (e.target.type = "date")}
                        // onBlur={(e) => (e.target.type = "text")}
                        value={model.date}
                        onChange={handleInput}
                    // placeholder={new Date().toLocaleDateString()}
                    />
                    {error.date.status && (
                        <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }} >
                            Please Enter Date
                        </p>
                    )}
                    <input
                        type="number"
                        name="invoice_no"
                        value={model.invoice_no}
                        onChange={handleInput}
                        placeholder="Invoice Number"
                    />
                    {error.invoice_no.status && (
                        <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }} >
                            Please Enter Invoice Number
                        </p>
                    )}
                    <input
                        type="text"
                        name="vehicle_no"
                        value={model.vehicle_no}
                        onChange={handleInput}
                        placeholder="GR/Vehicle Number"
                    />
                    {error.vehicle_no.status && (
                        <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }} >
                            Please Enter Vehicle Number
                        </p>
                    )}
                    <input
                        type="text"
                        name="transporter_name"
                        value={model.transporter_name}
                        onChange={handleInput}
                        placeholder="Transporter Name"
                    />
                    {error.transporter_name.status && (
                        <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }} >
                            Please Enter Transporter Name
                        </p>
                    )}
                    <select name="tax_type" onChange={handleInput}>
                        <option value="">Tax Type</option>
                        <option value="IGST">IGST</option>
                        <option value="LGST">LGST</option>
                    </select>
                    {error.tax_type.status && (
                        <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }} >
                            Please Select Tax Type
                        </p>
                    )}
                    <input
                        type="text"
                        name="ewaybill_no"
                        value={model.ewaybill_no}
                        onChange={handleInput}
                        placeholder="E-Waybill No."
                    />
                    {error.ewaybill_no.status && (
                        <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }} >
                            Please Enter E-Waybill No.
                        </p>
                    )}
                    <input
                        type="text"
                        name="total_nug"
                        value={model.total_nug}
                        onChange={handleInput}
                        placeholder="Total Cases"
                    />
                    {error.total_nug.status && (
                        <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }} >
                            Please Enter Total Cases
                        </p>
                    )}
                    <div className="cardpopup_btn" onClick={() => generateInvoiceFunc()}>
                        {btnLoading ? (
                            <CircularProgress style={{ color: "#fff" }} size={22} />
                        ) : (
                            "Proceed"
                        )}
                    </div>
                </DialogContent>
                <DialogActions></DialogActions>
            </Dialog>
        </div>
    );
};

export default GenerateInvoiceModel;
