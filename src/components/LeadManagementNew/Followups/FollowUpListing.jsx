import React from 'react';
import "../Clients/LMClients.css";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import { getFollowupd_data } from "../../../api/leadApi";
import { CircularProgress,Pagination } from "@mui/material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useState, useEffect } from "react";
import group from "../../../images/group.png";
import { useLocation } from "react-router-dom";

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

const FollowUpListing = () =>{
  const location = useLocation();

    const [allLeadsData, setallLeadsData] = useState([])
    const [pageCount, setpageCount] = useState(1);
    const [pageLength, setpageLength] = useState();
    const [totalDataCount, settotalDataCount] = useState();
    const [listingLoading , setlistingLoading] = useState(false)

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

   

    const getFollowupsData = async()=>{
      let type = location.state.type
      setlistingLoading(true)
        let res = await getFollowupd_data()
        try {
            if(res.data.status){
                if(type==="overdue"){
                  setallLeadsData(res?.data?.data?.overdue)
                }else if(type == "upcoming"){
                  setallLeadsData(res?.data?.data?.upcoming)
                }else {
                  setallLeadsData(res?.data?.data?.today)
                }
            }
        } catch (error) {
            console.log(error)
        }
        finally{
          setlistingLoading(false)
        }
    }

    const topFilterHandleInput = async (e) => {
      setfilterData({ ...filterData, [e.target.name]: e.target.value })
      getFollowupsData({ ...filterData, [e.target.name]: e.target.value })
    }

    useEffect(()=>{
      getFollowupsData();
   },[])

    return (
        <div className='lm_content_main_containers'>
          <>
        {listingLoading ? (
        <div style={{ margin: "auto", }} >
          <CircularProgress />
        </div>
      ) : (
        <>
        <div className="beat_heading">
        <div className="beat_left" style={{justifyContent:"start"}}>
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">{location.state.type}</div>
        </div>
        
      </div>
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
       
      </div>
          {allLeadsData?.length !== 0 ? (
            <>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                  <StyledTableCell>S. No.</StyledTableCell>
                    <StyledTableCell>Lead Name</StyledTableCell>
                    <StyledTableCell align="left">Mobile Number</StyledTableCell>
                    <StyledTableCell align="left">State</StyledTableCell>
                    <StyledTableCell align="left">Lead Source</StyledTableCell>
                    <StyledTableCell align="left">Assigned To</StyledTableCell>
                    <StyledTableCell align="left">Lead Potential</StyledTableCell>
                    <StyledTableCell align="left">Lead Stage</StyledTableCell>
                    
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allLeadsData?.map((row, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell>
                      
                        {i+1}
                      </StyledTableCell>
                      <StyledTableCell align="left" style={{cursor:"pointer"}} >
                        {row?.lead[0]?.leadName}</StyledTableCell>
                      <StyledTableCell align="left">{row?.lead[0]?.mobileNumber}</StyledTableCell>
                      <StyledTableCell align="left">{row?.lead[0]?.state?.name}</StyledTableCell>
                      <StyledTableCell align="left">{row?.lead[0]?.leadSource}</StyledTableCell>
                      <StyledTableCell align="left">{row?.lead[0]?.assignToEmp}</StyledTableCell>
                      <StyledTableCell align="left">{row?.lead[0]?.lead_potential}</StyledTableCell>
                      <StyledTableCell align="left">{row?.lead[0]?.lead_stage}</StyledTableCell>
                    
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
        </>
        </div>
    )
}

export default FollowUpListing;