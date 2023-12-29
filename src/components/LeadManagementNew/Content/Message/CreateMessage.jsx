import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogTitle, DialogContent, CircularProgress, } from "@mui/material";
import { createMessage } from "../../../../api/leadApi";
import { toast } from "react-toastify";

const CreateMessage = (props) => {

    const [message , setMessage] = useState({
        title:"",
        body:""
    })

    const handleCreate=async()=>{
        let data = message
        try {
            const res = await createMessage(data);
            console.log(res.data);
            if (res.data.status) {
              toast.success(res.data.message);
            
            } else {
              toast.error(res.data.message);
            }
            props.close();
            setMessage({
                ...message,
                title:"",
                body:""
            })
          } catch (error) {
            toast.error(error.message);
            // setApiRes({ loading: false, error: res.data.message });
          }
    }

    const handleChange=(e)=>{
        const {name , value} = e.target;
        setMessage({
            ...message,
            [name]:value
        })
    }

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
                    <div className="create_msg_heading" >Create Message</div>
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
                    <div className="content_create_msg_btn" onClick={handleCreate} >Create Message</div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateMessage