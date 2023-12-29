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
import { useNavigate } from "react-router-dom";
import CreateMessage from './CreateMessage';
import EditMessage from './EditMessage';
import { toast } from 'react-toastify';
import { deleteMessage, getMessageData } from '../../../../api/leadApi';
import "../../Home/LMHome.css"

const MessageListing = () => {
    const navigate = useNavigate();

    const [isLoading, setisLoading] = useState(false)
    const [allLeadsData, setallLeadsData] = useState([])
    const [pageCount, setpageCount] = useState(1);
    const [pageLength, setpageLength] = useState();
    const [totalDataCount, settotalDataCount] = useState();

    const [search, setSearch] = useState('');

    const [share, setShare] = useState({
        popUp:false,
        id:""
    });

    // delete
    const [deletePopup, setdeletePopup] = useState(false);
    const [currentGroup, setcurrentGroup] = useState({});

    const [addMessagePopup, setaddMessagePopup] = useState(false)
    const [editMessagePopup, seteditMessagePopup] = useState(false)

    const [filterData, setfilterData] = useState({
        type: "leads",
        limit: "10",
        page: pageCount,
        status: "",
    })

    useEffect(()=>{
       getMessageList(pageCount, search)
    },[pageCount])

    const getMessageList=async(p , s)=>{
        const data = {
            search: s ?? '',
            page: p ? String(p) : '1',
            limit: '5',
          };
        try {
            const res = await getMessageData(data);
            if(res.data.status){
                setallLeadsData(res.data.result)
                setpageLength(res.data.total_page);
                // toast.success("");
            }else{
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const topFilterHandleInput = async (e) => {
        setfilterData({ ...filterData, [e.target.name]: e.target.value })
        // getAllLeadsFunc({ ...filterData, [e.target.name]: e.target.value })
    }

    const deleteLContentMessageFunc = async (list) => {
        const data = {
            id: list._id,
            // is_delete: '1',
          };
          try {
            // setApiRes({ loading: true, error: '' });
            setdeletePopup(false);
            const res = await deleteMessage(data);
            if (res.data.status) {
            //   setApiRes({ loading: false, error: '' });
            getMessageList().finally(() => toast.success('Message deleted successfully'));
            } else {
            //   setApiRes({ loading: false, error: res.data.message });
              toast.error(res.data.message);
            }
          } catch (error) {
            // setApiRes({ loading: false, error: error.message });
            toast.error(error.message);
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

    const handleSharePopUp=(id)=>{
        setShare({
            ...share,
            popUp:!share.popUp,
            id:id
        })
    }

    const handleShare=(e , name , row)=>{
        if(name==="lead"){
            navigate("/lead_management_share_lead",{state:{title:row.title, description:row.description}} )
        }else if(name==="parties"){
            navigate("/lead_management_share_party",{state:{title:row.title, description:row.description}} );
        }else{
            navigate("/lead_management_share_customer",{state:{title:row.title, description:row.description}} );
        }
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
                    <div className="top_right_filter">
                        <div onClick={() => setaddMessagePopup(true)} className="top_right_create_btn_icon">
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
                        {allLeadsData?.length !== 0 ? (
                            <>
                                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>Title</StyledTableCell>
                                            <StyledTableCell align="left">Descriptiom</StyledTableCell>
                                            <StyledTableCell align="left">Action</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {allLeadsData?.map((row, i) => (
                                            <StyledTableRow key={i}>
                                                <StyledTableCell>
                                                    {row.title}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">{row.description}</StyledTableCell>
                                                <StyledTableCell align="left" className='position-relative'>
                                                    <BorderColorIcon
                                                        onClick={() => {
                                                            setcurrentGroup(row);
                                                            seteditMessagePopup(true)
                                                        }}
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
                                                       onClick={()=>handleSharePopUp(row._id)}
                                                      style={{ fontSize: '1rem', color: 'var(--main-color)', marginLeft: '0.5rem' }}
                                                    />
                                                    {share.popUp && share.id===row._id ?
                                                     <div className='option_lists' >
                                                       <div className='option_lists_div option_lists_first'>Share With</div>
                                                       <div className='option_lists_div' onClick={(e)=>handleShare(e,"lead",row)}>Leads</div>
                                                       <div className='option_lists_div'onClick={(e)=>handleShare(e,"customer",row)}>Customes</div>
                                                       <div className='option_lists_div'onClick={(e)=>handleShare(e,"parties",row)}>Parties</div>
                                                     </div>
                                                   :""}
                                                    
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
                            onClick={() => deleteLContentMessageFunc(currentGroup)}
                        >
                            Delete
                        </div>
                    </div>
                </DialogContent>
                <DialogActions></DialogActions>
            </Dialog>

            <CreateMessage
                open={addMessagePopup}
                close={() => setaddMessagePopup(!addMessagePopup)}
            />
            <EditMessage
                open={editMessagePopup}
                close={() => seteditMessagePopup(!editMessagePopup)}
                messageData={currentGroup}
                getMessageList={getMessageList}
            />
        </>
    )
}

export default MessageListing