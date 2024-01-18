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

const SendLeadMessagePage = (props) => {
  const inputRef = useRef(null)
  const [message, setMessage] = useState({
    title: "",
    body: "",
  });

  

  useEffect(() => {
    setMessage({
      ...message,
      title: props.messageData.title,
      body: props.messageData.body,
    });
  }, [props.messageData,]);


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

  const handleSetText = () =>{
    const input = inputRef.current;
   
    if (input) {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const replacement = " @Client Name";
      
      // Update the text with the replacement at the selected range
      const newText = message.body.substring(0, start) + replacement + message.body.substring(end);
      setMessage({
        ...message,
        body:newText
      });

      // input.setSelectionRange(start + replacement.length, start + replacement.length);

    }
   }

  const handleSend = async(elem) => {
  
    if(props.messageData.name==="file"){

    let updatedBody = message.body.replace(/@Client Name/g, elem.leadName);
    let data = {
      media: props.messageData.leadId,
      sharedWith: elem._id,
      userType: props.name
    };
    try {
      const res = await createSharedMedia_lead(data);

      if (res.data.status) {
        toast.success(res.data.message);
        const whatsappLink =`https://wa.me/${props?.name=="lead"?elem.mobileNumber:props?.name=="customer"?elem.mobileNo:elem.mobileNo}?text=${updatedBody}?link=${res.data.url}`;
        // window.open(whatsappLink, '_blank');
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
      // setApiRes({ loading: false, error: res.data.message });
    }
    
  }else if(props.messageData.name==="banner"){
    let updatedBody = message.body.replace(/@Client Name/g, elem.leadName);
    const whatsappLink = `https://wa.me/${elem.mobileNumber}?text=Hii%20,%20${encodeURIComponent(elem.leadName)}%0Atitle%20-%20${encodeURIComponent(message.title)}%0Adescription%20-%20${encodeURIComponent(updatedBody)}?link=${props?.messageData?.banner}`;
   window.location.href = whatsappLink;
  }
  else{
    let updatedBody = message.body.replace(/@Client Name/g, elem.leadName);
    const whatsappLink = `https://wa.me/${ elem.mobileNumber}?text=Hii%20,%20${encodeURIComponent( elem.leadName )}%0Atitle%20-%20${encodeURIComponent(message.title)}%0Adescription%20-%20${encodeURIComponent(updatedBody)}`;
   window.location.href = whatsappLink;
  }
  // else{
  //   let updatedBody = message.body.replace(/@Client Name/g, elem.leadName);
  //   const whatsappLink = `https://wa.me/${ elem.mobileNumber}?text=Hii%20,%20${encodeURIComponent( elem.leadName )}%0Atitle%20-%20${encodeURIComponent(message.title)}%0Adescription%20-%20${encodeURIComponent(updatedBody)}`;
  //   window.location.href = whatsappLink;
  // }
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
          <div className="create_msg_heading">Send</div>
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
          {props?.sentLead?.map((elem , id)=>{
            return(
              <>
              <div className="msg_total_send ">
                    <div className="image_body_list">
                      {/* <div className="">{elem.leadName.toString().charAt(0)}</div> */}
                    <div><p >{elem.leadName}</p>
                      <p>
                        {elem.mobileNumber}
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
          {/* <div className="content_create_msg_btn" onClick={handleUpdate}>
            Send Message
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendLeadMessagePage;
