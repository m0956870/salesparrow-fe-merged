import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogTitle, DialogContent, CircularProgress, } from "@mui/material";

const ShareMessage = (props) => {
    return (
        <Dialog
            open={props.open}
            aria-labelledby="form-dialog-title"
            maxWidth="sm"
            fullWidth={true}
            onClose={props.close}
        >
            <DialogContent style={{ padding: 0 }} >
                <div className="content_create_msg_popup" >
                    <div className="create_msg_heading" >Share Message</div>
                    <div className="msg_total_send">
                        <div>Total Sent</div>
                        <div>136</div>
                    </div>
                    <div className="content_create_msg_btn">Share</div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ShareMessage