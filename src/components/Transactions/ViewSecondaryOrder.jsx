import React, { useContext, useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";
import { CircularProgress } from "@mui/material";

// Images
import group from "../../images/group.png";
import { useParams } from "react-router-dom";
import { getSecondaryOrderDetail } from "../../api/reportsAPI";
import { toast } from "react-toastify";

const ViewSecondaryOrder = () => {
    const params = useParams()
    const [isLoading, setisLoading] = useState(false);
    const [btnLoading, setbtnLoading] = useState(false);
    const [invoiceData, setinvoiceData] = useState()

    useEffect(() => {
        setisLoading(true)
        getInvoiceFunc()
    }, [])

    async function getInvoiceFunc() {
        let { data } = await getSecondaryOrderDetail(params.id)
        if (data.status) {
            setinvoiceData(data.result)
            return setisLoading(false)
        }
        console.log("Invoide Order API Error!");
    }

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: "lightgrey",
            color: "#000",
            fontWeight: 600,
            border: "1px solid black",
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
            border: "1px solid black",
            // backgroundColor: "#fff",
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        borderBottom: "1px solid black",
    }));

    return (
        <div className="container" style={{ maxWidth: "100%" }}>
            <div className="beat_heading">
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">View Order</div>
                </div>
                <div className="beat_right employee_head">
                </div>
            </div>

            {isLoading ? (
                <div style={{ margin: "auto" }} >
                    <CircularProgress />
                </div>
            ) : (
                <div className="center_invoice">
                    <div id="invoice" style={{ padding: "1.5rem" }}>
                        <div className="invoice_detail_heading">
                            <span className="invoice_id">Secondary Order Details</span>
                        </div>
                        <div style={{ display: "flex" }} >
                            <div className="invoice_party_detail" style={{ paddingTop: "1rem", flex: 1 }}>
                                <div>Customer Name : <span className="grey_span">{invoiceData?.customer_name}</span></div>
                                <div>Employee Name : <span className="grey_span">{invoiceData?.emp_name}</span></div>
                                <div>Beat Name : <span className="grey_span">{invoiceData?.beat_name}</span></div>
                                <div>Route Name : <span className="grey_span">{invoiceData?.route_name}</span></div>
                            </div>
                            <div className="invoice_party_detail" style={{ paddingTop: "1rem", flex: 1 }}>
                                <div>State : <span className="grey_span">{invoiceData?.state}</span></div>
                                <div>Contact No. : <span className="grey_span">{invoiceData?.phone}</span></div>
                                <div>Email Id : <span className="grey_span">{invoiceData?.email}</span></div>
                            </div>
                        </div>
                        <Table aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell >S. No.</StyledTableCell>
                                    <StyledTableCell align="left">Item</StyledTableCell>
                                    <StyledTableCell align="center">UOM</StyledTableCell>
                                    <StyledTableCell align="center">Unit Price</StyledTableCell>
                                    <StyledTableCell align="center">Discount</StyledTableCell>
                                    <StyledTableCell align="center">Net Price</StyledTableCell>
                                    <StyledTableCell align="center">Qty</StyledTableCell>
                                    <StyledTableCell align="center">Amount</StyledTableCell>
                                </TableRow>
                            </TableHead>

                            {invoiceData?.length !== 0 && (
                                <TableBody>
                                    {invoiceData?.details?.map((item, i) => (
                                        <StyledTableRow >
                                            <StyledTableCell>{i + 1}</StyledTableCell>
                                            <StyledTableCell align="left">{item.product_name}</StyledTableCell>
                                            <StyledTableCell align="center">{JSON.parse(item.unit?.[0])?.[0]?.unitName}</StyledTableCell>
                                            <StyledTableCell align="center">₹{item.price}</StyledTableCell>
                                            <StyledTableCell align="center">{item.discount}%</StyledTableCell>
                                            <StyledTableCell align="center">₹{item.sub_total}</StyledTableCell>
                                            <StyledTableCell align="center">{item.quantity}</StyledTableCell>
                                            <StyledTableCell align="center">₹{item.amount}</StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                    <StyledTableRow >
                                        <StyledTableCell colSpan={5} ></StyledTableCell>
                                        <StyledTableCell colSpan={3} style={{ fontSize: "1.6rem", fontWeight: 500, padding: "0.5rem 0" }} align="center">
                                            <div>Total Amount : <span className="grey_span">₹{invoiceData?.amount}</span></div>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </TableBody>
                            )}
                        </Table>
                        {/* <div style={{ height: "3rem", display: "flex", border: "1px solid grey" }} >
                            <div style={{ flex: 1.54 }} ></div>
                            <div style={{ flex: 1, display: "grid", placeItems: "center", borderLeft: "1px solid grey" }} >
                                Total Amount: ₹{invoiceData?.amount}
                            </div>
                        </div> */}
                    </div>
                </div>
            )}

            {/* <div onClick={savePdf} class="btn changepass_btn">
                {btnLoading ? (
                    <CircularProgress style={{ color: "#fff" }} size={26} />
                ) : (
                    "Donwload Invoice"
                )}
            </div> */}

        </div >
    );
};

export default ViewSecondaryOrder;