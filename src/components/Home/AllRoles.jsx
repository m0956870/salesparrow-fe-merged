import React, { useEffect, useState } from "react";
import group from "../../images/group.png";

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

import SearchIcon from "@mui/icons-material/Search";
// import BorderColorIcon from "@mui/icons-material/BorderColor";
// import DeleteIcon from "@mui/icons-material/Delete";

import { useNavigate } from "react-router-dom";
import fetchAllRole from "../../api/roleAPI";
import { CircularProgress, Pagination } from "@mui/material";

const AllRoles = () => {
    const navigate = useNavigate()

    const [isLoading, setisLoading] = useState(false);
    const [pageCount, setpageCount] = useState(1);
    const [pageLength, setpageLength] = useState();

    const [deletePopup, setdeletePopup] = useState(false);
    const [currentGroup, setcurrentGroup] = useState({});

    const [allRoles, setallRoles] = useState([])

    useEffect(() => {
        setisLoading(true)
        fetchAllRole().then((res) => {
            setallRoles(res.data.result)
            setisLoading(false)
        });
    }, [])

    // console.log(allRoles);

    const [titlename, settitlename] = useState("");
    const filterData = allRoles?.filter((row) => {
        return row.rolename.toLowerCase().indexOf(titlename.toLowerCase()) !== -1;
    });

    const deleteRoleFunc = async () => {
        console.log(currentGroup);
        try {

        } catch (error) {
            console.log(error);
        }
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
                    <div className="title">All Role</div>
                </div>
                <div className="beat_right">
                    <div className="search">
                        <SearchIcon style={{ color: `var(--main-color)` }} />
                        <input
                            onChange={(e) => settitlename(e.target.value)}
                            type="text"
                            placeholder="Search"
                        />
                    </div>
                    <div className="add_btn"
                        onClick={() => navigate("/create_role")}
                    >
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
                                <StyledTableCell>Role Name</StyledTableCell>
                                <StyledTableCell align="center">Hierarchy Level</StyledTableCell>
                                <StyledTableCell align="center">Status</StyledTableCell>
                                {/* <StyledTableCell align="center">Action</StyledTableCell> */}
                            </TableRow>
                        </TableHead>
                        {/* <div style={{ margin: "0.5rem 0" }}></div> */}
                        {filterData?.length === 0 ? (
                            <div className="no_data" style={{ width: "280%" }}>
                                No data
                            </div>
                        ) : (
                            <TableBody>
                                {filterData?.map((row) => (
                                    <>
                                        <StyledTableRow key={row._id}>
                                            <StyledTableCell component="th" scope="row">
                                                {row.rolename}
                                            </StyledTableCell>
                                            <StyledTableCell
                                                align="center"
                                            >
                                                {row.hierarchy_level}
                                            </StyledTableCell>
                                            <StyledTableCell
                                                align="center"
                                                component="th"
                                                scope="row"
                                            >
                                                <div
                                                    className={`${row.status === "Active"
                                                        ? "active_beat active_role"
                                                        : "inactive_beat inactive_role"
                                                        }`}
                                                    style={{ display: "inline-block", padding: "0.2rem 1rem" }}
                                                >
                                                    {row.status}
                                                    {/* <select
                                                        name="day"
                                                    // onChange={(e) => editBeatStatus(e, row.id)}
                                                    >
                                                        <option value="">{row.status}</option>
                                                        <option value="Active">Active</option>
                                                        <option value="InActive">InActive</option>
                                                    </select> */}
                                                </div>
                                            </StyledTableCell>
                                            {/* <StyledTableCell align="center">
                                                <BorderColorIcon
                                                    onClick={() => navigate("/edit_beat", { state: row })}
                                                    style={{
                                                        fontSize: "1rem",
                                                        color: "var(--main-color)",
                                                        marginLeft: "0.5rem",
                                                    }}
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
                                            </StyledTableCell> */}
                                        </StyledTableRow>
                                        {/* <div style={{ margin: "0.2rem 0" }}></div> */}
                                    </>
                                ))}
                            </TableBody>
                        )}
                    </Table>
                    {allRoles?.length !== 0 && (
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
                    <div>Do you want to delete {currentGroup.rolename}?</div>
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
                            onClick={() => deleteRoleFunc()}
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

export default AllRoles