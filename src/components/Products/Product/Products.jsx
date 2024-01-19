import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

import { Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";
import { CircularProgress, Pagination } from "@mui/material";
import fetchAllBrands, { deleteProduct, editProduct, fetchAllCategory, fetchAllProduct, searchProduct } from "../../../api/productAPI";

import { useRef } from "react";
import { BsFilterLeft } from "react-icons/bs"
import { saveToPdf } from "../../../utils/saveToPdf";
import xlsx from "json-as-xlsx";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import isAllowed from "../../../utils/isAllowed";
import { PRODUCT_MANAGEMENT } from "../../../constants";

const Products = () => {
  const navigate = useNavigate();
  const [permissionAllowed, setpermissionAllowed] = useState(false)

  const pdfView = useRef(null);
  const [filterDivExtended, setfilterDivExtended] = useState(false);
  const [exportBtnLoading, setexportBtnLoading] = useState(false)
  const [pdfBtnLoading, setpdfBtnLoading] = useState(false)

  const [isLoading, setisLoading] = useState(false);
  const [btnLoading, setbtnLoading] = useState(false);
  const [allBrand, setallBrand] = useState([]);
  const [allCategory, setallCategory] = useState([]);
  const [allSubCategory, setallSubCategory] = useState([]);

  const [search, setSearch] = useState("");
  const [allProduct, setallProduct] = useState([]);
  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState();
  const [totalDataCount, settotalDataCount] = useState();

  const [deletePopup, setdeletePopup] = useState(false);
  const [currentGroup, setcurrentGroup] = useState({});

  const [filterData, setfilterData] = useState({
    brand_id: "",
    catagory_id: "",
    // sub_catagory_id: "",
    limit: "10",
    page: pageCount,
  });

  useEffect(() => {
    fetchAllBrands().then((res) => setallBrand(res.data.result));
    fetchAllCategory().then((res) => setallCategory(res.data.result));
  }, [])
  useEffect(() => {
    fetchAllProductFunc({ ...filterData, page: pageCount });
  }, [pageCount]);

  // useEffect(() => {
  //   if (search !== "") {
  //     let ID = setTimeout(() => {
  //       fetchAllProductFunc({ ...filterData, search })
  //     }, 1000);

  //     return () => clearTimeout(ID);
  //   }
  // }, [search]);

  const fetchAllProductFunc = async (filterData) => {
    setisLoading(true);
    if (!await isAllowed(PRODUCT_MANAGEMENT)) {
      toast.error("Module is not purchased!");
      return setisLoading(false);
    }

    try {
      fetchAllProduct(filterData).then((res) => {
        // console.log(res);
        if (res.data.status) {
          setallProduct(res.data.result);
          setpageLength(res.data.pageLength);
          settotalDataCount(res.data.count);
          setisLoading(false);
          setbtnLoading(false)
        } else {
          setisLoading(false);
          toast.error(res.data.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const searchProductFunc = async (e) => {
    // console.log(e.target.value);
    try {
      setisLoading(true);
      let res = await searchProduct(e.target.value, pageCount)
      // console.log(res)
      if (res.data.status) {
        setallProduct(res.data.result);
        setpageLength(res.data.pageLength);
      } else {
        toast.error(res.data.message);
      }
      setisLoading(false);
    } catch (error) {
      console.log(error)
    }
  }

  // console.log(allProduct)

  const editProductStatus = async (e, id) => {
    // console.log(e.target.value, id);
    let data = {
      id,
      status: e.target.value,
    };

    try {
      setisLoading(true);
      let res = await editProduct(null, data);
      // console.log(res);
      if (res.data.status) {
        toast.success("Product Edited Successfully!");
        fetchAllProductFunc(filterData);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProductFunc = async () => {
    // console.log(currentGroup);
    try {
      let res = await deleteProduct(currentGroup.id);
      // console.log(res);
      if (res.data.status) {
        toast.success("Product Deleted Successfully!");
        setdeletePopup(false);
        setisLoading(true);
        fetchAllProductFunc(filterData);
      } else {
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

  const categoryHandleInput = async (e) => {
    console.log(e.target.value);
    setfilterData({ ...filterData, [e.target.name]: e.target.value });
    try {
      fetchAllCategory(1, e.target.value).then((res) => setallSubCategory(res.data.result))
    } catch (error) {
      console.log(error)
    }
  }

  const topFilterHandleInput = (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value })
    filterProductFunc({ ...filterData, [e.target.name]: e.target.value })
  }

  const filterProductFunc = async (filterData) => {
    // console.log(filterData)
    try {
      setbtnLoading(true)
      fetchAllProductFunc(filterData)
    } catch (error) {
      console.log(error)
    }
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
      if (allProduct.length < 1) return toast.error("Report list is empty!");
      return saveToPdf(pdfView, "Monthly Attendence Report (All Employee)");
    }
  }

  // Import & Export
  let settings = {
    fileName: "SaleSparrow Products", // Name of the resulting spreadsheet
    extraLength: 3, // A bigger number means that columns will be wider
    writeMode: 'writeFile', // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
    writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
    RTL: false, // Display the columns from right-to-left (the default value is false)
  }

  const exportFunc = () => {
    if (allProduct.length < 1) {
      return toast.error("All product list is empty!")
    }
    let data = [
      {
        sheet: "Adults",
        columns: [
          { label: "ID", value: (row) => row.id ? row.id : "" },
          { label: "Product Name", value: (row) => row.name ? row.name : "" },
          { label: "Brand Name", value: (row) => row.brand_name ? row.brand_name : "" },
          { label: "Category Name", value: (row) => row.catagory_name ? row.catagory_name : "" },
          // { label: "Sub Category Name", value: (row) => row.sub_catagory_name ? row.sub_catagory_name : "" },
          { label: "GST", value: (row) => row.gst ? row.gst : "" },
          { label: "Image", value: (row) => row.image ? row.image : "" },
          { label: "Status", value: (row) => row.status ? row.status : "" },
        ],
        content: allProduct
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
      label: 'Product Name',
      key: 'name',
      type: "value",
      active: true,
    },
    {
      label: 'HSN Code',
      key: 'hsn_code',
      type: "value",
      active: true,
    },
    {
      label: 'Brand',
      key: 'brand_name',
      type: "value",
      active: true,
    },
    {
      label: 'Category',
      key: "catagory_name",
      type: "value",
      active: true,
    },
    {
      label: 'MRP',
      key: "mrp",
      type: "value",
      active: true,
    },
    {
      label: 'Unit 1',
      key: "packing_details",
      type: "unit_1",
      active: true,
    },
    {
      label: 'Unit 2',
      key: "packing_details",
      type: "unit_2",
      active: true,
    },
    {
      label: 'GST',
      key: "gst",
      type: "gst_value",
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

  const getUnitFunc = (unit, type) => {
    if (type === "unit_1") return <div style={{ whiteSpace: "nowrap" }}>{JSON.parse(unit?.[0])?.[0]?.unitName}<br />Pieces per unit: {JSON.parse(unit?.[0])?.[0]?.unitValue}</div>
    // else if (type === "unit_2") return <div style={{ whiteSpace: "nowrap" }}>{JSON.parse(unit?.[0])?.[1]?.unitName}<br />Pieces per unit: {JSON.parse(unit?.[0])?.[1]?.unitValue}</div>
    else if (type === "unit_2") return <div style={{ whiteSpace: "nowrap" }}>{JSON.parse(unit?.[0])?.[1]?.unitName}<br />{JSON.parse(unit?.[0])?.[0]?.unitValue}{JSON.parse(unit?.[0])?.[0]?.unitName} * {JSON.parse(unit?.[0])?.[1]?.unitValue}Pieces = {JSON.parse(unit?.[0])?.[0]?.unitValue * JSON.parse(unit?.[0])?.[1]?.unitValue} Pieces</div>
  }

  const TCComponent = ({ data }) => {
    let { row, col } = data;
    if (col.type === "image") {
      return <StyledTableCell>{row.image ? <img style={{ height: "2rem", width: "3rem" }} src={row.image} alt="" /> : null}</StyledTableCell>;
    } else if (col.type === "status") {
      return (
        <StyledTableCell>
          <div className={`${row.status === "Active" || row.status === "Approved" ? "active_beat" : "inactive_beat"}`} >
            <select name="day" onChange={(e) => editProductStatus(e, row.id)}            >
              <option value="">{row.status}</option>
              <option value="Active">Active</option>
              <option value="InActive">InActive</option>
            </select>
          </div>
        </StyledTableCell>
      )
    } else if (col.type === "action") {
      return (
        <div style={{ whiteSpace: "nowrap" }} >
          <StyledTableCell>
            <BorderColorIcon
              onClick={() => navigate("/edit_product", { state: row })}
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
        </div>
      )
    } else if (col.type === "unit_1") {
      return <StyledTableCell>{getUnitFunc(row[col.key], "unit_1")}</StyledTableCell>
    } else if (col.type === "unit_2") {
      return <StyledTableCell>{getUnitFunc(row[col.key], "unit_2")}</StyledTableCell>
    } else if (col.type === "gst_value") {
      return <StyledTableCell>{row[col.key]}%</StyledTableCell>
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
          <div className="title">Products</div>
        </div>
        <div className="beat_right employee_head">
          <div className="search">
            <SearchIcon style={{ color: `var(--main-color)` }} />
            <input type="text" onChange={searchProductFunc} placeholder="Search" />
          </div>
          {/* <div className="add_btn" onClick={() => navigate("/add_product")}>
            Add New
          </div> */}
        </div>
      </div>

      <div className="tracking_tabs" style={{ marginBottom: "1.5rem" }} >
        <div className="tarcking_tab_left">
          <select name="brand_id" onChange={handleInput} >
            <option value="">Brand</option>
            {allBrand.length === 0 && <option disabled value="">No Brand Found</option>}
            {allBrand?.map((brand) => (
              <option key={brand._id} value={brand._id}>{brand.name}</option>
            ))}
          </select>
          <select name="catagory_id" onChange={handleInput} >
            <option value="">Category</option>
            {allCategory.length === 0 && <option disabled value="">No Category Found</option>}
            {allCategory?.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
          {/* <select name="sub_catagory_id" onChange={handleInput} >
            <option value="">Sub Category</option>
            {allSubCategory.length === 0 && <option disabled value="">No Sub Category Found</option>}
            {allSubCategory?.map((scategory) => (
              <option key={scategory.id} value={scategory.id}>{scategory.name}</option>
            ))}
          </select> */}
          <div
            className="view_btn"
            onClick={() => filterProductFunc(filterData)}
          >
            {btnLoading ? (
              <CircularProgress style={{ color: "#fff" }} size={20} />
            ) : (
              "Filter"
            )}
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
          { permissionAllowed && <div className="add_new_side_btn" onClick={() => navigate("/add_product")}>
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
                {allProduct?.map((row, i) => (
                  <StyledTableRow key={i} >
                    <StyledTableCell>{((pageCount * filterData.limit) - filterData.limit) + (i + 1)}</StyledTableCell>
                    {filterCols?.map(col => <TCComponent data={{ row, col }} />)}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {allProduct?.length === 0 && (
            <div className="no_data">
              No data
            </div>
          )}

          {allProduct?.length !== 0 && (
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
              onClick={() => deleteProductFunc()}
            >
              Delete
            </div>
          </div>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
};

export default Products;
