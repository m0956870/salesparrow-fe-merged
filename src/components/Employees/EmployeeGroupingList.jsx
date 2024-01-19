import "./Employees.css";
import React, { useEffect, useState } from "react";
import group from "../../images/group.png";

import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";

import { allEmployeeGroup, deleteEmployeeGroup } from "../../api/employeeAPI";
import { CircularProgress, Pagination } from "@mui/material";
import getStateFunc from "../../api/locationAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import isAllowed from "../../utils/isAllowed";
import { EMPLOYEE_MANAGEMENT } from "../../constants";

const EmployeeGroupingList = () => {
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const [permissionAllowed, setpermissionAllowed] = useState(false)

  const [allState, setallState] = useState([]);
  const [groupList, setgroupList] = useState([]);
  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState();

  const [deletePopup, setdeletePopup] = useState(false);
  const [currentGroup, setcurrentGroup] = useState({});


  useEffect(() => {
    fetchAllEmpGrpFunc()
  }, [pageCount]);

  // console.log(groupList);

  useEffect(() => {
    getStateFunc().then((res) => setallState(res.data.result));
  }, []);



  const fetchAllEmpGrpFunc = async (e) => {
    setisLoading(true);
    if (!await isAllowed(EMPLOYEE_MANAGEMENT)) {
      toast.error("Module is not purchased!");
      return setisLoading(false)
    }
    allEmployeeGroup(pageCount).then((res) => {
      setgroupList(res.data.result);
      setisLoading(false);
      setpageLength(res.data.pageLength);
    });
  };

  const stateHandleInput = async (e) => {
    try {
      setisLoading(true);
      allEmployeeGroup(pageCount, e.target.value).then((res) => {
        setisLoading(false);
        setgroupList(res.data.result);
        setisLoading(false);
        setpageLength(res.data.pageLength);
      });
    } catch (error) {
      setisLoading(false);
      console.log(error);
      toast.error("Internet Error!");
    }
  };

  const deleteGroupFunc = async () => {
    // console.log(currentGroup);
    try {
      let res = await deleteEmployeeGroup(currentGroup.id);
      // console.log(res);

      if (res.data.status) {
        toast.success("Employee deleted Successfully!");
        setdeletePopup(false);
        setisLoading(true);
        allEmployeeGroup(pageCount).then((res) => {
          setgroupList(res.data.result);
          setisLoading(false);
          setpageLength(res.data.pageLength);
        });
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
          <div className="title">Employee Grouping List</div>
        </div>
        <div className="beat_right">
          <div className="search">
            <select name="state" onChange={stateHandleInput}>
              <option value="State">State</option>
              {allState?.map((state) => (
                <option key={state.id} value={state.id}>{state.name}</option>
              ))}
            </select>
          </div>
          {permissionAllowed && <div
            className="add_btn"
            onClick={() => navigate("/employee_grouping")}
            style={{ marginLeft: "1rem" }}
          >
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
                  Employee Group Name
                </StyledTableCell>
                <StyledTableCell sx={{ flex: 2 }} align="left">
                  Description
                </StyledTableCell>
                <StyledTableCell sx={{ flex: 1 }} align="left">
                  State
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
                  <>
                    <StyledTableRow
                      sx={{ display: "flex", width: "100%" }}
                      key={row.grp_name}
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
                        {row.state?.name}
                      </StyledTableCell>
                      <StyledTableCell sx={{ flex: 0.5 }} align="left">
                        <BorderColorIcon
                          onClick={() =>
                            navigate("/edit_employee_grouping", {
                              state: row,
                            })
                          }
                          style={{
                            fontSize: "1rem",
                            color: "var(--main-color)",
                          }}
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

export default EmployeeGroupingList;
