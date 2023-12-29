import React, { useEffect, useState } from "react";

import img1 from "../../../../images/column_filter.png"
import img2 from "../../../../images/excel_import.png"
import img3 from "../../../../images/excel_export.png"
import img4 from "../../../../images/pdf_download.png"

import { TfiPlus } from "react-icons/tfi"
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { tableCellClasses } from '@mui/material/TableCell';
import { Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";
import { CircularProgress, Pagination } from "@mui/material";

import { PolarArea } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { deleteLead, deleteLeadGroup, getCustomers, getGroupData, manageLeadGroup } from "../../../../api/leadApi";
import { BiArrowBack } from "react-icons/bi";
// import { AiOutlineShareAlt, AiOutlineTeam, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai"

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const GroupHome = ({ groupTab }) => {
  // console.log("groupTab", groupTab)

  return (
    <>
      {!groupTab && (
        <div style={{ margin: "12rem auto" }} >
          <h2>Please Select Group Type</h2>
        </div>
      )}
      {groupTab === "home" && <Home />}
      {groupTab === "listing" && <Listing />}
    </>
  );
};


const Home = () => {
  const navigate = useNavigate()
  const [isLoading, setisLoading] = useState(false)
  const [hNewLeads, sethNewLeads] = useState()
  const [hrecentActivity, sethrecentActivity] = useState()
  const [selectedGrp, setselectedGrp] = useState()

  const [grpData, setgrpData] = useState([])
  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState();
  const [totalDataCount, settotalDataCount] = useState();

  const [filterData, setfilterData] = useState({
    type: "groups",
    status: "",
    limit: "10",
  })

  // delete
  const [deletePopup, setdeletePopup] = useState(false);
  const [currentGroup, setcurrentGroup] = useState({});

  // Selection popup
  const [selectionBtn, setselectionBtn] = useState("selection")
  const [selectedLeadArr, setselectedLeadArr] = useState([])

  const [allGrpData, setallGrpData] = useState([])
  const [removeGrpPopup, setremoveGrpPopup] = useState(false);
  const [removeGrpPopupBtn, setremoveGrpPopupBtn] = useState("");
  const [removePopupData, setremovePopupData] = useState({
    lead_id_arr: selectedLeadArr,
    old_grp_id: selectedGrp?.id,
    new_grp_id: "",
    key: "",
  })

  useEffect(() => {
    getGroupDataFunc()
  }, [])

  useEffect(() => {
    if (removeGrpPopup === false) {
      setremoveGrpPopupBtn("")
      setselectionBtn("selection")
      setselectedLeadArr([])
    }
  }, [removeGrpPopup])

  async function getGroupDataFunc() {
    setisLoading(true)
    let { data } = await getCustomers({ type: "groups" })
    if (data.status) {
      setallGrpData(data.result)
      sethNewLeads(data.new_leads)
      sethrecentActivity(data.recent_activity)

      setisLoading(false)
    } else {
      console.log("Some Error!")
      setisLoading(false)
    }
  }

  async function getSelectedGroupDataFunc() {
    setisLoading(true)
    let { data } = await getGroupData({ grp_id: selectedGrp.id })
    if (data.status) {
      setgrpData(data.result)
      setpageLength(data.page_length)
      settotalDataCount(data.total)
      sethNewLeads(data.new_leads)

      setisLoading(false)
    } else {
      console.log("Some Error!")
      setisLoading(false)
    }
  }

  const leadGroupNavigateFunc = async (grp) => {
    setselectedGrp(grp)

    setisLoading(true)
    let { data } = await getGroupData({ grp_id: grp.id })
    if (data.status) {
      setgrpData(data.result)
      setpageLength(data.page_length)
      settotalDataCount(data.total)
      setisLoading(false)
    } else {
      console.log("Some Error!")
      setisLoading(false)
    }
  }

  const deleteLeadFunc = async () => {
    let res = await deleteLead({ lead_id: currentGroup._id });
    if (res.data.status) {
      toast.success("Lead Deleted Successfully!");
      setdeletePopup(false);
      setisLoading(true)

      let { data } = await getGroupData({ grp_id: selectedGrp.id })
      if (data.status) {
        setgrpData(data.result)
        setpageLength(data.page_length)
        settotalDataCount(data.total)
        sethNewLeads(data.new_leads)
        sethrecentActivity(data.recent_activity)

        setisLoading(false)
      } else {
        console.log("Some Error!")
        setisLoading(false)
      }
    } else {
      toast.error(res.data.message);
      setisLoading(false);
    }
  };

  const selectionBtnFunc = (type) => {
    if (type === "action") {
      setselectionBtn(type)
    } else {
      if (selectedLeadArr.length === 0) return toast.error("Select Leads First!")
      setremoveGrpPopup(true)
    }
  }

  const selectionCheckboxFunc = (e, row) => {
    if (!selectedLeadArr.includes(row._id)) {
      setselectedLeadArr([...selectedLeadArr, row._id])
    } else {
      let filteredArr = selectedLeadArr.filter(_id => _id !== row._id)
      setselectedLeadArr(filteredArr)
    }
  }

  const popupGrpSelected = (grp) => {
    if (selectedGrp.id === grp.id) setremoveGrpPopupBtn("same")
    else setremoveGrpPopupBtn("not same")

    setremovePopupData({
      lead_id_arr: selectedLeadArr,
      old_grp_id: selectedGrp?.id,
      new_grp_id: grp.id,
      key: selectedGrp.id === grp.id ? "remove" : "change",
    })
  }

  const mgPopupBtbFunc = async () => {
    let { data } = await manageLeadGroup(removePopupData)
    if (data.status) {
      toast.success("Successfull!")
      getSelectedGroupDataFunc()
      setremoveGrpPopup(false)
    } else {
      console.log("Some Error!")
      setisLoading(false)
    }
  }


  // Chart 
  const data = {
    labels: allGrpData?.map((item) => item.lead_grp_name),
    datasets: [
      {
        label: "",
        data: allGrpData?.map((item) => item.leads),
        backgroundColor: allGrpData?.map((item) => item.lead_grp_color),
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

  return (
    <>
      <div>
        <div className="group_home_btn_container" style={{ justifyContent: selectedGrp && "flex-start" }}>
          {!selectedGrp ? (
            <>
              <div className="create_btn">
                <TfiPlus className="create_btn_icon_icon" /> <span style={{ marginLeft: "0.5rem" }}>Create New</span>
              </div>
            </>
          ) : (
            <>
              <div onClick={() => setselectedGrp(null)} className="create_btn" style={{ justifySelf: "flex-start" }}>
                <BiArrowBack className="create_btn_icon_icon" />
                <span style={{ marginLeft: "0.5rem" }}>Go Back</span>
              </div>
            </>
          )}
        </div>

        {isLoading ? (
          <div style={{ margin: "auto", textAlign: "center" }} >
            <CircularProgress />
          </div>
        ) : (
          <>
            {!selectedGrp ? (
              <div className="group_home_container">
                <h2 className="grp_lead_heading" >Leads</h2>
                <div className="grp_lead_details_container">
                  <div className="left_div">New Leads</div>
                  <div className="left_div">{hNewLeads ?? "-"}</div>
                </div>
                <div className="grp_lead_details_container">
                  <div className="left_div">Recent Activity</div>
                  <div className="left_div">{hrecentActivity ?? "-"}</div>
                </div>

                <div className="multiple_group_scroll_container">
                  {allGrpData.length !== 0 && allGrpData.map((grp, i) => (
                    <div onClick={() => leadGroupNavigateFunc(grp)} style={{ backgroundColor: grp.lead_grp_color }} className="lead_group_container">
                      <div className="grp_name">{grp.lead_grp_name}</div>
                      <div className="grp_lead_count">{grp.leads}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "center" }} >
                  <div className="grp_home_chart_container">
                    <PolarArea data={data} options={options} />;
                  </div>
                </div>
              </div>
            ) : (
              <div id="lm_clients_main_containers" style={{ margin: "0 0 2rem 0" }}>
                <div className="top_filter_section">
                  <div className="top_left_filter">
                    <div className="entry_div">Show Entries</div>
                    <select className="limit_select" >
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                    </select>
                    {/* <div className="entry_div">Status</div> */}
                    <select className="limit_select status_select" >
                      <option value="">Status</option>
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </div>
                  <div className="top_right_filter">
                    <div className="other_functionality_section">
                      <div className="section_options"><img src={img1} /></div>
                      <div className="section_options"><img src={img2} /></div>
                      <div className="section_options"><img src={img3} /></div>
                      <div className="section_options"><img src={img4} /></div>
                    </div>
                    <div onClick={() => navigate("/create_lead_group")} className="top_right_create_btn_icon">
                      <TfiPlus className="create_btn_icon" /> <span>Create New</span>
                    </div>
                    {grpData?.lead_arr?.length !== 0 && (
                      <>
                        {selectionBtn === "selection" ? (
                          <div onClick={() => selectionBtnFunc("action")} className="top_right_create_btn_icon" style={{ marginLeft: "0.8rem" }}>
                            Select Lead
                          </div>
                        ) : (
                          <div onClick={() => selectionBtnFunc("selection")} className="top_right_create_btn_icon" style={{ marginLeft: "0.8rem" }}>
                            Selection Actions
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="tracking_tabs">
                  <div style={{ backgroundColor: "#aa4040", height: "25px", width: "25px", borderRadius: "0.2rem" }} ></div>
                  <div>
                    {grpData?.lead_grp_name}
                  </div>
                </div>

                {isLoading ? (
                  <div style={{ margin: "auto", textAlign: "center" }} >
                    <CircularProgress />
                  </div>
                ) : (
                  <>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Lead Name</StyledTableCell>
                          <StyledTableCell align="left">Mobile Number</StyledTableCell>
                          <StyledTableCell align="left">State</StyledTableCell>
                          <StyledTableCell align="left">Lead Source</StyledTableCell>
                          <StyledTableCell align="left">Assigned To</StyledTableCell>
                          <StyledTableCell align="left">Lead Potential</StyledTableCell>
                          <StyledTableCell align="left">Lead Stage</StyledTableCell>
                          <StyledTableCell align="left">Lead Group</StyledTableCell>
                          <StyledTableCell align="left">Last Follow Up</StyledTableCell>
                          <StyledTableCell align="left">Action</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {grpData?.lead_arr?.length !== 0 && grpData?.lead_arr?.map((row, i) => (
                          <StyledTableRow key={i}>
                            <StyledTableCell>
                              {selectionBtn === "action" && (
                                <input
                                  onChange={(e) => selectionCheckboxFunc(e, row)}
                                  checked={selectedLeadArr.includes(row._id)}
                                  type="checkbox"
                                  style={{ marginRight: "0.5rem" }}
                                />
                              )}
                              {row.lead_name || "-"}
                            </StyledTableCell>
                            <StyledTableCell align="left">{row.mobile_no || "-"}</StyledTableCell>
                            <StyledTableCell align="left">{row.state || "-"}</StyledTableCell>
                            <StyledTableCell align="left">{row.lead_source || "-"}</StyledTableCell>
                            <StyledTableCell align="left">{row.assigned_to || "-"}</StyledTableCell>
                            <StyledTableCell align="left">{row.lead_potential || "-"}</StyledTableCell>
                            <StyledTableCell align="left">{row.lead_stage || "-"}</StyledTableCell>
                            <StyledTableCell align="left">{row.lead_grp || "-"}</StyledTableCell>
                            <StyledTableCell align="left">{row.last_follow_up || "-"}</StyledTableCell>
                            <StyledTableCell align="left">
                              <BorderColorIcon
                                onClick={() => navigate("/edit_lead", { state: row })}
                                style={{ fontSize: '1rem', color: 'var(--main-color)' }}
                              />
                              <DeleteIcon
                                onClick={() => {
                                  setdeletePopup(true);
                                  setcurrentGroup(row);
                                }}
                                style={{ fontSize: '1rem', color: 'red', marginLeft: '0.5rem' }}
                              />
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {grpData?.lead_arr?.length !== 0 && (
                      <div className="top_filter_section" >
                        <div className="limit_bottom_info">Showing {((pageCount * filterData.limit) - filterData.limit) + 1} to {totalDataCount > pageCount * filterData.limit ? pageCount * filterData.limit : totalDataCount} of {totalDataCount} entries</div>
                        <div>
                          <Pagination
                            count={pageLength}
                            size="medium"
                            color="primary"
                            shape="rounded"
                            onChange={(e, value) => setpageCount(value)}
                            page={pageCount}
                          />
                        </div>
                      </div>
                    )}
                    {grpData?.lead_arr?.length === 0 && (
                      <div className="no_data">
                        No data
                      </div>
                    )}
                  </>
                )}

                {/* Popup for selecting group Leads */}
                <Dialog
                  open={removeGrpPopup}
                  aria-labelledby="form-dialog-title"
                  maxWidth="sm"
                  fullWidth={true}
                  onClose={() => setremoveGrpPopup(false)}
                >
                  <div className="ll_sl_popup" >
                    <div className="ll_sl_popup_heading">Manage Groups</div>
                    <div className="ll_sl_options_tabs" style={{ padding: "2rem 3rem" }}>
                      {allGrpData && allGrpData.map(grp => (
                        <label className="ll_mg_tabs" onChange={() => popupGrpSelected(grp)} >
                          <input type="radio" name="grp_tab" />
                          <div className="ll_mg_grp_tabs" >
                            <div className="color_div" style={{ '--h': `${grp.lead_grp_color}` }} ></div>
                            <div className="tab_name">{grp.lead_grp_name}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                    {!removeGrpPopupBtn ? (
                      <button disabled className="mg_btn_btn" style={{ border: "none" }} >
                        REMOVE
                      </button>
                    ) : removeGrpPopupBtn === "same" ? (
                      <div className="mg_btn" onClick={() => mgPopupBtbFunc()} >
                        REMOVE
                      </div>
                    ) : (
                      <div className="mg_btn" onClick={() => mgPopupBtbFunc()} >
                        MOVE
                      </div>
                    )}
                  </div>
                </Dialog>
              </div >
            )}
          </>
        )}

        <Dialog
          open={deletePopup}
          aria-labelledby="form-dialog-title"
          maxWidth="xs"
          fullWidth="true"
          onClose={() => setdeletePopup(false)}
        >
          <DialogTitle className="dialog_title">
            <div>Do you want to delete {currentGroup.lead_name}?</div>
          </DialogTitle>
          <DialogContent className="cardpopup_content">
            <div style={{ display: "flex", gap: "1rem" }}>
              <div
                className="employee_gl_popup"
                onClick={() => setdeletePopup(false)}
              >
                Cancel
              </div>
              <div
                className="employee_gl_popup_del"
                onClick={() => deleteLeadFunc()}
              >
                Delete
              </div>
            </div>
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
      </div>
    </>
  )
}

const Listing = () => {
  const navigate = useNavigate()
  const [isLoading, setisLoading] = useState(false)

  const [allGrpData, setallGrpData] = useState([])
  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState(1);
  const [totalDataCount, settotalDataCount] = useState();

  // delete
  const [deletePopup, setdeletePopup] = useState(false);
  const [currentGroup, setcurrentGroup] = useState({});

  const [filterData, setfilterData] = useState({
    type: "groups",
    status: "",
    limit: "10",
  })

  useEffect(() => {
    getGroupDataFunc(filterData)
  }, [])

  async function getGroupDataFunc(filterData) {
    setisLoading(true)
    let { data } = await getCustomers(filterData)
    if (data.status) {
      setallGrpData(data.result)
      setpageLength(data.page_length)
      settotalDataCount(data.total)
      setisLoading(false)
    } else {
      console.log("Some Error!")
      setisLoading(false)
    }
  }

  // const filterHandleInput = (e) => {
  //   setfilterData({ ...filterData, [e.target.name]: e.target.value })
  // }

  const topFilterHandleInput = async (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value })
    getGroupDataFunc({ ...filterData, [e.target.name]: e.target.value })
  }

  const deleteLeadGrpFunc = async () => {
    try {
      let res = await deleteLeadGroup({ grp_id: currentGroup.id });
      if (res.data.status) {
        toast.success("Group Deleted Successfully!");
        setdeletePopup(false);
        getGroupDataFunc();
      } else {
        toast.error(res.data.message);
        setisLoading(false);
      }
    } catch (error) {
      console.log(error);
      setisLoading(false);
    }
  };

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

  return (
    <div id="lm_clients_main_containers">
      <div className="top_filter_section">
        <div className="top_left_filter">
          <div className="entry_div">Show Entries</div>
          <select name="limit" onChange={topFilterHandleInput} className="limit_select" >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <select name="status" onChange={topFilterHandleInput} className="limit_select status_select" >
            <option value="">Status</option>
            <option value="Online" style={{ color: "green" }}>Online</option>
            <option value="Offline" style={{ color: "red" }}>Offline</option>
          </select>
        </div>
        <div className="top_right_filter">
          <div className="other_functionality_section">
            <div className="section_options"><img src={img1} /></div>
            <div className="section_options"><img src={img2} /></div>
            <div className="section_options"><img src={img3} /></div>
            <div className="section_options"><img src={img4} /></div>
          </div>
          <div onClick={() => navigate("/create_lead_group")} className="top_right_create_btn_icon">
            <TfiPlus className="create_btn_icon" /> <span>Create New</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ margin: "auto", }} >
          <CircularProgress />
        </div>
      ) : (
        <>
          {allGrpData?.length !== 0 ? (
            <>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>
                      <div style={{ marginLeft: "1rem" }}>Colours</div>
                    </StyledTableCell>
                    <StyledTableCell align="center">Group Name</StyledTableCell>
                    <StyledTableCell align="center">Lead</StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allGrpData?.map((row, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell>
                        <div style={{ height: "30px", width: "30px", background: `${row.lead_grp_color}`, marginLeft: "1rem" }} ></div> </StyledTableCell>
                      <StyledTableCell align="center">{row.lead_grp_name}</StyledTableCell>
                      <StyledTableCell align="center">
                        {row.leads != "-" ? <a href="#">{row.leads}</a> : row.leads}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <BorderColorIcon
                          onClick={() => navigate("/edit_lead_group", { state: row })}
                          style={{ fontSize: '1rem', color: 'var(--main-color)' }}
                        />
                        <DeleteIcon
                          onClick={() => {
                            setdeletePopup(true);
                            setcurrentGroup(row);
                          }}
                          style={{ fontSize: '1rem', color: 'red', marginLeft: '0.5rem' }}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="top_filter_section" >
                <div className="limit_bottom_info">Showing {((pageCount * filterData.limit) - filterData.limit) + 1} to {totalDataCount > pageCount * filterData.limit ? pageCount * filterData.limit : totalDataCount} of {totalDataCount} entries</div>
                <div>
                  <Pagination
                    count={pageLength}
                    size="medium"
                    color="primary"
                    shape="rounded"
                    onChange={(e, value) => setpageCount(value)}
                    page={pageCount}
                  />
                </div>
              </div>

              <Dialog
                open={deletePopup}
                aria-labelledby="form-dialog-title"
                maxWidth="xs"
                fullWidth="true"
                onClose={() => setdeletePopup(false)}
              >
                <DialogTitle className="dialog_title">
                  <div>Do you want to delete {currentGroup.lead_grp_name}?</div>
                </DialogTitle>
                <DialogContent className="cardpopup_content">
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div
                      className="employee_gl_popup"
                      onClick={() => setdeletePopup(false)}
                    >
                      Cancel
                    </div>
                    <div
                      className="employee_gl_popup_del"
                      onClick={() => deleteLeadGrpFunc()}
                    >
                      Delete
                    </div>
                  </div>
                </DialogContent>
                <DialogActions></DialogActions>
              </Dialog>
            </>
          ) : (
            <div className="no_data">
              No data
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default GroupHome;