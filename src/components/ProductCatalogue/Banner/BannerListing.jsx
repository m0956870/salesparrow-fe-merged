import React, { useEffect, useState } from "react";
import group from "../../../images/group.png";

import SearchIcon from "@mui/icons-material/Search";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";
import { Dialog, DialogActions, DialogTitle, DialogContent, } from "@mui/material";
import { CircularProgress, Pagination } from "@mui/material";
import { deleteCategory, editCategory, fetchAllCategory } from "../../../api/productAPI";

import { useNavigate } from "react-router-dom";
import { VIEW_CATALOGUE } from "../../../constants";
import AddBannerDialog from "./AddBannerDialog";
import EditBannerDialog from "./EditBannerDialog";

import { useRef } from "react";
import { BsFilterLeft } from "react-icons/bs"
import { saveToPdf } from "../../../utils/saveToPdf";
import xlsx from "json-as-xlsx";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import isAllowed from "../../../utils/isAllowed.js";
import { deleteCatalogueBanner, getCatalogueListing } from "../../../api/catalogueAPI.js";

const BannerListing = () => {
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);

  const pdfView = useRef(null);
  const [filterDivExtended, setfilterDivExtended] = useState(false);
  const [exportBtnLoading, setexportBtnLoading] = useState(false)
  const [pdfBtnLoading, setpdfBtnLoading] = useState(false)
  const [permissionAllowed, setpermissionAllowed] = useState(false)

  const [addCategoryPopup, setaddCategoryPopup] = useState();
  const [editCategoryPopup, seteditCategoryPopup] = useState();
  const [currCardData, setcurrCardData] = useState([])

  const [allCategory, setallCategory] = useState([]);
  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState();
  const [totalDataCount, settotalDataCount] = useState();

  const [deletePopup, setdeletePopup] = useState(false);
  const [currentGroup, setcurrentGroup] = useState({});

  const [filterData, setfilterData] = useState({
    limit: "10",
    page: pageCount,
  })

  useEffect(() => {
    getCatalogueListingFunc({ ...filterData, page: pageCount });
  }, [pageCount]);

  useEffect(() => {
    if (addCategoryPopup === false) {
      getCatalogueListingFunc(filterData)
    }
  }, [addCategoryPopup])

  useEffect(() => {
    if (editCategoryPopup === false) {
      getCatalogueListingFunc(filterData)
    }
  }, [editCategoryPopup])

  const getCatalogueListingFunc = async (filterData) => {
    setisLoading(true);
    if (!await isAllowed(VIEW_CATALOGUE)) {
      toast.error("Module is not purchased!");
      return setisLoading(false);
    } else {
      setpermissionAllowed(true)
    }

    getCatalogueListing(filterData).then((res) => {
      if (res.data.status) {
        setallCategory(res.data.data);
        setpageLength(res.data.total_pages);
        settotalDataCount(res.data.total_users);
      } else {
        toast.error(res.data.message);
      }
      setisLoading(false);
    });
  };

  const deleteBeatFunc = async () => {
    // console.log(currentGroup);
    try {
      let res = await deleteCatalogueBanner(currentGroup._id);
      // console.log(res);
      if (res.data.status) {
        toast.success("Category Deleted Successfully!");
        setdeletePopup(false);
        setisLoading(true);
        getCatalogueListingFunc(filterData);
      } else {
        setdeletePopup(false);
        toast.error(res.data.message);
        setisLoading(false);
      }
    } catch (error) {
      console.log(error);
      setisLoading(false);
    }
  };

  // Filter section
  const handleInput = (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value });
  };

  const topFilterHandleInput = (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value })
    getCatalogueListingFunc({ ...filterData, [e.target.name]: e.target.value })
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
      if (allCategory.length < 1) return toast.error("Report list is empty!");
      return saveToPdf(pdfView, "Monthly Attendence Report (All Employee)");
    }
  }

  // Import & Export
  let settings = {
    fileName: "SaleSparrow Catalogue Banners", // Name of the resulting spreadsheet
    extraLength: 3, // A bigger number means that columns will be wider
    writeMode: 'writeFile', // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
    writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
    RTL: false, // Display the columns from right-to-left (the default value is false)
  }

  const exportFunc = () => {
    if (allCategory.length < 1) {
      return toast.error("List is empty!")
    }
    let data = [
      {
        sheet: "Adults",
        columns: [
          { label: "ID", value: (row) => row.id ? row.id : "" },
          { label: "Product Name", value: (row) => row.name ? row.name : "" },
        ],
        content: allCategory
      },
    ]
    // console.log(data);
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
      label: 'Image',
      key: 'image',
      type: "image",
      active: true,
    },
    {
      label: 'Priority',
      key: 'priority',
      type: "value",
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
    if (col.type === "image") {
      return <StyledTableCell>{row.image ? <img style={{ height: "2rem", width: "3rem" }} src={row.image} alt="" /> : null}</StyledTableCell>;
    } else if (col.type === "action") {
      return (
        <div style={{ whiteSpace: "nowrap" }} >
          <StyledTableCell>
            <BorderColorIcon
              onClick={() => {
                seteditCategoryPopup(true)
                setcurrCardData(row)
              }}
              style={{ fontSize: "1rem", color: "var(--main-color)", marginLeft: "0.5rem", }}
            />
            <DeleteIcon
              style={{ fontSize: "1rem", color: "red", marginLeft: "0.5rem", }}
              className="emp_grp_icons"
              onClick={() => {
                setdeletePopup(true);
                setcurrentGroup(row);
              }}
            />
          </StyledTableCell>
        </div>
      )
    } else {
      return <StyledTableCell >{row[col.key]}</StyledTableCell>;
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

  return (
    <div className="container">
      <div className="beat_heading">
        <div className="beat_left">
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Banners</div>
        </div>
        <div className="beat_right employee_head">
          {/* <img src={excel_out} className="excel_icon" onClick={() => exportFunc()} alt="icon" /> */}
          {/* <div className="search">
            <SearchIcon style={{ color: `var(--main-color)` }} />
            <input type="text" onChange={searchCategoryFunc} placeholder="Search" />
          </div> */}
          {/* {permissionAllowed && <div className="add_btn" onClick={() => setaddCategoryPopup(true)}>
            Add New
          </div>} */}
        </div>
      </div>

      <div className="tracking_tabs" style={{ marginBottom: "1.5rem" }} >
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
            {permissionAllowed && <div className="add_new_side_btn" onClick={() => setaddCategoryPopup(true)}>
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
                {allCategory?.map((row, i) => (
                  <StyledTableRow key={i} >
                    <StyledTableCell>{((pageCount * filterData.limit) - filterData.limit) + (i + 1)}</StyledTableCell>
                    {filterCols?.map(col => <TCComponent data={{ row, col }} />)}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {allCategory?.length === 0 && (
            <div className="no_data">
              No data
            </div>
          )}

          {allCategory?.length !== 0 && (
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
        </div>
      )}

      <Dialog
        open={deletePopup}
        aria-labelledby="form-dialog-title"
        maxWidth="xs"
        fullWidth="true"
        onClose={() => setdeletePopup(false)}
      >
        <DialogTitle className="dialog_title">
          <div>Do you want to delete {currentGroup.name}?</div>
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
              onClick={() => deleteBeatFunc()}
            >
              Delete
            </div>
          </div>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>

      <AddBannerDialog
        open={addCategoryPopup}
        close={() => setaddCategoryPopup(!addCategoryPopup)}
      />
      <EditBannerDialog
        open={editCategoryPopup}
        close={() => seteditCategoryPopup(!editCategoryPopup)}
        currCardData={currCardData}
      />
    </div>
  );
};

export default BannerListing;
