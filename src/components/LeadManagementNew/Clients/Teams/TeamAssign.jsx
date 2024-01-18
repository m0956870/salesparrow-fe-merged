import "../LMClients.css"
import React, { useEffect, useState } from 'react'
import { TfiPlus } from "react-icons/tfi"
import { AiOutlineShareAlt, AiOutlineTeam, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai"
// import { BiSelectMultiple } from "react-icons/bi"

// import selectionImg from "../../../../images/selection.png"
import img1 from "../../../../images/column_filter.png"
import img2 from "../../../../images/excel_import.png"
import img3 from "../../../../images/excel_export.png"
import img4 from "../../../../images/pdf_download.png"

// import SearchIcon from '@mui/icons-material/Search';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import { RiShareBoxFill } from "react-icons/ri";
import TableCell from '@mui/material/TableCell';
import { tableCellClasses } from '@mui/material/TableCell';
import { Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";
import { CircularProgress, Pagination } from "@mui/material"
import { assignToEmp, deleteLead, deleteMultipleLead, getCustomers, getGroups, manageLeadGroup, manageLeadGroupFromLead } from "../../../../api/leadApi"
import { toast } from "react-toastify"
import { useLocation, useNavigate } from "react-router-dom"
import getStateFunc from "../../../../api/locationAPI"
import fetchAllEmployee from "../../../../api/employeeAPI"

const TeamAssign = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setisLoading] = useState(false)

  const [allLeadsData, setallLeadsData] = useState([])
  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState();
  const [totalDataCount, settotalDataCount] = useState();

  const [allState, setallState] = useState([]);
  const [allEmployee, setallEmployee] = useState([]);
  const [allLeadGroups, setallLeadGroups] = useState([]);

  const [selectionBtn, setselectionBtn] = useState("selection")
  const [selectedLeadArr, setselectedLeadArr] = useState([])
  const [selectedArrPopup, setselectedArrPopup] = useState(false);
  const [share, setShare] = useState({
    popUp:false,
    id:""
});

  // grp data
  const [allGrpData, setallGrpData] = useState([])
  const [removeGrpPopup, setremoveGrpPopup] = useState(false);
  const [removeGrpPopupBtn, setremoveGrpPopupBtn] = useState("");
  const [removePopupData, setremovePopupData] = useState({
    lead_id_arr: selectedLeadArr,
    new_grp_id: "",
    key: "",
  })

  const [filterData, setfilterData] = useState({
    type: "leads",
    limit: "10",
    page: pageCount,
    state: "",
    employee_id: "",
    leasSource: "",
    lead_stage: "",
    lead_potential: "",
    customer_grp: "",
    status: "",
  })

  // delete
  const [deletePopup, setdeletePopup] = useState(false);
  const [currentGroup, setcurrentGroup] = useState({});

  useEffect(() => {
    getAllLeadsFunc({ ...filterData, page: pageCount })
  }, [pageCount])

  useEffect(() => {
    getStateFunc().then((res) => setallState(res.data.result));
    getGroups().then((res) => setallLeadGroups(res.data.result));
    getGroupDataFunc()
  }, [])

  async function getAllLeadsFunc(filterData) {
    setisLoading(true)
    let { data } = await getCustomers(filterData)
    if (data.status) {
      setallLeadsData(data.result)
      setpageLength(data.page_length)
      settotalDataCount(data.total)
      setisLoading(false)
    } else {
      console.log("Some Error!")
      setisLoading(false)
    }
  }

  async function getGroupDataFunc() {
    setisLoading(true)
    let { data } = await getCustomers({ type: "groups" })
    if (data.status) {
      setallGrpData(data.result)
      setisLoading(false)
    } else {
      console.log("Some Error!")
      setisLoading(false)
    }
  }
  // console.log("allGrpData", allGrpData)

  const filterHandleInput = (e, state) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value })
    if (state) fetchAllEmployee({ state: e.target.value }).then(res => setallEmployee(res.data.result));
  }

  const topFilterHandleInput = async (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value })
    getAllLeadsFunc({ ...filterData, [e.target.name]: e.target.value })
  }

  const deleteLeadFunc = async () => {
    let res = await deleteLead({ lead_id: currentGroup._id });
    if (res.data.status) {
      getAllLeadsFunc(filterData);
      setdeletePopup(false);
      toast.success("Lead Deleted Successfully!");
    } else {
      toast.error(res.data.message);
      setisLoading(false);
    }

  };

  const selectionBtnFunc = async(type) => {
    if (type === "action") {
      setselectionBtn(type)
    } else {
    //   if (selectedLeadArr.length === 0) return toast.error("Select Leads First!")
    //   setselectedArrPopup(true)
    if (!selectedLeadArr) return toast.error("Select Team First!")

        let postData = {
            leadIdArr: selectedLeadArr,
            emp_id: location?.state?.id,
        }
        // setbtnLoading(true)
        let { data } = await assignToEmp(postData)
        if (data.status) {
            navigate("/lead_management_clients")
            toast.success("All Leads Assigned to Team Successfully!")
            // setbtnLoading(false)
        } else {
            console.log("Some Error!")
            // setbtnLoading(false)
        }
       }
    }

<<<<<<< HEAD
    const selectionCheckboxFunc = (e, row) => {
      if (!selectedLeadArr.includes(row._id)) {
        setselectedLeadArr([...selectedLeadArr, row._id])
      } else {
        let filteredArr = selectedLeadArr.filter(_id => _id !== row._id)
        setselectedLeadArr(filteredArr)
      }
    }

=======
  const selectionCheckboxFunc = (e, row) => {
    if (!selectedLeadArr.includes(row._id)) {
      setselectedLeadArr([...selectedLeadArr, row])
    } else {
      let filteredArr = selectedLeadArr.filter(_id => _id !== row._id)
      setselectedLeadArr(filteredArr)
    }
  }
  console.log(selectedLeadArr,"selectedLeadArr")
>>>>>>> 04fedc3911e1dd3321940bd01676f64ef01e52f2

  const shareContentSLFunc = () => {
    setShare({
      ...share,
      popUp:!share.popUp,
      // id:id
  })
    // setselectedArrPopup(false)
  }
  const assignToTeamSLFunc = () => {
    setselectedArrPopup(false)
    navigate("/lead_management_team_listing", { state: selectedLeadArr })
  }

  const manageGroupSLFunc = async () => {
    setselectedArrPopup(false)
    setremoveGrpPopup(true)
  }

  const deleteSLFunc = async () => {
    let res = await deleteMultipleLead({ leadIdArr: selectedLeadArr });
    if (res.data.status) {
      getAllLeadsFunc(filterData);
      setselectionBtn("selection")
      toast.success("All Leads Deleted Successfully!");
      setselectedArrPopup(false);
    } else {
      toast.error(res.data.message);
    }
  }


  const popupGrpSelected = (grp) => {
    setremoveGrpPopupBtn("not same")
    setremovePopupData({
      lead_id_arr: selectedLeadArr,
      new_grp_id: grp.id,
      key: "change",
    })
  }

  const mgPopupBtbFunc = async () => {
    let { data } = await manageLeadGroupFromLead(removePopupData)
    if (data.Status) {
      toast.success("Successfull!")
      getAllLeadsFunc(filterData);
      setremoveGrpPopup(false)
    } else {
      console.log("Some Error!")
      setisLoading(false)
    }
  }


  // Table Design
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

  const handleShare=(e , type)=>{
      navigate("/share_lead" , {state:{name:type , id:selectedLeadArr}})
  }

  const handleNavigateFollowups=(id)=>{
     navigate('/followups_lead' , {state:{id:id}})
  }

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
            <option value="Active" style={{ color: "green" }}>Active</option>
            <option value="InActive" style={{ color: "red" }}>InActive</option>
          </select>
        </div>
        <div className="top_right_filter">
          <div className="other_functionality_section">
            <div className="section_options"><img src={img1} /></div>
            <div className="section_options"><img src={img2} /></div>
            <div className="section_options"><img src={img3} /></div>
            <div className="section_options"><img src={img4} /></div>
          </div>
          <div onClick={() => navigate("/add_lead")} className="top_right_create_btn_icon">
            <TfiPlus className="create_btn_icon" />
             <span>Create New</span>
          </div>
          {allLeadsData?.length !== 0 && (
            <>
              {selectionBtn === "selection" ? (
                <div onClick={() => selectionBtnFunc("action")} className="top_right_create_btn_icon" style={{ marginLeft: "0.8rem" }}>
                  Select Leads
                </div>
              ) : (
                <div onClick={() => selectionBtnFunc("selection")} className="top_right_create_btn_icon" style={{ marginLeft: "0.8rem" }}>
                  Assign
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="lm_datafilter_tab">
        <div className="datafilter_tab_left">
          <select name="state" onChange={(e) => filterHandleInput(e, "state")}>
            <option value="">Select State</option>
            {allState.length === 0 && <option disabled value="">No States Found</option>}
            {allState?.map((state) => (
              <option value={state.id}>{state.name}</option>
            ))}
          </select>
          <select name="employee_id" onChange={filterHandleInput} >
            <option value="">Select an Employee</option>
            {allEmployee.length === 0 && <option disabled value="">No Employee Found</option>}
            {allEmployee?.map((state) => (
              <option key={state.id} value={state.id}>{state.employeeName}</option>
            ))}
          </select>
          <select name="leasSource" onChange={filterHandleInput}>
            <option value="">Lead Source</option>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="IndiaMart">IndiaMart</option>
            <option value="TradeIndia">Trade India</option>
            <option value="Website">Website</option>
            <option value="Manual">Manual</option>
          </select>
          <select name="time_period" onChange={filterHandleInput}>
            <option value="">Time Period</option>
            <option value="1">1 Month</option>
            <option value="3">3 Month</option>
            <option value="6">6 Month</option>
            <option value="12">12 Month</option>
            <option value="">Lifetime</option>
          </select>
          <select name="lead_stage" onChange={filterHandleInput}>
            <option value="">Lead Stage</option>
            <option value="Open">Open</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Won">Won</option>
            <option value="Loose">Loose</option>
          </select>
          <select name="customer_grp" onChange={filterHandleInput}>
            <option value="">Select Group</option>
            {allLeadGroups.length === 0 && <option disabled value="">No Lead Found</option>}
            {allLeadGroups?.map((grp) => (
              <option key={grp.id} value={grp.id}>{grp.lead_grp_name}</option>
            ))}
          </select>
          <select name="lead_potential" onChange={filterHandleInput}>
            <option value="">Lead Potential</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="datafilter_tab_right">
          <div className="view_btn" onClick={() => getAllLeadsFunc(filterData)}>
            View
          </div>
        </div>
      </div>

      {/* {allLeadsData?.length !== 0 && (
        <>
          {selectionBtn === "selection" ? (
            <div onClick={() => selectionBtnFunc("action")} className="leadlist_select_btn">
              Select Leads
            </div>
          ) : (
            <div onClick={() => selectionBtnFunc("selection")} className="leadlist_select_btn">
              Selection Actions
            </div>
          )}
        </>
      )} */}


      {isLoading ? (
        <div style={{ margin: "auto", }} >
          <CircularProgress />
        </div>
      ) : (
        <>
          {allLeadsData?.length !== 0 ? (
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
                  {allLeadsData?.map((row, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell>
                        {selectionBtn === "action" && (
                          <input
                            onChange={(e) => selectionCheckboxFunc(e, row)}
<<<<<<< HEAD
                            checked={selectedLeadArr.includes(row._id)}
=======
                            checked={selectedLeadArr.includes(row)}
>>>>>>> 04fedc3911e1dd3321940bd01676f64ef01e52f2
                            type="checkbox"
                            style={{ marginRight: "0.5rem" }}
                          />
                        )}
                        {row.leadName}
                      </StyledTableCell>
                      <StyledTableCell align="left">{row.mobileNumber}</StyledTableCell>
                      <StyledTableCell align="left">{row.state?.name}</StyledTableCell>
                      <StyledTableCell align="left">{row.leadSource}</StyledTableCell>
                      <StyledTableCell align="left">{row.assignToEmp}</StyledTableCell>
                      <StyledTableCell align="left">{row.lead_potential}</StyledTableCell>
                      <StyledTableCell align="left">{row.lead_stage}</StyledTableCell>
                      <StyledTableCell align="left">{row.lead_grp}</StyledTableCell>
                      <StyledTableCell align="left">{row.last_follow_date}</StyledTableCell>
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
                         <RiShareBoxFill
                        onClick={()=>handleNavigateFollowups(row._id)}
                      style={{ fontSize: '1rem', color: 'var(--main-color)', marginLeft: '0.5rem' }}
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
            </>
          ) : (
            <div className="no_data">
              No data
            </div>
          )}
        </>
      )}

      <Dialog
        open={deletePopup}
        aria-labelledby="form-dialog-title"
        maxWidth="xs"
        fullWidth={true}
        onClose={() => setdeletePopup(false)}
      >
        <DialogTitle className="dialog_title">
          <div>Do you want to delete {currentGroup.leadName}?</div>
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

      {/* Popup for Selected Leads */}
      <Dialog
        open={selectedArrPopup}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
        fullWidth={true}
        onClose={() => setselectedArrPopup(false)}
      >
        <div className="ll_sl_popup" >
          <div className="ll_sl_popup_heading">Options</div>
          <div className="ll_sl_options_tabs">
            <div onClick={() => shareContentSLFunc()} className="ll_sl_tabs">
              <div className="tab_icon"><AiOutlineShareAlt className="icon" /></div>
              <div className="tab_name">Share Content</div>
              {share.popUp  ?
              <div className='option_lists_lead' >
                <div className='option_lists_div option_lists_first'>Share With</div>
               <div className='option_lists_div' onClick={(e)=>handleShare(e,"Message")}>Message</div>
               <div className='option_lists_div'onClick={(e)=>handleShare(e,"Banner")}>Banner</div>
               <div className='option_lists_div'onClick={(e)=>handleShare(e,"Files")}>Files</div>
                 </div>
               :""}
            </div>
            <div onClick={() => assignToTeamSLFunc()} className="ll_sl_tabs">
              <div className="tab_icon"><AiOutlineTeam className="icon" /></div>
              <div className="tab_name">Assign to team</div>
            </div>
            <div onClick={() => manageGroupSLFunc()} className="ll_sl_tabs">
              <div className="tab_icon"><AiOutlineEdit className="icon" /></div>
              <div className="tab_name">Manage group</div>
            </div>
            <div onClick={() => deleteSLFunc()} className="ll_sl_tabs">
              <div className="tab_icon"><AiOutlineDelete className="icon" /></div>
              <div className="tab_name">Delete</div>
            </div>
          </div>
        </div>
      </Dialog>

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
          ) : (
            <div className="mg_btn" onClick={() => mgPopupBtbFunc()} >
              MOVE
            </div>
          )}
        </div>
      </Dialog>
    </div >
  )
}

export default TeamAssign