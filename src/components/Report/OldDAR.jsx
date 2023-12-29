// import "./MExpReportAllEmployee.css";
import "./Report.css";
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

const DailyAttendanceReports = () => {
  const [isLoading, setisLoading] = useState(false);

  const [reportSummery, setreportSummery] = useState({})

  const [allAttendance, setallAttendance] = useState()
  const [filteredAttendance, setfilteredAttendance] = useState()

  const [activeFilterTab, setactiveFilterTab] = useState("")

  const [dataAval, setdataAval] = useState(false)

  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState();

  const [filterData, setfilterData] = useState({
    start_date: "",
    end_date: "",
    date1: new Date().toLocaleDateString(),
    page: pageCount,
  })

  useEffect(() => {
    getMonthlyAttendanceFunc()
  }, [pageCount]);

  console.log(filteredAttendance)

  async function getMonthlyAttendanceFunc() {
    setisLoading(true)

    let res = await getTodayAttendance(filterData)
    if (res.data.status) {
      setpageLength(res.data.pageLength);

      Object.values(res.data.result).map(item => {
        if (typeof item == "object") {
          if (item.length !== 0) {
            setdataAval(true)
          } else {
            setdataAval(false)
          }
        }
      })

      let enteries = Object.entries(res.data.result)
      // setfilteredAttendance([])
      // setallAttendance([])
      enteries.map(item => {
        if (typeof item[1] == "object") {
          setallAttendance(allAttendance => {
            return { ...allAttendance, [item[0]]: item[1] }
          })
          setfilteredAttendance(filteredAttendance => {
            return { ...filteredAttendance, [item[0]]: item[1] }
          })
        } else {
          setreportSummery(reportSummery => {
            return { ...reportSummery, [item[0]]: item[1] }
          })
        }

      })

      setisLoading(false)
    }
  }

  const handleInput = (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value });
  };

  const filterAttendanceFunc = async (name) => {
    setactiveFilterTab(name);

    if (allAttendance[name] == undefined || allAttendance[name].length == 0) {
      setfilteredAttendance({ [name]: [] })
      setdataAval(false)
    } else {
      setfilteredAttendance({ [name]: allAttendance[name] })
      setdataAval(true)
    }

    if (name === activeFilterTab) {
      setactiveFilterTab("");
      setfilteredAttendance(allAttendance)
      setdataAval(true)
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
          <div className="title">Daily Attendence Reports</div>
        </div>
        <div className="beat_right">
        </div>
      </div>

      <div className="tracking_tabs">
        <div className="tarcking_tab_left">
          <input
            type="text"
            onClick={(e) => (e.target.type = "date")}
            onBlur={(e) => (e.target.type = "text")}
            name="date1"
            value={filterData.date1}
            onChange={handleInput}
          />
          <div className="view_btn_2" onClick={() => getMonthlyAttendanceFunc()} > View</div>
        </div>

        <div className="tarcking_tab_right">
          <div className="view_btn_2"
            onClick={() => filterAttendanceFunc("online_emp")}
            style={{ background: "#00a65a", fontWeight: "600", border: `${activeFilterTab === "online_emp" ? "2px solid #000" : ""}` }}
          >
            Online {reportSummery?.online}
          </div>
          <div className="view_btn_2"
            onClick={() => filterAttendanceFunc("leave_emp")}
            style={{ background: "#00c0ef", fontWeight: "600", border: `${activeFilterTab === "leave_emp" ? "2px solid #000" : ""}` }}
          >
            Leave {reportSummery?.leave}
          </div>
          <div className="view_btn_2"
            onClick={() => filterAttendanceFunc("offline_emp")}
            style={{ background: "#dd4b39", fontWeight: "600", border: `${activeFilterTab === "offline_emp" ? "2px solid #000" : ""}` }}
          >
            Offline {reportSummery?.offline}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ margin: "auto", }} >
          <CircularProgress />
        </div>
      ) : (
        <div className="device_table">
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow style={{ display: "flex" }}>
                <StyledTableCell style={{ flex: 1 }} >Employee Name</StyledTableCell>
                <StyledTableCell style={{ flex: 1 }} align="center">State</StyledTableCell>
                <StyledTableCell style={{ flex: 1 }} align="center">Beat Name</StyledTableCell>
                <StyledTableCell style={{ flex: 1 }} align="center">Purpose</StyledTableCell>
                <StyledTableCell style={{ flex: 1 }} align="center">Location</StyledTableCell>
                <StyledTableCell style={{ flex: 1 }} align="center">Time</StyledTableCell>
                <StyledTableCell style={{ flex: 1 }} align="center">Status</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAttendance && Object.values(filteredAttendance)?.map((row) => (
                row.map(row => (
                  <StyledTableRow style={{ display: "flex", background: `${row.status === "Online" ? "#abf6ab" : row.status === "Offline" ? "#f49e9e" : "lightblue"}` }} >
                    <StyledTableCell style={{ flex: 1 }}>{row.emp_name}</StyledTableCell>
                    <StyledTableCell style={{ flex: 1 }} align="center">{row.state} </StyledTableCell>
                    <StyledTableCell style={{ flex: 1 }} align="center">{row.beat_name}</StyledTableCell>
                    <StyledTableCell style={{ flex: 1 }} align="center">{row.purpose || "-"}</StyledTableCell>
                    <StyledTableCell style={{ flex: 1 }} align="center">{row.location?.[0] || "-"}</StyledTableCell>
                    <StyledTableCell style={{ flex: 1 }} align="center">{row.time && new Date(row.time).toLocaleDateString() || "-"} </StyledTableCell>
                    <StyledTableCell style={{ flex: 1 }} align="center">
                      <div className={`${row.status === "Online" ? "active_beat" : "inactive_beat"}`}>
                        {row.status}
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ))}
            </TableBody>
          </Table>

          {dataAval === true && (
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
          {dataAval === false && (
            <div className="no_data">
              No Data
            </div>
          )}
        </div >
      )
      }

    </div >
  );
};

export default DailyAttendanceReports;
