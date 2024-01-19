import React, { useEffect, useState } from "react";
import group from "../../../images/group.png";

import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";

import { allEmployeeGroup, deleteEmployeeGroup } from "../../../api/employeeAPI";
import { CircularProgress, Pagination } from "@mui/material";
import getStateFunc from "../../../api/locationAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";
import { allProductGroup, deleteProductGroup, fetchAllCategory } from "../../../api/productAPI";
import isAllowed from "../../../utils/isAllowed";
import { PRODUCT_MANAGEMENT } from "../../../constants";

const ProductGroupingList = () => {
  const navigate = useNavigate();
  const [permissionAllowed, setpermissionAllowed] = useState(false)

  const [deletePopup, setdeletePopup] = useState(false);
  const [currentGroup, setcurrentGroup] = useState({});

  const [isLoading, setisLoading] = useState(false);

  const [groupList, setgroupList] = useState([]);
  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState();

  const [allCategory, setallCategory] = useState([]);


  const productGroupListFunc = async () => {
    setisLoading(true);
    if (!await isAllowed(PRODUCT_MANAGEMENT)) {
      toast.error("Module is not purchased!");
      return setisLoading(false);
    } else {
      setpermissionAllowed(true);
    }

    try {
      allProductGroup(pageCount).then((res) => {
        // console.log(res);
        if (res.data.status) {
          setgroupList(res.data.result);
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

  useEffect(() => {
    productGroupListFunc();
  }, [pageCount]);

  useEffect(() => {
    fetchAllCategory().then((res) => setallCategory(res.data.result));
  }, [])

  const categoryHandleInput = async (e) => {
    // console.log(e.target.value);
    try {
      setisLoading(true)
      allProductGroup(pageCount, e.target.value).then((res) => {
        // console.log(res);
        if (res.data.status) {
          setgroupList(res.data.result);
          setpageLength(res.data.pageLength);
          setisLoading(false);
        } else {
          setisLoading(false);
          toast.error(res.data.message);
        }
      });
    } catch (error) {
      console.log(error)
    }
  }

  const deleteGroupFunc = async () => {
    // console.log(currentGroup);
    try {
      let res = await deleteProductGroup(currentGroup.id);
      // console.log(res);
      if (res.data.status) {
        toast.success("Product Group Deleted Successfully!");
        setdeletePopup(false);
        setisLoading(true);
        productGroupListFunc()
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Internet Error!");
    }
  };

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
          <div className="title">Product Grouping List</div>
        </div>
        <div className="beat_right">
          <div className="search">
            <select onChange={categoryHandleInput} >
              <option value="">All Category</option>
              {allCategory.length === 0 && <option disabled value="">No Category Found</option>}
              {allCategory?.map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>
          {permissionAllowed && <div className="add_btn" style={{ marginLeft: "1.5rem" }} onClick={() => navigate("/product_grouping")}          >
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
              <TableRow sx={{ display: "flex", width: "100%" }}>
                <StyledTableCell sx={{ flex: 1 }}>
                  Product Group Name
                </StyledTableCell>
                <StyledTableCell sx={{ flex: 2 }} align="left">
                  Group Description
                </StyledTableCell>
                <StyledTableCell sx={{ flex: 1 }} align="left">
                  Category
                </StyledTableCell>
                <StyledTableCell sx={{ flex: 0.5 }} align="left">
                  Action
                </StyledTableCell>
              </TableRow>
            </TableHead>
            {/* <div style={{ margin: "0.5rem 0" }}></div> */}
            <TableBody>
              {groupList.length !== 0 ? (
                groupList.map((row) => (
                  <div key={row.grp_name}>
                    <StyledTableRow
                      sx={{ display: "flex", width: "100%" }}
                    >
                      <StyledTableCell
                        sx={{ flex: 1 }}
                        component="th"
                        scope="row"
                      >
                        {row.grp_name}
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{ flex: 2 }}
                        align="left"
                        component="th"
                        scope="row"
                      >
                        {row.grp_description}
                      </StyledTableCell>
                      <StyledTableCell sx={{ flex: 1 }} align="left">
                        {row.catagory_id}
                      </StyledTableCell>
                      <StyledTableCell sx={{ flex: 0.5 }} align="left">
                        <BorderColorIcon
                          onClick={() =>
                            navigate("/edit_product_grouping", {
                              state: row,
                            })
                          }
                          style={{ fontSize: "1rem", color: "var(--main-color)", }}
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
                  </div>
                ))
              ) : (
                <div className="no_data" style={{ width: "100%" }}>
                  No data
                </div>
              )}
            </TableBody>
          </Table>
          {groupList.length !== 0 && (
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
          <div>Do you want to delete this group?</div>
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
              onClick={() => deleteGroupFunc()}
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

export default ProductGroupingList;
