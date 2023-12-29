import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { updateMessage } from "../../../../../api/leadApi";
import { SetMealSharp } from "@mui/icons-material";
import { FaWhatsappSquare } from "react-icons/fa";

const SendMessagePage = (props) => {
  const [message, setMessage] = useState({
    title: "",
    body: "",
    banner:""
  });

  useEffect(() => {
    setMessage({
      ...message,
      title: props.messageData.title,
      body: props.messageData.description,
      banner:props.messageData?.banner
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

  const handleSend=(elem)=>{
    const whatsappLink = `https://wa.me/${props.name=="lead"?elem.mobileNumber:props.name=="customer"?elem.mobileNo:elem.mobileNo}?text=Hii%20,%20${encodeURIComponent(props.name=="lead"?elem.leadName:props.name=="customer"?elem.customerName:elem.firmName)}%0Atitle%20-%20${encodeURIComponent(message.title)}%0Adescription%20-%20${encodeURIComponent(message.body)}`;
      window.location.href = whatsappLink;
  }

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
          <div className="create_msg_heading">Review and Send</div>
          {message?.banner?<div><img src={message?.banner}/></div>:""}
          <div className="msg_body_section">
            <div className="msg_body_title">Title</div>
            <textarea
              className="msg_body_txtarea_title"
              name="title"
              placeholder="Enter your title"
              value={message.title}
              onChange={handleChange}
            />
            <div className="msg_body_title">Your Message </div>
            <textarea
              className="msg_body_txtarea_msg"
              name="body"
              placeholder="Enter your description"
              value={message.body}
              onChange={handleChange}
            />
          </div>
          {/* <h3>Insert <span style={{color:"#1565c0"}}>{props?.sentName?.map((elem)=>"@"+elem + ' , ')}</span></h3> */}
          {props?.sentName?.map((elem , id)=>{
            return(
              <>
              <div className="msg_total_send ">
                    <div className="image_body_list">
                      {/* <div className="">{elem.leadName.toString().charAt(0)}</div> */}
                    <div><p >{props.name=="lead"?elem.leadName:props.name=="customer"?elem.customerName:elem.firmName}</p>
                      <p>
                        {props.name=="lead"?elem.mobileNumber:props.name=="customer"?elem.mobileNo:elem.mobileNo}
                      </p></div>
                    </div>
                    <div className="content_create_msg_btn_whatsap" onClick={()=>handleSend(elem)}>
                      <FaWhatsappSquare fontSize={"28px"}/> Send
                    </div>
                   
                  </div>
              </>
            )
          })}
          <div className="msg_total_send">
            <div>Total Sent</div>
            <div>{props?.sentName?.length}</div>
          </div>
          <div className="content_create_msg_btn" onClick={handleUpdate}>
            Save Message
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendMessagePage;
