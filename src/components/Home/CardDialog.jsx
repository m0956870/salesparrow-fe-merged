import "./CardDialog.css";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";

const CardDialog = (props) => {
  //   console.log(props.currCardData);
  const [card, setcard] = useState({
    number: "",
    name: "",
    date: "",
  });

  const handleInput = (e) => {
    setcard({ ...card, [e.target.name]: e.target.value });
  };

  const addCardFunc = () => {
    console.log(card);
  };

  useEffect(() => {
    setcard({
      number: "",
      name: "",
      date: "",
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
            <div>Add New Card</div>
          ) : (
            <div>Edit Card</div>
          )}
        </DialogTitle>
        <DialogContent className="cardpopup_content">
          <input
            type="text"
            name="number"
            value={card.number}
            onChange={handleInput}
            placeholder="Enter Card Number"
          />
          <input
            type="text"
            name="name"
            value={card.name}
            onChange={handleInput}
            placeholder="Card Holder's Name"
          />
          <input
            type="text"
            name="date"
            value={card.date}
            onChange={handleInput}
            placeholder="Expiry Date"
          />
          <div className="cardpopup_btn" onClick={() => addCardFunc()}>
            CONTINUE
          </div>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
};

export default CardDialog;
