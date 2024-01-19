import "./Party.css";
import React, { useEffect, useState } from "react";
import group from "../../images/group.png";
import excel_in from "../../images/excel_in.png";
import excel_out from "../../images/excel_out.png";

import SearchIcon from "@mui/icons-material/Search";
// import VisibilityIcon from "@mui/icons-material/Visibility";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";

import fetchAllParty, { deleteParty, editParty, getPartyType, importParties } from "../../api/partyAPI";
import { CircularProgress, Pagination } from "@mui/material";
import getStateFunc from "../../api/locationAPI";

import { useRef } from "react";
import { BsFilterLeft } from "react-icons/bs"
import { saveToPdf } from "../../utils/saveToPdf";
import xlsx from "json-as-xlsx";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import isAllowed from "../../utils/isAllowed";
import { PARTY_MANAGEMENT } from "../../constants";

const Party = () => {
  const navigate = useNavigate();
  const pdfView = useRef(null);
  const [isLoading, setisLoading] = useState(false);
  const [filterDivExtended, setfilterDivExtended] = useState(false);
  const [exportBtnLoading, setexportBtnLoading] = useState(false)
  const [pdfBtnLoading, setpdfBtnLoading] = useState(false)
  const [permissionAllowed, setpermissionAllowed] = useState(false)

  const [allState, setallState] = useState([]);
  const [allParty, setallParty] = useState([]);
  const [partyTypes, setpartyTypes] = useState()
  const [stateID, setstateID] = useState("");

  const [search, setSearch] = useState("");
  const [allParties, setallParties] = useState();
  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState();
  const [totalDataCount, settotalDataCount] = useState();

  const [deletePopup, setdeletePopup] = useState(false);
  const [currentGroup, setcurrentGroup] = useState({});
  const [viewDocumentPopup, setviewDocumentPopup] = useState(false)

  const [filterData, setfilterData] = useState({
    state: "",
    party_id: "",
    partyType: "",
    start_date: "",
    end_date: "",
    limit: "10",
    page: pageCount,
  });

  useEffect(() => {
    getPartyType().then(res => setpartyTypes(res.data.result))
    // fetchAllParty().then(res => setallParty(res.data.result))
    getStateFunc().then((res) => setallState(res.data.result));
  }, []);
  useEffect(() => {
    fetchAllPartyFunc({ ...filterData, page: pageCount });
  }, [pageCount]);

  useEffect(() => {
    if (search !== "") {
      let ID = setTimeout(() => {
        fetchAllPartyFunc({ ...filterData, search })
      }, 1000);

      return () => clearTimeout(ID);
    }
  }, [search]);

  const fetchAllPartyFunc = async (filterData) => {
    setisLoading(true)
    if (!await isAllowed(PARTY_MANAGEMENT)) {
      toast.error("Module is not purchased!");
      return setisLoading(false);
    }

    let res = await fetchAllParty(filterData);
    if (res.data.status) {
      setallParties(res.data.result);
      setpageLength(res.data.pageLength);
      settotalDataCount(res.data.count);
    } else {
      toast.error(res.data.message);
    }
    setisLoading(false);
  };

  const editPartyStatus = async (e, id) => {
    let data = { id, status: e.target.value, };
    setisLoading(true);
    let res = await editParty(data);
    if (res.data.status) {
      toast.success("Party edited successfully!");
      fetchAllPartyFunc(filterData);
    } else {
      toast.error(res.data.message);
      setisLoading(false);
    }
  };

  const deletePartyFunc = async () => {
    setisLoading(true);
    let res = await deleteParty(currentGroup.id);
    if (res.data.status) {
      toast.success("Party deleted successfully!");
      setdeletePopup(false);
      setisLoading(true);
      fetchAllPartyFunc(filterData);
    } else {
      toast.error(res.data.message);
      setisLoading(false);
    }
  };

  let settings = {
    fileName: "SaleSparrow Parties", // Name of the resulting spreadsheet
    extraLength: 3, // A bigger number means that columns will be wider
    writeMode: 'writeFile', // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
    writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
    RTL: false, // Display the columns from right-to-left (the default value is false)
  }

  const exportFunc = () => {
    if (allParties.length < 1) {
      return toast.error("All party list is empty!")
    }

    let data = [
      {
        sheet: "Adults",
        columns: [
          { label: "ID", value: (row) => row.id ? row.id : "" },
          { label: "Firm_Name", value: (row) => row.firmName ? row.firmName : "" },
          { label: "Party_Type", value: (row) => row.partyType ? row.partyType : "" },
          { label: "Contact_Person_Name", value: (row) => row.contactPersonName ? row.contactPersonName : "" },
          { label: "Phone_Number", value: (row) => row.mobileNo ? row.mobileNo : "" },
          { label: "GST_No", value: (row) => row.GSTNo ? row.GSTNo : "" },
          { label: "State", value: (row) => row.state.name ? row.state.name : "" },
          { label: "City", value: (row) => row.city.name ? row.city.name : "" },
          { label: "Pincode", value: (row) => row.pincode ? row.pincode : "" },
          { label: "Address_1", value: (row) => row.address1 ? row.address1 : "" },
          { label: "Address_2", value: (row) => row.address2 ? row.address2 : "" },
          { label: "Email", value: (row) => row.email ? row.email : "" },
          { label: "DOB", value: (row) => row.DOB ? row.DOB : "" },
          { label: "DOA", value: (row) => row.DOA ? row.DOA : "" },
          { label: "Profile_Image", value: (row) => row.image ? row.image : "" },
          { label: "Status", value: (row) => row.status ? row.status : "" },
        ],
        content: allParties
      },
    ]
    console.log(data);
    try {
      xlsx(data, settings, callback)
    } catch (error) {
      console.log(error);
    }
  }

  let callback = function (sheet) {
    console.log("Download complete:", sheet)
  }

  let importFunc = async (e) => {
    const file = e.target.files[0];
    console.log(file);
    try {
      let res = await importParties(file)
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  const getPartyTypeFunc = async () => {
    try {
      let res = await getPartyType()
      // console.log(res)
      if (res.data.status) {
        setpartyTypes(res.data.result)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleInput = (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value });
  };
  const stateHandleInput = (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value });
  }

  const filterFunc = () => {
    fetchAllPartyFunc(filterData)
  }

  const topFilterHandleInput = (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value })
    fetchAllPartyFunc({ ...filterData, [e.target.name]: e.target.value })
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
      if (allParties.length < 1) return toast.error("Report list is empty!");
      return saveToPdf(pdfView, "Parties");
    }
  }

  // Filter
  const [tableCols, setTableCols] = useState([
    {
      label: 'Party Code',
      key: 'partyid',
      type: "value",
      active: true,
    },
    {
      label: 'Party Type',
      key: 'partyType',
      type: "value",
      active: true,
    },
    {
      label: 'Party Name',
      key: 'firmName',
      type: "value",
      active: true,
    },
    {
      label: 'Assigned Routes',
      key: 'route',
      type: "route_value",
      active: true,
    },
    {
      label: 'Contact No.',
      key: "mobileNo",
      type: "value",
      active: true,
    },
    {
      label: 'State',
      key: "name",
      type: "state_value",
      active: true,
    },
    {
      label: 'Date',
      key: "DOB",
      type: "value",
      active: true,
    },
    {
      label: 'Documents',
      key: "View Documents",
      type: "document_value",
      active: true,
    },
    {
      label: 'Status',
      key: "status",
      type: "status",
      active: true,
    },
    {
      label: 'Action',
      key: "abscent",
      type: "action",
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
    if (col.type === "state_value") {
      return <StyledTableCell>{row.state?.[col.key]}</StyledTableCell>;
    } else if (col.type === "route_value") {
      return (
        <StyledTableCell>
          {row.route.length === 0 ? "-" :
            row.route?.map(route => (
              <div>
                {route.route_name}
              </div>
            ))}
        </StyledTableCell>
      )
    } else if (col.type === "document_value") {
      return (
        <StyledTableCell>
          <span className="view_doc_span"
            onClick={() => {
              setviewDocumentPopup(true);
              setcurrentGroup(row)
            }}>
            {col.key}
          </span>
        </StyledTableCell>
      )
    } else if (col.type === "status") {
      return (
        <StyledTableCell>
          <div className={`${row.status === "Active" || row.status === "Approved" ? "active_beat" : "inactive_beat"}`} >
            <select name="day" onChange={(e) => editPartyStatus(e, row.id)}>
              <option value="">{row.status}</option>
              <option value="Active">Active</option>
              <option value="InActive">InActive</option>
              <option value="Approved">Approved</option>
              <option value="UnApproved">UnApproved</option>
            </select>
          </div>
        </StyledTableCell>
      )
    } else if (col.type === "action") {
      return (
        <StyledTableCell>
          <BorderColorIcon
            onClick={() => navigate("/edit_party", { state: row })}
            style={{ fontSize: "1rem", color: "var(--main-color)", marginLeft: "0.5rem", }}
          />
          {/* <DeleteIcon
            style={{ fontSize: "1rem", color: "red", marginLeft: "0.5rem", }}
            className="emp_grp_icons"
            onClick={() => {
              setdeletePopup(true);
              setcurrentGroup(row);
            }}
          /> */}
        </StyledTableCell>
      )
    } else {
      return <StyledTableCell>{row[col.key]}</StyledTableCell>;
    }
  }

  // Table style
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

  // Document Table style
  const StyledDocumentTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "grey",
      color: theme.palette.common.white,
      fontWeight: "bold",
      borderRight: "1px solid #fff",
      overflow: "hidden",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      border: "none",
      borderLeft: "2px solid #f3f3f3",
      '&:last-child': {
        borderRight: "2px solid #f3f3f3",
      },
      whiteSpace: "nowrap",
      padding: "0.2rem 1rem",
    },
  }));

  return (
    <div className="container">
      <div className="beat_heading">
        <div className="beat_left">
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Party</div>
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
          <select name="state" onChange={stateHandleInput}>
            <option value="">All States</option>
            {allState?.map((state) => (
              <option key={state.id} value={state.id}>{state.name}</option>
            ))}
          </select>
          <select
            class="grouping_select"
            name="partyType"
            onChange={handleInput}
          >
            <option value="">All Party Types</option>
            {partyTypes?.map((type) => (
              <option key={type._id} value={type._id}>{type.party_type}</option>
            ))}
          </select>
          <div
            className="view_btn_2"
            onClick={() => filterFunc()}
          >
            View
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
          </div>
          <div className="new_add_btn_top_filter">
            <div className="top_right_filter">
              <div className="other_functionality_section" style={{ marginRight: 0 }}>
                <div className="section_options" onClick={() => filterAndExportFunc("column_filter")}>
                  <span className="filter_icon" ><BsFilterLeft size={22} /></span> Filter
                </div>
                <div className="section_options">
                  <label>
                    <span>Import</span>
                    <input type="file" accept=".xlsx, .xls, .csv" onChange={importFunc} name="file" style={{ display: "none" }} />
                  </label>
                </div>
                <div className="section_options" onClick={() => filterAndExportFunc("export")}>
                  {exportBtnLoading ? <CircularProgress size={24} /> : "Export"}
                </div>
                <div className="section_options" onClick={() => filterAndExportFunc("pdf")} >
                  {pdfBtnLoading ? <CircularProgress size={24} /> : "PDF"}
                </div>
                <div style={{ display: filterDivExtended ? "block" : "none" }} className="col_filter_section">
                  {tableCols?.map((col) => (
                    <div className="col_filter" >
                      <label >
                        <input type="checkbox" checked={col.active} onChange={() => toogleTableCol(col.key)} />
                        <span onChange={() => toogleTableCol(col.key)} >{col.label}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {permissionAllowed && <div className="add_new_side_btn" onClick={() => navigate("/add_party")}>
              Add New
            </div>}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ margin: "auto", }} >
          <CircularProgress />
        </div>
      ) : (
        <>
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
                  {allParties?.map((row, i) => (
                    <StyledTableRow key={i} >
                      <StyledTableCell>{((pageCount * filterData.limit) - filterData.limit) + (i + 1)}</StyledTableCell>
                      {filterCols?.map(col => <TCComponent data={{ row, col }} />)}
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          {allParties && allParties?.length !== 0 && (
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
          {allParties && allParties?.length === 0 && (
            <div className="no_data">
              No Data
            </div>
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
          <div>Do you want to delete {currentGroup.firmName}?</div>
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
              onClick={() => deletePartyFunc()}
            >
              Delete
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Document Popup */}
      <Dialog
        open={viewDocumentPopup}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
        fullWidth="true"
        onClose={() => setviewDocumentPopup(false)}
      >
        <DialogTitle className="dialog_title">
          <div>{currentGroup.firmName} Documents</div>
        </DialogTitle>
        {currentGroup?.document?.length === 0 ? (
          <div className="no_data">
            No Document Found
          </div>
        ) : (
          <DialogContent className="cardpopup_content">
            <Table aria-label="customized table">
              <TableHead>
                <TableRow onClick={() => console.log(currentGroup.document.length)} >
                  <StyledDocumentTableCell>S. No.</StyledDocumentTableCell>
                  <StyledDocumentTableCell>Document Name</StyledDocumentTableCell>
                  <StyledDocumentTableCell>Image</StyledDocumentTableCell>
                  <StyledDocumentTableCell>Action</StyledDocumentTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <StyledTableRow >
                  {currentGroup?.document?.map((row, i) => (
                    <>
                      <StyledDocumentTableCell >{i + 1}</StyledDocumentTableCell>
                      <StyledDocumentTableCell >{row?.name}</StyledDocumentTableCell>
                      <StyledDocumentTableCell >{row?.value ? <img style={{ height: "3rem", width: "4rem" }} src={row?.value} alt="" /> : null}</StyledDocumentTableCell>
                      <StyledDocumentTableCell ><a href={row?.value} download>download</a></StyledDocumentTableCell>
                    </>
                  ))}
                </StyledTableRow>
              </TableBody>
            </Table>
          </DialogContent>
        )}
      </Dialog>
    </div >
  );
};

export default Party;