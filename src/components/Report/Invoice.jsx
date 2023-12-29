import "./Report.css";
import React, { useContext, useEffect, useRef, useState } from "react";

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
import { useParams } from "react-router-dom";
import { getInvoice } from "../../api/reportsAPI";
import { AdminContext } from "../../App";
import { toast } from "react-toastify";

const PrimaryOrders = () => {
    const params = useParams()
    // console.log("params.id", params.id);

    const { state } = useContext(AdminContext)
    // console.log("admin state", state && state);

    const [isLoading, setisLoading] = useState(false);
    const [btnLoading, setbtnLoading] = useState(false);

    const [invoiceData, setinvoiceData] = useState()

    useEffect(() => {
        setisLoading(true)
        getInvoiceFunc()
    }, [])

    // console.log(invoiceData)

    async function getInvoiceFunc() {
        let { data } = await getInvoice(params.id)
        // console.log(data)

        if (data.status) {
            setinvoiceData(data.result)
            return setisLoading(false)
        }

        console.log("Invoide Order API Error!");
    }


    // html to pdf
    const pdfView = useRef(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.type = "application/javascript";
        script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
        document.head.appendChild(script);
    }, []);

    function savePdf() {
        setbtnLoading(true)

        var opt = {
            margin: 0.2,
            filename: "myfile.pdf",
            image: { type: "jpg", quality: 0.5 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        };
        window.html2pdf(pdfView.current, opt)
            .then(() => {
                setbtnLoading(false)
                toast.success("Invoice Downloaded Successfully!")
            })
        // html2pdf().set(opt).from(this.$refs.document).save()
    }

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: "lightgrey",
            color: "#000",
            fontWeight: 600,
            border: "1px solid gray"
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
            border: "1px solid gray"
            // backgroundColor: "#fff",
        },
    }));

       const StyledTableRow = styled(TableRow)(({ theme }) => ({
        borderBottom: "2px solid #00000011",
    }));

    return (
        <div className="container" style={{ maxWidth: "100%" }}>
            <div className="beat_heading">
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">Order Invoice</div>
                </div>
                <div className="beat_right employee_head">
                    <div className="add_btn" onClick={savePdf} >
                        {btnLoading ? (
                            <div className="download_invoice_btn">
                                <CircularProgress style={{ color: "#fff" }} size={26} />
                            </div>
                        ) : (
                            "Download Invoice"
                        )}
                    </div>
                </div>
            </div>

            {/* <a onClick={savePdf} className="invoice_download_link" href="#">Donwload Invoice</a> */}

            {isLoading ? (
                <div style={{ margin: "auto" }} >
                    <CircularProgress />
                </div>
            ) : (
                <div className="center_invoice" ref={pdfView}>
                    <div id="invoice">
                        <div className="invoice_company_detail">
                            <div>Company Name : <span className="grey_span">{state?.result?.company_name}</span></div>
                            <div>Email : <span className="grey_span">{state?.result?.email}</span></div>
                            <div>Phone : <span className="grey_span">{state?.result?.phone}</span></div>
                        </div>
                        <div className="invoice_detail_heading">
                            <span className="invoice_id">Invoide #{invoiceData?._id}</span>
                            <span>/</span>
                            <span className="invoice_date">{invoiceData?.date?.split("-").reverse().join("-")}</span>
                        </div>
                        <div className="invoice_party_detail">
                            <h2 className="party_invoice_heading" >Bill To</h2>
                            <div>Party Name : <span className="grey_span">{invoiceData?.party_name}</span></div>
                            <div>Email : <span className="grey_span">{invoiceData?.email}</span></div>
                            <div>Phone : <span className="grey_span">{invoiceData?.phone}</span></div>
                            <div>Pay Status :
                                <span className="grey_span">
                                    {invoiceData?.pay_status === "Paid" ? (
                                        <span style={{ color: "green" }}>
                                            {invoiceData?.pay_status}
                                        </span>
                                    ) : (
                                        <span style={{ color: "red" }}>
                                            {invoiceData?.pay_status}
                                        </span>
                                    )}
                                </span>
                            </div>
                        </div>
                        <Table aria-label="customized table">
                            <TableHead>
                                <TableRow style={{ display: "flex" }}>
                                    <StyledTableCell style={{ flex: 1 }} >S. No.</StyledTableCell>
                                    <StyledTableCell style={{ flex: 3 }} align="center">Item</StyledTableCell>
                                    <StyledTableCell style={{ flex: 1 }} align="center">Unit Price</StyledTableCell>
                                    <StyledTableCell style={{ flex: 1 }} align="center">Qty</StyledTableCell>
                                    <StyledTableCell style={{ flex: 1 }} align="center">Amount</StyledTableCell>
                                </TableRow>
                            </TableHead>

                            {invoiceData?.length !== 0 && (
                                <TableBody>
                                    {invoiceData?.details?.map((item, i) => (
                                        <StyledTableRow style={{ display: "flex" }} >
                                            <StyledTableCell style={{ flex: 1 }}>{i + 1}</StyledTableCell>
                                            <StyledTableCell style={{ flex: 3 }} align="left">{item.product_name}</StyledTableCell>
                                            <StyledTableCell style={{ flex: 1 }} align="center">{item.unit_price || 100}</StyledTableCell>
                                            <StyledTableCell style={{ flex: 1 }} align="center">{item.quantity}</StyledTableCell>
                                            <StyledTableCell style={{ flex: 1 }} align="center">{item.sub_total}</StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                    <StyledTableRow style={{ display: "flex" }} >
                                        <StyledTableCell style={{ flex: 5 }}></StyledTableCell>
                                        <StyledTableCell className="invoice_total_amount_cell" style={{ flex: 2.05 }} align="center">
                                            <div>Total Amount : <span className="grey_span">{invoiceData?.amount}</span></div>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </TableBody>
                            )}
                        </Table>
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

        </div>
    );
};

export default PrimaryOrders;