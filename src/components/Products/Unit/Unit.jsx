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

import { Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";

import { CircularProgress, Pagination } from "@mui/material";
import { toast } from "react-toastify";
import { deleteCategory, deleteUnit, editCategory, editUnit, fetchAllCategory, fetchAllUnit } from "../../../api/productAPI";

import AddUnitDialog from "./AddUnitDialog";
import EditUnitDialog from "./EditUnitDialog";
import { useNavigate } from "react-router-dom";
import isAllowed from "../../../utils/isAllowed";
import { PRODUCT_MANAGEMENT } from "../../../constants";

const Unit = () => {
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);

  const [addUnitPopup, setaddUnitPopup] = useState();
  const [editUnitPopup, seteditUnitPopup] = useState();
  const [currCardData, setcurrCardData] = useState([])

  const [allUnit, setallUnit] = useState([]);
  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState();

  const [deletePopup, setdeletePopup] = useState(false);
  const [currentGroup, setcurrentGroup] = useState({});

  useEffect(() => {
    fetchAllUnitFunc();
  }, [pageCount]);
  useEffect(() => {
    if (addUnitPopup === false) {
      fetchAllUnitFunc()
    }
  }, [addUnitPopup])

  useEffect(() => {
    if (editUnitPopup === false) {
      fetchAllUnitFunc()
    }
  }, [editUnitPopup])

  const fetchAllUnitFunc = async () => {
    setisLoading(true);
    if (!await isAllowed(PRODUCT_MANAGEMENT)) {
      toast.error("Module is not purchased!");
      return setisLoading(false);
    }

    fetchAllUnit(pageCount).then((res) => {
      console.log(res.data.result)
      if (res.data.status) {
        setallUnit(res.data.result);
        setpageLength(res.data.pageLength);
        setisLoading(false);
      } else {
        setisLoading(false);
        toast.error(res.data.message);
      }
    });
  };

  const editUnitStatus = async (e, id) => {
    let data = { id, status: e.target.value, };
    setisLoading(true);
    let res = await editUnit(data);
    console.log(res);
    if (res.data.status) {
      toast.success("Unit Edited Successfully!");
      fetchAllUnitFunc();
    } else {
      toast.error(res.data.message);
    }
  };

  const deleteUnitFunc = async () => {
    let res = await deleteUnit(currentGroup._id);
    if (res.data.status) {
      toast.success("Unit Deleted Successfully!");
      setdeletePopup(false);
      setisLoading(true);
      fetchAllUnitFunc();
    } else {
      toast.error(res.data.message);
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
          <div className="title">Product Units</div>
        </div>
        <div className="beat_right employee_head">
          <div className="add_btn" onClick={() => setaddUnitPopup(true)}>
            Add New
          </div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ margin: "auto", }}>
          <CircularProgress />
        </div>
      ) : (
        <div className="beat_table">
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Unit Name</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>

            {allUnit?.length === 0 ? (
              <div className="no_data" style={{ width: "250%" }}>
                No data
              </div>
            ) : (
              <TableBody>
                {allUnit.map((row) => (
                  <>
                    <StyledTableRow key={row.sr_no}>
                      <StyledTableCell component="th" scope="row">
                        {row.unit}
                      </StyledTableCell>
                      <StyledTableCell align="center" component="th" scope="row">
                        <div
                          className={`${row.status === "Active"
                            ? "active_beat"
                            : "inactive_beat"
                            }`}
                        >
                          <select name="day" onChange={(e) => editUnitStatus(e, row._id)}                          >
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
                          style={{ fontSize: "1rem", color: "var(--main-color)", marginLeft: "0.5rem", }}
                          className="emp_grp_icons"
                          onClick={() => {
                            setcurrCardData(row)
                            seteditUnitPopup(true)
                          }}
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
                  </>
                ))}
              </TableBody>
            )}
          </Table>
          {allUnit?.length !== 0 && (
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
            <div className="employee_gl_popup" onClick={() => setdeletePopup(false)}            >
              Cancel
            </div>
            <div className="employee_gl_popup_del" onClick={() => deleteUnitFunc()}            >
              Delete
            </div>
          </div>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>

      <AddUnitDialog
        open={addUnitPopup}
        close={() => setaddUnitPopup(!addUnitPopup)}
      />
      <EditUnitDialog
        open={editUnitPopup}
        close={() => seteditUnitPopup(!editUnitPopup)}
        currCardData={currCardData}
      />
    </div>
  );
};

export default Unit;
