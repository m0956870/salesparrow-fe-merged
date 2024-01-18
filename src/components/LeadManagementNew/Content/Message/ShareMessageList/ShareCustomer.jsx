import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";
import { CircularProgress, Pagination } from "@mui/material";
import group from "../../../../../images/group.png";

import { getCusFeedbackReport, getRetailer, getSSWiseReport } from "../../../../../api/reportsAPI";
import fetchAllParty from "../../../../../api/partyAPI";
import fetchAllBeat from "../../../../../api/beatAPI";

import { useRef } from "react";
import { BsFilterLeft } from "react-icons/bs"
import { saveToPdf } from "../../../../../utils/saveToPdf";
import getStateFunc from "../../../../../api/locationAPI";
import fetchAllEmployee from "../../../../../api/employeeAPI";
import xlsx from "json-as-xlsx";
import { toast } from "react-toastify";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import SendMessagePage from "./SendMessagePage";

const ShareCustomer = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const [isLoading, setisLoading] = useState(false);

  const pdfView = useRef(null);
  const [filterDivExtended, setfilterDivExtended] = useState(false);
  const [exportBtnLoading, setexportBtnLoading] = useState(false)
  const [pdfBtnLoading, setpdfBtnLoading] = useState(false)

  const [allState, setallState] = useState([]);
  const [allBeats, setallBeats] = useState([])

  const [selectionBtn, setselectionBtn] = useState("selection")
  const [selectedCustomerArr, setselectedCustomerArr] = useState([])
  const [selectedArrPopup, setselectedArrPopup] = useState(false);
  const [selectPopup , setSelectPopup] = useState(false)
  const [allRowSelect, setAllRowSelect] = useState(false)
  const [sendMessagePopup, setsendMessagePopup] = useState(false)
  const [sentName , setSentName] = useState([])
  const [allSent , setAllSent] = useState(false);

  const [search, setSearch] = useState("");
  const [allRetailers, setallRetailers] = useState([]);
  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState();
  const [totalDataCount, settotalDataCount] = useState();

  const [filterData, setfilterData] = useState({
    state: "",
    beat_id: "",
    limit: "10",
    page: pageCount,
  })

  useEffect(() => {
    getStateFunc().then((res) => setallState(res.data.result));
    fetchAllBeat().then(res => setallBeats(res.data.result));
  }, []);
  useEffect(() => {
    getRetailerFunc({ ...filterData, page: pageCount })
  }, [pageCount]);

  useEffect(() => {
    if (search !== "") {
      let ID = setTimeout(() => {
        getRetailerFunc({ ...filterData, search })
      }, 1000);

      return () => clearTimeout(ID);
    }
  }, [search]);

  const getRetailerFunc = async (filterData) => {
    setisLoading(true)

    let { data } = await getRetailer(filterData)
    if (data.status) {
      setallRetailers(data.result)
      setpageLength(data.pageLength);
      settotalDataCount(data.count);
      return setisLoading(false)
    }
    console.log("Server Error")
  }

  const handleInput = (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value });
  };

  const stateHandleInput = async (e) => {
    // fetchAllEmployee({ state: e.target.value }).then((res) => {
    //   setallEmployee(res.data.result);
    // })
  };

  const selectionBtnFunc = (type) => {
    setAllRowSelect(false)
    setselectedCustomerArr([])
    if (type === "action") {
      setselectionBtn(type)
    } else {
      if (selectedCustomerArr.length === 0) return toast.error("Select Leads First!")
      setselectedArrPopup(true)
    }
  }

  const selectionAllBtnFunc = (type) => {
    setAllSent(true)
    if (type === "action") {
      setselectionBtn(type)
      allRetailers.map((elem ,id)=>{
        setselectedCustomerArr([...selectedCustomerArr, elem.id])
      })
      setAllRowSelect(true)
    } else {
      if (selectedCustomerArr.length === 0) return toast.error("Select Leads First!")
      setselectedArrPopup(true)
    }
  }

  const selectionCheckboxFunc = (e, row) => {
    setAllSent(false)
    setSelectPopup(false)
    if (!selectedCustomerArr.includes(row.id)) {
      setselectedCustomerArr([...selectedCustomerArr, row.id])
    } else {
      let filteredArr = selectedCustomerArr.filter(id => id !== row.id)
      setselectedCustomerArr(filteredArr)
    }
  }
  console.log(selectedCustomerArr, "arr")

  const filterFunc = () => {
    // getSecDataFunc(filterData)
  }

  const topFilterHandleInput = (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value })
    getRetailerFunc({ ...filterData, [e.target.name]: e.target.value })
  }
  const filterAndExportFunc = (type) => {
    setTimeout(() => {
      setexportBtnLoading(false)
      setpdfBtnLoading(false)
    }, 2000);

    if (type === "column_filter") return setfilterDivExtended(!filterDivExtended);
    else if (type === "export") {
      setexportBtnLoading(true)
      setfilterDivExtended(false);
      return exportFunc();
    } else if (type === "pdf") {
      setpdfBtnLoading(true)
      setfilterDivExtended(false);
      if (allRetailers.length < 1) return toast.error("Report list is empty!");
      return saveToPdf(pdfView, "Monthly Attendence Report (All Employee)");
    }
  }

  // Export
  let settings = {
    fileName: "Monthly Attendence Report (All Employee)", // Name of the resulting spreadsheet
    extraLength: 3, // A bigger number means that columns will be wider
    writeMode: 'writeFile', // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
    writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
    RTL: false, // Display the columns from right-to-left (the default value is false)
  }

  const exportFunc = () => {
    // console.log(allEmployee);
    if (allRetailers.length < 1) return toast.error("Report list is empty!");

    let data = [
      {
        sheet: "Adults",
        columns: [
          { label: "ID", value: (row) => row.id ? row.id : "" },
          { label: "Employee_Name", value: (row) => row.employeeName || "" },
        ],
        content: allRetailers
      },
    ]
    try {
      xlsx(data, settings, callback)
    } catch (error) {
      console.log(error);
    }
  }
  let callback = function (sheet) {
    console.log("Download complete:", sheet)
  }

  // Filter
  const [tableCols, setTableCols] = useState([
    {
      label: 'Customer Name',
      key: 'customerName',
      type: "value",
      active: true,
    },
    {
      label: 'Firm Name',
      key: 'firmName',
      type: "value",
      active: true,
    },
    {
      label: 'Customer Type',
      key: 'customer_type',
      type: "value",
      active: true,
    },
    // {
    //   label: 'Beat',
    //   key: 'beat',
    //   type: "value",
    //   active: true,
    // },
    {
      label: 'Route',
      key: 'route',
      type: "value",
      active: true,
    },
    {
      label: 'City',
      key: 'city',
      type: "value",
      active: true,
    },
    {
      label: 'Date',
      key: 'date',
      type: "value",
      active: true,
    },
    {
      label: 'Mobile No.',
      key: "mobileNo",
      type: "value",
      active: true,
    },
    {
      label: 'Status',
      key: "status",
      type: "component",
      active: true,
    },
  ]);

  let filterCols = tableCols.filter(col => col.active);
  const toogleTableCol = (key) => {
    // if (key === "emp_name") return;
    const temp = tableCols.map(col => {
      if (col.key === key) return { ...col, active: !col.active }
      return col;
    })
    setTableCols(temp)
  }

  const TCComponent = ({ data }) => {
    let { row, col } = data;
    if (col.type === "component") {
      return <StyledTableCell>
        <div className={`${row.status === "Active" ? "active_beat" : "inactive_beat"}`} >
          {row.status}
        </div>
      </StyledTableCell >
    }
    return <StyledTableCell>{row[col.key]}</StyledTableCell>;
  }

  // Table style
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "var(--main-color)",
      color: theme.palette.common.white,
      fontWeight: "bold",
      borderRight: "1px solid #fff",
      overflow: "hidden",
      whiteSpace: "nowrap"
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      border: "none",
      borderLeft: "2px solid #f3f3f3",
      '&:last-child': {
        borderRight: "2px solid #f3f3f3",
      },
      whiteSpace: "nowrap"
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    borderBottom: "2px solid #f3f3f3",
    '&:nth-of-type(odd)': {
      backgroundColor: "#fff",
    },
    '&:nth-of-type(even)': {
      backgroundColor: "#fbfbfb",
    },
  }));

  const handleSendMessage=()=>{
    if(selectedCustomerArr.length){
    setsendMessagePopup(true)
   
    const selecteCustomerName =  allSent?allRetailers:allRetailers.filter((elem)=>{
      return selectedCustomerArr.includes(elem.id);
    })
   setSentName(selecteCustomerName.map((elem)=>elem))
  }else{
    toast.warning("Please select party first")
}
  }
  return (
    <div className="container">
      <div className="beat_heading">
        <div className="beat_left">
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Customers</div>
        </div>
        <div className="beat_right employee_head">
          <div className="search">
            <SearchIcon style={{ color: `var(--main-color)` }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
            />
          </div>
        </div>
      </div>

      <div className="tracking_tabs" style={{ marginBottom: "1.5rem" }}>
        <div className="tarcking_tab_left">
          <select onChange={stateHandleInput}>
            <option value="">All States</option>
            {allState?.map((state) => (
              <option key={state.id} value={state.id}>{state.name}</option>
            ))}
          </select>
          {/* <select name="beat_id" onChange={handleInput}>
            <option value="">All Beats</option>
            {allBeats.length === 0 && <option disabled value="">No Beats Found</option>}
            {allBeats?.map((beat) => (
              <option value={beat?.id}>{beat?.beatName}</option>
            ))}
          </select> */}
          <div
            className="view_btn"
            onClick={() => getRetailerFunc(filterData)}
          >
            View
          </div>
        </div>
        <div className="top_filter_section" >
          <div className="top_left_filter">
            <div className="entry_div">Show Entries</div>
            <select name="limit" onChange={topFilterHandleInput} className="limit_select" >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="new_add_btn_top_filter">
            <div className="top_right_filter position-relative">
            {allRetailers?.length !== 0 && (
            <>
             <div  className="top_right_create_btn_icon" onClick={handleSendMessage} style={{ marginLeft: "0.8rem" }}>
                  Send
                </div>
                <div onClick={() => setSelectPopup(!selectPopup)} className="top_right_create_btn_icon" style={{ marginLeft: "0.8rem" }}>
                  Select Leads
                </div>
            </>
          )}
          {selectPopup ?
              <div className='option_lists'style={{right:"90%" , top:"0%"}} >
               <div className='option_lists_div'onClick={() => selectionAllBtnFunc("action")}>Select All</div>
              <div className='option_lists_div' onClick={() => selectionBtnFunc("action")}>Bulk Select</div>
       
        </div>
    :""}
            </div>
            {/* <div className="add_new_side_btn" onClick={() => navigate("/add_party")}>
              Add New
            </div> */}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ margin: "auto", }}        >
          <CircularProgress />
        </div>
      ) : (
        <div className="" ref={pdfView}>
          <div className="table_scroll_container">
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>S. No.</StyledTableCell>
                  {filterCols?.map(col => <StyledTableCell>{col.label}</StyledTableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {allRetailers?.map((row, i) => (
                  <StyledTableRow key={i} >
                    <StyledTableCell>
                        {selectionBtn === "action" && (
                          <input
                            onChange={(e) => selectionCheckboxFunc(e, row)}
                            checked={allRowSelect?true:selectedCustomerArr.includes(row.id)}
                            type="checkbox"
                            style={{ marginRight: "0.5rem" }}
                          />
                        )}
                        {((pageCount * filterData.limit) - filterData.limit) + (i + 1)}</StyledTableCell>
                    {filterCols?.map(col => <TCComponent data={{ row, col }} />)}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {allRetailers && (
            <div className="top_filter_section" style={{ marginBlock: "1rem" }} >
              <div className="limit_bottom_info">Showing {((pageCount * filterData.limit) - filterData.limit) + 1} to {totalDataCount > pageCount * filterData.limit ? pageCount * filterData.limit : totalDataCount} of {totalDataCount} entries</div>
              <div>
                <Pagination
                  count={pageLength}
                  size="medium"
                  color="primary"
                  shape="rounded"
                  variant="outlined"
                  onChange={(e, value) => setpageCount(value)}
                  page={pageCount}
                />
              </div>
            </div>
          )}
          {!allRetailers && (
            <div className="no_data">
              No Data
            </div>
          )}
        </div>
      )}
     <SendMessagePage
      open={sendMessagePopup}
      close={() => setsendMessagePopup(!sendMessagePopup)}
      messageData={location.state}
      sentName={sentName}
      name="customer"
      />
    </div>
  );
};

export default ShareCustomer;