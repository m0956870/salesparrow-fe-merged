import React, { useEffect, useRef, useState } from 'react'
import group from "../../images/group.png";
import getStateFunc from '../../api/locationAPI';
import fetchAllEmployee from '../../api/employeeAPI';

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";
import { getDayStatus } from '../../api/tracking';
import { toast } from 'react-toastify';

const DaySummary = () => {

  const [allState, setallState] = useState([]);
  const [allEmployee, setallEmployee] = useState([]);

  const [selectedStatus, setselectedStatus] = useState()
  const [daySummeryData, setdaySummeryData] = useState()
  const [distributorVisitData, setDistributorVisitData] = useState()

  const [timelineArr, settimelineArr] = useState()

  const [filterData, setfilterData] = useState({
    emp_id: "",
  })

  useEffect(() => {
    getStateFunc().then((res) => setallState(res.data.result));
    fetchAllEmployee().then((res) => setallEmployee(res.data.result));
  }, []);

  useEffect(() => {
    if (daySummeryData) {
      console.log("daySummeryData", daySummeryData)
      let timelineData = [];
      let tempObj = {}

      if (daySummeryData?.started_time !== "NA") {
        tempObj.type = "attendance_start"
        tempObj.beat_name = daySummeryData?.beat_name
        tempObj.started_time = daySummeryData?.started_time
        timelineData.push(tempObj)
        tempObj = {}
      }

      // market_visit_data
      if (daySummeryData?.market_visit_data?.data !== "NA") {
        daySummeryData?.market_visit_data?.data?.map(data => {
          tempObj.type = "market_visit_data"
          tempObj.retailer_name = data?.retailer_name
          tempObj.order_status = data?.order_status
          tempObj.total_amount = data?.total_amount
          tempObj.visit_time = data?.visit_time
          timelineData.push(tempObj)
          tempObj = {}
        })
      }

      // sales_report_data
      if (daySummeryData?.sales_report_data?.data !== "NA") {
        let { sales_report_time, pc, tc, sales_amount } = daySummeryData?.sales_report_data?.data
        tempObj.type = "sales_report_data"
        tempObj.name = "Sales Report Submission"
        tempObj.time = sales_report_time
        tempObj.tc = tc
        tempObj.pc = pc
        tempObj.sales_amount = sales_amount
        timelineData.push(tempObj)
        tempObj = {}
      }

      // expense_report_data
      if (daySummeryData?.expense_report_data?.data !== "NA") {
        let { submit_time, travelled_distance, ta_amount, da_amount, misc_amount } = daySummeryData?.expense_report_data?.data
        tempObj.type = "expense_report_data"
        tempObj.name = "Expense Report Submission"
        tempObj.submit_time = submit_time
        tempObj.travelled_distance = travelled_distance
        tempObj.ta_amount = ta_amount
        tempObj.da_amount = da_amount
        tempObj.misc_amount = misc_amount
        timelineData.push(tempObj)
        tempObj = {}
      }

      settimelineArr(timelineData)
    }
  }, [daySummeryData])

  // console.log("timelineArr", timelineArr)
  // console.log("daySummeryData", daySummeryData)
  // console.log("distributorVisitData", distributorVisitData)

  const stateHandleInput = async (e) => {
    fetchAllEmployee({ state: e.target.value }).then((res) => {
      setallEmployee(res.data.result);
    });
  };

  const empHandleInput = (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value });
  };

  const getStausFunc = async (type) => {
    if (filterData.emp_id === "") return toast.error("Select Employee First!")

    setselectedStatus(type)
    let { data } = await getDayStatus({ emp_id: filterData.emp_id, str: type })
    if (data.status) {
      if (type === "Complete") {
        setdaySummeryData(data.result)
      }
      else setDistributorVisitData(data.result)
    } else {
      console.log("Some Error!")
    }
  }


  // Table styling
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "var(--main-color)",
      color: theme.palette.common.white,
      fontWeight: "bold",
      borderRight: "1px solid #fff",
      overflow: "hidden",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      border: "none",
      borderLeft: "2px solid #00000011",
      '&:last-child': {
        borderRight: "2px solid #00000011",
      },
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    borderBottom: "2px solid #00000011",
  }));

  // const lastActivityEl = useRef(null);
  // useEffect(() => {
  //   if (lastActivityEl.current) lastActivityEl.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
  // }, []);

  // const timelineArr = [
  //   {
  //     dt: 'Dec 2, 2021',
  //     tme: '01:49 PM',
  //     icn: "",
  //     hdng: 'lorem ipsum',
  //     dsc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus, iste voluptate. Earum expedita id numquam, deserunt vero inventore molestiae nulla.',
  //   },
  //   {
  //     dt: 'Dec 2, 2021',
  //     tme: '01:49 PM',
  //     icn: "",
  //     hdng: 'lorem ipsum',
  //     dsc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus, iste voluptate. Earum expedita id numquam, deserunt vero inventore molestiae nulla.',
  //   },
  //   {
  //     dt: 'Dec 2, 2021',
  //     tme: '01:49 PM',
  //     icn: "",
  //     hdng: 'lorem ipsum',
  //     dsc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus, iste voluptate. Earum expedita id numquam, deserunt vero inventore molestiae nulla.',
  //   },
  //   {
  //     dt: 'Dec 2, 2021',
  //     tme: '01:49 PM',
  //     icn: "",
  //     hdng: 'lorem ipsum last',
  //     dsc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus, iste voluptate. Earum expedita id numquam, deserunt vero inventore molestiae nulla.',
  //   },
  // ];

  const allData = [
    {
      name: "Lorem Ipsum",
      assigned_state: "Haryana",
      mobile_no: "9999999999",
      gps: "ON",
      internet: "Online",
      battery: "30%",
      mobile: "Last ON: Unknown",
      updated_at: "12/10/2021-02:02:36",
    },
    {
      name: "Lorem Ipsum",
      assigned_state: "Haryana",
      mobile_no: "9999999999",
      gps: "ON",
      internet: "Online",
      battery: "30%",
      mobile: "Last ON: Unknown",
      updated_at: "12/10/2021-02:02:36",
    },
    {
      name: "Lorem Ipsum",
      assigned_state: "Haryana",
      mobile_no: "9999999999",
      gps: "OFf",
      internet: "Offline",
      battery: "30%",
      mobile: "Last ON: Unknown",
      updated_at: "12/10/2021-02:02:36",
    },
    {
      name: "Lorem Ipsum",
      assigned_state: "Haryana",
      mobile_no: "9999999999",
      gps: "ON",
      internet: "Online",
      battery: "30%",
      mobile: "Last ON: Unknown",
      updated_at: "12/10/2021-02:02:36",
    },
    {
      name: "Lorem Ipsum",
      assigned_state: "Haryana",
      mobile_no: "9999999999",
      gps: "OFF",
      internet: "Online",
      battery: "30%",
      mobile: "Last ON: Unknown",
      updated_at: "12/10/2021-02:02:36",
    },
    {
      name: "Lorem Ipsum",
      assigned_state: "Haryana",
      mobile_no: "9999999999",
      gps: "ON",
      internet: "Offline",
      battery: "30%",
      mobile: "Last ON: Unknown",
      updated_at: "12/10/2021-02:02:36",
    },
    {
      name: "Lorem Ipsum",
      assigned_state: "Haryana",
      mobile_no: "9999999999",
      gps: "ON",
      internet: "Online",
      battery: "30%",
      mobile: "Last ON: Unknown",
      updated_at: "12/10/2021-02:02:36",
    },
    {
      name: "Lorem Ipsum",
      assigned_state: "Haryana",
      mobile_no: "9999999999",
      gps: "OFF",
      internet: "Online",
      battery: "30%",
      mobile: "Last ON: Unknown",
      updated_at: "12/10/2021-02:02:36",
    },
    {
      name: "Lorem Ipsum",
      assigned_state: "Haryana",
      mobile_no: "9999999999",
      gps: "ON",
      internet: "Online",
      battery: "30%",
      mobile: "Last ON: Unknown",
      updated_at: "12/10/2021-02:02:36",
    },
    {
      name: "Lorem Ipsum",
      assigned_state: "Haryana",
      mobile_no: "9999999999",
      gps: "ON",
      internet: "Offline",
      battery: "30%",
      mobile: "Last ON: Unknown",
      updated_at: "12/10/2021-02:02:36",
    },
    {
      name: "Lorem Ipsum",
      assigned_state: "Haryana",
      mobile_no: "9999999999",
      gps: "ON",
      internet: "Offline",
      battery: "30%",
      mobile: "Last ON: Unknown",
      updated_at: "12/10/2021-02:02:36",
    },
    {
      name: "Lorem Ipsum",
      assigned_state: "Haryana",
      mobile_no: "9999999999",
      gps: "ON",
      internet: "Online",
      battery: "30%",
      mobile: "Last ON: Unknown",
      updated_at: "12/10/2021-02:02:36",
    },
    {
      name: "Lorem Ipsum",
      assigned_state: "Haryana",
      mobile_no: "9999999999",
      gps: "ON",
      internet: "Online",
      battery: "30%",
      mobile: "Last ON: Unknown",
      updated_at: "12/10/2021-02:02:36",
    },
  ];

  return (
    <div className="container">
      <div className="beat_heading">
        <div className="beat_left" >
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Day Status of a Employee</div>
        </div>
      </div>

      <div className="tracking_tabs">
        <div className="tarcking_tab_left">
          <select onChange={stateHandleInput}>
            <option value="">All States</option>
            {allState?.map((state) => (
              <option key={state.id} value={state.id}>{state.name}</option>
            ))}
          </select>
          <select name="emp_id" onChange={empHandleInput} >
            <option value="">All Employees</option>
            {allEmployee.length === 0 && <option disabled value="">No Employee Found</option>}
            {allEmployee?.map((employee) => (
              <option key={employee.id} value={employee.id}>{employee.employeeName}</option>
            ))}
          </select>
          <div className="view_btn" onClick={() => getStausFunc("Complete")} style={{ whiteSpace: "nowrap", fontWeight: 600 }}>
            COMPLETE DAY SUMMARY
          </div>
          {/* <div className="view_btn" onClick={() => getStausFunc("Distributor")} style={{ whiteSpace: "nowrap", fontWeight: 600 }}>
            DISTRIBUTOR VISIT DETAILES
          </div> */}
        </div>
      </div>

      {selectedStatus === "Complete" ? (
        <div className='ds_daysummery_section' >
          <h3>Day Summery</h3>
          <div className="tracking_tabs">
            <section className="timelineSec">
              {/* <div className="tl_head">
                <div className="tl_heading">Timeline</div>
                <button className="addActBtn">
                  <BsPlus className="addIcon" /> <span className="btnlabel">Add Activity</span>
                </button>
              </div> */}
              <div className="tl_container">
                {/* {timelineArr?.map(function (act, i) {
                  const lastI = timelineArr.length - 1;
                  return (
                    // <div className="activity" ref={i === lastI ? lastActivityEl : null}>
                    <div className="activity">
                      <div className="actDT">
                        <div className="date">{act.tme}</div>
                      </div>
                      <div className="iconBox">
                        <div className="actIcon">{act.icn}</div>
                      </div>
                      <div className="actContent">
                        <h4>{act.hdng}</h4>
                        <p>{act.dsc}</p>
                      </div>
                    </div>
                  );
                })} */}
                {timelineArr?.length !== 0 ? timelineArr?.map(function (data) {
                  const lastI = timelineArr.length - 1;
                  return (
                    // <div className="activity" ref={i === lastI ? lastActivityEl : null}>
                    <>
                      {data.type === "attendance_start" && (
                        <div className="activity" onClick={() => console.log(data)} >
                          <div className="actDT">
                            <div className="date">{new Date(data.started_time).toLocaleTimeString().slice(0, 5) + new Date(data.started_time).toLocaleTimeString().slice(8, 11)}</div>
                          </div>
                          <div className="iconBox">
                            <div className="actIcon">{data.icn}</div>
                          </div>
                          <div className="actContent">
                            <div><span style={{ fontWeight: "600" }} >Attendance Start:</span> Selected Route</div>
                            <div className="ds_detail_btn">{data.beat_name}</div>
                          </div>
                        </div>
                      )}
                      {data.type === "market_visit_data" && (
                        <div className="activity" onClick={() => console.log(data)} >
                          <div className="actDT">
                            <div className="date">{new Date(data.visit_time).toLocaleTimeString().slice(0, 5) + new Date(data.visit_time).toLocaleTimeString().slice(8, 11)}</div>
                          </div>
                          <div className="iconBox">
                            <div className="actIcon">{data.icn}</div>
                          </div>
                          <div className="actContent" style={{ backgroundColor: data.order_status === "Non-productive" && "#ff5151", color: data.order_status === "Non-productive" && "#fff" }}>
                            <div className="ds_mv_retailer_name">{data.retailer_name}</div>
                            <div className="ds_mv_order">
                              <div className="ds_detail_btn" style={{ backgroundColor: "var(--main-color)" }}>{data.order_status}</div>
                            </div>
                            <div className="ds_mv_amount">{data.order_status !== "Non-productive" && `₹${data.total_amount}`}</div>
                          </div>
                        </div>
                      )}
                      {data.type === "sales_report_data" && (
                        <div className="activity" onClick={() => console.log(data)} >
                          <div className="actDT">
                            <div className="date">{new Date(data.time).toLocaleTimeString().slice(0, 5) + new Date(data.time).toLocaleTimeString().slice(8, 11)}</div>
                          </div>
                          <div className="iconBox">
                            <div className="actIcon">{data.icn}</div>
                          </div>
                          <div className="actContent">
                            <div className="ds_mv_retailer_name"><span style={{ fontWeight: "600" }} >{data.name}</span></div>
                            <div className="ds_mv_order">
                              <div className="ds_mv_tc" >TC: <div className="ds_detail_btn" style={{ backgroundColor: "var(--main-color)" }}>{data.tc}</div></div>
                              <div className="ds_mv_pc" >PC: <div className="ds_detail_btn" style={{ backgroundColor: "var(--main-color)" }}>{data.pc}</div></div>
                              {/* <div className="ds_detail_btn" style={{ backgroundColor: "var(--main-color)" }}>{data.order_status}</div> */}
                            </div>
                            <div className="ds_mv_amount">₹{data.sales_amount}</div>
                          </div>
                        </div>
                      )}
                      {data.type === "expense_report_data" && (
                        <div className="activity" onClick={() => console.log(data)} >
                          <div className="actDT">
                            <div className="date">{new Date(data.submit_time).toLocaleTimeString().slice(0, 5) + new Date(data.submit_time).toLocaleTimeString().slice(8, 11)}</div>
                          </div>
                          <div className="iconBox">
                            <div className="actIcon">{data.icn}</div>
                          </div>
                          <div className="actContent">
                            <div className="ds_mv_retailer_name"><span style={{ fontWeight: "600" }} >{data.name}</span></div>
                            <div className="ds_mv_order" style={{ flex: 1.4 }}>
                              <div className="ds_mv_tc" ><div className="ds_detail_btn" style={{ backgroundColor: "#ff5151", marginLeft: 0 }}>{data.travelled_distance}km</div></div>
                              <div className="ds_mv_pc" ><div className="ds_detail_btn" style={{ backgroundColor: "#ffce51", marginLeft: 0 }}>TA: ₹{Math.abs(data.ta_amount)}</div></div>
                            </div>
                            <div className="ds_mv_order" style={{ flex: 1.4, borderRight: "none" }}>
                              <div className="ds_mv_tc" ><div className="ds_detail_btn" style={{ backgroundColor: "#51ff96", marginLeft: 0 }}>DA: ₹{Math.abs(data.da_amount)}</div></div>
                              <div className="ds_mv_pc" ><div className="ds_detail_btn" style={{ backgroundColor: "#516dff", marginLeft: 0 }}>Misc: ₹{Math.abs(data.misc_amount)}</div></div>
                            </div>
                            {/* <div className="ds_mv_amount">
                              <div className="ds_mv_tc" ><div className="ds_detail_btn" style={{ backgroundColor: "var(--main-color)", marginLeft: 0 }}>{data.tc}</div></div>
                              <div className="ds_mv_pc" ><div className="ds_detail_btn" style={{ backgroundColor: "var(--main-color)", marginLeft: 0 }}>{data.pc}</div></div>
                            </div> */}
                          </div>
                        </div>
                      )}
                    </>
                  );
                }) : (
                  <div className="no_data">No data</div>
                )}
              </div >
            </section>
          </div>
          <h3>Day Starts</h3>

          <div id="ds_summery_cards">
            <div className="ds_card">
              <div className="ds_card_heading" style={{ backgroundColor: "#ff5151" }}>
                <h4>Total Distaince (KMS)</h4>
              </div>
              <div className="ds_card_body">
                <div className="info_heading">Device KM.</div>
                <div className="info_count">{daySummeryData?.day_starts?.total_distance?.device_kms}</div>
              </div>
              <div className="ds_card_body">
                <div className="info_heading">Submitted KM.</div>
                <div className="info_count">{daySummeryData?.day_starts?.total_distance?.submitted_kms}</div>
              </div>
            </div>
            <div className="ds_card">
              <div className="ds_card_heading" style={{ backgroundColor: "#ffce51" }}>
                <h4>Primary Performance</h4>
              </div>
              <div className="ds_card_body">
                <div className="info_heading">Order Count</div>
                <div className="info_count">{daySummeryData?.day_starts?.primary_performance?.order_count}</div>
              </div>
              <div className="ds_card_body">
                <div className="info_heading">Order Amount</div>
                <div className="info_count">₹{daySummeryData?.day_starts?.primary_performance?.order_amount}</div>
              </div>
            </div>
            <div className="ds_card">
              <div className="ds_card_heading" style={{ backgroundColor: "#516dff" }}>
                <h4>Sales Performance</h4>
              </div>
              <div className="ds_card_body">
                <div className="sp_info_heading"></div>
                <div className="sp_info_count">TC</div>
                <div className="sp_info_count">PC</div>
                <div className="sp_info_count">NC</div>
              </div>
              <div className="ds_card_body">
                <div className="sp_info_heading">Market visits.</div>
                <div className="sp_info_count">{daySummeryData?.day_starts?.sales_performance?.market_visits?.tc}</div>
                <div className="sp_info_count">{daySummeryData?.day_starts?.sales_performance?.market_visits?.pc}</div>
                <div className="sp_info_count">{daySummeryData?.day_starts?.sales_performance?.market_visits?.nc ?? 0}</div>
              </div>
              <div className="ds_card_body">
                <div className="sp_info_heading">Submitted (Reports).</div>
                <div className="sp_info_count">{daySummeryData?.day_starts?.sales_performance?.submitted_reports?.tc}</div>
                <div className="sp_info_count">{daySummeryData?.day_starts?.sales_performance?.submitted_reports?.pc}</div>
                <div className="sp_info_count">{daySummeryData?.day_starts?.sales_performance?.submitted_reports?.nc ?? 0}</div>
              </div>
            </div>
            <div className="ds_card">
              <div className="ds_card_heading" style={{ backgroundColor: "#01de59" }}>
                <h4>Sales Amount</h4>
              </div>
              <div className="ds_card_body">
                <div className="info_heading">Market visits</div>
                <div className="info_count">₹{daySummeryData?.day_starts?.sales_amount?.market_visits}</div>
              </div>
              <div className="ds_card_body">
                <div className="info_heading">Submitted (Reports)</div>
                <div className="info_count">₹{daySummeryData?.day_starts?.sales_amount?.submitted_reports}</div>
              </div>
            </div>
          </div>
        </div>
      ) : selectedStatus === "Distributor" ? (
        <div>
          <div className="ds_dis_visit_section">
            <h3 className='dis_section_heading'>Distributor Visit Details</h3>
            <div className="tracking_tabs" style={{ width: "100%", padding: 0, boxShadow: "none" }}>
              <div className="tarcking_tab_left">
                <select onChange={stateHandleInput}>
                  <option value="">All States</option>
                  {allState?.map((state) => (
                    <option key={state.id} value={state.id}>{state.name}</option>
                  ))}
                </select>
                <div className="view_btn_2">View</div>
              </div>
              <div className="tarcking_tab_right"></div>
            </div>
            <div className="ds_details_section">
              <div className="ds_detail_container">
                <div className="ds_detail_div">
                  <div className="title">Employee Name:</div>
                  <div className="info">Naveen</div>
                </div>
                <div className="ds_detail_div">
                  <div className="title">Date:</div>
                  <div className="info">Naveen</div>
                </div>
                <div className="ds_detail_div">
                  <div className="title">Planned Beats:</div>
                  <div className="info">Naveen</div>
                </div>
                <div className="ds_detail_div">
                  <div className="title">Covered Beats:</div>
                  <div className="info">Naveen</div>
                </div>
                <div className="ds_detail_div">
                  <div className="title">Day Start:</div>
                  <div className="info">Naveen</div>
                </div>
                <div className="ds_detail_div">
                  <div className="title">Day End:</div>
                  <div className="info">Naveen</div>
                </div>
              </div>
              <div className="ds_detail_container">
                <div className="ds_detail_div">
                  <div className="title">Distributor Name:</div>
                  <div className="info">Naveen</div>
                </div>
                <div className="ds_detail_div">
                  <div className="title">TC:</div>
                  <div className="info">Naveen</div>
                </div>
                <div className="ds_detail_div">
                  <div className="title">PC:</div>
                  <div className="info">Naveen</div>
                </div>
                <div className="ds_detail_div">
                  <div className="title">NC:</div>
                  <div className="info">Naveen</div>
                </div>
                <div className="ds_detail_div">
                  <div className="title">Amount:</div>
                  <div className="info">Naveen</div>
                </div>
              </div>
              <div className='ds_detail_container' style={{ backgroundColor: "#fff", border: "none" }}></div>
            </div>
          </div>

          <Table sx={{ minWidth: 700, marginBottom: "1.5rem" }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell align="left">Assigned State</StyledTableCell>
                <StyledTableCell align="left">Mobile</StyledTableCell>
                <StyledTableCell align="left">GPS</StyledTableCell>
                <StyledTableCell align="left">Internet</StyledTableCell>
                <StyledTableCell align="left">Battery</StyledTableCell>
                <StyledTableCell align="left">Mobile</StyledTableCell>
                <StyledTableCell align="left">Updated At</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allData.map((row) => (
                <>
                  <StyledTableRow key={row.name}>
                    <StyledTableCell>{row.name}</StyledTableCell>
                    <StyledTableCell align="left">{row.assigned_state}</StyledTableCell>
                    <StyledTableCell align="left">{row.mobile_no}</StyledTableCell>
                    <StyledTableCell align="left">{row.battery}</StyledTableCell>
                    <StyledTableCell align="left">{row.mobile}</StyledTableCell>
                    <StyledTableCell align="left">{row.mobile}</StyledTableCell>
                    <StyledTableCell align="left">{row.mobile}</StyledTableCell>
                    <StyledTableCell align="left">{row.updated_at}</StyledTableCell>
                  </StyledTableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="no_data">
          Select Employee
        </div>
      )}

    </div>
  )
}

export default DaySummary