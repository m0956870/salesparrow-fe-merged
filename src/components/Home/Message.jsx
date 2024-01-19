import "./Message.css";
import React, { useEffect, useState } from "react";
import group from "../../images/group.png";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BorderColorIcon from "@mui/icons-material/BorderColor";

import { RiWhatsappFill } from "react-icons/ri";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";

import MessageDialog from "./MessageDialog";
import ViewMessageDialog from "./ViewMessageDialog";
import SendNotificationPopup from "../Message/SendNotificationPopup";

// import AddBeat from "./AddBeat";

const Message = () => {
  const [messageDialog, setmessageDialog] = useState(false);
  const [msgType, setmsgType] = useState("message");

  const [viewMessageDialog, setviewMessageDialog] = useState(false);

  const allData = [
    {
      type: "whatsapp",
      title: "Lorem Ipsum",
      date: "12/1/22",
      state: "Rajasthan",
      city: "Jaypur, Ajmer",
      employee: "All (20)",
      distributor: "30",
    },
    {
      type: "whatsapp",
      title: "Lorem Ipsum",
      date: "12/1/22",
      state: "Rajasthan",
      city: "Jaypur, Ajmer",
      employee: "All (20)",
      distributor: "30",
    },
    {
      type: "text",
      title: "Lorem Ipsum",
      date: "12/1/22",
      state: "Rajasthan",
      city: "Jaypur, Ajmer",
      employee: "All (20)",
      distributor: "30",
    },
    {
      type: "whatsapp",
      title: "Lorem Ipsum",
      date: "12/1/22",
      state: "Rajasthan",
      city: "Jaypur, Ajmer",
      employee: "All (20)",
      distributor: "30",
    },
    {
      type: "whatsapp",
      title: "Lorem Ipsum",
      date: "12/1/22",
      state: "Rajasthan",
      city: "Jaypur, Ajmer",
      employee: "All (20)",
      distributor: "30",
    },
    {
      type: "whatsapp",
      title: "Lorem Ipsum",
      date: "12/1/22",
      state: "Rajasthan",
      city: "Jaypur, Ajmer",
      employee: "All (20)",
      distributor: "30",
    },
    {
      type: "text",
      title: "Lorem Ipsum",
      date: "12/1/22",
      state: "Rajasthan",
      city: "Jaypur, Ajmer",
      employee: "All (20)",
      distributor: "30",
    },
    {
      type: "text",
      title: "Lorem Ipsum",
      date: "12/1/22",
      state: "Rajasthan",
      city: "Jaypur, Ajmer",
      employee: "All (20)",
      distributor: "30",
    },
    {
      type: "whatsapp",
      title: "Lorem Ipsum",
      date: "12/1/22",
      state: "Rajasthan",
      city: "Jaypur, Ajmer",
      employee: "All (20)",
      distributor: "30",
    },
    {
      type: "whatsapp",
      title: "Lorem Ipsum",
      date: "12/1/22",
      state: "Rajasthan",
      city: "Jaypur, Ajmer",
      employee: "All (20)",
      distributor: "30",
    },
    {
      type: "whatsapp",
      title: "Lorem Ipsum",
      date: "12/1/22",
      state: "Rajasthan",
      city: "Jaypur, Ajmer",
      employee: "All (20)",
      distributor: "30",
    },
    {
      type: "whatsapp",
      title: "Lorem Ipsum",
      date: "12/1/22",
      state: "Rajasthan",
      city: "Jaypur, Ajmer",
      employee: "All (20)",
      distributor: "30",
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

  const messageDialogOpen = () => {
    setmsgType("message");
    setmessageDialog(true);
  };
  const whatsappDialogOpen = () => {
    setmsgType("whatsapp");
    setmessageDialog(true);
  };

  // useEffect(() => {
  //   if (messageDialog === false) console.log("popup == flase")
  // }, [messageDialog])

  return (
    <div className="container">
      <div className="beat_heading">
        <div
          className="beat_left"
        // onClick={() => setbeatTab("beat")}
        >
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Message</div>
        </div>
        <div className="beat_right">
          <div className="whatsapp" onClick={() => whatsappDialogOpen()}>
            <RiWhatsappFill />
          </div>
          <div className="add_btn" onClick={() => messageDialogOpen()}>
            SEND NOTIFICATION
          </div>
        </div>
      </div>
      <div className="beat_table">
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Type</StyledTableCell>
              <StyledTableCell align="left">Title</StyledTableCell>
              <StyledTableCell align="left">Date</StyledTableCell>
              <StyledTableCell align="left">State</StyledTableCell>
              <StyledTableCell align="left">Enployee</StyledTableCell>
              <StyledTableCell align="left">Distributor</StyledTableCell>
              <StyledTableCell align="left">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          {/* <div style={{ margin: "0.5rem 0" }}></div> */}
          <TableBody>
            {allData.map((row) => (
              <>
                <StyledTableRow key={row.title}>
                  <StyledTableCell align="center" component="th" scope="row">
                    {row.type === "whatsapp" ? (
                      <RiWhatsappFill
                        style={{ fontSize: 20, color: "#3fe523" }}
                      />
                    ) : (
                      <div
                        style={{
                          color: "var(--main-color)",
                          fontWeight: "bold",
                        }}
                      >
                        Notification
                      </div>
                    )}
                    {/* <div>Urgent</div> */}
                  </StyledTableCell>
                  <StyledTableCell align="left" component="th" scope="row">
                    {row.title}
                  </StyledTableCell>
                  <StyledTableCell align="left">{row.date}</StyledTableCell>
                  <StyledTableCell align="left" component="th" scope="row">
                    {row.state}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <a className="message_link" href="#">
                      {row.employee}
                    </a>
                  </StyledTableCell>
                  <StyledTableCell align="left" component="th" scope="row">
                    <a className="message_link" href="#">
                      {row.distributor}
                    </a>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <a
                      className="message_link"
                      href="#"
                      onClick={() => setviewMessageDialog(true)}
                    >
                      view
                    </a>
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

      {/* <ViewMessageDialog
        open={viewMessageDialog}
        close={() => setviewMessageDialog(!viewMessageDialog)}
        msgType={msgType}
      /> */}
      <SendNotificationPopup
        open={messageDialog}
        close={() => setmessageDialog(!messageDialog)}
      />
      {/* <MessageDialog
        open={messageDialog}
        close={() => setmessageDialog(!messageDialog)}
        msgType={msgType}
      /> */}
    </div>
  );
};

export default Message;