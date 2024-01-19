import React, { useEffect, useState } from 'react'
import { TfiPlus } from "react-icons/tfi"

import img1 from "../../../../images/column_filter.png"
import img2 from "../../../../images/excel_import.png"
import img3 from "../../../../images/excel_export.png"
import img4 from "../../../../images/pdf_download.png"

// import SearchIcon from '@mui/icons-material/Search';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { RiShareBoxFill } from "react-icons/ri";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { tableCellClasses } from '@mui/material/TableCell';
import { CircularProgress, Dialog, DialogContent, DialogTitle, Pagination } from "@mui/material"

// APIs
import getStateFunc from "../../../../api/locationAPI";
import fetchAllEmployee from "../../../../api/employeeAPI";
import fetchAllBeat from "../../../../api/beatAPI";
import { deleteCustomer, deleteMultipleLead, getCustomers } from '../../../../api/leadApi'
import { AiOutlineDelete, AiOutlineEdit, AiOutlineShareAlt, AiOutlineTeam } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const CustomersTab = ({ retailerData }) => {
    const navigate = useNavigate()
    const [isLoading, setisLoading] = useState(false)

    const [tabData, settabData] = useState([])
    const [pageCount, setpageCount] = useState(1);
    const [pageLength, setpageLength] = useState(1);
    const [totalDataCount, settotalDataCount] = useState();
    const [selectedLeadArr, setselectedLeadArr] = useState([])
    const [selectedLeadId , setSelectedLeadId] = useState([]);
    const [selectedArrPopup, setselectedArrPopup] = useState(false);

    const [deletePopup, setdeletePopup] = useState(false);
    const [currentGroup, setcurrentGroup] = useState({});

    const [allState, setallState] = useState([]);
    const [allEmployee, setallEmployee] = useState([]);
    const [allBeat, setAllBeat] = useState([]);
    const [selectionBtn, setselectionBtn] = useState("selection");
    const [share, setShare] = useState({
        popUp:false,
        id:""
    });

    const [filterData, setfilterData] = useState({
        type: "customers",
        sub_type: "retailers",
        employee_id: "",
        beat_id: "",
        status: "",
        limit: "10",
    })

    useEffect(() => {
        settabData(retailerData?.result)
        setpageLength(retailerData?.page_length)
        settotalDataCount(retailerData?.total)
        getStateFunc().then((res) => setallState(res.data.result));
        fetchAllBeat().then((res) => setAllBeat(res.data.result));
    }, []);
    // console.log("tabData", tabData)

    const filterHandleInput = (e) => {
        setfilterData({ ...filterData, [e.target.name]: e.target.value })
    }

    const topFilterHandleInput = async (e) => {
        setfilterData({ ...filterData, [e.target.name]: e.target.value })
        filterFunc({ ...filterData, [e.target.name]: e.target.value })
    }

    const filterFunc = async (filterData) => {
        console.log(filterData)

        setisLoading(true)
        let { data } = await getCustomers(filterData)
        // console.log("data", data)
        if (data.status) {
            settabData(data.result)
            setpageLength(data.page_length)
            settotalDataCount(data.total)
            setisLoading(false)
        } else {
            console.log("Some Error!")
            setisLoading(false)
        }
    }

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

    
  const selectionBtnFunc = (type) => {
    if (type === "action") {
      setselectionBtn(type)
    } else {
      if (selectedLeadArr.length === 0) return toast.error("Select Leads First!")
      setselectedArrPopup(true)
    }
  }

  const selectionCheckboxFunc = (e, row, ind) => {
    if (!selectedLeadId.includes(row._id)) {
      setSelectedLeadId([...selectedLeadId, row._id])
      setselectedLeadArr([...selectedLeadArr, row])
    } else {
      let filteredArr = selectedLeadArr.filter((i,id) => id !== ind)
      setselectedLeadArr(filteredArr)

      let filteredArrId = selectedLeadId.filter(_id => _id !== row._id)
      setSelectedLeadId(filteredArrId)
    }
  }

  const deleteLeadFunc = async () => {
    setisLoading(true)
    let res = await deleteCustomer({ id: currentGroup._id });
    if (res.data.status) {
      setdeletePopup(false);
      toast.success("Lead Deleted Successfully!");
      filterFunc()
      setisLoading(false)
    } else {
      toast.error(res.data.message);
      setisLoading(false);
    }

  };


  const shareContentSLFunc = () => {
    setShare({
      ...share,
      popUp:!share.popUp,
      // id:id
  })
  }

  const assignToTeamSLFunc = () => {
    setselectedArrPopup(false)
    navigate("/lead_management_team_listing", { state: selectedLeadArr })
  }

  const manageGroupSLFunc = async () => {
    setselectedArrPopup(false)
    // setremoveGrpPopup(true)
  }

  const handleShare=(e , type)=>{
    navigate("/share_customer_page" , {state:{name:type , id:selectedLeadArr , pageType:"customer"}})
}


  const handleSharePopUp=(id)=>{
    setShare({
        ...share,
        popUp:!share.popUp,
        id:id
    })
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
                    {/* <div className="entry_div">Status</div> */}
                    {/* <select name="status" onChange={topFilterHandleInput} className="limit_select status_select" >
                        <option value="">Status</option>
                        <option value="Online" style={{ color: "green" }}>Online</option>
                        <option value="Offline" style={{ color: "red" }}>Offline</option>
                    </select> */}
                </div>
                <div className="top_right_filter">
                    <div className="other_functionality_section">
                        <div className="section_options"><img src={img1} /></div>
                        <div className="section_options"><img src={img2} /></div>
                        <div className="section_options"><img src={img3} /></div>
                        <div className="section_options"><img src={img4} /></div>
                    </div>
                    {/* <div className="top_right_create_btn_icon">
                        <TfiPlus className="create_btn_icon" /> <span>Create New</span>
                    </div> */}
                    {tabData?.length !== 0 && (
            <>
              {selectionBtn === "selection" ? (
                <div onClick={() => selectionBtnFunc("action")} className="top_right_create_btn_icon" style={{ marginLeft: "0.8rem" }}>
                  Select Leads
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
                <div className="tarcking_tab_left">
                    <select name="state" onChange={(e) => fetchAllEmployee({ state: e.target.value }).then((res) => setallEmployee(res.data.result))}>
                        <option value="">All State</option>
                        {allState?.map((state) => (
                            <option key={state.id} value={state.id}> {state.name} </option>
                        ))}
                    </select>
                    <select name="employee_id" onChange={filterHandleInput}>
                        <option value="">All Employee</option>
                        {allEmployee?.map((employee) => (
                            <option key={employee.id} value={employee.id}>{employee.employeeName}</option>
                        ))}
                    </select>
                    <select name="beat_id" onChange={filterHandleInput}>
                        <option value="">All Beat</option>
                        {allBeat?.map((beat) => (
                            <option key={beat.id} value={beat.id}>{beat.beatName}</option>
                        ))}
                    </select>
                    <div className="view_btn" onClick={() => filterFunc(filterData)}>
                        View
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div style={{ margin: "auto", }} >
                    <CircularProgress />
                </div>
            ) : (
                <>
                    {tabData?.length !== 0 ? (
                        <>
                            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Customer Name</StyledTableCell>
                                        <StyledTableCell align="left">Beat Name</StyledTableCell>
                                        <StyledTableCell align="left">Mobile Number</StyledTableCell>
                                        <StyledTableCell align="left">Status</StyledTableCell>
                                        {/* <StyledTableCell align="left">Action</StyledTableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tabData?.map((row, i) => (
                                        <StyledTableRow key={i}>
                                            <StyledTableCell component="th" scope="row">
                                            {selectionBtn === "action" && (
                                         <input
                                              onChange={(e) => selectionCheckboxFunc(e, row,i)}
                                              checked={selectedLeadArr.includes(row)}
                                              type="checkbox"
                                              style={{ marginRight: "0.5rem" }}
                                            />
                                          )}
                                                {row.customer_name}
                                                </StyledTableCell>
                                            <StyledTableCell align="left">{row.beat_name}</StyledTableCell>
                                            <StyledTableCell align="left">{row.mobile_number}</StyledTableCell>
                                            <StyledTableCell align="left" component="th" scope="row">
                                                <span style={{ display: 'inline', padding: '0.2rem 1rem' }} className={`${row.status === 'Active' ? 'active_beat' : 'inactive_beat'}`}>
                                                    {row.status}
                                                </span>
                                            </StyledTableCell>
                                            {/* <StyledTableCell align="left" className='position-relative'>
                                           
                                               <DeleteIcon 
                                                onClick={() => {
                                                  setdeletePopup(true);
                                                  setcurrentGroup(row);
                                                }}
                                               style={{ fontSize: '1rem', color: 'red', marginLeft: '0.5rem' }} />
                                               
                                           </StyledTableCell> */}
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

            {/* POP UP....................... */}
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
            {/* <div onClick={() => assignToTeamSLFunc()} className="ll_sl_tabs">
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
            </div> */}
          </div>
        </div>
      </Dialog>

{/* deletempopup */}

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
      </Dialog>      
        </div >
    )
}

export default CustomersTab