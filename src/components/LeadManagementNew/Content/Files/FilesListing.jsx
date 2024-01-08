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
import CreateFile from './CreateFile';
import EditFile from './EditFile';
import { toast } from 'react-toastify';
import { deleteFile, deleteMessage, getFileData, getMessageData } from '../../../../api/leadApi';
import "../../Home/LMHome.css"
import ManageImage from './ManageImage';

const FilesListing = () => {
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

    const [addFilePopup, setaddFilePopup] = useState(false)
    const [editFilePopup, seteditFilePopup] = useState(false)
    const [manageImage , setManageImage] = useState(false)
    const [manageImageList , setManageImageList] = useState([])
    const [catalogue , setCatalogue] = useState(false)

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
                setpageLength(res.data.total_page);
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

    const deleteLContentFileFunc = async (list) => {
        const data = {
            id: list._id,
            // is_delete: '1',
          };
          try {
            // setApiRes({ loading: true, error: '' });
            setdeletePopup(false);
            const res = await deleteFile(data);
            if (res.data.status) {
            //   setApiRes({ loading: false, error: '' });
            getFileList().finally(() => toast.success('File deleted successfully'));
            } else {
            //   setApiRes({ loading: false, error: res.data.File });
              toast.error(res.data.File);
            }
          } catch (error) {
            // setApiRes({ loading: false, error: error.File });
            toast.error(error.File);
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
            navigate("/lead_management_share_lead",{state:{title:row.title, description:row.description,banner:row?.images[0] ,leadId:row._id, name:"file"}} )
        }else if(name==="parties"){
            navigate("/lead_management_share_party",{state:{title:row.title, description:row.description,banner:row?.images[0] ,leadId:row._id, name:"file"}} );
        }else{
            navigate("/lead_management_share_customer",{state:{title:row.title, description:row.description,banner:row?.images[0] ,leadId:row._id, name:"file"}} );
        }
    }

    const handleFile=(type)=>{
      if(type=="catalogue"){
        setaddFilePopup(true)
        setCatalogue(true)
      }else{
      setaddFilePopup(true)
      setCatalogue(false)
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
                        <div onClick={() => handleFile("catalogue")} className="top_right_create_btn_icon">
                            <TfiPlus className="create_btn_icon" /> <span>Create Catalogue</span>
                        </div>
                        <div onClick={() =>handleFile()} className="top_right_create_btn_icon" style={{marginLeft:"0.8rem"}}>
                            <TfiPlus className="create_btn_icon" /> <span>Create File</span>
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
                                            <StyledTableCell align="left">Image</StyledTableCell>
                                            <StyledTableCell align="left">Shared</StyledTableCell>
                                            <StyledTableCell align="left">Action</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {allLeadsData?.map((row, i) => (
                                            <StyledTableRow key={i}>
                                                <StyledTableCell>
                                                    {row.fileType==="PDF"?row.title+"(Uploaded)":row.title}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">{row.fileType==="PDF"?<a href={row.pdf[0]} target='blank' className='team-assign'>View File</a>:<img src={row.images[0]} width={"10%"}/>}</StyledTableCell>
                                                <StyledTableCell align="left">{row.sharedCount}</StyledTableCell>
                                                <StyledTableCell align="left" className='position-relative'>
                                                    <BorderColorIcon
                                                        onClick={() => {
                                                            setcurrentGroup(row);
                                                            seteditFilePopup(true)
                                                            setCatalogue(row.fileType==="PDF"?false:true)
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
                                                       <div className='option_lists_div'onClick={(e)=>handleShare(e,"customer",row)}>Customer</div>
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
                            onClick={() => deleteLContentFileFunc(currentGroup)}
                        >
                            Delete
                        </div>
                    </div>
                </DialogContent>
                <DialogActions></DialogActions>
            </Dialog>

            <CreateFile
                open={addFilePopup}
                close={() => setaddFilePopup(!addFilePopup)}
                setaddFilePopup={setaddFilePopup}
                manageImage={manageImage}
                setManageImage={setManageImage}
                manageImageList={manageImageList}
                setManageImageList={setManageImageList}
                catalogue={catalogue}
                setCatalogue={setCatalogue}
                getFile={getFileList}
            />
            <EditFile
                open={editFilePopup}
                close={() => seteditFilePopup(!editFilePopup)}
                seteditFilePopup={seteditFilePopup}
                fileData={currentGroup}
                getFileList={getFileList}
                manageImage={manageImage}
                setManageImage={setManageImage}
                manageImageList={manageImageList}
                catalogue={catalogue}
                setManageImageList={setManageImageList}
                getFile={getFileList}
            />
            <ManageImage
            manageImage={manageImage}
            close={() => setManageImage(!manageImage)}
            setManageImage={setManageImage}
            manageImageList={manageImageList}
            setManageImageList={setManageImageList}
            setaddFilePopup={setaddFilePopup}
            seteditFilePopup={seteditFilePopup}
            editFilePopup={editFilePopup}
            />
        </>
    )
}

export default FilesListing