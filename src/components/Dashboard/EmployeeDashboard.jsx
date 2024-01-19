import "./EmployeeDashboard.css";
import React, { useEffect, useState } from "react";
import group from "../../images/group.png";
import Leave from "../../images/Leave.png";
import offline from "../../images/offline.png";
import Online from "../../images/Online.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import Top5Category from "../../charts/Top5Category";
import TeamWIseMS from "../../charts/TeamWIseMS";
import MonthlyMTD1 from "../../charts/MonthlyMTD1";
import MonthlyMTD2 from "../../charts/MonthlyMTD2";
import { getEmpDashboardData } from "../../api/dashboardAPI";
import { CircularProgress } from "@mui/material";
import StateWIseMS from "../../charts/StateWIseMS";
import isAllowed from "../../utils/isAllowed";
import { toast } from "react-toastify";
import { LIVE_DASHBOARD } from "../../constants";

const EmployeeDashboard = () => {
  const [activeTab, setactiveTab] = useState("today");
  const [isLoading, setisLoading] = useState(false);
  const [todayData, settodayData] = useState()
  const [monthlyData, setmonthlyData] = useState()
  const [yearlyData, setyearlyData] = useState()

  useEffect(() => {
    getEmpDashboardDataFunc(activeTab)
  }, [activeTab])

  async function getEmpDashboardDataFunc() {
    setisLoading(true)

    if (!await isAllowed(LIVE_DASHBOARD)) {
      toast.error("Module is not purchased!")
      return setisLoading(false)
    }

    let { data } = await getEmpDashboardData(activeTab)
    if (!data.status) {
      return console.log("Some Error!")
    }
    if (activeTab === "today") settodayData(data.result)
    else if (activeTab === "mtd") setmonthlyData(data.result)
    else setyearlyData(data.result)
    setisLoading(false)
  }

  // console.log("todayData", todayData)
  // console.log("monthlyData", monthlyData)
  // console.log("yearlyData", yearlyData) 

  const getMonthlyTCPCData = (monthlyData) => {
    let { mtd_tc, lmtd_tc, mtd_pc, lmtd_pc } = monthlyData
    return { mtd_tc, lmtd_tc, mtd_pc, lmtd_pc }
  }
  const getmonthlyPSSSData = (monthlyData) => {
    let { mtd_secondary_sales, lmtd_secondary_sales, mtd_primary_sales, lmtd_primary_sales } = monthlyData
    return { mtd_secondary_sales, lmtd_secondary_sales, mtd_primary_sales, lmtd_primary_sales }
  }


  return (
    <div className="container">
      <div className="dash_heading">
        <div className="icon">
          <img src={group} alt="icon" />
        </div>
        <div className="title">Employee's Dashboard</div>
      </div>

      <div className="tab_container">
        <div
          onClick={() => setactiveTab("today")}
          className={`tabs ${activeTab === "today" ? "active" : ""}`}
        >
          Today
        </div>
        <div
          onClick={() => setactiveTab("mtd")}
          className={`tabs ${activeTab === "mtd" ? "active" : ""}`}
        >
          Monthly
        </div>
        <div
          onClick={() => setactiveTab("ytd")}
          className={`tabs ${activeTab === "ytd" ? "active" : ""}`}
        >
          Yearly
        </div>
      </div>

      {/* {activeTab === "Today" && (
      <div className="body today_body">
        <div className="rows beats"></div>
        <div className="rows attendance"></div>
        <div className="rows users"></div>
        <div className="rows visits"></div>
      </div>
    )}

    {activeTab === "Monthly" && (
      <div className="body monthly_body">
        <div className="rows first"></div>
        <div className="rows second"></div>
        <div className="rows third"></div>
        <div className="rows forth"></div>
        <div className="rows fifth"></div>
        <div className="rows sixth"></div>
      </div>
    )}
    {activeTab === "Yearly" && (
      <div className="body yearly_body">
        <div className="rows first"></div>
        <div className="rows second"></div>
        <div className="rows third"></div>
        <div className="rows forth"></div>
        <div className="rows fifth"></div>
      </div>
    )} */}

      {isLoading ? (
        <div style={{ margin: "auto", }} >
          <CircularProgress />
        </div>
      ) : (
        <>
          {activeTab === "today" && todayData && (
            <div className="body today_body">
              <div className="first">
                <div className="rows beats">
                  <div className="beat">
                    <div className="title" style={{ color: "#fe6e4c" }}>
                      {todayData.total_beat_count}
                    </div>
                    <div className="desc">Total Beats</div>
                  </div>
                  <div className="beat">
                    <div className="title" style={{ color: "#7f66ff" }}>
                      {todayData.total_retailer_count}
                    </div>
                    <div className="desc">Total Beats Counter</div>
                  </div>
                  <div className="beat">
                    <div className="title" style={{ color: "#55ef94" }}>
                      0
                    </div>
                    <div className="desc">New Beats</div>
                  </div>
                  <div className="beat">
                    <div className="title" style={{ color: "#e82b6d" }}>
                      {todayData.total_unattended_retailer}
                    </div>
                    <div className="desc">Unattentted Beats Counter</div>
                  </div>
                  <div className="beat last">
                    <div className="title" style={{ color: "#c861fa" }}>
                      {todayData.total_attended_retailer}
                    </div>
                    <div className="desc">Attentted Beats Counter</div>
                  </div>
                </div>
                <div className="rows attendance">
                  <div className="head">Live Attendance</div>
                  <div className="body">
                    <div className="section online">
                      <div className="progress">
                        <div className="count">{todayData.online_emp}</div>
                        <div className="bar">
                          <div
                            className="value"
                            style={{ backgroundColor: "#7f66ff", width: `${(todayData.online_emp / todayData.total_user) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="btn" style={{ backgroundColor: "#7f66ff" }}>
                        {/* <AiOutlineWifi /> */}
                        <img src={Online} alt="icon" />
                        Online
                      </div>
                    </div>
                    <div className="section leave">
                      <div className="progress">
                        <div className="count">{todayData.leave_emp}</div>
                        <div className="bar">
                          <div
                            className="value"
                            style={{ backgroundColor: "#55ef94", width: `${(todayData.leave_emp / todayData.total_user) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="btn" style={{ backgroundColor: "#55ef94" }}>
                        <img src={Leave} alt="icon" />
                        Leave
                      </div>
                    </div>
                    <div className="section offline">
                      <div className="progress">
                        <div className="count">{todayData.offline_emp}</div>
                        <div className="bar">
                          <div
                            className="value"
                            style={{ backgroundColor: "#e82b6d", width: `${(todayData.offline_emp / todayData.total_user) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="btn" style={{ backgroundColor: "#e82b6d" }}>
                        <img src={offline} alt="icon" />
                        Offline
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="second">
                <div className="rows_2 users">
                  <div className="head">Active User</div>
                  <div className="body">
                    <div className="item_2">
                      <div className="nummber">{todayData.active_user_15_min}</div>
                      <div className="time">15 Min.</div>
                    </div>
                    <div className="diff">
                      <div className="nummber">{todayData.active_user_1_hr}</div>
                      <div className="time">1 Hour</div>
                    </div>
                    <div className="item_2">
                      <div className="nummber">{todayData.active_user_3_hr}</div>
                      <div className="time">3 Hour</div>
                    </div>
                  </div>
                </div>
                <div className="rows_2 visits">
                  <div className="head">Live Visits - Productivity</div>
                  <div className="body">
                    <div className="item_2">
                      <div className="nummber">{todayData.total_tc}</div>
                      <div className="time">TC</div>
                    </div>
                    <div className="diff">
                      <div className="nummber">{todayData.total_pc}</div>
                      <div className="time">PC</div>
                    </div>
                    <div className="item_2">
                      <div className="nummber">{todayData.total_nc}</div>
                      <div className="time">NC</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "mtd" && monthlyData && (
            <div className="body yearly_body">
              <div className="first">
                <div className="rows beats">
                  <div className="beat">
                    <div className="title" style={{ color: "#fe6e4c" }}>
                      {monthlyData.total_beat_count}
                    </div>
                    <div className="desc">Total Beats</div>
                  </div>
                  <div className="beat">
                    <div className="title" style={{ color: "#7f66ff" }}>
                      {monthlyData.total_retailer_count}
                    </div>
                    <div className="desc">Total Beats Counter</div>
                  </div>
                  <div className="beat">
                    <div className="title" style={{ color: "#55ef94" }}>
                      0
                    </div>
                    <div className="desc">New Beats</div>
                  </div>
                  <div className="beat">
                    <div className="title" style={{ color: "#e82b6d" }}>
                      {monthlyData.total_unattended_retailer}
                    </div>
                    <div className="desc">Unattentted Beats Counter</div>
                  </div>
                  <div className="beat last">
                    <div className="title" style={{ color: "#c861fa" }}>
                      {monthlyData.total_attended_retailer}
                    </div>
                    <div className="desc">Attentted Beats Counter</div>
                  </div>
                </div>
                <div className="rows attendance">
                  <div className="head">
                    Top 5 Category of the month (Secondary Sale)
                  </div>
                  <div className="body chart_div">
                    {/* <div className="chart_detail">
                    {monthlyData?.catagory_wise_sec_sale?.map((category, i) => (
                      <div className="bar_detail">
                        <div
                          className="color"
                          style={{ background: getColorFunc(i) }}
                        ></div>
                        <h4>{category.catagory_name}:</h4>
                        <p>{category.catagory_sale_amount}</p>
                      </div>
                    ))}
                    </div> */}
                    <div id="chart">
                      <Top5Category categories={monthlyData?.catagory_wise_sec_sale} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="y_second">
                <div style={{ padding: 0 }} className="rows left">
                  <div className="head">All Employee's (Rank wise)</div>
                  <div className="all_employees_body">
                    <div className="all_employees" style={{ overflowX: "scroll" }}  >
                      <div className="employees_section">
                        {monthlyData?.all_emp_rank_wise?.map(emp => (
                          <div className="employee">
                            <div className="rank_head">
                              <span className="rank_icon">
                                <AccountCircleIcon />
                              </span>
                              <span className="rank_name">{emp.emp_name}</span>
                            </div>
                            <div className="rank_middle">
                              <div className="middle_left">
                                <div>TC:</div>
                                <div>PC:</div>
                                <div>NC:</div>
                                <div className="bottom">Totals</div>
                              </div>
                              <div className="middle_right">
                                <div className="ed_emp_rankwise_count">{emp.tc}</div>
                                <div className="ed_emp_rankwise_count">{emp.pc}</div>
                                <div className="ed_emp_rankwise_count">{emp.nc}</div>
                                <div className="bottom">₹{emp.sales}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="total_employees">
                      <div className="total_emp_count">
                        <div className="left_total">Total</div>
                        <div className="right_total">
                          <div className="column">
                            <div style={{ color: "#fe6e4c", fontWeight: 700 }}>
                              Totals
                            </div>
                            <div style={{ color: "gray" }}>₹{monthlyData?.total_sales}</div>
                          </div>
                          <div className="column">
                            <div>
                              <span style={{ fontWeight: 700 }}>TC:</span> {monthlyData?.total_tc}
                            </div>
                            <div>
                              <span style={{ fontWeight: 700 }}>PC:</span> {monthlyData?.total_pc}
                            </div>
                            <div>
                              <span style={{ fontWeight: 700 }}>NC:</span> {monthlyData?.total_new_retailers}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="y_right">
                  <div className="up">
                    <div className="head">Team wise Monthly Sale</div>
                    <div className="body chart_div_2">
                      {/* <div className="chart_detail">
                        <div className="mw_detail">₹200000</div>
                      </div> */}
                      <div id="team_bar_chart">
                        <TeamWIseMS teamMonthlySale={monthlyData?.team_monthly_sale} />
                      </div>
                    </div>
                  </div>
                  <div className="down">
                    <div className="head">State wise Monthly Sale</div>
                    <div className="body chart_div_2">
                      {/* <div className="chart_detail">
                        <div className="mw_detail">₹200000</div>
                      </div> */}
                      <div id="state_bar_chart">
                        <StateWIseMS teamMonthlySale={monthlyData?.state_wise_sale} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="m_forth">
                <div className="rows down mtd_charts">
                  <div className="head">MTD/LMTD</div>
                  <div className="body monthly_mtd">
                    <div className="mtd_chart1">
                      <MonthlyMTD1 monthlyTCPCData={getMonthlyTCPCData(monthlyData)} />
                    </div>
                    <div className="mtd_chart2">
                      <MonthlyMTD2 monthlyPSSSData={getmonthlyPSSSData(monthlyData)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "ytd" && yearlyData && (
            <div className="body yearly_body">
              <div className="first">
                <div className="rows beats">
                  <div className="beat">
                    <div className="title" style={{ color: "#fe6e4c" }}>
                      {yearlyData.total_beat_count}
                    </div>
                    <div className="desc">Total Beats</div>
                  </div>
                  <div className="beat">
                    <div className="title" style={{ color: "#7f66ff" }}>
                      {yearlyData.total_retailer_count}
                    </div>
                    <div className="desc">Total Beats Counter</div>
                  </div>
                  <div className="beat">
                    <div className="title" style={{ color: "#55ef94" }}>
                      0
                    </div>
                    <div className="desc">New Beats</div>
                  </div>
                  <div className="beat">
                    <div className="title" style={{ color: "#e82b6d" }}>
                      {yearlyData.total_unattended_retailer}
                    </div>
                    <div className="desc">Unattentted Beats Counter</div>
                  </div>
                  <div className="beat last">
                    <div className="title" style={{ color: "#c861fa" }}>
                      {yearlyData.total_attended_retailer}
                    </div>
                    <div className="desc">Attentted Beats Counter</div>
                  </div>
                </div>
                <div className="rows attendance">
                  <div className="head">
                    Top 5 Category of the month (Secondary Sale)
                  </div>
                  <div className="body chart_div">
                    {/* <div className="chart_detail">
                      <div className="bar_detail">
                        <div
                          className="color"
                          style={{ background: "#fe58d9" }}
                        ></div>
                        <h4>Total Sale:</h4>
                        <p>20,000</p>
                      </div>
                    </div> */}
                    <div id="chart">
                      <Top5Category categories={yearlyData?.catagory_wise_sec_sale} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="y_second">
                <div style={{ padding: 0 }} className="rows left">
                  <div className="head">All Employee's (Rank wise)</div>
                  <div className="all_employees_body">
                    <div className="all_employees" style={{ overflowX: "scroll" }}>
                      <div className="employees_section">
                        {yearlyData?.all_emp_rank_wise?.map(emp => (
                          <div className="employee">
                            <div className="rank_head">
                              <span className="rank_icon">
                                <AccountCircleIcon />
                              </span>
                              <span className="rank_name">{emp.emp_name}</span>
                            </div>
                            <div className="rank_middle">
                              <div className="middle_left">
                                <div>TC:</div>
                                <div>PC:</div>
                                <div>NC:</div>
                                <div className="bottom">Totals</div>
                              </div>
                              <div className="middle_right">
                                <div>{emp.tc}</div>
                                <div>{emp.pc}</div>
                                <div>{emp.nc}</div>
                                <div className="bottom">₹{emp.sales}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="total_employees">
                      <div className="total_emp_count">
                        <div className="left_total">Total</div>
                        <div className="right_total">
                          <div className="column">
                            <div style={{ color: "#fe6e4c", fontWeight: 700 }}>
                              Totals
                            </div>
                            <div style={{ color: "gray" }}>₹{yearlyData?.total_sales}</div>
                          </div>
                          <div className="column">
                            <div>
                              <span style={{ fontWeight: 700 }}>TC:</span> {yearlyData?.total_tc}
                            </div>
                            <div>
                              <span style={{ fontWeight: 700 }}>PC:</span> {yearlyData?.total_pc}
                            </div>
                            <div>
                              <span style={{ fontWeight: 700 }}>NC:</span> {yearlyData?.total_new_retailers}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="y_right">
                  <div className="up">
                    <div className="head">Team wise Monthly Sale</div>
                    <div className="body chart_div_2">
                      {/* <div className="chart_detail">
                        <div className="mw_detail">₹800000</div>
                      </div> */}
                      <div id="team_bar_chart">
                        <TeamWIseMS teamMonthlySale={yearlyData?.team_yearly_sale} />
                      </div>
                    </div>
                  </div>
                  <div className="down">
                    <div className="head">State wise Monthly Sale</div>
                    <div className="body chart_div_2">
                      {/* <div className="chart_detail">
                        <div className="mw_detail">₹200000</div>
                      </div> */}
                      <div id="state_bar_chart">
                        <StateWIseMS teamMonthlySale={yearlyData?.state_wise_sale} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EmployeeDashboard;
