import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogTitle, DialogContent, CircularProgress, } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { blankValidator } from "../../utils/Validation";
import { markAsDelivered } from "../../api/reportsAPI";
import { toast } from "react-toastify";

const MarkAsDeliveredModel = ({ open, close, rowData }) => {
    // console.log("rowData", rowData);
    const navigate = useNavigate()
    const [btnLoading, setbtnLoading] = useState(false);

    const [model, setmodel] = useState({
        order_id: rowData?.order_id,
        invoice_date: new Date().toISOString().substr(0, 10),
        supply_by_id: rowData?.feed_by_id,
        invoice_no: undefined,
        partyType: rowData?.party_type_id,
        invoice_amount: undefined,

        // vehicle_no: undefined,
        // transporter_name: "",
        // tax_type: "",
        // ewaybill_no: "",
        // total_nug: "",
    })

    const [error, setError] = useState({
        invoice_date: { status: false, },
        invoice_no: { status: false, },
        invoice_amount: { status: false, },
        bigger_invoice_amount: { status: false, },
        // vehicle_no: { status: false, },
        // transporter_name: { status: false, },
        // tax_type: { status: false, },
        // ewaybill_no: { status: false, },
        // total_nug: { status: false, },
    });

    const handleInput = (e) => {
        Object.values(error).map(item => item.status = false)
        setmodel({ ...model, [e.target.name]: e.target.value });
    };


    const generateInvoiceFunc = async () => {
        if (!blankValidator(model.invoice_date)) return setError({ ...error, invoice_date: { status: true, } });
        if (!blankValidator(model.invoice_no)) return setError({ ...error, invoice_no: { status: true, } });
        if (!blankValidator(model.invoice_amount)) return setError({ ...error, invoice_amount: { status: true, } });
        if (model.invoice_amount > rowData?.total_amount) return setError({ ...error, bigger_invoice_amount: { status: true, } });
        // if (!blankValidator(model.vehicle_no)) return setError({ ...error, vehicle_no: { status: true, }, });
        // if (!blankValidator(model.transporter_name)) return setError({ ...error, transporter_name: { status: true, } });
        // if (!blankValidator(model.tax_type)) return setError({ ...error, tax_type: { status: true, } });
        // if (!blankValidator(model.ewaybill_no)) return setError({ ...error, ewaybill_no: { status: true, } });
        // if (!blankValidator(model.total_nug)) return setError({ ...error, total_nug: { status: true, }, });


        let dataObj = {
            order_id: rowData?.order_id,
            invoice_date: model.invoice_date,
            supply_by_id: rowData?.feed_by_id,
            invoice_no: model.invoice_no,
            partyType: rowData?.party_type_id,
            party_id: rowData?.party_id,
            invoice_amount: model.invoice_amount,
        }
        let res = await markAsDelivered(dataObj);
        console.log(res);
        if (res.data.status) {
            toast.success("Mark As Delivered Successfully!");
            return close()
        }
        console.log("Error");

        // navigate(`/invoice/${rowData.order_id}`, { state: model })
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
                        name="invoice_date"
                        // onClick={(e) => (e.target.type = "date")}
                        // onBlur={(e) => (e.target.type = "text")}
                        value={model.invoice_date}
                        onChange={handleInput}
                    // placeholder={new Date().toLocaleDateString()}
                    />
                    {error.invoice_date.status && (
                        <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }} >
                            Please Enter Date
                        </p>
                    )}
                    <input
                        type="text"
                        name="invoice_no"
                        value={model.invoice_no}
                        onChange={(e) => {
                            if (isNaN(e.target.value.trim())) return;
                            handleInput(e)
                        }}
                        placeholder="Invoice Number"
                    />
                    {error.invoice_no.status && (
                        <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }} >
                            Please Enter Invoice Number
                        </p>
                    )}
                    <input
                        type="text"
                        name="invoice_amount"
                        value={model.invoice_amount}
                        onChange={(e) => {
                            if (isNaN(e.target.value.trim())) return;
                            handleInput(e)
                        }}
                        placeholder="Invoice Amount"
                    />
                    {error.invoice_amount.status && (
                        <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }} >
                            Please Enter Invoice Amount
                        </p>
                    )}
                    {error.bigger_invoice_amount.status && (
                        <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }} >
                            Invoice amount Should be lower then total amount!
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

export default MarkAsDeliveredModel;
