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

const SendLeadCustomerPopUp = (props) => {
  const inputRef = useRef(null)

  const [message, setMessage] = useState({
    title: "",
    body: "",
    banner:""
  });

  useEffect(() => {
    setMessage({
      ...message,
      title: props.messageData.title,
      body: props.messageData.body,
      banner:props.messageData.banner
    });
  }, [props.messageData,]);


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
      const replacement = " @Client Name ";
      
      // Update the text with the replacement at the selected range
      const newText = message.body.substring(0, start) + replacement + message.body.substring(end);
      setMessage({
        ...message,
        body:newText
      });

    }
   }

  const handleSend=async(elem , name)=>{
    // const whatsappLink = `https://wa.me/${elem.mobile_number}?text=Hii%20,%20${encodeURIComponent(props?.pageType=="parties"?elem.party_name:elem.customer_name)}%0Atitle%20-%20${encodeURIComponent(message.title)}%0Adescription%20-%20${encodeURIComponent(message.body)}`;
    //   window.location.href = whatsappLink;
    

    if(props.messageData.name==="file"){
      let updatedBody = message.body.replace(/@Client Name/g, name);
      let data = {
        media: props.messageData.leadId,
        sharedWith: elem._id,
        userType: props.pageType
      };
      try {
        const res = await createSharedMedia_lead(data);

        if (res.data.status) {
          toast.success(res.data.message);
          const whatsappLink =`https://wa.me/${elem.mobile_number}?text=Hii%20,%20${encodeURIComponent(props?.pageType=="party"?elem.party_name:elem.customer_name)}%0Atitle%20-%20${encodeURIComponent(message.title)}%0Adescription%20-%20${encodeURIComponent(updatedBody)}?text=${res.data.url}`;
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
      let updatedBody = message.body.replace(/@Client Name/g, name);
      // const whatsappLink = `https://wa.me/${elem.mobile_number}?text=Hii%20,%20${encodeURIComponent(props.name=="lead"?elem.leadName:props?.name=="customer"?elem.customerName:elem.firmName)}%0Atitle%20-%20${encodeURIComponent(message.title)}%0Adescription%20-%20${encodeURIComponent(updatedBody)}?link=${props?.messageData?.banner}`;
      const whatsappLink = `https://wa.me/${elem.mobile_number}?text=Hii%20,%20%0Atitle%20-%20${encodeURIComponent(message.title)}%0Adescription%20-%20${encodeURIComponent(updatedBody)}?link=${props?.messageData?.banner}`;
      window.location.href = whatsappLink;
    }
    else{
      let updatedBody = message.body.replace(/@Client Name/g, name);
      const whatsappLink = `https://wa.me/${elem.mobile_number}?text=Hii%20,%20%0Atitle%20-%20${encodeURIComponent(message.title)}%0Adescription%20-%20${encodeURIComponent(updatedBody)}`;
      // const whatsappLink = `https://wa.me/${elem.mobile_number}?text=Hii%20,%20${encodeURIComponent(props.name=="lead"?elem.leadName:props?.name=="customer"?elem.customerName:elem.firmName)}%0Atitle%20-%20${encodeURIComponent(message.title)}%0Adescription%20-%20${encodeURIComponent(updatedBody)}`;
      window.location.href = whatsappLink;
    }
  }

  console.log(props, "props")

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
          {props?.sentLead?.map((elem , id)=>{
            let name = props?.pageType=="party"?elem.party_name:elem.customer_name
            return(
              <>
              <div className="msg_total_send ">
                    <div className="image_body_list">
                      {/* <div className="">{elem.leadName.toString().charAt(0)}</div> */}
                    <div><p >{name}</p>
                      <p>
                        {elem.mobileNumber}
                      </p></div>
                    </div>
                    <div className="content_create_msg_btn_whatsap" onClick={()=>handleSend(elem ,name)}>
                      <FaWhatsappSquare fontSize={"28px"}/> Send
                    </div>
                   
                  </div>
              </>
            )
          })}
          <div className="msg_total_send">
            <div>Total Sent</div>
            <div>{props?.sentLead?.length}</div>
          </div>
          {/* <div className="content_create_msg_btn" onClick={handleUpdate}>
            Send Message
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendLeadCustomerPopUp;
