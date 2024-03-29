import { CircularProgress, Grid } from "@mui/material";
import "./Followups.css";
import React, { useEffect, useState } from "react";
import { getFollowupd_data } from "../../../api/leadApi";
import { useLocation, useNavigate } from "react-router-dom";
import group from "../../../images/group.png";

const FollowUpsDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

    const [state , setState] = useState();
    const [isLoading , setisLoading] = useState(false);
    const [activeTitle , setActiveTitle] = useState("false");

    const getFollowupsData = async()=>{
      setisLoading(true)
        let res = await getFollowupd_data()
        try {
            if(res.data.status){
              setState(res?.data?.data)
              setisLoading(false)
            }
        } catch (error) {
            console.log(error)
            setisLoading(false)
        }
    }

    useEffect(()=>{
       getFollowupsData();
    },[])

    const handleClick = (type)=>{
     navigate("/followups_listing" ,{state:{type:type}})
    }

    useEffect(()=>{
      setActiveTitle(location.pathname)
    },[activeTitle])

  return (
    <div className="lm_content_main_containers" style={{margin:"0"}}>
       <div className="lead_manage_head">
                <div className={`${activeTitle === "/lead_management_home" ? "title" : "titleNotActive"}`} onClick={()=> navigate("/lead_management_home")}>Home </div>
                <div className={`${activeTitle === "/lead_management_clients" ? "title" : "titleNotActive"}`} onClick={()=> navigate("/lead_management_clients")}>Clients</div>
                <div className={`${activeTitle === "/lead_management_content" ? "title" : "titleNotActive"}`} onClick={()=> navigate("/lead_management_content")}>Content</div>
                <div className={`${activeTitle === "/lead_management_followups" ? "title" : "titleNotActive"}`} onClick={()=> navigate("/lead_management_followups")}>Followup</div>
                </div>
      {isLoading?
       <div style={{ margin: "auto", }} >
                    <CircularProgress />
                </div>
                :
      <>
       <div className="beat_heading">
        <div className="beat_left" style={{justifyContent:"start"}}>
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Followup Dashboard</div>
        </div>
        
      </div>
      <div className="lm_client_tab_container">
       
        <Grid container >
          <Grid item  xs={12} lg={4}>
            <div className="followups_dashboard_box">
              <div className="followups_dashboard_overdue" onClick={()=>handleClick("overdue")}>
                <h2 style={{textAlign:"center"}}>Overdue</h2>
                <h2>{state?.overdue}</h2>
              </div>
            </div>
          </Grid>
          <Grid item  xs={12} lg={4}>
            <div className="followups_dashboard_box">
              <div className="followups_dashboard_upcoming" onClick={()=>handleClick("upcoming")}>
                <h2 style={{textAlign:"center"}}>Upcoming</h2>
                <h2>{state?.upcoming}</h2>
              </div>
            </div>
          </Grid>
          <Grid item  xs={12} lg={4}>
            <div className="followups_dashboard_box">
              <div className="followups_dashboard_someday" onClick={()=>handleClick("today")}>
                <h2 style={{textAlign:"center"}}>Today</h2>
                <h2>{state?.today}</h2>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
      <div className="followups_dasboard_downbox">
        <Grid
          container
          item 
          xs={12}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Grid container>
            <Grid item  xs={12}>
              <h2 style={{textAlign:"center"}}>Follow Ups</h2>
            </Grid>
          </Grid>

          <Grid item  container xs={6} className="followups_data">
            <Grid item  xs={12} lg={3}>
              <div className="followups_sidebox">
                <p>Follow ups</p>
                <p style={{marginTop:"5rem"}}>Leads</p>
              </div>
            </Grid>
            <Grid item  xs={12} lg={3}>
              <div style={{display:"flex" , justifyContent:"center"}}>
                <div>
                  <div className="followups_overdue"></div>
                  <h4 style={{textAlign:"center"}}>Overdue</h4>
                  <h4 style={{textAlign:"center",margin: "1rem 0rem"}}>{state?.overdue}</h4>
                </div>
              </div>
            </Grid>
            <Grid item  xs={12} lg={3}>
              <div style={{display:"flex" , justifyContent:"center"}}>
                <div>
                  <div className="followups_upcoming"></div>
                  <h4 style={{textAlign:"center"}}>Upcoming</h4>
                  <h4 style={{textAlign:"center",margin: "1rem 0rem"}}>{state?.upcoming}</h4>
                </div>
              </div>
            </Grid>
            <Grid item  xs={12} lg={3}>
              <div style={{display:"flex" , justifyContent:"center"}}>
                <div>
                  <div className="followups_someday"></div>
                  <h4 style={{textAlign:"center"}}>Today</h4>
                  <h4 style={{textAlign:"center",margin: "1rem 0rem"}}>{state?.today}</h4>
                </div>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </div>
        </>}
    </div>
  );
};

export default FollowUpsDashboard;
