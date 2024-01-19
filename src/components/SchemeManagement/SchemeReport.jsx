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

const SchemeReport = () => {

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
      rank: "1st",
      party_name: "party 1",
      coupon_no: "25",
      acheived: "Bike",
      claimed: "Bike",
      delivered: "Bike",
      delivered_date: "12/10/2021",
      pending: "Price",
    },
    {
      rank: "1st",
      party_name: "party 1",
      coupon_no: "25",
      acheived: "Bike",
      claimed: "Bike",
      delivered: "Bike",
      delivered_date: "12/10/2021",
      pending: "Price",
    },
    {
      rank: "1st",
      party_name: "party 1",
      coupon_no: "25",
      acheived: "Bike",
      claimed: "Bike",
      delivered: "Bike",
      delivered_date: "12/10/2021",
      pending: "Price",
    },
    {
      rank: "1st",
      party_name: "party 1",
      coupon_no: "25",
      acheived: "Bike",
      claimed: "Bike",
      delivered: "Bike",
      delivered_date: "12/10/2021",
      pending: "Price",
    },
    {
      rank: "1st",
      party_name: "party 1",
      coupon_no: "25",
      acheived: "Bike",
      claimed: "Bike",
      delivered: "Bike",
      delivered_date: "12/10/2021",
      pending: "Price",
    },
    {
      rank: "1st",
      party_name: "party 1",
      coupon_no: "25",
      acheived: "Bike",
      claimed: "Bike",
      delivered: "Bike",
      delivered_date: "12/10/2021",
      pending: "Price",
    },
    {
      rank: "1st",
      party_name: "party 1",
      coupon_no: "25",
      acheived: "Bike",
      claimed: "Bike",
      delivered: "Bike",
      delivered_date: "12/10/2021",
      pending: "Price",
    },
    {
      rank: "1st",
      party_name: "party 1",
      coupon_no: "25",
      acheived: "Bike",
      claimed: "Bike",
      delivered: "Bike",
      delivered_date: "12/10/2021",
      pending: "Price",
    },
    {
      rank: "1st",
      party_name: "party 1",
      coupon_no: "25",
      acheived: "Bike",
      claimed: "Bike",
      delivered: "Bike",
      delivered_date: "12/10/2021",
      pending: "Price",
    },
    {
      rank: "1st",
      party_name: "party 1",
      coupon_no: "25",
      acheived: "Bike",
      claimed: "Bike",
      delivered: "Bike",
      delivered_date: "12/10/2021",
      pending: "Price",
    },
    {
      rank: "1st",
      party_name: "party 1",
      coupon_no: "25",
      acheived: "Bike",
      claimed: "Bike",
      delivered: "Bike",
      delivered_date: "12/10/2021",
      pending: "Price",
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
          <div className="title">Scheme Report</div>
        </div>

        <div className="beat_right">
          <div className="search">
            <SearchIcon style={{ color: `var(--main-color)` }} />
            <input type="text" placeholder="Search" />
          </div>
        </div>

      </div>

      <div className="tracking_tabs">
        <div className="tarcking_tab_left">
          <select name="city">
            <option value="City">City</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
          </select>
          <select name="state">
            <option value="State">State</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
          </select>
          <input type="date" name="" id="" />
          <input type="date" name="" id="" />
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
              <StyledTableCell>Rank</StyledTableCell>
              <StyledTableCell align="left">Party Name</StyledTableCell>
              <StyledTableCell align="left">Coupon No.</StyledTableCell>
              <StyledTableCell align="left">Achieved</StyledTableCell>
              <StyledTableCell align="left">Claimed</StyledTableCell>
              <StyledTableCell align="left">Delivered</StyledTableCell>
              <StyledTableCell align="left">Delivered Date</StyledTableCell>
              <StyledTableCell align="left">Pending</StyledTableCell>
            </TableRow>
          </TableHead>
          {/* <div style={{ margin: "0.5rem 0" }}></div> */}
          <TableBody>
            {allData.map((row) => (
              <>
                <StyledTableRow key={row.rank}>
                  <StyledTableCell component="th" scope="row">
                    {row.rank}
                  </StyledTableCell>
                  <StyledTableCell align="left" component="th" scope="row">
                    {row.party_name}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {row.coupon_no}
                  </StyledTableCell>
                  <StyledTableCell align="left" component="th" scope="row">
                    {row.acheived}
                  </StyledTableCell>
                  <StyledTableCell align="left" component="th" scope="row">
                    {row.claimed}
                  </StyledTableCell>
                  <StyledTableCell align="left">{row.delivered}</StyledTableCell>
                  <StyledTableCell align="left">{row.delivered_date}</StyledTableCell>
                  <StyledTableCell align="left">
                    {row.pending}
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

export default SchemeReport