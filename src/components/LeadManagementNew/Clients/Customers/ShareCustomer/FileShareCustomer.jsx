import React, { useEffect, useState } from 'react'
import { TfiPlus } from "react-icons/tfi"
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
import { Dialog, DialogActions, DialogTitle, DialogContent, Pagination, CircularProgress } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { deleteFile, deleteMessage, getFileData, getMessageData } from '../../../../../api/leadApi';
import "../../../Home/LMHome.css"
import SendLeadCustomerPopUp from './SendCustomerPopUp';

const FileShareCustomer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location)

    const [isLoading, setisLoading] = useState(false)
    const [allLeadsData, setallLeadsData] = useState([])
    const [pageCount, setpageCount] = useState(1);
    const [pageLength, setpageLength] = useState();
    const [totalDataCount, settotalDataCount] = useState();

    const [search, setSearch] = useState('');
    const [sendMessagePopup , setsendMessagePopup] = useState(false)

    const [message, setMessage] = useState({
        title: "",
        body: "",
      });

    // delete
 

 
   

    const [filterData, setfilterData] = useState({
        type: "leads",
        limit: "10",
        page: pageCount,
        status: "",
    })

    useEffect(()=>{
       getFileList(pageCount, search)
    },[pageCount])

    const getFileList=async(p , s)=>{
        const data = {
            search: s ?? '',
            page: p ? String(p) : '1',
            limit: '5',
          };
        try {
            const res = await getFileData(data);
            if(res.data.status){
                setallLeadsData(res.data.result)
                setpageLength(res.data.pageLength);
                settotalDataCount(res.data.count)
                // toast.success("");
            }else{
                toast.error(res.data.File);
            }
        } catch (error) {
            toast.error(error.File);
        }
    }

    const topFilterHandleInput = async (e) => {
        setfilterData({ ...filterData, [e.target.name]: e.target.value })
        // getAllLeadsFunc({ ...filterData, [e.target.name]: e.target.value })
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

    const handleSharePopUp=(row)=>{
        setsendMessagePopup(true);
        setMessage({
            ...message,
            title:row.title,
            body:row.description,
            leadId:row._id,
            name:"file"
        })
    }


    return (
        <>
            <div className="lm_content_main_containers">
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
                                            <StyledTableCell>Title</StyledTableCell>
                                            <StyledTableCell align="left">Image</StyledTableCell>
                                            <StyledTableCell align="left">Shared</StyledTableCell>
                                            <StyledTableCell align="left">Action</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {allLeadsData?.map((row, i) => (
                                            <StyledTableRow key={i}>
                                                <StyledTableCell>
                                                    {row.title}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">{row.fileType==="PDF"?<a href={row.pdf[0]} target='blank' className='team-assign'>View File</a>:<img src={row.images[0]} width={"10%"}/>}</StyledTableCell>
                                                <StyledTableCell align="left">{row.sharedCount}</StyledTableCell>
                                                <StyledTableCell align="left" className='position-relative'>
                                                    <RiShareBoxFill
                                                       onClick={()=>handleSharePopUp(row)}
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
            </div>

            
    <SendLeadCustomerPopUp
      open={sendMessagePopup}
      close={() => setsendMessagePopup(!sendMessagePopup)}
      messageData={message}
      sentLead={location?.state?.id}
      pageType={location?.state?.pageType}
      />
            
            
           
        </>
    )
}

export default FileShareCustomer