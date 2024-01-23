import "./LMContent.css"
import React, { useEffect, useState } from 'react'
import group from "../../../images/group.png";

import { CircularProgress } from "@mui/material";
import MessageListing from "./Message/MessageListing";
import FileListing from "./Files/FilesListing";
import BannerListing from "./Banner/BannerListing";
import { useLocation, useNavigate } from "react-router-dom";

const LMContent = () => {
  const location = useLocation();
    const navigate = useNavigate();
  
  const [isLoading, setisLoading] = useState(false)
  const [activeTab, setactiveTab] = useState("Message");
  const [activeTitle , setActiveTitle] = useState("false");

  useEffect(()=>{
    setActiveTitle(location.pathname)
  },[activeTitle])

  return (
    <div className="container">
      <div className="lead_manage_head">
                <div className={`${activeTitle === "/lead_management_home" ? "title" : "titleNotActive"}`} onClick={()=> navigate("/lead_management_home")}>Home </div>
                <div className={`${activeTitle === "/lead_management_clients" ? "title" : "titleNotActive"}`} onClick={()=> navigate("/lead_management_clients")}>Clients</div>
                <div className={`${activeTitle === "/lead_management_content" ? "title" : "titleNotActive"}`} onClick={()=> navigate("/lead_management_content")}>Content</div>
                <div className={`${activeTitle === "/lead_management_followups" ? "title" : "titleNotActive"}`} onClick={()=> navigate("/lead_management_followups")}>Followup</div>
                </div>
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