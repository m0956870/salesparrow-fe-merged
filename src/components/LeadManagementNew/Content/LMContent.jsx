import "./LMContent.css"
import React, { useState } from 'react'
import group from "../../../images/group.png";

import { CircularProgress } from "@mui/material";
import MessageListing from "./Message/MessageListing";
import FileListing from "./Files/FilesListing";
import BannerListing from "./Banner/BannerListing";

const LMContent = () => {
  const [isLoading, setisLoading] = useState(false)
  const [activeTab, setactiveTab] = useState("Message");

  return (
    <div className="container">
      <div className="beat_heading">
        <div className="beat_left">
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Content</div>
        </div>
        <div className="beat_right">
        </div>
      </div>

      <div className="lm_content_tab_container">
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
      </div>

      {isLoading ? (
        <div style={{ margin: "8rem auto" }} >
          <CircularProgress />
        </div>
      ) : (
        <>
          {activeTab === "Message" && <MessageListing />}
          {activeTab === "Files" && <FileListing />}
          {activeTab === "Banner" && <BannerListing />}
        </>
      )}

  
    </div>
  )
}

export default LMContent