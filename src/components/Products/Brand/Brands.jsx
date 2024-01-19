import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import group from "../../../images/group.png";
// import excel_in from "../../../images/excel_in.png";
import excel_out from "../../../images/excel_out.png";

import xlsx from "json-as-xlsx"

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
import { toast } from "react-toastify";
import fetchAllBrands, { deleteBrand, editBrand, searchBrand } from "../../../api/productAPI";
import isAllowed from "../../../utils/isAllowed";
import { PRODUCT_MANAGEMENT } from "../../../constants";

const Beat = () => {
    const navigate = useNavigate();
    const [isLoading, setisLoading] = useState(false);
    const [permissionAllowed, setpermissionAllowed] = useState(false)

    const [allBrand, setAllBrand] = useState([]);
    const [pageCount, setpageCount] = useState(1);
    const [pageLength, setpageLength] = useState();

    const [deletePopup, setdeletePopup] = useState(false);
    const [currentGroup, setcurrentGroup] = useState({});

    const fetchAllBrandFunc = async () => {
        setisLoading(true);
        if (!await isAllowed(PRODUCT_MANAGEMENT)) {
            setpermissionAllowed(false);
            toast.error("Module is not purchased!")
            return setisLoading(false);
        } else {
            setpermissionAllowed(true);
        }

        let res = await fetchAllBrands(pageCount)
        if (res.data.status) {
            // console.log(res);
            setAllBrand(res.data.result);
            setpageLength(res.data.pageLength);
            setisLoading(false);
        } else {
            setisLoading(false);
            toast.error(res.data.message);
        }
    };

    useEffect(() => {
        fetchAllBrandFunc();
    }, [pageCount]);

    const searchBrandFunc = async (e) => {
        // console.log(e.target.value);
        try {
            setisLoading(true);
            let res = await searchBrand(e.target.value, pageCount)
            // console.log(res)
            if (res.data.status) {
                setAllBrand(res.data.result);
                setpageLength(res.data.pageLength);
                setisLoading(false);
            } else {
                setisLoading(false);
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const [titlename, settitlename] = useState("");
    const filterData = allBrand?.filter((row) => {
        return row?.beatName?.toLowerCase().indexOf(titlename?.toLowerCase()) !== -1;
    });

    // console.log(allBrand);

    const editBrandStatus = async (e, id) => {
        // console.log(e.target.value, id);
        let data = {
            id,
            status: e.target.value,
        };
        try {
            setisLoading(true);
            let res = await editBrand(null, data);
            console.log(res);
            if (res.data.status) {
                toast.success("Brand edited Successfully!");
                fetchAllBrandFunc();
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
            let res = await deleteBrand(currentGroup._id);
            // console.log(res);
            if (res.data.status) {
                toast.success("Brand Deleted Successfully!");
                setdeletePopup(false);
                setisLoading(true);
                fetchAllBrandFunc();
            } else {
                toast.error(res.data.message);
                setisLoading(false);
            }
        } catch (error) {
            console.log(error);
            setisLoading(false);
        }
    };

    // Import & Export
    let settings = {
        fileName: "SaleSparrow Brands", // Name of the resulting spreadsheet
        extraLength: 3, // A bigger number means that columns will be wider
        writeMode: 'writeFile', // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
        writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
        RTL: false, // Display the columns from right-to-left (the default value is false)
    }

    const exportFunc = () => {
        if (allBrand.length < 1) {
            return toast.error("All brand list is empty!")
        }
        let data = [
            {
                sheet: "Adults",
                columns: [
                    { label: "ID", value: (row) => row._id ? row._id : "" },
                    { label: "Brand Name", value: (row) => row.name ? row.name : "" },
                    { label: "Image", value: (row) => row.image ? row.image : "" },
                    { label: "Status", value: (row) => row.status ? row.status : "" },
                ],
                content: allBrand
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

    return (
        <div className="container">
            <div className="beat_heading">
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">Brands</div>
                </div>
                <div className="beat_right employee_head">
                    <img src={excel_out} className="excel_icon" onClick={() => exportFunc()} alt="icon" />
                    <div className="search">
                        <SearchIcon style={{ color: `var(--main-color)` }} />
                        <input onChange={searchBrandFunc} type="text" placeholder="Search"
                        />
                    </div>
                    {permissionAllowed && <div className="add_btn" onClick={() => navigate("/add_brand")}>
                        Add New
                    </div>}
                </div>
            </div>

            {isLoading ? (
                <div
                    style={{
                        margin: "auto",
                    }}
                >
                    <CircularProgress />
                </div>
            ) : (
                <div className="beat_table">
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Image</StyledTableCell>
                                <StyledTableCell align="center">Brand Name</StyledTableCell>
                                <StyledTableCell align="center">Status</StyledTableCell>
                                <StyledTableCell align="center">Action</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {/* <div style={{ margin: "0.5rem 0" }}></div> */}
                        {filterData?.length === 0 ? (
                            <div className="no_data" style={{ width: "400%" }}>
                                No data
                            </div>
                        ) : (
                            <TableBody>
                                {filterData?.map((row) => (
                                    <>
                                        <StyledTableRow key={row._id}>
                                            <StyledTableCell component="th" scope="row">
                                                {row.image ? <img style={{ height: "2rem", width: "3rem" }} src={row.image} alt="" /> : null}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {row.name}
                                            </StyledTableCell>
                                            <StyledTableCell
                                                align="center"
                                                component="th"
                                                scope="row"
                                            >
                                                <div className={`${row.status === "Active" || row.status === "Approved" ? "active_beat" : "inactive_beat"}`}
                                                >
                                                    <select name="day" onChange={(e) => editBrandStatus(e, row._id)}                                                    >
                                                        <option value="">{row.status}</option>
                                                        <option value="Active">Active</option>
                                                        <option value="InActive">InActive</option>
                                                        {/* <option value="Approved">Approved</option>
                                                        <option value="UnApproved">UnApproved</option> */}
                                                    </select>
                                                </div>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <BorderColorIcon
                                                    onClick={() => navigate("/edit_brand", { state: row })}
                                                    style={{ fontSize: "1rem", color: "var(--main-color)", marginLeft: "0.5rem", }}
                                                    className="emp_grp_icons"
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
                                        </StyledTableRow>
                                        {/* <div style={{ margin: "0.2rem 0" }}></div> */}
                                    </>
                                ))}
                            </TableBody>
                        )}
                    </Table>
                    {allBrand?.length !== 0 && (
                        <div className="pagination">
                            <Pagination
                                count={pageLength}
                                size="large"
                                color="primary"
                                onChange={(e, value) => setpageCount(value)}
                                page={pageCount}
                            />
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
                            onClick={() => deleteBrandFunc()}
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

export default Beat;