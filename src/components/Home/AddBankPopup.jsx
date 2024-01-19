// import "./AddBankPopup.css";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";

const AddBankPopup = (props) => {
  //   console.log(props.currCardData);
  const [bank, setbank] = useState({
    number: "",
    name: "",
    date: "",
  });

  const handleInput = (e) => {
    setbank({ ...bank, [e.target.name]: e.target.value });
  };

  const addBankFunc = () => {
    console.log(bank);
  };

  useEffect(() => {
    setbank({
      branch_name: "",
      bank_name: "",
      acc_number: "",
      ifsc: "",
    });
  }, [props]);

  return (
    <div>
      <Dialog
        open={props.open}
        aria-labelledby="form-dialog-title"
        maxWidth="xs"
        fullWidth="true"
        onClose={props.close}
      >
        <DialogTitle className="dialog_title">
          {props.currCardData === undefined ? (
            <div>Bank Details</div>
          ) : (
            <div>Edit Bank Details</div>
          )}
        </DialogTitle>
        <DialogContent className="cardpopup_content">
          <input
            type="text"
            name="branch_name"
            value={bank.branch_name}
            onChange={handleInput}
            placeholder="Branch Name"
          />
          <input
            type="text"
            name="bank_name"
            value={bank.bank_name}
            onChange={handleInput}
            placeholder="Bank Name"
          />
          <input
            type="text"
            name="acc_number"
            value={bank.acc_number}
            onChange={handleInput}
            placeholder="Account Number"
          />
          <input
            type="text"
            name="ifsc"
            value={bank.ifsc}
            onChange={handleInput}
            placeholder="IFSC Code"
          />
          <div className="cardpopup_btn" onClick={() => addBankFunc()}>
            SUBMIT
          </div>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
};

export default AddBankPopup;
