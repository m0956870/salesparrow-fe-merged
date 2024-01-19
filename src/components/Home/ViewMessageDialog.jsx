import "./ViewMessageDialog.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ViewMessageDialog = (props) => {
  const navigate = useNavigate();
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
          <div className="viewmsg_title">Message</div>
        </DialogTitle>
        <DialogContent className="content">
          <div style={{ display: "flex", gap: "1rem" }}>
            <div className="message_left">
              <div className="message_form">
                <div className="dual_select"></div>
                <input
                  type="text"
                  name="company_name"
                  // value={user.company_name}
                  // onChange={handleInput}
                  placeholder="Message Type"
                />
              </div>
            </div>
            <div className="message_right">
              <div className="message_form">
                <div className="dual_select"></div>
                <input
                  type="text"
                  name="company_name"
                  // value={user.company_name}
                  // onChange={handleInput}
                  placeholder="Message Title"
                />
              </div>
            </div>
          </div>
          <div>
            <textarea name="" rows="5" placeholder="Message Description"></textarea>
          </div>
          <a className="dialog_link" href="#">
            Abc.PDF <VisibilityIcon style={{fontSize:"0.9rem"}} />
          </a>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewMessageDialog;
