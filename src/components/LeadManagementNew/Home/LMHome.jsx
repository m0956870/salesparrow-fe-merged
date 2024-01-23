import "./LMHome.css"
import React, { useEffect, useState } from 'react'
import group from "../../../images/group.png";
import fetchAllEmployee from "../../../api/employeeAPI"

import { Bar, Doughnut, PolarArea } from 'react-chartjs-2';

import { AiOutlineAlignCenter } from 'react-icons/ai';
import { IoIosStarHalf } from 'react-icons/io';
import { VscTypeHierarchySub } from 'react-icons/vsc';
import { GrUnorderedList } from 'react-icons/gr';
import { HiOutlineUsers } from 'react-icons/hi';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { getHomeTabsData } from '../../../api/leadApi';
import { CircularProgress } from '@mui/material';
import { useLocation, useNavigate } from "react-router-dom";

const LMHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [lmActiveTab, setlmActiveTab] = useState("leadstage")
  const [isLoading, setisLoading] = useState(false)
  const [allEmployee, setallEmployee] = useState([]);
  const [activeTitle , setActiveTitle] = useState("false");

  const [leadStage, setleadStage] = useState()
  const [leadPotential, setleadPotential] = useState()
  const [customerGroup, setcustomerGroup] = useState()
  const [leadSourceList, setleadSourceList] = useState()

  const [filterData, setfilterData] = useState({
    type: "",
    leadSource: "",
    assignToEmp : "",
    month: ""
  })

  useEffect(() => {
    getHomeTabsDataFunc("leadstage")
    fetchAllEmployee().then(res => setallEmployee(res.data.result));
  }, [])

  async function getHomeTabsDataFunc(tabName) {
    setfilterData({ ...filterData, type: tabName })
    setisLoading(true)
    let { data } = await getHomeTabsData({ ...filterData, type: tabName })
    if (data.status) {
      if (tabName === "leadstage") {
        setleadStage(data.result)
      } else if (tabName === "leadpotential") {
        setleadPotential(data.result)
      } else if (tabName === "customergrp") {
        setcustomerGroup(data.result)
      } else if (tabName === "leadsourcelist") {
        setleadSourceList(data.result)
      }
      setisLoading(false)
    } else {
      console.log("some error!")
      setisLoading(false)
    }
  }

  // console.log(lmActiveTab)

  const lmTabClicked = (tabName) => {
    setlmActiveTab(tabName)
    getHomeTabsDataFunc(tabName)
  }

  // Filters

  const leadSourceFilterFunc = async (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value })

    setisLoading(true)
    let { data } = await getHomeTabsData({ ...filterData, [e.target.name]: e.target.value })
    if (data.status) {
      console.log(data.result)
      if (lmActiveTab === "leadstage") {
        setleadStage(data.result)
      } else if (lmActiveTab === "leadpotential") {
        setleadPotential(data.result)
      } else if (lmActiveTab === "customergrp") {
        setcustomerGroup(data.result)
      } else if (lmActiveTab === "leadsourcelist") {
        setleadSourceList(data.result)
      }
      setisLoading(false)
    } else {
      console.log("some error!")
      setisLoading(false)
    }
  }
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
          <div className="title">Home</div>
        </div>
        <div className="beat_right">
        </div>
      </div>

      {/* Lead Home Select Filters */}
      <div className="lm_home_main_container">
        <div className="lm_home_filter">
          <select className='lead_source' name="leadSource" onChange={leadSourceFilterFunc} >
            <option value="">Lead Source</option>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="IndiaMart">IndiaMart</option>
            <option value="TradeIndia">Trade India</option>
            <option value="Website">Website</option>
            <option value="Manual">Manual</option>
          </select>
          <select name="assignToEmp" onChange={leadSourceFilterFunc} >
                        <option value="">All Employees</option>
                        {allEmployee.length === 0 && <option disabled value="">No Employee Found</option>}
                        {allEmployee?.map((employee) => (
                            <option key={employee?.id} value={employee?.id} > {employee?.employeeName} </option>
                        ))}
                    </select>
          <select name="month" className='time_period' onChange={leadSourceFilterFunc}>
            <option value="">Select Time Period</option>
            <option value="1">1 Month</option>
            <option value="3">3 Month</option>
            <option value="6">6 Month</option>
            <option value="12">12 Month</option>
            <option value="0">Lifetime</option>
          </select>
        </div>

        {/* Lead Home Tabs */}
        <div className="lead_home_tabs">
          <div className="lm_tab" onClick={() => lmTabClicked("leadstage")} >
            <div className={`icon_div ${lmActiveTab === "leadstage" && "active_icon_div"}`} >
              <AiOutlineAlignCenter className='lm_tab_icon' />
            </div>
            <div className={`tab_name ${lmActiveTab === "leadstage" && "active_tab_name"}`}>Lead Stage</div>
          </div>
          <div className="lm_tab" onClick={() => lmTabClicked("leadpotential")} >
            <div className={`icon_div ${lmActiveTab === "leadpotential" && "active_icon_div"}`}>
              <IoIosStarHalf className='lm_tab_icon' />
            </div>
            <div className={`tab_name ${lmActiveTab === "leadpotential" && "active_tab_name"}`}>Lead Potential</div>
          </div>
          <div className="lm_tab" onClick={() => lmTabClicked("customergrp")} >
            <div className={`icon_div ${lmActiveTab === "customergrp" && "active_icon_div"}`}>
              <VscTypeHierarchySub className='lm_tab_icon' />
            </div>
            <div className={`tab_name ${lmActiveTab === "customergrp" && "active_tab_name"}`}>Customer Group</div>
          </div>
          <div className="lm_tab" onClick={() => lmTabClicked("leadsourcelist")} >
            <div className={`icon_div ${lmActiveTab === "leadsourcelist" && "active_icon_div"}`}>
              <GrUnorderedList className='lm_tab_icon' />
            </div>
            <div className={`tab_name ${lmActiveTab === "leadsourcelist" && "active_tab_name"}`}>Lead Source List</div>
          </div>
        </div>

        {isLoading ? (
          <div style={{ margin: "8rem auto" }} >
            <CircularProgress />
          </div>
        ) : (
          <>
            {lmActiveTab === "leadstage" && <LeadStageTab data={leadStage} />}
            {lmActiveTab === "leadpotential" && <LeadPotentialTab data={leadPotential} />}
            {lmActiveTab === "customergrp" && <LeadCustomerGroupTab data={customerGroup} />}
            {lmActiveTab === "leadsourcelist" && <LeadSourceListTab data={leadSourceList} />}
          </>
        )}
      </div>

    </div>
  )
}

function LeadStageTab({ data }) {
  // console.log("LeadStageTab data", data)

  let leadStageData = []
  let colors = ['#a143ff', '#fe7f0e', '#28a9e2', '#2ba02d', '#2846e2']

  data?.map((lead, i) => {
    let obj = {}
    obj.leadStage = Object.keys(lead)[0]
    obj.leads = Object.values(lead)[0].leads
    obj.deal = Object.values(lead)[0].deal_value
    obj.color = colors[i]
    leadStageData.push(obj)
  })
  // console.log(leadStageData)

  return (
    <div className="leadStageTab">
      <div className="chart">
        {leadStageData
          .sort((a, b) => b.leads - a.leads)
          .map((data, i) => (
            <div
              className="stackBox"
              key={i}
              style={{
                backgroundColor: data.color,
                '--h': `${data.leads * 10}px`,
              }}
            >
              {data.leadStage} : {data.leads}
            </div>
          ))}
      </div>
      <div className="lm_home_main_container">
        <h2>Lead Stage</h2>
        <div className="lm_bottom_container">
          <div className="bottom_divs bottom_divs_headings">
            <div className="ls_color"></div>
            <div className="ls_heading">Lead Stage</div>
            <div className="ls_heading">Leads</div>
            <div className="ls_heading">deals (USD)</div>
          </div>
          {leadStageData.map(ls => (
            <div className="bottom_divs">
              <div className="ls_color" style={{ backgroundColor: ls.color }} ></div>
              <div className="ls">{ls.leadStage}</div>
              <div className="ls">{ls.leads}</div>
              <div className="ls">{ls.deal}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LeadPotentialTab({ data }) {
  // console.log("LeadPotentialTab data", data)

  let leadPotData = []
  let colors = ['#2a88c0', '#e4a92f', '#24ae6d']

  Object.entries(data)?.map((lead, i) => {
    // console.log(lead)
    let obj = {}
    obj.leadPotential = lead[0]
    obj.leads = lead[1]
    obj.color = colors[i]
    leadPotData.unshift(obj)
  })
  // console.log(leadPotData.reverse())

  const chartData = {
    labels: leadPotData.map((v) => v.leadPotential),
    datasets: [
      {
        label: 'My First Dataset',
        data: leadPotData.map((v) => v.leads),
        backgroundColor: leadPotData.map((v) => v.color),
        hoverOffset: 3,
      },
    ],
  };

  const options = {
    indexAxis: "x",
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="leadPotentialTab">
      <div className="chart" style={{ width: "60%" }}>
        <Bar data={chartData} options={options} />
      </div>
      <div className="lm_home_main_container">
        <h2>Lead Potential</h2>
        <div className="lm_bottom_container" style={{ width: "60%" }}>
          <div className="bottom_divs bottom_divs_headings">
            <div className="ls_color"></div>
            <div className="ls_heading">Lead Potentials</div>
            <div className="ls_heading">Leads</div>
          </div>
          {leadPotData.map(ls => (
            <div className="bottom_divs">
              <div className="ls_color" style={{ backgroundColor: ls.color }} ></div>
              <div className="ls">{ls.leadPotential}</div>
              <div className="ls">{ls.leads}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LeadCustomerGroupTab({ data }) {
  // console.log("LeadCustomerGroupTab data", data)
  const [noLeads, setnoLeads] = useState(true)
  data = data ? data : [""];

  const leadCustGroupData1 = []
  let totalLeadCount = 0
  let colors = ['#e53b95', '#3500d5', '#2498cb', '#2ba02d', '#913ce5']

  useEffect(() => {
    data.length = data.length - 1
    let leadCount = data?.every(lead => lead.leads === 0)
    setnoLeads(leadCount)
  }, [])

  data?.map((lead, i) => {
    if (i < data.length - 1) {
      let obj = {}
      obj.customerGroup = lead.lead_grp_name
      obj.leads = lead.leads
      obj.color = colors[i % colors.length]
      leadCustGroupData1.push(obj)
    } else {
      totalLeadCount = lead.total_leads
    }
  })
  console.log(leadCustGroupData1)

  const chartData = {
    labels: leadCustGroupData1?.map((v) => v.customerGroup),
    datasets: [
      {
        label: 'My First Dataset',
        data: leadCustGroupData1?.map((v) => v.leads),
        backgroundColor: leadCustGroupData1?.map((v) => v.color),
        hoverOffset: 0,
      },
    ],
  };

  const options = {
    indexAxis: "x",
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const emptyChartData = [
    {
      customerGroup: '',
      leads: 1,
      color: "#efefef",
    },
  ];

  const chartData1 = {
    labels: emptyChartData.map((v) => v.customerGroup),
    datasets: [
      {
        label: 'My First Dataset',
        data: emptyChartData.map((v) => v.leads),
        backgroundColor: emptyChartData.map((v) => v.color),
        hoverOffset: 0,
      },
    ],
  };

  const options1 = {
    indexAxis: "x",
    responsive: true,
    plugins: {
      tooltip: {
        // displayColors: false,
        filter: function (tooltipItem) {
          return tooltipItem.lead === 100
        }
      },
      legend: {
        display: false,
      },
    },
  };


  return (
    <>
      {/* {leadCustGroupData1.length !== 0 && ( */}
        <div className="leadPotentialTab">
          <div className="chart lp_total_count">
            {noLeads ? (
              <Doughnut data={chartData1} options={options1} />
            ) : (
              <Doughnut data={chartData} options={options} />
            )}
            <div className="lp_total_div">
              <div>{totalLeadCount}</div>
              <div>Total Leads</div>
            </div>
          </div>
          <div className="lm_home_main_container">
            <h2>Customer Group</h2>
            <div className="lp_bottom_container">
              <div className="lp_bottom_divs lp_bottom_divs_headings">
                <div className="ls_color"></div>
                <div className="ls_heading">Customer Group</div>
                <div className="ls_heading">Leads</div>
              </div>
              {leadCustGroupData1?.map(ls => (
                <div className="lp_bottom_divs">
                  <div className="ls_color" style={{ backgroundColor: ls.color }} ></div>
                  <div className="ls">{ls.customerGroup}</div>
                  <div className="ls">{ls.leads}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      {/* )} */}
    </>
  );
}

function LeadSourceListTab({ data }) {
  // console.log("LeadSourceListTab data", data)

  let [leadSourceListData1, setleadSourceListData1] = useState([
    {
      leadSource: 'All Leads',
      leads: 0,
      color: '#3500d5',
      showOptions: false
    }
  ])
  let colors = ['#3500d5', '#2498cb', '#913ce5', '#55acff', '#2498cb']

  if (leadSourceListData1.length < 7) {
    Object.entries(data)?.map((lead, i) => {
      let obj = {}
      obj.leadSource = lead[0]
      obj.leads = lead[1]
      obj.color = colors[i % colors.length]
      obj.showOptions = false
      leadSourceListData1.push(obj)
    })
  }
  // console.log(leadSourceListData1)

  // const [leadSourceListData, setleadSourceListData] = useState([
  //   {
  //     leadSource: 'All Leads',
  //     leads: 32,
  //     color: '#3500d5',
  //     showOptions: false
  //   },
  //   {
  //     leadSource: 'Facebook',
  //     leads: 32,
  //     color: '#3500d5',
  //     showOptions: false
  //   },
  //   {
  //     leadSource: 'Instagram',
  //     leads: 12,
  //     color: '#2498cb',
  //     showOptions: false
  //   },
  //   {
  //     leadSource: 'IndiaMart',
  //     leads: 7,
  //     color: '#913ce5',
  //     showOptions: false
  //   },
  //   {
  //     leadSource: 'tradeindia',
  //     leads: 20,
  //     color: '#55acff',
  //     showOptions: false
  //   },
  //   {
  //     leadSource: 'Website',
  //     leads: 20,
  //     color: '#55acff',
  //     showOptions: false
  //   },
  //   {
  //     leadSource: 'Manual',
  //     leads: 20,
  //     color: '#55acff',
  //     showOptions: false
  //   },
  // ])

  const lslOptionsFunc = (ls, i) => {
    ls.showOptions = !ls.showOptions
    setleadSourceListData1([...leadSourceListData1])
  }

  const chartData = {
    labels: leadSourceListData1.map((v) => v.leadSource),
    datasets: [
      {
        label: 'My First Dataset',
        data: leadSourceListData1.map((v) => v.leads),
        backgroundColor: leadSourceListData1.map((v) => v.color),
        hoverOffset: 3,
      },
    ],
  };

  const options = {
    indexAxis: "x",
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="leadPotentialTab">
      <div className="chart" style={{ width: "50%" }}>
        <PolarArea data={chartData} options={options} />
      </div>
      <div className="lm_home_main_container">
        <h2>Lead Source List</h2>
        <div className="lm_bottom_container" >
          {leadSourceListData1.map((ls, i) => (
            <div className={`bottom_divs ${i === 0 && "first_lead_source"}`} >
              <div className="lsl_color" style={{ backgroundColor: ls.color }} ></div>
              <div className="ls">{ls.leadSource?.toUpperCase()?.split("_")?.join(" ")}</div>
              <div className="ls lsl_count_options">
                <div><HiOutlineUsers /></div>
                <div className='lsl_between_count'>{ls.leads}</div>
                <div className='lsl_options_dots'>
                  <BiDotsVerticalRounded onClick={() => lslOptionsFunc(ls, i)} />
                  {ls.showOptions && (
                    <div className='option_lists' >
                      <div className='option_lists_div'>List Info</div>
                      <div className='option_lists_div'>Delete List</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LMHome