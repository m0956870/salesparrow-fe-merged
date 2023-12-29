import React, { useEffect, useState } from "react";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";
import { CircularProgress, Pagination } from "@mui/material";

// Images
import group from "../../images/group.png";
// import excel_in from "../../images/excel_in.png";
// import excel_out from "../../images/excel_out.png";

import { editClaimSatus, editGoodReturnVoucher, getGoodReturnVoucher } from "../../api/reportsAPI";
import fetchAllParty, { getPartyType } from "../../api/partyAPI";
import { toast } from "react-toastify";

// import xlsx from "json-as-xlsx"

const GoodReturnVoucherApproval = () => {
    const [isLoading, setisLoading] = useState(false);

    const [partyTypes, setpartyTypes] = useState()
    const [allParty, setallParty] = useState([]);

    const [goodReturnVoucher, setgoodReturnVoucher] = useState([]);

    const [pageCount, setpageCount] = useState(1);
    const [pageLength, setpageLength] = useState();

    const [filterData, setfilterData] = useState({
        party_type_id: "",
        party_id: "",
        start_date: "",
        end_date: "",
        page: pageCount,
    })

    useEffect(() => {
        setisLoading(true)
        getPartyType().then(res => setpartyTypes(res.data.result))
        fetchAllParty().then(res => setallParty(res.data.result))
        goodReturnVoucherFunc()
    }, [pageCount]);

    // console.log(goodReturnVoucher)

    const handleInput = (e) => {
        setfilterData({ ...filterData, [e.target.name]: e.target.value });
    };

    const goodReturnVoucherFunc = async () => {
        // return console.log(filterData)

        setisLoading(true)
        let { data } = await getGoodReturnVoucher(filterData)
        if (data.status) {
            setgoodReturnVoucher(data.result)
            setpageLength(data.pageLength);
            return setisLoading(false)
        }
        console.log("Server Error")
    }

    const editStatusFunc = async (e, id) => {
        setisLoading(true);

        let res = await editGoodReturnVoucher({ id, approval_status: e.target.value });
        console.log(res);
        if (res.data.status) {
            toast.success("Report Edited Successfully!");
            goodReturnVoucherFunc();
        }

        return console.log("Error");
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
        <div className="container" >
            <div className="beat_heading">
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">Good Return Voucher Approval</div>
                </div>
                <div className="beat_right employee_head">
                </div>
            </div>

            <div className="tracking_tabs">
                <div className="tarcking_tab_left">
                    <select
                        class="grouping_select"
                        name="party_type_id"
                        onChange={handleInput}
                    >
                        <option value="">All Party Types</option>
                        {partyTypes?.map((type) => (
                            <option key={type._id} value={type._id}>{type.party_type}</option>
                        ))}
                    </select>
                    <select name="party_id" onChange={handleInput}>
                        <option value="">All Parties</option>
                        {allParty.length === 0 && <option disabled value="">No Party Found</option>}
                        {allParty?.map((party) => (
                            <option key={party?.id} value={party?.id}> {party?.firmName} </option>
                        ))}
                    </select>
                    {/* <input
                        type="text"
                        onClick={(e) => (e.target.type = "date")}
                        onBlur={(e) => (e.target.type = "text")}
                        name="start_date"
                        onChange={handleInput}
                        placeholder="Start Date"
                    />
                    <input
                        type="text"
                        onClick={(e) => (e.target.type = "date")}
                        onBlur={(e) => (e.target.type = "text")}
                        name="end_date"
                        onChange={handleInput}
                        placeholder="End Date"
                    /> */}

                    <div
                        className="view_btn"
                        onClick={() => goodReturnVoucherFunc()}
                    >
                        View
                    </div>
                </div>
            </div>
            <div style={{ marginBottom: "1.5rem" }} ></div>

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
                                <StyledTableCell>Party Name</StyledTableCell>
                                <StyledTableCell align="center">Party Type</StyledTableCell>
                                <StyledTableCell align="center">Total Qty</StyledTableCell>
                                <StyledTableCell align="center">Depriciation</StyledTableCell>
                                <StyledTableCell align="center">Description</StyledTableCell>
                                <StyledTableCell align="center">Net Amount</StyledTableCell>
                                <StyledTableCell align="center">Total Amount</StyledTableCell>
                                {/* <StyledTableCell align="center">Date</StyledTableCell> */}
                                <StyledTableCell align="center">Status</StyledTableCell>
                            </TableRow>
                        </TableHead>

                        {goodReturnVoucher?.length !== 0 && (
                            <TableBody>
                                {goodReturnVoucher?.map((row, i) => (
                                    <StyledTableRow key={i}>
                                        <StyledTableCell>{row.party_id?.name} </StyledTableCell>
                                        <StyledTableCell align="center">{row.party_type?.name} </StyledTableCell>
                                        <StyledTableCell align="center">{row.total_qty} </StyledTableCell>
                                        <StyledTableCell align="center">{row.depriciation}</StyledTableCell>
                                        <StyledTableCell align="center">{row.description}</StyledTableCell>
                                        <StyledTableCell align="center">{row.net_amount}</StyledTableCell>
                                        <StyledTableCell align="center">{row.total_amount}</StyledTableCell>
                                        {/* <StyledTableCell align="center">{row.date}</StyledTableCell> */}
                                        <StyledTableCell align="center">
                                            <div
                                                className={`${row.approval_status === "Approved" ? "active_beat" : "inactive_beat"}`} >
                                                <select onChange={(e) => editStatusFunc(e, row.id)} >
                                                    <option value="">{row.approval_status}</option>
                                                    <option value="Approved">Approved</option>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Modify">Modify</option>
                                                </select>
                                            </div>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        )}
                    </Table>
                    {goodReturnVoucher?.length !== 0 && (
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
                    {goodReturnVoucher?.length === 0 && (
                        <div className="no_data">
                            No Data
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GoodReturnVoucherApproval;