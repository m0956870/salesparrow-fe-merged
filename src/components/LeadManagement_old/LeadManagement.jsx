import "./LeadManagement.css";
import React, { useState } from "react";
import group from "../../images/group.png";

const LeadManagement = () => {
  const [activeTab, setactiveTab] = useState("Home");
  return (
    <div className="container">
      <div className="beat_heading">
        <div className="beat_left">
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Lead Management</div>
        </div>
      </div>

      <div className="lead_tab_container">
        <div
          onClick={() => setactiveTab("Home")}
          className={`${
            activeTab === "Home" ? "lead_tab active_tab" : "lead_tab"
          }`}
        >
          Home
        </div>
        <div
          onClick={() => setactiveTab("Clients")}
          className={`${
            activeTab === "Clients" ? "lead_tab active_tab" : "lead_tab"
          }`}
        >
          Clients
        </div>
        <div
          onClick={() => setactiveTab("Content")}
          className={`${
            activeTab === "Content" ? "lead_tab active_tab" : "lead_tab"
          }`}
        >
          Content
        </div>
        <div
          onClick={() => setactiveTab("Follow Ups")}
          className={`${
            activeTab === "Follow Ups" ? "lead_tab active_tab" : "lead_tab"
          }`}
        >
          Follow Ups
        </div>
      </div>
    </div>
  );
};

export default LeadManagement;
