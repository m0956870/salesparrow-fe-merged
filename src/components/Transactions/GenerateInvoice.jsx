import "./Transactions.css"
import React, { useContext, useEffect, useRef, useState } from "react";
import group from "../../images/group.png";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";
import { CircularProgress } from "@mui/material";
import { Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";
import { getGenerateInvoice, getOrderDetail, markAsDelivered } from "../../api/reportsAPI";
import { fetchAllProduct, fetchAllUnit } from "../../api/productAPI";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import isAllowed from "../../utils/isAllowed";
import { VIEW_GENERATE_INVOICE } from "../../constants";

const GenerateInvoice = () => {
    const location = useLocation()
    console.log("location.state", location.state)
    const params = useParams()
    const navigate = useNavigate()

    const [isLoading, setisLoading] = useState(false);
    const [btnLoading, setbtnLoading] = useState(false);
    const [invoiceData, setinvoiceData] = useState();

    const [createdInvoice, setcreatedInvoice] = useState()
    const [afterInvoiceCreatePopup, setafterInvoiceCreatePopup] = useState(false)

    // Popup Model
    const [popupInput, setpopupInput] = useState({
        // order_id: params.id,
        date: location.state?.date || "",
        invoice_no: location.state?.invoice_no || "",
        vehicle_no: location.state?.vehicle_no || "",
        transporter_name: location.state?.transporter_name || "",
        tax_type: location.state?.tax_type || "",
        ewaybill_no: location.state?.ewaybill_no || "",
        total_nug: location.state?.total_nug || "",
    })

    // Product Data
    const [allProduct, setallProduct] = useState([])

    // Tax
    useEffect(() => {
        setisLoading(true)
        getInvoiceFunc()
    }, [])
    // console.log(allProduct)

    const popupInputHandler = (e) => {
        setpopupInput({ ...popupInput, [e.target.name]: e.target.value });
    }

    async function getInvoiceFunc() {
        let { data } = await getOrderDetail(params.id)
        if (data.status) {
            setinvoiceData(data.result)
            console.log("invoiceData", data.result)
            setallProduct(data.result.details)
            return setisLoading(false)
        }
        console.log("Invoide Order API Error!");
    }

    //make the array for the taxtable
    const taxTable = [
        {
            gst: 5,
            total_amount: "",
            taxable_amount: "",
            total_tax: "",
            igst: "",
            cgst: "",
            sgst: "",
        },
        {
            gst: 12,
            total_amount: "",
            taxable_amount: "",
            total_tax: "",
            igst: "",
            cgst: "",
            sgst: "",
        },
        {
            gst: 18,
            total_amount: "",
            taxable_amount: "",
            total_tax: "",
            igst: "",
            cgst: "",
            sgst: "",
        },
        {
            gst: 28,
            total_amount: "",
            taxable_amount: "",
            total_tax: "",
            igst: "",
            cgst: "",
            sgst: "",
        },
    ]

    // const taxTable = []
    // all the calculation based on the all product/ ammount here
    allProduct?.map((p) => {
        taxTable?.map(t => {
            if (p.gst == t.gst) {
                let total_amount = Math.floor(Number(t.total_amount) + Number(p.amount))
                t.total_amount = Math.floor(Number(t.total_amount) + Number(p.amount));

                if (t.gst == "5") {
                    let taxable_amount = Math.floor(total_amount / 1.05)
                    t.taxable_amount = taxable_amount;

                    let total_tax = total_amount - taxable_amount
                    t.total_tax = total_amount - taxable_amount;

                    t.igst = total_tax;
                    t.cgst = total_tax / 2;
                    t.sgst = total_tax / 2;
                } else if (t.gst == "12") {
                    let taxable_amount = Math.floor(total_amount / 1.12)
                    t.taxable_amount = taxable_amount;

                    let total_tax = total_amount - taxable_amount
                    t.total_tax = total_amount - taxable_amount;

                    t.igst = total_tax;
                    t.cgst = total_tax / 2;
                    t.sgst = total_tax / 2;
                } else if (t.gst == "18") {
                    let taxable_amount = Math.floor(total_amount / 1.18)
                    t.taxable_amount = taxable_amount;

                    let total_tax = total_amount - taxable_amount
                    t.total_tax = total_amount - taxable_amount;

                    t.igst = total_tax;
                    t.cgst = total_tax / 2;
                    t.sgst = total_tax / 2;
                } else if (t.gst == "28") {
                    let taxable_amount = Math.floor(total_amount / 1.28)
                    t.taxable_amount = taxable_amount;

                    let total_tax = total_amount - taxable_amount
                    t.total_tax = total_amount - taxable_amount;

                    t.igst = total_tax;
                    t.cgst = total_tax / 2;
                    t.sgst = total_tax / 2;
                }
            }
        })
    })

    const saveInvoiceBtnFunc = async () => {
        setbtnLoading(true)
        if (!await isAllowed(VIEW_GENERATE_INVOICE)) {
            toast.error("Module is not purchased!");
            return setbtnLoading(false);
        }

        let invoice_amount = 0
        taxTable.map((tax) => invoice_amount += Number(tax.taxable_amount))

        let finalData = {
            order_id: params.id,
            invoice_date: popupInput.date,
            invoice_no: popupInput.invoice_no,
            vehicle_no: popupInput.vehicle_no,
            transporter_name: popupInput.transporter_name,
            tax_type: popupInput.tax_type,
            ewaybill_no: popupInput.ewaybill_no,
            total_nug: popupInput.total_nug,

            emp_name: invoiceData.emp_name,
            party_id: invoiceData.party_id,
            partyType: invoiceData.party_type_id,
            supply_by_id: invoiceData.feed_by_id,
            invoice_amount: invoice_amount,
            product_list: allProduct,
            tax: taxTable,
        }
        // return console.log("finalData", finalData)

        let res = await getGenerateInvoice(finalData)
        if (res.data.status) {
            // let dataObj = {
            //     order_id: params.id,
            //     invoice_date: popupInput.date,
            //     supply_by_id: invoiceData.feed_by_id,
            //     invoice_no: popupInput.invoice_no,
            //     party_id: invoiceData.party_id,
            //     partyType: invoiceData.party_type_id,
            //     invoice_amount: invoice_amount,
            // }
            // let res2 = await markAsDelivered(dataObj)
            // if (res2.data.status) {
            //     return console.log("done");
            // }

            // toast.success("Invoice created successfully.");
            // navigate("/invoices");

            toast.success("Invoice created successfully.");
            setcreatedInvoice(res.data.result)
            setafterInvoiceCreatePopup(true)
            setbtnLoading(false)
            return
        }
        console.log("Error")
        setbtnLoading(false)
    }

    const addItemFunc = () => {
        let obj = {
            gst: "",
            price: "",
            product_id: "",
            product_name: "",
            quantity: "",
            sub_total: "",
            unit: [],
        }

        setallProduct([...allProduct, obj])
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

    // Table Styles
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
            padding: "0.5rem 1rem",
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
        <div className="container" style={{ maxWidth: "100%" }}>
            <div className="beat_heading">
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">Invoices</div>
                </div>
                <div className="beat_right employee_head">
                    <div className="add_btn" onClick={savePdf} >
                        {btnLoading ? (
                            <div className="download_invoice_btn">
                                <CircularProgress style={{ color: "#fff" }} size={26} />
                            </div>
                        ) : (
                            "Print Invoice"
                        )}
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div style={{ margin: "auto" }} >
                    <CircularProgress />
                </div>
            ) : (
                <>
                    <div ref={pdfView}>
                        {/* Popup Input */}
                        <div className="tracking_tabs" style={{ flexDirection: "column" }}>
                            <div className="tarcking_tab_left" style={{ width: "100%" }}>
                                <input
                                    type="text"
                                    name="party_name"
                                    value={invoiceData?.party_name}
                                    // onChange={popupInputHandler}
                                    placeholder="Party Name"
                                    disabled
                                />
                                <input
                                    type="text"
                                    name="invoice_no"
                                    value={popupInput.invoice_no}
                                    onChange={popupInputHandler}
                                    placeholder="Invoice Number"
                                />
                                <input
                                    type="text"
                                    name="ewaybill_no"
                                    value={popupInput.ewaybill_no}
                                    onChange={popupInputHandler}
                                    placeholder="E-Waybill No."
                                />
                            </div>
                            <div className="tarcking_tab_left" style={{ width: "100%" }}>
                                <input
                                    type="text"
                                    name="date"
                                    value={popupInput.date}
                                    onChange={popupInputHandler}
                                    onClick={(e) => (e.target.type = "date")}
                                    onBlur={(e) => (e.target.type = "text")}
                                    placeholder="Date"
                                />
                                <select name="tax_type" onChange={popupInputHandler}>
                                    <option value={popupInput.tax_type}>Selected Tax - {popupInput.tax_type}</option>
                                    <option value="IGST">IGST</option>
                                    <option value="LGST">LGST</option>
                                </select>

                                <input
                                    type="text"
                                    name="total_nug"
                                    value={popupInput.total_nug}
                                    onChange={popupInputHandler}
                                    placeholder="Total Cases"
                                />
                            </div>
                        </div>
                        <div style={{ marginBottom: "1.5rem" }} ></div>


                        {/* Prduct Table */}
                        <Table aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>S. No.</StyledTableCell>
                                    <StyledTableCell align="left">Item</StyledTableCell>
                                    <StyledTableCell align="center">Qty</StyledTableCell>
                                    <StyledTableCell align="center">Unit</StyledTableCell>
                                    <StyledTableCell align="center">Price</StyledTableCell>
                                    <StyledTableCell align="center">Cases</StyledTableCell>
                                    <StyledTableCell align="center">Amount</StyledTableCell>
                                    <StyledTableCell align="center"></StyledTableCell>
                                </TableRow>
                            </TableHead>

                            {allProduct?.length !== 0 && (
                                <TableBody>
                                    {allProduct?.map((row, i) => (
                                        <StyledTableRow key={i} >
                                            <StyledTableCell>{i + 1}</StyledTableCell>
                                            <StyledTableCell align="left">
                                                <ItemName row={row} i={i} allProduct={allProduct} setallProduct={setallProduct} />
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <QuantityInput row={row} allProduct={allProduct} setallProduct={setallProduct} />
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <UnitInput row={row} allProduct={allProduct} setallProduct={setallProduct} />
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <PriceInput row={row} allProduct={allProduct} setallProduct={setallProduct} />
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <NugInput row={row} allProduct={allProduct} setallProduct={setallProduct} />
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <TotalAmountInput row={row} allProduct={allProduct} setallProduct={setallProduct} />
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <DeleteIcon
                                                    style={{ fontSize: "1rem", color: "red", marginLeft: "0.5rem", }}
                                                    className="emp_grp_icons"
                                                    onClick={() => {
                                                        setallProduct(allProduct.filter((p) => p.product_id !== row.product_id))
                                                    }}
                                                />
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            )}
                        </Table>

                        <div className="add_product_invoice_btn">
                            <div className="add_btn" style={{ padding: "0.5rem" }} onClick={() => addItemFunc()} >Add Items</div>
                        </div>

                        {/* Tax Table */}
                        <div className="beat_heading">
                            <div className="beat_left">
                                <div className="icon">
                                    <img src={group} alt="icon" />
                                </div>
                                <div className="title">Tax</div>
                            </div>
                            <div className="beat_right employee_head">
                            </div>
                        </div>

                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Tax Rate</StyledTableCell>
                                    <StyledTableCell align="center">Taxable Amount</StyledTableCell>
                                    <StyledTableCell align="center">Total Tax</StyledTableCell>
                                    {popupInput.tax_type === "IGST" ? (
                                        <StyledTableCell align="center">IGST</StyledTableCell>
                                    ) : (
                                        <>
                                            <StyledTableCell align="center">CGST</StyledTableCell>
                                            <StyledTableCell align="center">SGST</StyledTableCell>
                                        </>
                                    )}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {taxTable.map((table, i) => (
                                    <>
                                        {table.total_amount !== "" && (
                                            <StyledTableRow>
                                                <StyledTableCell>{table.gst}%</StyledTableCell>
                                                <StyledTableCell align="center">₹{table.taxable_amount}</StyledTableCell>
                                                <StyledTableCell align="center">₹{table.total_tax}</StyledTableCell>
                                                {popupInput.tax_type === "IGST" ? (
                                                    <StyledTableCell align="center">₹{table.igst}</StyledTableCell>
                                                ) : (
                                                    <>
                                                        <StyledTableCell align="center">₹{table.cgst}</StyledTableCell>
                                                        <StyledTableCell align="center">₹{table.sgst}</StyledTableCell>
                                                    </>
                                                )}
                                            </StyledTableRow>
                                        )}
                                    </>
                                ))}
                            </TableBody>
                        </Table>

                    </div>


                    <div className="invoice_bottom_btns">
                        {/* <div onClick={() => saveInvoiceBtnFunc()} className="action_btn">
                    SAVE
                </div> */}
                        <button disabled={btnLoading} onClick={() => saveInvoiceBtnFunc()} className="action_btn">
                            {btnLoading ? (
                                <CircularProgress style={{ color: "#fff" }} size={26} />
                            ) : (
                                "GENERATE INVOICE"
                            )}

                        </button>
                    </div>
                </>
            )}

            {/* after invoice created popup */}
            <Dialog
                open={afterInvoiceCreatePopup}
                aria-labelledby="form-dialog-title"
                maxWidth="xs"
                fullWidth="true"
                onClose={() => setafterInvoiceCreatePopup(false)}
            >
                <DialogTitle className="dialog_title">
                    <div>Do you want to see invoice or quit?</div>
                </DialogTitle>
                <DialogContent className="cardpopup_content">
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div className="employee_gl_popup" onClick={() => navigate("/invoices")}>
                            No
                        </div>
                        <div className="employee_gl_popup_del" onClick={() => navigate(`/tax_invoice/${createdInvoice?._id}`)}>
                            Yes
                        </div>
                    </div>
                </DialogContent>
                <DialogActions></DialogActions>
            </Dialog>

        </div >
    );
};



const ItemName = ({ row, i, allProduct, setallProduct }) => {
    // console.log("row", row)
    // console.log("allProduct", allProduct)
    const [inputVal, setinputVal] = useState(row.product_name)
    const [productList, setproductList] = useState([])

    useEffect(() => {
        fetchAllProduct().then(res => setproductList(res.data.result))
    }, [])

    const onChangeHandler = (e) => {
        let selectedProduct = JSON.parse(e.target.value)
        setinputVal(selectedProduct.name)

        allProduct[i].gst = selectedProduct.gst;
        allProduct[i].price = selectedProduct.price;
        allProduct[i].product_id = selectedProduct.id;
        allProduct[i].product_name = selectedProduct.name;
        allProduct[i].quantity = "1";
        allProduct[i].sub_total = selectedProduct.price * 1;
        allProduct[i].amount = selectedProduct.amount;
        allProduct[i].unit = selectedProduct.packing_details[0]

        setallProduct(allProduct);
    }

    const handleInput = () => {
        let product = allProduct.map((p) => {
            if (p.product_id === row.product_id) {
                p.product_name = inputVal;
            }
            return p;
        })
        setallProduct(product);
    }
    return (
        < select
            className="invoice_product_select"
            onChange={onChangeHandler}
            onBlur={handleInput}
        >
            <option value={inputVal}>{inputVal}</option>
            {productList?.map((product) => (
                <option key={product.id} value={JSON.stringify(product)}>{product.name}</option>
            ))}
        </select >
    )
}

const QuantityInput = ({ row, allProduct, setallProduct }) => {
    const [inputVal, setinputVal] = useState(row.quantity)

    const handleInput = () => {
        let product = allProduct.map((p) => {
            if (p.product_id === row.product_id) {
                p.quantity = inputVal;
                p.amount = inputVal * p.price
            }
            return p;
        })
        setallProduct(product);
    }

    return (
        <input
            type="number"
            value={inputVal}
            onChange={(e) => setinputVal(e.target.value)}
            onBlur={handleInput}
            placeholder="0"
            className="invoice_product_select"
        />
    )
}

const UnitInput = ({ row, allProduct, setallProduct }) => {
    // const [inputVal, setinputVal] = useState(JSON.parse(row.unit)?.[0]?.unitName)
    let unitValue = row.unit.length !== 0 ? JSON.parse(row.unit)?.[0]?.unitName : "Select Unit"
    const [inputVal, setinputVal] = useState(unitValue)
    // const [inputVal, setinputVal] = useState("")
    const [allUnits, setallUnits] = useState([])

    useEffect(() => {
        // fetchAllUnit().then(res => setallUnits(res.data.result))
        // setallUnits(JSON.parse(row.unit))
        let rowUnits = row.unit.length === 0 ? [] : JSON.parse(row.unit)
        setallUnits(rowUnits)
    }, [])

    const handleInput = () => {
        let product = allProduct.map((p) => {
            if (p.product_id === row.product_id) {
                p.unit = JSON.stringify([{ unitName: inputVal }])
            }
            return p;
        })
        setallProduct(product);
    }

    return (
        < select
            className="invoice_product_select"
            onChange={(e) => setinputVal(e.target.value)}
            onBlur={handleInput}
        >
            <option value={inputVal}>{inputVal}</option>
            {allUnits?.map((unit) => (
                <option key={unit._id} value={unit.unitName}>{unit.unitName}</option>
            ))}
        </select >
    )
}

const PriceInput = ({ row, allProduct, setallProduct }) => {
    const [inputVal, setinputVal] = useState(row.price)

    const handleInput = () => {
        let product = allProduct.map((p) => {
            if (p.product_id === row.product_id) {
                p.price = inputVal;
                p.amount = inputVal * p.quantity
            }
            return p;
        })
        setallProduct(product);
    }

    return (
        <input
            type="number"
            value={inputVal}
            onChange={(e) => setinputVal(e.target.value)}
            onBlur={handleInput}
            placeholder="0"
            className="invoice_product_select"
        />
    )
}

const NugInput = ({ row, allProduct, setallProduct }) => {
    const [inputVal, setinputVal] = useState(row.nug)

    const handleInput = () => {
        let product = allProduct.map((p) => {
            if (p.product_id === row.product_id) {
                p.nug = inputVal;
            }
            return p;
        })
        setallProduct(product);
    }

    return (
        <input
            type="number"
            value={inputVal}
            onChange={(e) => setinputVal(e.target.value)}
            onBlur={handleInput}
            placeholder="0"
            className="invoice_product_select"
        />
    )
}

const TotalAmountInput = ({ row, allProduct, setallProduct }) => {
    const [inputVal, setinputVal] = useState(row.amount)

    const handleInput = () => {
        let product = allProduct.map((p) => {
            if (p.product_id === row.product_id) {
                p.amount = inputVal;
            }
            return p;
        })
        setallProduct(product);
    }

    return (
        <>
            <div className="invoice_product_select">₹{inputVal}</div>
            {/* <input
            type="number"
            value={inputVal}
            onChange={(e) => setinputVal(e.target.value)}
            onBlur={handleInput}
            placeholder="0"
            className="invoice_product_select"
            /> */}
        </>
    )
}

export default GenerateInvoice;