import "./SubAdminList.css";
import React, { useState } from "react";
import group from "../../images/group.png";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BorderColorIcon from "@mui/icons-material/BorderColor";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";

// import AddBeat from "./AddBeat";

const SubAdminList = () => {
  const [beatTab, setbeatTab] = useState("beat");
  const [beatData, setbeatData] = useState({});

  const editBeatFunc = (row) => {
    // console.log(row)
    setbeatData(row);
    setbeatTab("edit");
  };

  const allData = [
    {
      name: "Lorem Ipsum",
      state: "Rajasthan",
      district: "Jaipur",
      city: "Jaypur, Ajmer",
      area: "Lorem Ipsum Ipsum",
      status: "ACTIVE",
    },
    {
      name: "Lorem Ipsum",
      state: "Rajasthan",
      district: "Jaipur",
      city: "Jaypur, Ajmer",
      area: "Lorem Ipsum Ipsum",
      status: "INACTIVE",
    },
    {
      name: "Lorem Ipsum",
      state: "Rajasthan",
      district: "Jaipur",
      city: "Jaypur, Ajmer",
      area: "Lorem Ipsum Ipsum",
      status: "ACTIVE",
    },
    {
      name: "Lorem Ipsum",
      state: "Rajasthan",
      district: "Jaipur",
      city: "Jaypur, Ajmer",
      area: "Lorem Ipsum Ipsum",
      status: "INACTIVE",
    },
    {
      name: "Lorem Ipsum",
      state: "Rajasthan",
      district: "Jaipur",
      city: "Jaypur, Ajmer",
      area: "Lorem Ipsum Ipsum",
      status: "ACTIVE",
    },
    {
      name: "Lorem Ipsum",
      state: "Rajasthan",
      district: "Jaipur",
      city: "Jaypur, Ajmer",
      area: "Lorem Ipsum Ipsum",
      status: "INACTIVE",
    },
    {
      name: "Lorem Ipsum",
      state: "Rajasthan",
      district: "Jaipur",
      city: "Jaypur, Ajmer",
      area: "Lorem Ipsum Ipsum",
      status: "ACTIVE",
    },
    {
      name: "Lorem Ipsum",
      state: "Rajasthan",
      district: "Jaipur",
      city: "Jaypur, Ajmer",
      area: "Lorem Ipsum Ipsum",
      status: "INACTIVE",
    },
    {
      name: "Lorem Ipsum",
      state: "Rajasthan",
      district: "Jaipur",
      city: "Jaypur, Ajmer",
      area: "Lorem Ipsum Ipsum",
      status: "ACTIVE",
    },
    {
      name: "Lorem Ipsum",
      state: "Rajasthan",
      district: "Jaipur",
      city: "Jaypur, Ajmer",
      area: "Lorem Ipsum Ipsum",
      status: "INACTIVE",
    },
  ];

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
        <div className="beat_left" onClick={() => setbeatTab("beat")}>
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Sub-Admin</div>
        </div>
      </div>
        <div className="beat_table">
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>SubAdminList Name</StyledTableCell>
                <StyledTableCell align="center">State</StyledTableCell>
                <StyledTableCell align="center">District</StyledTableCell>
                <StyledTableCell align="center">City</StyledTableCell>
                <StyledTableCell align="center">Areas</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            {/* <div style={{ margin: "0.5rem 0" }}></div> */}
            <TableBody>
              {allData.map((row) => (
                <>
                  <StyledTableRow key={row.name}>
                    <StyledTableCell component="th" scope="row">
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell align="center" component="th" scope="row">
                      {row.state}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.district}
                    </StyledTableCell>
                    <StyledTableCell align="center" component="th" scope="row">
                      {row.city}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.area}</StyledTableCell>
                    <StyledTableCell align="center" component="th" scope="row">
                      <div
                        className={`${
                          row.status === "ACTIVE"
                            ? "active_beat"
                            : "inactive_beat"
                        }`}
                      >
                        {row.status}
                      </div>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <VisibilityIcon
                        style={{ fontSize: "1rem", color: "var(--main-color)" }}
                      />
                      <BorderColorIcon
                        onClick={() => editBeatFunc(row)}
                        style={{
                          fontSize: "1rem",
                          color: "var(--main-color)",
                          marginLeft: "0.5rem",
                        }}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                  {/* <div style={{ margin: "0.2rem 0" }}></div> */}
                </>
              ))}
            </TableBody>
          </Table>
        </div>

      {/* {beatTab === "add" && <AddBeat />}
      {beatTab === "edit" && <AddBeat beatData={beatData} />} */}
    </div>
  );
};

export default SubAdminList;
