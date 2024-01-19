import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { toast } from "react-toastify";
import { deleteProductVarient, editProductVarient, fetchAllProduct, fetchAllProductVarient } from "../../../api/productAPI";


const ProductVarient = () => {
  const navigate = useNavigate();
  const location = useLocation()
  // console.log(location.state)

  const [isLoading, setisLoading] = useState(false);

  const [allProduct, setallProduct] = useState([]);
  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState();

  const [deletePopup, setdeletePopup] = useState(false);
  const [currentGroup, setcurrentGroup] = useState({});

  const fetchAllProductVFunc = async () => {
    setisLoading(true);
    try {
      fetchAllProductVarient(pageCount, location.state.id).then((res) => {
        // console.log(res);
        if (res.data.status) {
          setallProduct(res.data.result);
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
    fetchAllProductVFunc();
  }, [pageCount]);

  // allProduct.map(variant => console.log(JSON.parse(variant.packing_details.map(det => deet))))

  const editProductStatus = async (e, id) => {
    // console.log(e.target.value, id);
    let data = {
      id,
      status: e.target.value,
    };

    try {
      setisLoading(true);
      let res = await editProductVarient(null, data);
      // console.log(res);
      if (res.data.status) {
        toast.success("Product Varient Edited Successfully!");
        fetchAllProductVFunc();
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
      let res = await deleteProductVarient(currentGroup.id);
      // console.log(res);
      if (res.data.status) {
        toast.success("Product Varient Deleted Successfully!");
        setdeletePopup(false);
        setisLoading(true);
        fetchAllProductVFunc();
      } else {
        toast.error(res.data.message);
        setisLoading(false);
      }
    } catch (error) {
      console.log(error);
      setisLoading(false);
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
          <div className="title">{location.state?.name} Varients</div>
        </div>
        <div className="beat_right">
          {/* <div className="search">
            <SearchIcon style={{ color: `var(--main-color)` }} />
            <input type="text" placeholder="Search" />
          </div> */}
          <div className="add_btn" onClick={() => navigate("/add_product_varient", { state: location.state })}>
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
                <StyledTableCell>Image</StyledTableCell>
                <StyledTableCell align="center">Varient Name</StyledTableCell>
                <StyledTableCell align="center">MRP</StyledTableCell>
                <StyledTableCell align="center">Retailer Price</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            {/* <div style={{ margin: "0.5rem 0" }}></div> */}

            {allProduct?.length === 0 ? (
              <div className="no_data" style={{ width: "560%" }}>
                No data
              </div>
            ) : (
              <TableBody>
                {allProduct?.map((row) => (
                  <>
                    <StyledTableRow key={row._id}>
                      <StyledTableCell component="th" scope="row">
                        {row.image ? <img style={{ height: "2rem", width: "3rem" }} src={row.image} alt="" /> : null}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.varient_name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.mrp}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.price}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <div
                          className={`${row.status === "Active" || row.status === "Approved"
                            ? "active_beat"
                            : "inactive_beat"
                            }`}
                        >
                          <select
                            name="day"
                            onChange={(e) => editProductStatus(e, row.id)}
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
                          onClick={() => navigate("/edit_product_varient", { state: { ...row, category_id: location.state.id } })}
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
          {allProduct?.length !== 0 && (
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
          <div>Do you want to delete {currentGroup.varient_name}?</div>
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

export default ProductVarient;
