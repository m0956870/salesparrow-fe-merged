import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import { getHistory_data,  } from "../../../../api/leadApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EditFile = (props) => {
const navigate = useNavigate()
  const [history, sethistory] = useState()
  
const getHistoryData = async() =>{
    let res = await getHistory_data(props?.fileData?._id);
    try {
        if(res.data.data){
            sethistory(res.data.data)
        }
    } catch (error) {
        console.log(error)
    }
}

useEffect(()=>{
getHistoryData()
},[props?.fileData?._id])

const handlePreview = () =>{
    navigate(`https://crm.salesparrow.in/whatsapp-preview/${props?.fileData?._id}`)
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
          <div className="create_msg_heading">View</div>
          <div className="msg_body_section">
            <div className="msg_body_title">
              <img
                src={props.fileData.images ? props.fileData.images[0] : ""}
                width={"100px"}
              />
            </div>
            <div className="msg_body_title">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div></div>
                <div style={{marginLeft:"3.5rem"}}>{props?.fileData?.title}</div>
                {props.catalogue?<a href={`https://crm.salesparrow.in/whatsapp-preview/${props?.fileData?._id}`} target="_blank" style={{color:"#28A9E2"}}>Preview</a>:""}
              </div>
            </div>
          </div>

          <div className="msg_body_section">
            <div className="msg_body_title">Sharing History</div>
            <div className="share_history_btn">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>Total Shared</div>
                <div>{history?.sharedCount}</div>
              </div>
            </div>
            <div className="share_history_btn">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>Opened</div>
                <div>{history?.opened}</div>
              </div>
            </div>
            <div className="share_history_btn">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>Unopen</div>
                <div>{history?.unopened}</div>
              </div>
            </div>
          </div>

          <div className="msg_body_section">
            <div className="msg_body_title">High Potential clients</div>
            {/* <div className="share_history_box">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>View in last 7 days</div>
                <div>5</div>
              </div>
            </div> */}
            <div className="share_history_box">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{color:"#28A9E2"}}>Viewed in multiple times</div>
                <div style={{color:"#28A9E2"}}>{history?.viewMultipleTime}</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditFile;
