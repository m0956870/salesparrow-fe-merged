import React, { useEffect, useState } from "react";
import group from "../../images/group.png";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";
import { getTodayAttendance } from "../../api/reportsAPI";
import { CircularProgress, Pagination } from "@mui/material";
import { AiOutlineBell, AiFillInfoCircle } from "react-icons/ai"
import { toast } from "react-toastify";
import { sendNotification } from "../../api/messageAPI";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";

const TodayAttendanceReports = () => {
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);

  const [allAttendance, setallAttendance] = useState([])
  const [filteredAttendance, setfilteredAttendance] = useState([])
  const [reportSummery, setreportSummery] = useState({})

  const [activeFilterTab, setactiveFilterTab] = useState("")

  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState();

  const [leaveReasonPopup, setleaveReasonPopup] = useState(false);
  const [currentRow, setcurrentRow] = useState()

  const [filterData, setfilterData] = useState({
    start_date: "",
    end_date: "",
    date1: new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).split("/").reverse().join("-"),
    page: pageCount,
    limit: 10,
  })

  useEffect(() => {
    getTodayAttendanceFunc({ ...filterData, page: pageCount })
  }, [pageCount]);

  async function getTodayAttendanceFunc(filterData) {
    setisLoading(true)

    let res = await getTodayAttendance(filterData)
    // console.log(res.data)
    if (res.data.status) {
      setallAttendance(res.data.result.emp)
      setfilteredAttendance(res.data.result.emp)
      setreportSummery({
        online: res.data.result.online || 0,
        offline: res.data.result.offline || 0,
        leave: res.data.result.leave || 0,
      })

      setpageLength(res.data.pageLength);
      setisLoading(false)
    }
  }

  const handleInput = (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value });
  };

  // console.log("filterData", filterData)

  const filterAttendanceFunc = async (name) => {
    setactiveFilterTab(name);

    if (name === activeFilterTab) {
      setactiveFilterTab("");
      return setfilteredAttendance(allAttendance)
    }

    let filtered = allAttendance.filter(item => item.status == name)
    setfilteredAttendance(filtered)
  }

  function getCurrentDate() {
    let date = new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    return date.split("/").reverse().join("-")
  }


  const sendNotificationFunc = async (row) => {
    console.log(row)
    let temp = {
      emp_id: row.emp_id,
      title: "Punch Attendance",
      body: "You are offline! Please punch your attendance.",
    }

    let { data } = await sendNotification(temp);
    if (data.status) {
      toast.success(data.message)
    } else {
      toast.error("Some Error!")
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
          <div className="title">Today Attendence Reports</div>
        </div>
        <div className="beat_right">
        </div>
      </div>

      <div className="tracking_tabs">
        <div className="tarcking_tab_left">
          {/* <input
            type="text"
            onClick={(e) => (e.target.type = "date")}
            onBlur={(e) => (e.target.type = "text")}
            name="date1"
            value={filterData.date1}
            onChange={handleInput}
            max={getCurrentDate()}
          />
          <div className="view_btn_2" onClick={() => getTodayAttendanceFunc()} > View</div> */}
          <div className="view_btn_2"
            onClick={() => filterAttendanceFunc("Online")}
            style={{ whiteSpace: "nowrap", background: "#00a65a", fontWeight: "600", outline: `${activeFilterTab === "Online" ? "2px solid #000" : ""}` }}
          >
            Online {reportSummery?.online}
          </div>
          <div className="view_btn_2"
            onClick={() => filterAttendanceFunc("Leave")}
            style={{ whiteSpace: "nowrap", background: "#00c0ef", fontWeight: "600", outline: `${activeFilterTab === "Leave" ? "2px solid #000" : ""}` }}
          >
            Leave {reportSummery?.leave}
          </div>
          <div className="view_btn_2"
            onClick={() => filterAttendanceFunc("Offline")}
            style={{ whiteSpace: "nowrap", background: "#dd4b39", fontWeight: "600", outline: `${activeFilterTab === "Offline" ? "2px solid #000" : ""}` }}
          >
            Offline {reportSummery?.offline}
          </div>
        </div>

        <div className="tarcking_tab_right"></div>
      </div>

      <div style={{ marginBottom: "1.5rem" }} ></div>

      {isLoading ? (
        <div style={{ margin: "auto", }} >
          <CircularProgress />
        </div>
      ) : (
        <div className="beat_table">
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>S. No.</StyledTableCell>
                <StyledTableCell style={{ flex: 1 }} >Employee Name</StyledTableCell>
                <StyledTableCell style={{ flex: 1 }} align="center">State</StyledTableCell>
                <StyledTableCell style={{ flex: 1 }} align="center">Beat Name</StyledTableCell>
                <StyledTableCell style={{ flex: 1 }} align="center">Purpose</StyledTableCell>
                <StyledTableCell style={{ flex: 1 }} align="center">Location</StyledTableCell>
                <StyledTableCell style={{ flex: 1 }} align="center">Date</StyledTableCell>
                <StyledTableCell style={{ flex: 1 }} align="center">Status</StyledTableCell>
                <StyledTableCell align="left">Travel Path</StyledTableCell>
              </TableRow>
            </TableHead>

            {filteredAttendance?.length !== 0 && (
              <TableBody >
                {filteredAttendance?.map((row, i) => (
                  <StyledTableRow style={{ background: `${row.status === "Online" ? "#abf6ab" : row.status === "Offline" ? "#f49e9e" : "lightblue"}` }} >
                    <StyledTableCell>{((pageCount * filterData.limit) - filterData.limit) + (i + 1)}</StyledTableCell>
                    <StyledTableCell style={{ flex: 1 }}>{row.emp_name}</StyledTableCell>
                    <StyledTableCell style={{ flex: 1 }} align="center">{row.state} </StyledTableCell>
                    <StyledTableCell style={{ flex: 1 }} align="center">{row.beat_name}</StyledTableCell>
                    <StyledTableCell style={{ flex: 1 }} align="center">{row.purpose || "-"}</StyledTableCell>
                    <StyledTableCell style={{ flex: 1 }} align="center">{row.location?.[0] || "-"}</StyledTableCell>
                    <StyledTableCell style={{ flex: 1 }} align="center">{row.time && new Date(row.time).toLocaleString() || "-"} </StyledTableCell>
                    <StyledTableCell style={{ flex: 1 }} align="center">
                      {row.status === "Online" ? (
                        <div className={"active_beat"}>
                          {row.status}
                        </div>
                      ) : row.status === "Leave" ? (
                        <div onClick={() => {
                          setcurrentRow(row);
                          setleaveReasonPopup(true);
                        }} className="inactive_beat" style={{ display: "inline-flex", cursor: "pointer" }}>
                          {row.status} <AiFillInfoCircle size={18} />
                        </div>
                      ) : (
                        <div onClick={() => sendNotificationFunc(row)} className={"inactive_beat"} style={{ display: "inline-flex", cursor: "pointer" }}>
                          {row.status} <AiOutlineBell size={18} />
                        </div>
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {row.status === "Online" && <div style={{ textDecoration: "underline", color: "purple" }} onClick={() => navigate("/employee_travel_path", { state: { location: row.all_location } })} >See the location</div>}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            )}
          </Table>

          {filteredAttendance?.length !== 0 && (
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
          {filteredAttendance?.length === 0 && (
            <div className="no_data">
              No Data
            </div>
          )}
        </div>
      )
      }


      <Dialog
        open={leaveReasonPopup}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
        fullWidth={true}
        onClose={() => setleaveReasonPopup(false)}
      >
        <DialogContent className="cardpopup_content">
          <div>{currentRow?.leave_reason}</div>
        </DialogContent>
      </Dialog>
    </div >
  );
};

export default TodayAttendanceReports;
