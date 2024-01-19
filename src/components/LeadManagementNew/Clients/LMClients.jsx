import "./LMClients.css";
import React, { useEffect, useState } from "react";
import group from "../../../images/group.png";

import Customers from "./Customers/Customers";
import LeadListing from "./Lead/LeadListing";
import GroupHome from "./Group/GroupHome";
import Teams from "./Teams/Teams";
import { CircularProgress } from "@mui/material";
import { useLocation } from "react-router-dom";

const LMClients = () => {
    const location = useLocation()

    const [isLoading, setisLoading] = useState(false)
    const [activeTab, setactiveTab] = useState("customers");

    const [customerTabSelected, setcustomerTabSelected] = useState(true)
    const [customerTab, setcustomerTab] = useState("")

    const [groupTabSelected, setgroupTabSelected] = useState(false)
    const [groupTab, setgroupTab] = useState("")

    // useEffect(() => {
    //     console.log(location?.state)
    // }, [location])

    const [filterData, setfilterData] = useState({
        type: "customers",
        sub_type: "",
        status: "",
        limit: "10",
    })

    // const filterHandleInput = (e) => {
    //     setfilterData({ ...filterData, [e.target.name]: e.target.value })
    // }

    const tabClickedFunc = (tab) => {
        setactiveTab(tab)
        if (tab !== "customers") {
            setcustomerTabSelected(false)
        }
        if (tab !== "Groups") {
            setgroupTabSelected(false)
        }
    }

    const customerSelectedFunc = (customer) => {
        setcustomerTab(customer)
        setcustomerTabSelected(false)
    }

    const groupTabFunc = (grp) => {
        setgroupTab(grp)
        setgroupTabSelected(false)
    }
    
    // useEffect(() => {
    //     const url = "https://google.com";
    //     window.navigation.navigate(url)
    // }, []);
    return (
        <div className="container">
            <div className="beat_heading">
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">Clients</div>
                </div>
                <div className="beat_right">
                </div>
            </div>

            <div className="lm_client_tab_container">
                <div
                    onClick={() => {
                        tabClickedFunc("customers")
                        if (customerTabSelected) setcustomerTabSelected(false)
                        else setcustomerTabSelected(true)
                    }}
                    className={`tabs customers ${activeTab === "customers" ? "active" : ""}`}>
                    <div>Customers</div>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{ display: customerTabSelected ? "block" : "none" }}
                        className="customer_popup"
                    >
                        <div className="customer_filter_section" >
                            <div className="customer_heading">Options</div>
                            {/* <div className="top_left_filter" style={{ padding: "1rem" }}>
                                <div className="entry_div">Show Entries</div>
                                <select name="limit" onChange={filterHandleInput} className="limit_select" >
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                </select>
                                <div className="entry_div">Status</div>
                                <select name="status" onChange={filterHandleInput} className="limit_select status_select" >
                                    <option value="">Status</option>
                                    <option value="Online">Online</option>
                                    <option value="Offline">Offline</option>
                                </select>
                            </div> */}
                            <div className="customer_options_tabs">
                                <div onClick={() => customerSelectedFunc("retailers")} className="customer_type">Customers</div>
                                <div onClick={() => customerSelectedFunc("parties")} className="customer_type">Parties</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div onClick={() => tabClickedFunc("Leads")} className={`tabs ${activeTab === "Leads" ? "active" : ""}`}>
                    Leads
                </div>
                <div
                    onClick={() => {
                        tabClickedFunc("Groups")
                        if (groupTabSelected) setgroupTabSelected(false)
                        else setgroupTabSelected(true)
                    }}
                    className={`tabs customers ${activeTab === "Groups" ? "active" : ""}`}>
                    <div>Groups</div>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{ display: groupTabSelected ? "block" : "none" }}
                        className="customer_popup"
                    >
                        <div className="customer_filter_section" >
                            <div className="customer_heading">Options</div>
                            <div className="customer_options_tabs">
                                <div onClick={() => groupTabFunc("home")} className="customer_type">Group Home</div>
                                <div onClick={() => groupTabFunc("listing")} className="customer_type">All Groups</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div onClick={() => tabClickedFunc("Teams")} className={`tabs ${activeTab === "Teams" ? "active" : ""}`} >
                    Teams
                </div>
            </div>

            {isLoading ? (
                <div style={{ margin: "8rem auto" }} >
                    <CircularProgress />
                </div>
            ) : (
                <>
                    {activeTab === "customers" && <Customers customerData={{ customerTab: customerTab }} />}
                    {activeTab === "Leads" && <LeadListing />}
                    {activeTab === "Groups" && <GroupHome groupTab={groupTab} />}
                    {activeTab === "Teams" && <Teams />}
                </>
            )}
        </div>
    )
}

export default LMClients