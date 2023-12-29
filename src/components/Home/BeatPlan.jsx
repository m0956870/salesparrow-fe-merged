import './BeatPlan.css'
import React from 'react'
import group from "../../images/group.png";
import SearchIcon from "@mui/icons-material/Search";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";

const BeatPlan = () => {

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

  const allData = [
    {
      date: "12/10/2021",
    },
    {
      date: "12/10/2021",
    },
    {
      date: "12/10/2021",
    },
    {
      date: "12/10/2021",
    },
    {
      date: "12/10/2021",
    },
    {
      date: "12/10/2021",
    },
    {
      date: "12/10/2021",
    },
    {
      date: "12/10/2021",
    },
    {
      date: "12/10/2021",
    },
    {
      date: "12/10/2021",
    },
    {
      date: "12/10/2021",
    },
    {
      date: "12/10/2021",
    },
    {
      date: "12/10/2021",
    },
    {
      date: "12/10/2021",
    },
    {
      date: "12/10/2021",
    },
  ];

       const StyledTableRow = styled(TableRow)(({ theme }) => ({
        borderBottom: "2px solid #00000011",
    }));
  return (
    <div className="container">
      <div className="beat_heading">
        <div className="beat_left" >
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Beat Plan/Approval</div>
        </div>

      </div>

      <div className="tracking_tabs">
        <div className="tarcking_tab_left">
          <select name="city">
            <option value="City">Select a State</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
          </select>
          <select name="state">
            <option value="State">Select Employee</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
          </select>
          <select name="city">
            <option value="City">Month</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
          </select>
          <select name="state">
            <option value="State">Year</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
          </select>

          <div
            className="view_btn"
          // onClick={() => setbeatTab("add")}
          >
            View
          </div>
        </div>
      </div>

      <div className="device_table">
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center" >Date</StyledTableCell>
              <StyledTableCell align="center">Beat Name</StyledTableCell>
              <StyledTableCell align="center">Activities</StyledTableCell>
            </TableRow>
          </TableHead>
          {/* <div style={{ margin: "0.5rem 0" }}></div> */}
          <TableBody>
            {allData.map((row) => (
              <>
                <StyledTableRow  key={row.date}>
                  <StyledTableCell align="center" component="th" scope="row">
                    {row.date}
                  </StyledTableCell>
                  <StyledTableCell align="center" component="th" scope="row">
                    <span className='table_cell'>
                        <select name="">
                            <option value="">Select Beat</option>
                            <option value="">Select Beat</option>
                        </select>
                    </span>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                  <span className='table_cell'>
                        <select name="">
                            <option value="">Select Activity</option>
                            <option value="">Select Activity</option>
                        </select>
                    </span>
                  </StyledTableCell>

                </StyledTableRow>
                {/* <div style={{ margin: "0.2rem 0" }}></div> */}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default BeatPlan