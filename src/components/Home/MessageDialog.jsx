import "./MessageDialog.css";
import React from "react";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import {HiOutlineLink} from "react-icons/hi"

const MessageDialog = (props) => {
  return (
    <div>
      <Dialog
        open={props.open}
        aria-labelledby="form-dialog-title"
        maxWidth="md"
        fullWidth="true"
        onClose={props.close}
      >
        <DialogTitle className="dialog_title">
            {props.msgType === "message" ? "Send Message": "Send Whatsapp"}
        </DialogTitle>
        
        <DialogContent className="content">
          <div style={{display:"flex", gap:"1rem"}}>
            <div className="message_left">
              <div className="message_form">
                <div className="dual_select">
                  <select name="city">
                    <option value="City">City</option>
                    <option value="saab">Saab</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="audi">Audi</option>
                  </select>
                  <select name="city">
                    <option value="State">State</option>
                    <option value="saab">Saab</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="audi">Audi</option>
                  </select>
                </div>
                <input
                  type="text"
                  name="company_name"
                  // value={user.company_name}
                  // onChange={handleInput}
                  placeholder="Company Name"
                />
              </div>
            </div>
            <div className="message_right">
              <div className="message_form">
                <div className="dual_select">
                  <select name="city">
                    <option value="City">City</option>
                    <option value="saab">Saab</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="audi">Audi</option>
                  </select>
                  <select name="city">
                    <option value="State">State</option>
                    <option value="saab">Saab</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="audi">Audi</option>
                  </select>
                </div>
                <input
                  type="text"
                  name="company_name"
                  // value={user.company_name}
                  // onChange={handleInput}
                  placeholder="Company Name"
                />
              </div>
            </div>
          </div>
          <a className="dialog_link" href="#">Attachment <HiOutlineLink /></a>
          <div className="message_btn">SEND</div>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
};

export default MessageDialog;
