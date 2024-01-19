import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { updateMessage } from "../../../../api/leadApi";
import { SetMealSharp } from "@mui/icons-material";

const EditMessage = (props) => {
  const [message, setMessage] = useState({
    title: "",
    body: "",
  });

  useEffect(() => {
    setMessage({
      ...message,
      title: props.messageData.title,
      body: props.messageData.description,
    });
  }, [props.messageData._id,]);


  const handleUpdate = async () => {
    let data = {
      id: props.messageData._id,
      title: message.title,
      body: message.body,
    };
    try {
      const res = await updateMessage(data);
      if (res.data.status) {
        toast.success(res.data.message);
        props.getMessageList()
      } else {
        toast.error(res.data.message);
      }
      props.close();
      setMessage({
        ...message,
        title: "",
        body: "",
      });
    } catch (error) {
      toast.error(error.message);
      // setApiRes({ loading: false, error: res.data.message });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage({
      ...message,
      [name]: value,
    });
  };

  return (
    <Dialog
      open={props.open}
      aria-labelledby="form-dialog-title"
      maxWidth="sm"
      fullWidth={true}
      onClose={props.close}
    >
      <DialogContent style={{ padding: 0 }}>
        <div className="content_create_msg_popup">
          <div className="create_msg_heading">Edit Message</div>
          <div className="msg_body_section">
            <div className="msg_body_title">Title</div>
            <textarea
              className="msg_body_txtarea_title"
              name="title"
              placeholder="Enter your title"
              value={message.title}
              onChange={handleChange}
            />
            <div className="msg_body_title">Type your message here</div>
            <textarea
              className="msg_body_txtarea_msg"
              name="body"
              placeholder="Enter your description"
              value={message.body}
              onChange={handleChange}
            />
          </div>
          <div className="msg_total_send">
            <div>Total Sent</div>
            <div>136</div>
          </div>
          <div className="content_create_msg_btn" onClick={handleUpdate}>
            Save Message
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditMessage;
