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
import { useLocation } from "react-router-dom";
import { AdminContext } from "../../App";
import { toast } from "react-toastify";

const ViewInvoice = () => {
    const location = useLocation()
    // console.log(location.state)
    const { state } = useContext(AdminContext)

    const [isLoading, setisLoading] = useState(false);
    const [btnLoading, setbtnLoading] = useState(false);
    const [invoiceData, setinvoiceData] = useState(location.state)

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
                            <span className="invoice_id">Invoide ID - {invoiceData?.invoice_no}</span>
                            <span>/</span>
                            <span className="invoice_date">Date - {invoiceData?.date?.split("-").reverse().join("-")}</span>
                        </div>
                        <h2 className="party_invoice_heading" >Details</h2>
                        <div className="invoice_party_detail">
                            {/* <div>Voucher No. : <span className="grey_span">{invoiceData?.voucher_no}</span></div> */}
                            <div>Party Name : <span className="grey_span">{invoiceData?.party_name}</span></div>
                            <div>Party Email : <span className="grey_span">{invoiceData?.email}</span></div>
                            <div>Vehicle No. : <span className="grey_span">{invoiceData?.vehicle_no}</span></div>
                            <div>Order By : <span className="grey_span">{invoiceData?.emp_name}</span></div>
                            {/* <div>Email : <span className="grey_span">{invoiceData?.email}</span></div>
                            <div>Phone : <span className="grey_span">{invoiceData?.phone}</span></div> */}
                            {/* <div>Sale Type : <span className="grey_span">{invoiceData?.sale_type}</span></div> */}
                            {/* <div>Pay Status :
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
                            </div> */}
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
                                    {invoiceData?.product_list?.map((item, i) => (
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

                        <h2 className="party_invoice_heading" style={{ margin: "1rem 0" }}>Tax Details</h2>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Tax Rate</StyledTableCell>
                                    <StyledTableCell align="center">Taxable Amount</StyledTableCell>
                                    <StyledTableCell align="center">Total Tax</StyledTableCell>
                                    {invoiceData.tax === "IGST" ? (
                                        <StyledTableCell align="center">IGST</StyledTableCell>
                                    ) : (
                                        <>
                                            <StyledTableCell align="center">CGST</StyledTableCell>
                                            <StyledTableCell align="center">SGST</StyledTableCell>
                                        </>
                                    )}
                                    {/* <StyledTableCell align="center">IGST</StyledTableCell>
                                    <StyledTableCell align="center">CGST</StyledTableCell>
                                    <StyledTableCell align="center">SGST</StyledTableCell> */}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {invoiceData.tax.map((table, i) => (
                                    <>
                                        {table.total_amount !== "" && (
                                            <StyledTableRow>
                                                <StyledTableCell>{table.gst}%</StyledTableCell>
                                                <StyledTableCell align="center">{table.taxable_amount}</StyledTableCell>
                                                <StyledTableCell align="center">{table.total_tax}</StyledTableCell>
                                                {table.tax_type === "IGST" ? (
                                                    <StyledTableCell align="center">{table.igst}</StyledTableCell>
                                                ) : (
                                                    <>
                                                        <StyledTableCell align="center">{table.cgst}</StyledTableCell>
                                                        <StyledTableCell align="center">{table.sgst}</StyledTableCell>
                                                    </>
                                                )}
                                                {/* <StyledTableCell align="center">{table.igst}</StyledTableCell>
                                                <StyledTableCell align="center">{table.cgst}</StyledTableCell>
                                                <StyledTableCell align="center">{table.sgst}</StyledTableCell> */}
                                            </StyledTableRow>
                                        )}
                                    </>
                                ))}
                            </TableBody>
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

export default ViewInvoice;