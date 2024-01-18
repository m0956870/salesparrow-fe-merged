import "../../Content/LMContent.css"
import React, { useState } from 'react'
import group from "../../../../images/group.png";

import { CircularProgress } from "@mui/material";
import { useLocation } from "react-router-dom";
import FileShareCustomer from "./ShareCustomer/FileShareCustomer";
import MsgShareCustomer from "./ShareCustomer/MsgShareCustomer";
import BannerShareCustomer from "./ShareCustomer/BannerShareCustomer";


const ShareCustomerPage = () => {
    const location = useLocation();
  const [isLoading, setisLoading] = useState(false)
//   const [activeTab, setactiveTab] = useState("Message");

  return (
    <div className="container">
      <div className="beat_heading">
        <div className="beat_left">
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Client</div>
        </div>
        <div className="beat_right">
        </div>
      </div>

      {/* <div className="lm_content_tab_container">
        <div className="lm_content_tab_wrapper" >
          <div onClick={() => setactiveTab("Message")} className={`tabs ${activeTab === "Message" ? "active" : ""}`} >
            Message
          </div>
          <div onClick={() => setactiveTab("Files")} className={`tabs ${activeTab === "Files" ? "active" : ""}`} >
            Files
          </div>
          <div onClick={() => setactiveTab("Banner")} className={`tabs ${activeTab === "Banner" ? "active" : ""}`} >
            Banner
          </div>
        </div>
      </div> */}

      {isLoading ? (
        <div style={{ margin: "8rem auto" }} >
          <CircularProgress />
        </div>
      ) : (
        <>
          {location?.state?.name === "Message" && <MsgShareCustomer />}
          {location?.state?.name === "Files" && <FileShareCustomer />}
          {location?.state?.name === "Banner" && <BannerShareCustomer />}
        </>
      )}

  
    </div>
  )
}

export default ShareCustomerPage;