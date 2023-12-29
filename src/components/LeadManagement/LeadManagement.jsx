import './LeadManagement.css';
import React, { useState } from 'react';
import group from '../../images/group.png';
import { useEffect } from 'react';
import Home from './Home';

const tabs = [
  { name: 'Home', comp: <Home /> },
  { name: 'Clients', comp: <Clients /> },
  { name: 'Content', comp: <Content /> },
  { name: 'Follow Up', comp: <FollowUp /> },
];

export default function LeadManagement() {
  const [activeTab, setactiveTab] = useState(tabs[0]);
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
        {/* {tabs.map((tab, i) => {
          return (
            <button onClick={() => setactiveTab(tab)} className={`${activeTab.name === tab.name ? 'lead_tab active_tab' : 'lead_tab'}`} key={i}>
              {tab.name}
            </button>
          );
        })} */}
      </div>
      {activeTab.comp}
    </div>
  );
}

function Clients() {
  return <>Clients</>;
}

function Content() {
  return <>Content</>;
}

function FollowUp() {
  return <>FollowUp</>;
}
