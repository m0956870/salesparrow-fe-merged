import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import group from "../../../images/group.png";
import excel_out from "../../../images/excel_out.png";
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
import fetchAllBrands, { deletePriceList, editPriceList, fetchPriceListing } from "../../../api/productAPI";

import { useRef } from "react";
import { BsFilterLeft } from "react-icons/bs"
import xlsx from "json-as-xlsx";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import { saveToPdf } from "../../../utils/saveToPdf";

const PriceList = () => {
    const navigate = useNavigate();
    const [isLoading, setisLoading] = useState(false);

    const pdfView = useRef(null);
    const [filterDivExtended, setfilterDivExtended] = useState(false);
    const [exportBtnLoading, setexportBtnLoading] = useState(false)
    const [pdfBtnLoading, setpdfBtnLoading] = useState(false)

    const [allPriceList, setAllBrand] = useState([]);
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
        fetchPriceListingFunc(filterData);
    }, [pageCount]);

    const fetchPriceListingFunc = async (filterData) => {
        setisLoading(true);

        fetchPriceListing(filterData).then((res) => {
            if (res.data.status) {
                // console.log(res);
                setAllBrand(res.data.result);
                setpageLength(res.data.pageLength);
                setisLoading(false);
            } else {
                setisLoading(false);
                toast.error(res.data.message);
            }
        });
    };

    const editPriceListStatus = async (e, id) => {
        // console.log(e.target.value, id);
        let data = {
            id,
            status: e.target.value,
        };

        try {
            setisLoading(true);
            let res = await editPriceList(data);
            // console.log(res);
            if (res.data.status) {
                toast.success("Price List Edited Successfully!");
                fetchPriceListingFunc(filterData);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteBrandFunc = async () => {
        // console.log(currentGroup);
        try {
            let res = await deletePriceList(currentGroup._id);
            // console.log(res);
            if (res.data.status) {
                toast.success("Price List Deleted Successfully!");
                setdeletePopup(false);
                setisLoading(true);
                fetchPriceListingFunc(filterData);
            } else {
                toast.error(res.data.message);
                setisLoading(false);
            }
        } catch (error) {
            console.log(error);
            setisLoading(false);
        }
    };

    const handleInput = async (e) => {
        setfilterData({ ...filterData, [e.target.name]: e.target.value });
    };

    const topFilterHandleInput = (e) => {
        setfilterData({ ...filterData, [e.target.name]: e.target.value })
        fetchPriceListingFunc(filterData)
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
            if (allPriceList.length < 1) return toast.error("Report list is empty!");
            return saveToPdf(pdfView, "Monthly Attendence Report (All Employee)");
        }
    }

    // Export
    let settings = {
        fileName: "Price List", // Name of the resulting spreadsheet
        extraLength: 3, // A bigger number means that columns will be wider
        writeMode: 'writeFile', // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
        writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
        RTL: false, // Display the columns from right-to-left (the default value is false)
    }

    const exportFunc = () => {
        if (allPriceList.length < 1) {
            return toast.error("All list is empty!")
        }
        let data = [
            {
                sheet: "Adults",
                columns: [
                    { label: "ID", value: (row) => row.id ? row.id : "" },
                ],
                content: allPriceList
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

    // Filter
    const [tableCols, setTableCols] = useState([
        {
            label: 'List Name',
            key: 'price_list_name',
            type: "value",
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
        if (col.type === "status") {
            return (
                <StyledTableCell>
                    <div className={`${row.status === "Active" || row.status === "Approved" ? "active_beat" : "inactive_beat"}`}                    >
                        <select name="day" onChange={(e) => editPriceListStatus(e, row._id)} >
                            <option value="">{row.status}</option>
                            <option value="Active">Active</option>
                            <option value="InActive">InActive</option>
                        </select>
                    </div>
                </StyledTableCell>
            )
        } else if (col.type === "action") {
            return (
                <StyledTableCell>
                    <BorderColorIcon
                        onClick={() => navigate("/edit_price_list", { state: row })}
                        style={{ fontSize: "1rem", color: "var(--main-color)", marginLeft: "0.5rem", }}
                        className="emp_grp_icons"
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

    return (
        <div className="container">
            <div className="beat_heading">
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">Price List</div>
                </div>
                <div className="beat_right employee_head">
                    {/* <img src={excel_out} className="excel_icon" onClick={() => exportFunc()} alt="icon" /> */}
                    {/* <div className="search">
                        <SearchIcon style={{ color: `var(--main-color)` }} />
                        <input onChange={searchBrandFunc} type="text" placeholder="Search"
                        />
                    </div> */}
                    <div className="add_btn" onClick={() => navigate("/add_price_list")}>
                        Add New
                    </div>
                </div>
            </div>

            <div className="top_filter_section" style={{ marginBottom: "1.5rem" }}>
                <div className="top_left_filter">
                    <div className="entry_div">Show Entries</div>
                    <select name="limit" onChange={topFilterHandleInput} className="limit_select" >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>
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
                                {allPriceList?.map((row, i) => (
                                    <StyledTableRow key={i} >
                                        <StyledTableCell>{((pageCount * filterData.limit) - filterData.limit) + (i + 1)}</StyledTableCell>
                                        {filterCols?.map(col => <TCComponent data={{ row, col }} />)}
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {allPriceList?.length !== 0 && (
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
                    {allPriceList?.length == 0 && (
                        <div className="no_data">
                            No data
                        </div>
                    )}
                </div>
            )}
            <Dialog
                open={deletePopup}
                aria-labelledby="form-dialog-title"
                maxWidth="xs"
                fullWidth={true}
                onClose={() => setdeletePopup(false)}
            >
                <DialogTitle className="dialog_title">
                    <div>Do you want to delete {currentGroup.price_list_name}?</div>
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
                            onClick={() => deleteBrandFunc()}
                        >
                            Delete
                        </div>
                    </div>
                </DialogContent>
                <DialogActions></DialogActions>
            </Dialog>
        </div>
    )
}

export default PriceList