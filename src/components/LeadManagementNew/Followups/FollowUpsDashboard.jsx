import { Grid } from "@mui/material";
import "./Followups.css";
import React, { useEffect, useState } from "react";
import { getFollowupd_data } from "../../../api/leadApi";

const FollowUpsDashboard = () => {

    const [state , setState] = useState()

    const getFollowupsData = async()=>{
        let res = await getFollowupd_data()
        try {
            if(res.data.status){
              setState(res?.data?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
       getFollowupsData();
    },[])
  console.log(state?.overdue.length, "state")

  return (
    <div className="container">
      <div className="lm_client_tab_container">
        <Grid container >
          <Grid item  xs={12} lg={4}>
            <div className="followups_dashboard_box">
              <div className="followups_dashboard_overdue">
                <h2>Overdue</h2>
                <h2>{state?.overdue.length}</h2>
              </div>
            </div>
          </Grid>
          <Grid item  xs={12} lg={4}>
            <div className="followups_dashboard_box">
              <div className="followups_dashboard_upcoming">
                <h2>Upcoming</h2>
                <h2>{state?.upcoming.length}</h2>
              </div>
            </div>
          </Grid>
          <Grid item  xs={12} lg={4}>
            <div className="followups_dashboard_box">
              <div className="followups_dashboard_someday">
                <h2>Someday</h2>
                <h2>{state?.someDay.length}</h2>
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
                  <h4>Overdue</h4>
                  <h4 style={{textAlign:"center",margin: "1rem 0rem"}}>{state?.overdue.length}</h4>
                </div>
              </div>
            </Grid>
            <Grid item  xs={12} lg={3}>
              <div style={{display:"flex" , justifyContent:"center"}}>
                <div>
                  <div className="followups_upcoming"></div>
                  <h4>Upcoming</h4>
                  <h4 style={{textAlign:"center",margin: "1rem 0rem"}}>{state?.upcoming.length}</h4>
                </div>
              </div>
            </Grid>
            <Grid item  xs={12} lg={3}>
              <div style={{display:"flex" , justifyContent:"center"}}>
                <div>
                  <div className="followups_someday"></div>
                  <h4>Someday</h4>
                  <h4 style={{textAlign:"center",margin: "1rem 0rem"}}>{state?.someDay.length}</h4>
                </div>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default FollowUpsDashboard;
