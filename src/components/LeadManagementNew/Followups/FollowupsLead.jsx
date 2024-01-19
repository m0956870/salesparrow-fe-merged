import group from "../../../images/group.png";
import s from "../../LeadManagement/lead.module.css";
import "./Followups.css";
import { BsAlarm, BsApple, BsArchive, BsAward, BsPlus } from "react-icons/bs";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getLead_follwups, getLeads, saveFollowup_lead, updateFollowup_lead } from "../../../api/leadApi";
import { CircularProgress, Dialog } from "@mui/material";
import { AiOutlineShareAlt, AiOutlineTeam } from "react-icons/ai";
import { toast } from "react-toastify";



const schedule = [
  {
    name: "Today",
    label: "today",
  },
  {
    name: "Tomorrow",
    label: "tomorrow",
  },
  {
    name: "3 Days from now",
    label: "3days",
  },
  {
    name: "1 Week from now",
    label: "1week",
  },
  {
    name: "1 Month from now",
    label: "1month",
  },
  // {
  //   name: "Select custom date and time",
  //   label: "customdate",
  // },
  // {
  //   name: "never",
  //   label: "never",
  // },
];

const activityData = [
  {
    name: "Phone Call",
    label: "call",
  },
  {
    name: "Message",
    label: "message",
  },
  {
    name: "Meeting",
    label: "meeting",
  },
  {
    name: "Note",
    label: "note",
  },
];

const FollowupsLead = () => {
  const lastActivityEl = useRef(null);
  const location = useLocation();

  const [followupData, setfollowupData] = useState([]);
  const [leadList , setLeadList] = useState([])
  const [addPopup, setAddPopup] = useState(false);
  const [activity, setActivity] = useState(false);
  const [addActivity, setaddActivity] = useState(false);
  const [scheduleData , setScheduleData] = useState(false);
 const [activityName , setActivityName] = useState("")
 const [dateTime , setDateTime] = useState("")
 const [description , setDescription] = useState("")
 const [lastDateObject, setLastDateObject] = useState(null);
 const [nextDateObject, setNextDateObject] = useState(null);
 const [dateTimePopup , setDateTimePopup] = useState(false);

 const [addLoading , setAddLoading] = useState(false)
 const [updateLoading , setUpdateLoading] = useState(false)
 const [loadingElementId , setLoadingElementId] = useState(null)
 const [isLoading , setisLoading] = useState(false)

 let todayDate = new Date();
  useEffect(() => {
    if (lastActivityEl.current)
      lastActivityEl.current.scrollIntoView({
        block: "end",
        behavior: "smooth",
      });
  }, []);

  const getLeadapiFollowup = async () => {
    let data = {
      skip: 0,
      limit: 20,
      leadId: location.state.id,
    };

    const res = await getLead_follwups(data);
    try {
      if (res.data.status) {
        setfollowupData(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleAddActivity = () => {
    setActivity(true);
  };

  const handleUpdateActivity=()=>{
    setAddPopup(true);
  }

  
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

  const handleScheduleUpdate = (name , id) => {
     setLoadingElementId(id);
    switch (name) {
      case "today":
        var d = new Date(todayDate.setDate(todayDate.getDate()));
        setScheduleData(formatDate(d.toLocaleString()));

        break;
      case "tomorrow":
        var d = new Date(todayDate.setDate(todayDate.getDate() + 1));
        setScheduleData(formatDate(d.toLocaleString()));

        break;
      case "3days":
        var d = new Date(todayDate.setDate(todayDate.getDate() + 3));
        setScheduleData(formatDate(d.toLocaleString()));

        break;
      case "1week":
        var d = new Date(todayDate.setDate(todayDate.getDate() + 7));
        setScheduleData(formatDate(d.toLocaleString()));
        break;

      case "1month":
        var d = new Date(todayDate.setDate(todayDate.getDate() + 30));
        setScheduleData(formatDate(d.toLocaleString()));
        break;

      case "customdate":
        setScheduleData("customdate");
        break;

      case "never":
        setScheduleData("never");
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if(scheduleData==="customdate"){
       setDateTimePopup(true)
    }else{
      updateActivity(scheduleData);
    }
   
  }, [scheduleData]);

  let dateArray = followupData?.map((elem)=> {return elem.date})


useEffect(() => {
const currentDate = new Date();
let formatedDate = formatDate(currentDate)
  const parseDate = dateString => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format: ' + dateString);
    }
    return date;
  };

  try {
    const lastDate = dateArray.filter(date => date <= formatedDate);
    const nextDate = dateArray.filter(date => date > formatedDate);
    let maxDate = new Date(Math.max(...lastDate.map(dateString => new Date(dateString))))
    let minDate = new Date(Math.min(...nextDate.map(dateString => new Date(dateString))))
    setLastDateObject( maxDate.toISOString().split('T')[0]);
    setNextDateObject( minDate.toISOString().split('T')[0]);
  } catch (error) {
    console.error('Error:', error.message);
  }
}, [followupData]);

  const matchingElement = followupData?.find(elem => {
    const formattedElemDate = formatDate(elem?.date);
    const formattedNextDate = formatDate(nextDateObject);
    return formattedElemDate == formattedNextDate;
  });

  const updateActivity = async() => {
    console.log("123first")
    let data = {
        date:scheduleData,
        id: matchingElement?._id
    }
    let res = await updateFollowup_lead(data)
    try {
        if(res.data.status){
            toast.success("Success")
            setAddPopup(false)
            getLeadapiFollowup();
            setLoadingElementId(null);
        }
    } catch (error) {
        console.log(error)
        setLoadingElementId(null);
    }finally{
      setDateTimePopup(false)
    }
  };

  const handleActivityAdd = (name) => {
    switch (name) {
      case "call":
        setActivityName("Phone");

        break;
      case "message":
        setActivityName("Message");

        break;
      case "meeting":
        setActivityName("Meeting");

        break;
      case "note":
        setActivityName("Note");
        break;

      default:
        break;
    }
    setActivity(false);
    setaddActivity(true);
  };

  const handleSaveActivity = async() => {
    setAddLoading(true)
    let data = {
        type: activityName,
        description: description, //optional
        date: dateTime.toString().split("T").join(" "),
        leadId: location.state.id
    }
    let res = await saveFollowup_lead(data)
    try {
        if(res.data.status){
            toast.success("Success")
            setaddActivity(false)
            getLeadapiFollowup();
            setAddLoading(false)
        }
    } catch (error) {
        console.log(error)
        setAddLoading(false)
    }
  };

  async function getLeadList() {
    setisLoading(true)
    const data = {
      lead_id: location.state.id,
      is_customer: '0',
      search: '',
      state:  '',
      leadSource: '',
      employee_id: '',
      page:  '1',
      limit: '5',
    };

    try {
      const res = await getLeads(data);
      setLeadList(res.data.results);
      setisLoading(false)
    } catch (error) {
    
      toast.error(error.message);
      console.log('get leads catch error', error.message);
      setisLoading(false)
    }
  }

  useEffect(() => {
    getLeadapiFollowup();
    getLeadList()
  }, []);

  const leadInfo = [
    {
      label:"Lead Name" ,
      value: leadList[0]?.leadName,
      backgroundColor:
        " linear-gradient(50deg, rgba(58,175,127,1) 62%, #90f6b7 100%)",
    },
    {
      label: "Display Name",
      value: leadList[0]?.displayName,
      backgroundColor: "linear-gradient(50deg, #327e95 62%, #84d6cd 100%)",
    },
    {
      label: "Mobile Number",
      value: leadList[0]?.mobileNumber,
      backgroundColor: "linear-gradient(50deg, #e8858f 62%, #f6b897 100%)",
    },
    {
      label: "Email ID",
      value: leadList[0]?.email,
      backgroundColor: "linear-gradient(50deg, #f28447 62%, #f6b897 100%)",
    },
    {
      label: "Pincode",
      value: leadList[0]?.pincode,
      backgroundColor: "linear-gradient(50deg, #388722 62%, #091d02 100%)",
    },
    {
      label: "State",
      value: leadList[0]?.sate_name,
      backgroundColor: "linear-gradient(50deg, #f42951 62%, #091d02 100%)",
    },
    {
      label: "City",
      value: leadList[0]?.city_name,
      backgroundColor: "linear-gradient(50deg, #e99fb9 62%, #fba87b 100%)",
    },
    {
      label: "Lead Source",
      value: leadList[0]?.leadSource,
      backgroundColor: "linear-gradient(50deg, #af28dc 62%, #a913da 100%)",
    },
    {
      label: "Add by Admin/Employee",
      value: leadList[0]?.emp_name,
      backgroundColor: "linear-gradient(50deg, #3e87c6 62%, #3e85c6 100%)",
    },
    {
      label: "Note",
      value: leadList[0]?.note,
      backgroundColor: "linear-gradient(50deg, #723973 62%, #fba87b 100%)",
    },
    {
      label: "Assign to employee",
      value: leadList[0]?.emp_name,
      backgroundColor: "linear-gradient(50deg, #23bae9 62%, #23bae2 100%)",
    },
    {
      label: "Group Name",
      value: leadList[0]?.email,
      backgroundColor: "linear-gradient(50deg, #904874 62%, #fba87b 100%)",
    },
  ];

  console.log(followupData , "follow>>>>>>>>>>>>>>>>>>>>>")

  return (
    <div className="container">
      <div className="beat_heading">
        <div className="beat_left">
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Follow Ups</div>
        </div>
      </div>
      {isLoading?
       <div style={{ margin: "auto", }} >
                    <CircularProgress />
                </div>
                :
      <>
      <div className="followups_lead_abc">
        {leadInfo.map((data, i) => (
          <div
            className="followups_lead_xyz"
            style={{ background: `${data.backgroundColor}` }}
            key={i}
          >
            <label htmlFor="name">{data.label}</label>
            <div>{data.value}</div>
          </div>
        ))}
      </div>
      <div className="followup_details_box">
          <div style={{textAlign:"end" }} onClick={handleUpdateActivity}>
            <span style={{ color:"#28A9E2",fontWeight:"700" }}>Update Activity</span>
          </div>
        <h3 style={{ textAlign: "center" }}>Follow Up Details</h3>
        <div className="followups_123">
          <div className="followups_456" style={{ backgroundColor: "#522da9" }}>
            <label>Last Follow Up</label>
            <div>{lastDateObject ? lastDateObject: 'N/A'}</div>
          </div>
          <div className="followups_456" style={{ backgroundColor: "#ef0c76" }}>
            <label>Next Follow Up</label>
            <div>{nextDateObject ? nextDateObject: 'N/A'}</div>
          </div>
          <div className="followups_456" style={{ backgroundColor: "#63d19a" }}>
            <label>Status</label>
            <div>Overdue/Today/Upcoming</div>
          </div>
        </div>
      </div>
      <div className="followup_details_box">
        {/* <h4 style={{textAlign:"center"}}>Follow Up Details</h4> */}
        <div className="followups_123">
          <div className="followups_456" style={{ backgroundColor: "#419b28" }}>
            <div>Lead Potential</div>
            <h2>High</h2>
          </div>
          <div className="followups_456" style={{ backgroundColor: "#6b7dcb" }}>
            <div>Lead Storage</div>
            <h2>Open</h2>
          </div>
          <div className="followups_456" style={{ backgroundColor: "#ff6705" }}>
            <div>Deal Value</div>
            <h2>1500</h2>
          </div>
        </div>
      </div>

      {/* timeline */}
      <section className={s.timelineSec}>
        <div className={s.tl_head}>
          <div className={s.tl_heading}>Timeline</div>
          <button className={s.addActBtn} onClick={handleAddActivity}>
            <BsPlus className={s.addIcon} />{" "}
            <span className={s.btnlabel}>Add Activity</span>
          </button>
        </div>
        <div className={s.tl_container}>
          {/* activity */}
          {followupData?.map(function (act, i) {
            const lastI = followupData.length - 1;
            return (
              <div
                className={s.activity}
                ref={i === lastI ? lastActivityEl : null}
              >
                <div className={s.actDT}>
                  <div className={s.date}>{act.date}</div>
                  <div className={s.time}>{act.time}</div>
                </div>
                <div className={s.iconBox}>
                  {/* <div className={s.actIcon}>{act.icn}</div> */}
                </div>
                <div className={s.actContent}>
                  <h4>{act.type}</h4>
                  <p>{act.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <Dialog
        open={addPopup}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
        fullWidth={true}
        onClose={() => setAddPopup(false)}
      >
        <div className="ll_sl_popup">
          <div className="ll_sl_popup_heading">Schedule follow up for</div>
          <div className="ll_sl_options_tabs">
            {schedule.map((elem, id) => {
              return (
                <div
                  className="ll_sl_tabs"
                   onClick={() => handleScheduleUpdate(elem.label , id)}
                >
                  <div className="followup_schedule">{updateLoading && loadingElementId === id ? (
                  <CircularProgress style={{ color: "#fff" }} size={26} />
                ) : (
                  elem.name
                )}</div>
                </div>
              );
            })}
            <div
                  className="ll_sl_tabs"
                   onClick={() => handleScheduleUpdate("customdate")}
                >
                  <div className="followup_schedule">Custome date</div>
                </div>
                {/* <div
                  className="ll_sl_tabs"
                   onClick={() => handleScheduleUpdate("never")}
                >
                  <div className="followup_schedule">Never</div>
                </div> */}
            {dateTimePopup?
            <div className="ll_sl_tabs">
              <input className="followup_schedule"
              type="date" 
            onChange={(e)=>setScheduleData(e.target.value.toString().split("T").join(" "))}
            />
            </div>
            
            :""}
          </div>
          {dateTimePopup?<div className="followup_activity_btn">
            <button onClick={updateActivity}>
            {updateLoading ? (
            <CircularProgress style={{ color: "#fff" }} size={26} />
          ) : (
            "Save"
          )}</button>
          </div>:""}
        </div>
      </Dialog>

      <Dialog
        open={activity}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
        fullWidth={true}
        onClose={() => setActivity(false)}
      >
        <div className="ll_sl_popup">
          <div className="ll_sl_popup_heading">Add Activity</div>
          <div
            className="ll_sl_options_tabs"
            style={{ padding: "2rem 3rem 2rem 3rem" }}
          >
            {activityData.map((elem, id) => {
              return (
                <div className="ll_sl_tabs"
                onClick={() => handleActivityAdd(elem.label)}
                >
                  <div className="tab_icon">
                    <AiOutlineTeam className="icon" />
                  </div>
                  <div className="tab_name">{elem.name}</div>
                </div>
              );
            })}
          </div>
          {/* <div className="followup_activity_btn">
            <button onClick={handleSaveActivity}>Save</button>
          </div> */}
        </div>
      </Dialog>
      <Dialog
        open={addActivity}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
        fullWidth={true}
        onClose={() => setaddActivity(false)}
      >
        <div className="ll_sl_popup">
          <div className="ll_sl_popup_heading">
            Activity with Bhavesh Khajuriya
          </div>
          <div className="" style={{ padding: "2rem 3rem 0rem 3rem" }}>
            <div className="followups_box_shadow">
              <div>{activityName}</div>
            </div>
            <div className="followups_box_shadow">
              <textarea
                style={{ backgroundColor: "#ffff" }}
                placeholder="Add optional details here"
                rows={2}
                cols={12}
                name="description"
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
              />
            </div>
            <div
              className="followups_box_shadow"
              style={{ backgroundColor: "#28A9E2", color: "#fff" }}
            >
              <div>
             <> 
             <input className="folowup_datetime_field" type="datetime-local" value={dateTime} onChange={(e)=>setDateTime(e.target.value)}/>
             </>
              </div>
            </div>
          </div>
          <div className="followup_activity_btn">
            <button onClick={handleSaveActivity}>
            {addLoading ? (
            <CircularProgress style={{ color: "#fff" }} size={26} />
          ) : (
            "Add Activity"
          )}</button>
          </div>
        </div>
      </Dialog></>}
    </div>
  );
};

export default FollowupsLead;
