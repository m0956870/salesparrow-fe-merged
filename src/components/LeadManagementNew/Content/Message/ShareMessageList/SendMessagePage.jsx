import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { createSharedMedia_lead, updateMessage } from "../../../../../api/leadApi";
import { SetMealSharp } from "@mui/icons-material";
import { FaWhatsappSquare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SendMessagePage = (props) => {
<<<<<<< HEAD
  const inputRef = useRef(null)
=======
>>>>>>> 04fedc3911e1dd3321940bd01676f64ef01e52f2
  const navigate = useNavigate();
  const [message, setMessage] = useState({
    title: "",
    body: "",
    banner:""
  });

  useEffect(() => {
    setMessage({
      ...message,
      title: props?.messageData?.title,
      body: props?.messageData?.description,
      banner:props?.messageData?.banner
    });
  }, [props?.messageData?._id,]);
<<<<<<< HEAD
=======


  const handleUpdate = async () => {
    let data = {
      id: props?.messageData?._id,
      title: message.title,
      body: message.body,
    };
    try {
      const res = await updateMessage(data);
      if (res.data.status) {
        toast.success(res.data.message);
        props?.getMessageList()
      } else {
        toast.error(res.data.message);
      }
      props?.close();
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

>>>>>>> 04fedc3911e1dd3321940bd01676f64ef01e52f2

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage({
      ...message,
      [name]: value,
    });
  };

<<<<<<< HEAD
  const handleSetText = () =>{
    const input = inputRef.current;
   
    if (input) {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const replacement = " @Client Name ";
      
      // Update the text with the replacement at the selected range
      const newText = message.body.substring(0, start) + replacement + message.body.substring(end);
      setMessage({
        ...message,
        body:newText
      });

    }
   }

  const handleSend=async(elem,name , shareWithId)=>{
    if(props.messageData.name==="file"){
      let updatedBody = message?.body?.replace(/@Client Name/g, name);
      let data = {
        media: props.messageData.leadId,
        sharedWith: shareWithId,
=======

  const handleSend=async(elem)=>{
    if(props.messageData.name==="file"){

      let data = {
        media: props.messageData.leadId,
        sharedWith: elem.id,
>>>>>>> 04fedc3911e1dd3321940bd01676f64ef01e52f2
        userType: props.name
      };
      try {
        const res = await createSharedMedia_lead(data);
<<<<<<< HEAD

        if (res.data.status) {
          toast.success(res.data.message);
          const whatsappLink =`https://wa.me/${props?.name=="lead"?elem.mobileNumber:props?.name=="customer"?elem.mobileNo:elem.mobileNo}?text=Hii%20,%20${encodeURIComponent(props.name=="lead"?elem.leadName:props?.name=="customer"?elem.customerName:elem.firmName)}%0Atitle%20-%20${encodeURIComponent(message.title)}%0Adescription%20-%20${encodeURIComponent(updatedBody)}?text=${res.data.url}`;
=======
        if (res.data.status) {
          toast.success(res.data.message);
          const whatsappLink =`https://wa.me/${props?.name=="lead"?elem.mobileNumber:props?.name=="customer"?elem.mobileNo:elem.mobileNo}?text=${res.data.url}`;
>>>>>>> 04fedc3911e1dd3321940bd01676f64ef01e52f2
          window.location.href = whatsappLink;
        } else {
          toast.error(res.data.message);
        }
        props?.close();
        setMessage({
          ...message,
          title: "",
          body: "",
        });
      } catch (error) {
        toast.error(error.message);
<<<<<<< HEAD
      }
    
    }else if(props.messageData.name==="banner"){
      let updatedBody = message?.body?.replace(/@Client Name/g, name);
      const whatsappLink = `https://wa.me/${props?.name=="lead"?elem.mobileNumber:props?.name=="customer"?elem.mobileNo:elem.mobileNo}?text=Hii%20,%20${encodeURIComponent(props.name=="lead"?elem.leadName:props?.name=="customer"?elem.customerName:elem.firmName)}%0Atitle%20-%20${encodeURIComponent(message.title)}%0Adescription%20-%20${encodeURIComponent(updatedBody)}?link=${props?.messageData?.banner}`;
     window.location.href = whatsappLink;
    }
    else{
      let updatedBody = message?.body?.replace(/@Client Name/g, name);
      const whatsappLink = `https://wa.me/${props?.name=="lead"?elem.mobileNumber:props?.name=="customer"?elem.mobileNo:elem.mobileNo}?text=Hii%20,%20${encodeURIComponent(props.name=="lead"?elem.leadName:props?.name=="customer"?elem.customerName:elem.firmName)}%0Atitle%20-%20${encodeURIComponent(message.title)}%0Adescription%20-%20${encodeURIComponent(updatedBody)}`;
     window.location.href = whatsappLink;
=======
        // setApiRes({ loading: false, error: res.data.message });
      }
    
    }else{
      const whatsappLink = `https://wa.me/${props?.name=="lead"?elem.mobileNumber:props?.name=="customer"?elem.mobileNo:elem.mobileNo}?text=Hii%20,%20${encodeURIComponent(props.name=="lead"?elem.leadName:props?.name=="customer"?elem.customerName:elem.firmName)}%0Atitle%20-%20${encodeURIComponent(message.title)}%0Adescription%20-%20${encodeURIComponent(message.body)}`;
      window.location.href = whatsappLink;
>>>>>>> 04fedc3911e1dd3321940bd01676f64ef01e52f2
    }
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
              ref={inputRef}
            />
            <div className="msg_body_title" style={{textAlign:"start", cursor:"pointer"}} onClick={handleSetText}>
            Insert <span style={{color:"#1565c0" , textAlign:""}}>@Client Name</span></div>
          </div>
          {props?.sentName?.map((elem , id)=>{
            let name = props?.name=="lead"?elem.leadName:props?.name=="customer"?elem.customerName:elem.firmName;
            let shareWithId = props?.name=="lead"?elem._id:props?.name=="customer"?elem.id:elem.id;
            return(
              <>
              <div className="msg_total_send ">
                    <div className="image_body_list">
<<<<<<< HEAD
                    <div><p >{name}</p>
=======
                      {/* <div className="">{elem.leadName.toString().charAt(0)}</div> */}
                    <div><p >{props?.name=="lead"?elem.leadName:props?.name=="customer"?elem.customerName:elem.firmName}</p>
>>>>>>> 04fedc3911e1dd3321940bd01676f64ef01e52f2
                      <p>
                        {props?.name=="lead"?elem.mobileNumber:props?.name=="customer"?elem.mobileNo:elem.mobileNo}
                      </p></div>
                    </div>
                    <div className="content_create_msg_btn_whatsap" onClick={()=>handleSend(elem , name , shareWithId)}>
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
<<<<<<< HEAD
         
=======
          {/* <div className="content_create_msg_btn" onClick={handleUpdate}>
            Save Message
          </div> */}
>>>>>>> 04fedc3911e1dd3321940bd01676f64ef01e52f2
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendMessagePage;
