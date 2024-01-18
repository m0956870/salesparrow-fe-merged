import { CircularProgress, Grid } from "@mui/material";
import "./Followups.css";
import React, { useEffect, useState } from "react";
import { getFollowupd_data } from "../../../api/leadApi";
import { useNavigate } from "react-router-dom";
import group from "../../../images/group.png";

const FollowUpsDashboard = () => {
  const navigate = useNavigate()

    const [state , setState] = useState();
    const [isLoading , setisLoading] = useState(false)

    const getFollowupsData = async()=>{
      setisLoading(true)
        let res = await getFollowupd_data()
        try {
            if(res.data.status){
              setState(res?.data?.data)
<<<<<<< HEAD
              setisLoading(false)
=======
>>>>>>> 04fedc3911e1dd3321940bd01676f64ef01e52f2
            }
        } catch (error) {
            console.log(error)
            setisLoading(false)
        }
    }

    useEffect(()=>{
       getFollowupsData();
    },[])
  console.log(state?.overdue.length, "state")

    const handleClick = (type)=>{
     navigate("/followups_listing" ,{state:{type:type}})
    }

  return (
    <div className="lm_content_main_containers">
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
<<<<<<< HEAD
       
        <Grid container >
          <Grid item  xs={12} lg={4}>
            <div className="followups_dashboard_box">
              <div className="followups_dashboard_overdue" onClick={()=>handleClick("overdue")}>
                <h2 style={{textAlign:"center"}}>Overdue</h2>
                <h2>{state?.overdue?.length}</h2>
=======
        <Grid container >
          <Grid item  xs={12} lg={4}>
            <div className="followups_dashboard_box">
              <div className="followups_dashboard_overdue">
                <h2>Overdue</h2>
                <h2>{state?.overdue.length}</h2>
>>>>>>> 04fedc3911e1dd3321940bd01676f64ef01e52f2
              </div>
            </div>
          </Grid>
          <Grid item  xs={12} lg={4}>
            <div className="followups_dashboard_box">
<<<<<<< HEAD
              <div className="followups_dashboard_upcoming" onClick={()=>handleClick("upcoming")}>
                <h2 style={{textAlign:"center"}}>Upcoming</h2>
                <h2>{state?.upcoming?.length}</h2>
=======
              <div className="followups_dashboard_upcoming">
                <h2>Upcoming</h2>
                <h2>{state?.upcoming.length}</h2>
>>>>>>> 04fedc3911e1dd3321940bd01676f64ef01e52f2
              </div>
            </div>
          </Grid>
          <Grid item  xs={12} lg={4}>
            <div className="followups_dashboard_box">
<<<<<<< HEAD
              <div className="followups_dashboard_someday" onClick={()=>handleClick("today")}>
                <h2 style={{textAlign:"center"}}>Today</h2>
                <h2>{state?.today?.length}</h2>
=======
              <div className="followups_dashboard_someday">
                <h2>Someday</h2>
                <h2>{state?.someDay.length}</h2>
>>>>>>> 04fedc3911e1dd3321940bd01676f64ef01e52f2
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
<<<<<<< HEAD
                  <h4 style={{textAlign:"center"}}>Overdue</h4>
                  <h4 style={{textAlign:"center",margin: "1rem 0rem"}}>{state?.overdue?.length}</h4>
=======
                  <h4>Overdue</h4>
                  <h4 style={{textAlign:"center",margin: "1rem 0rem"}}>{state?.overdue.length}</h4>
>>>>>>> 04fedc3911e1dd3321940bd01676f64ef01e52f2
                </div>
              </div>
            </Grid>
            <Grid item  xs={12} lg={3}>
              <div style={{display:"flex" , justifyContent:"center"}}>
                <div>
                  <div className="followups_upcoming"></div>
<<<<<<< HEAD
                  <h4 style={{textAlign:"center"}}>Upcoming</h4>
                  <h4 style={{textAlign:"center",margin: "1rem 0rem"}}>{state?.upcoming?.length}</h4>
=======
                  <h4>Upcoming</h4>
                  <h4 style={{textAlign:"center",margin: "1rem 0rem"}}>{state?.upcoming.length}</h4>
>>>>>>> 04fedc3911e1dd3321940bd01676f64ef01e52f2
                </div>
              </div>
            </Grid>
            <Grid item  xs={12} lg={3}>
              <div style={{display:"flex" , justifyContent:"center"}}>
                <div>
                  <div className="followups_someday"></div>
<<<<<<< HEAD
                  <h4 style={{textAlign:"center"}}>Today</h4>
                  <h4 style={{textAlign:"center",margin: "1rem 0rem"}}>{state?.today?.length}</h4>
=======
                  <h4>Someday</h4>
                  <h4 style={{textAlign:"center",margin: "1rem 0rem"}}>{state?.someDay.length}</h4>
>>>>>>> 04fedc3911e1dd3321940bd01676f64ef01e52f2
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
