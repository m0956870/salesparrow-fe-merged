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

import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";

import { CircularProgress, Pagination } from "@mui/material";
import { toast } from "react-toastify";
import { deleteSubCategory, editCategory, fetchAllCategory } from "../../../api/productAPI";

import AddSubCategoryDialog from "./AddSubCategoryDialog";
import EditSubCategoryDialog from "./EditSubCategoryDialog";
import { useNavigate } from "react-router-dom";

const ProductSubCategory = () => {
  const [addCategoryPopup, setaddCategoryPopup] = useState(false);
  const [editCategoryPopup, seteditCategoryPopup] = useState(false);
  const [currCardData, setcurrCardData] = useState([])

  const navigate = useNavigate();

  const [isLoading, setisLoading] = useState(false);

  const [allSubCategory, setallSubCategory] = useState([]);
  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState();

  const [deletePopup, setdeletePopup] = useState(false);
  const [currentGroup, setcurrentGroup] = useState({});

  const [categories, setcategories] = useState([])
  const [categoryID, setcategoryID] = useState("")

  const fetchAllSubCFunc = async () => {
    setisLoading(true);
    try {
      fetchAllCategory(pageCount, categoryID).then((res) => {
        if (res.data.status) {
          setallSubCategory(res.data.result);
          setpageLength(res.data.pageLength);
          setisLoading(false);
        } else {
          setisLoading(false);
          toast.error(res.data.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   fetchAllSubCFunc();
  // }, [pageCount]);

  // console.log(allSubCategory);

  const editSubCStatus = async (e, id) => {
    // console.log(e.target.value, id);
    let data = {
      id,
      status: e.target.value,
    };

    try {
      setisLoading(true);
      let res = await editCategory(null, data);
      // console.log(res);
      if (res.data.status) {
        toast.success("Category Edited Successfully!");
        fetchAllSubCFunc();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteSubCFunc = async () => {
    // console.log(currentGroup);
    try {
      let res = await deleteSubCategory(currentGroup.id);
      // console.log(res);
      if (res.data.status) {
        toast.success("Sub Category Deleted Successfully!");
        setdeletePopup(false);
        setisLoading(true);
        fetchAllSubCFunc();
      } else {
        toast.error(res.data.message);
        setisLoading(false);
      }
    } catch (error) {
      console.log(error);
      setisLoading(false);
    }
  };

  useEffect(() => {
    if (addCategoryPopup === false && categoryID !== "") {
      fetchAllSubCFunc()
    }
  }, [addCategoryPopup])

  useEffect(() => {
    if (editCategoryPopup === false && categoryID !== "") {
      fetchAllSubCFunc()
    }
  }, [editCategoryPopup])

  const stateHandleInput = async (e) => {
    setcategoryID(e.target.value)
    try {
      setisLoading(true);
      try {
        fetchAllCategory(pageCount, e.target.value).then((res) => {
          if (res.data.status) {
            setallSubCategory(res.data.result);
            setpageLength(res.data.pageLength);
            setisLoading(false);
          } else {
            setisLoading(false);
            toast.error(res.data.message);
          }
        });
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchAllCategory().then((res) => setcategories(res.data.result));
  }, []);

  // console.log(categories);

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
          <div className="title">Product Sub Category</div>
        </div>
        <div className="beat_right">
          <div className="search">
            <select name="state" onChange={stateHandleInput}>
              <option value="">All Category</option>
              {categories?.map((category) => (
                <option value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="add_btn" onClick={() => setaddCategoryPopup(true)}>
            Add New
          </div>
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
                <StyledTableCell>Sub Category Name</StyledTableCell>
                <StyledTableCell align="left">Category</StyledTableCell>
                <StyledTableCell align="left">Status</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            {/* <div style={{ margin: "0.5rem 0" }}></div> */}

            {categoryID === "" ? <div className="no_data" style={{ width: "185%" }}>
              Please Select Catogery
            </div> : allSubCategory?.length === 0 ? (
              <div className="no_data" style={{ width: "250%" }}>
                No data
              </div>
            ) : (
              <TableBody>
                {allSubCategory?.map((row) => (
                  <>
                    <StyledTableRow key={row.sr_no}>
                      <StyledTableCell component="th" scope="row">
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="left" component="th" scope="row">
                        {row.catagory}
                      </StyledTableCell>
                      <StyledTableCell align="left" component="th" scope="row">
                        <div
                          className={`${row.status === "Active"
                            ? "active_beat"
                            : "inactive_beat"
                            }`}
                        >
                          <select
                            name="day"
                            onChange={(e) => editSubCStatus(e, row.id)}
                          >
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
                          onClick={() => {
                            setcurrCardData(row)
                            seteditCategoryPopup(true)
                          }}
                          style={{
                            fontSize: "1rem",
                            color: "var(--main-color)",
                            marginLeft: "0.5rem",
                          }}
                          className="emp_grp_icons"
                        />
                        <DeleteIcon
                          style={{
                            fontSize: "1rem",
                            color: "red",
                            marginLeft: "0.5rem",
                          }}
                          className="emp_grp_icons"
                          onClick={() => {
                            setdeletePopup(true);
                            setcurrentGroup(row);
                          }}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                    {/* <div style={{ margin: "0.2rem 0" }}></div> */}
                  </>
                ))}
              </TableBody>
            )}
          </Table>
          {allSubCategory?.length !== 0 && (
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
              onClick={() => deleteSubCFunc()}
            >
              Delete
            </div>
          </div>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>

      <AddSubCategoryDialog
        open={addCategoryPopup}
        close={() => setaddCategoryPopup(!addCategoryPopup)}
      />
      <EditSubCategoryDialog
        open={editCategoryPopup}
        close={() => seteditCategoryPopup(!editCategoryPopup)}
        currCardData={currCardData}
      />
    </div>
  );
};

export default ProductSubCategory;
