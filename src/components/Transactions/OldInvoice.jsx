import "./Transactions.css"
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
import { useLocation, useParams } from "react-router-dom";
import { getOrderDetail } from "../../api/reportsAPI";
import { toast } from "react-toastify";
import { fetchAllUnit, fetchAllProduct } from "../../api/productAPI";
import { AdminContext } from "../../App";

const OldInvoice = () => {
    const params = useParams()
    const location = useLocation()

    const { state, dispatch } = useContext(AdminContext)
    console.log(state && state);

    const [isLoading, setisLoading] = useState(false);
    const [btnLoading, setbtnLoading] = useState(false);

    const [invoiceData, setinvoiceData] = useState()

    // Top Popup Fields
    const [popupInput, setpopupInput] = useState({
        date: location.state?.date || "",
        invoice_no: location.state?.invoice_no || "",
        vehicle_no: location.state?.vehicle_no || "",
        voucher_no: location.state?.voucher_no || "",
        sale_type: location.state?.sale_type || "",
        tax_type: location.state?.tax_type || "",
        // order_id: params.id,
    })

    const popupInputHandler = (e) => {
        setpopupInput({ ...popupInput, [e.target.name]: e.target.value });
    }

    // Product Table
    const [allProduct, setallProduct] = useState([])

    // Tax Table 
    const [taxTable, settaxTable] = useState([
        {
            tax_rate: "5",
            taxable_ammount: "",
            igst: "",
            cgst: "",
            sgst: "",
            total_tax: "",
        },
        {
            tax_rate: "12",
            taxable_ammount: "",
            igst: "",
            cgst: "",
            sgst: "",
            total_tax: "",
        },
        {
            tax_rate: "18",
            taxable_ammount: "",
            igst: "",
            cgst: "",
            sgst: "",
            total_tax: "",
        },
        {
            tax_rate: "28",
            taxable_ammount: "",
            igst: "",
            cgst: "",
            sgst: "",
            total_tax: "",
        }
    ])


    useEffect(() => {
        setisLoading(true)
        getInvoiceFunc()
    }, [])

    useEffect(() => {
        // taxTable.map((table, i) => {
        //     console.log(table)
        //     allProduct?.map((product, i) => {
        //         console.log(product.sub_total)
        //         table.taxable_ammount = product.sub_total
        //         table.igst = product.sub_total
        //         table.cgst = product.sub_total / 2
        //         table.sgst = product.sub_total / 2

        //         // taxTable.map(item => {
        //         //     if (item.tax_rate === 5) item.taxable_ammount = product.sub_total
        //         //     if (item.tax_rate === 12) item.taxable_ammount = product.sub_total / 2
        //         //     if (item.tax_rate === 18) item.taxable_ammount = product.sub_total / 3
        //         //     if (item.tax_rate === 28) item.taxable_ammount = product.sub_total / 4
        //         // })
        //     })
        // })
        // console.log(allProduct);
    }, [allProduct])


    


    // console.log("invoiceData", invoiceData)
    // console.log("allProduct", allProduct)
    // console.log("location", location.state);
    // console.log("popupInput", popupInput)
    // console.log("taxTable", taxTable)


    async function getInvoiceFunc() {
        let { data } = await getOrderDetail(params.id)
        // console.log(data)

        if (data.status) {
            setinvoiceData(data.result)
            setallProduct(data.result.details)
            return setisLoading(false)
        }

        console.log("Invoide Order API Error!");
    }


    // Action Button Function

    const saveInvoiceBtnFunc = async () => {
        let finalData = {
            popupInput,
            allProduct,
            taxTable
        }

        console.log(finalData)
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

    // useEffect(() => {
    //     console.log("useEff tax")
    // }, [state])

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
            backgroundColor: "var(--main-color)",
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
            border: "1px solid lightgray",
            padding: "0.5rem 1rem"
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
                    <div className="title">Old Invoices</div>
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

            <div className="tracking_tabs" style={{ flexDirection: "column" }}>
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
                    <input
                        type="text"
                        name="invoice_no"
                        value={popupInput.invoice_no}
                        onChange={popupInputHandler}
                        placeholder="Invoice Number"
                    />
                    <input
                        type="text"
                        name="vehicle_no"
                        value={popupInput.vehicle_no}
                        onChange={popupInputHandler}
                        placeholder="Vehicle Number"
                    />
                </div>
                <div className="tarcking_tab_left" style={{ width: "100%" }}>
                    <input
                        type="text"
                        name="voucher_no"
                        value={popupInput.voucher_no}
                        onChange={popupInputHandler}
                        placeholder="Voucher Number"
                    />
                    <input
                        type="text"
                        name="sale_type"
                        value={popupInput.sale_type}
                        onChange={popupInputHandler}
                        placeholder="Sale Type"
                    />
                    <select name="tax_type" onChange={popupInputHandler}>
                        <option value={popupInput.tax_type}>Selected Tax - {popupInput.tax_type}</option>
                        <option value="IGST">IGST</option>
                        <option value="LGST">LGST</option>
                    </select>

                </div>
            </div>
            <div style={{ marginBottom: "1.5rem" }} ></div>

            {isLoading ? (
                <div style={{ margin: "auto" }} >
                    <CircularProgress />
                </div>
            ) : (
                <Table aria-label="customized table">
                    <TableHead>
                        <TableRow style={{ display: "flex" }}>
                            <StyledTableCell style={{ flex: 0.5 }} >S. No.</StyledTableCell>
                            <StyledTableCell style={{ flex: 3 }} align="left">Item</StyledTableCell>
                            <StyledTableCell style={{ flex: 1 }} align="center">Qty</StyledTableCell>
                            <StyledTableCell style={{ flex: 1 }} align="center">Unit</StyledTableCell>
                            <StyledTableCell style={{ flex: 1 }} align="center">Price</StyledTableCell>
                            <StyledTableCell style={{ flex: 1 }} align="center">Amount</StyledTableCell>
                        </TableRow>
                    </TableHead>

                    {allProduct?.length !== 0 && (
                        <TableBody>
                            {allProduct?.map((row, i) => (
                                <StyledTableRow style={{ display: "flex" }} >
                                    <StyledTableCell style={{ flex: 0.5 }}>{i + 1}</StyledTableCell>
                                    <StyledTableCell style={{ flex: 3 }} align="left">
                                        <ItemName row={row} allProduct={allProduct} />
                                    </StyledTableCell>
                                    <StyledTableCell style={{ flex: 1 }} align="center">
                                        <QuantityInput row={row} allProduct={allProduct} />
                                    </StyledTableCell>
                                    <StyledTableCell style={{ flex: 1 }} align="center">
                                        <UnitInput row={row} allProduct={allProduct} />
                                    </StyledTableCell>
                                    <StyledTableCell style={{ flex: 1 }} align="center">
                                        <PriceInput row={row} allProduct={allProduct} />
                                    </StyledTableCell>
                                    <StyledTableCell style={{ flex: 1 }} align="center">
                                        <TotalAmountInput row={row} allProduct={allProduct} taxTable={taxTable} onChange={(c) => {
                                            console.log(">>>>", c)
                                            // dispatch({ type: "ADMIN", payload: { ...state, tax: taxTable } });
                                        }} />
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                            {/* <StyledTableRow style={{ display: "flex" }} >
                                <StyledTableCell style={{ flex: 5 }}></StyledTableCell>
                                <StyledTableCell className="invoice_total_amount_cell" style={{ flex: 2.05 }} align="right">
                                    <div>Total Amount : <span className="grey_span">{invoiceData?.amount}</span></div>
                                </StyledTableCell>
                            </StyledTableRow> */}
                        </TableBody>
                    )}
                </Table>
            )}


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
                        {popupInput.tax_type === "IGST" ? (
                            <StyledTableCell align="center">IGST</StyledTableCell>
                        ) : (
                            <>
                                <StyledTableCell align="center">CGST</StyledTableCell>
                                <StyledTableCell align="center">SGST</StyledTableCell>
                            </>
                        )}
                        <StyledTableCell align="center">Total Tax</StyledTableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {taxTable.map((table, i) => (
                        <StyledTableRow>
                            <StyledTableCell>{table.tax_rate}%</StyledTableCell>
                            <StyledTableCell align="center">{table.taxable_ammount}</StyledTableCell>
                            {popupInput.tax_type === "IGST" ? (
                                <StyledTableCell align="center">{table.igst}</StyledTableCell>
                            ) : (
                                <>
                                    <StyledTableCell align="center">{table.cgst}</StyledTableCell>
                                    <StyledTableCell align="center">{table.sgst}</StyledTableCell>
                                </>
                            )}
                            <StyledTableCell align="center">{table.total_tax}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="invoice_bottom_btns">
                <div onClick={() => saveInvoiceBtnFunc()} className="action_btn">
                    SAVE
                </div>
                <div className="action_btn">
                    GENERATE INVOICE
                </div>
            </div>
        </div >
    );
};



// Custom Input fields 

const ItemName = ({ row, allProduct, onChange }) => {
    const [inputVal, setinputVal] = useState(row.product_name)

    const [productList, setproductList] = useState([])

    useEffect(() => {
        fetchAllProduct().then(res => setproductList(res.data.result))
    }, [])

    const retailHandleInput = (e, selectedProduct) => {
        setinputVal(e.target.value)

        let product = allProduct.filter(product => product.id === selectedProduct.id)[0]
        // console.log(product);
        product.product_name = e.target.value
    }

    return (
        < select name="product_name" onChange={(e) => retailHandleInput(e, row)} className="invoice_product_select" >
            <option value={row.product_name}>{row.product_name}</option>
            {productList?.map((product) => (
                <option key={product.id} value={product.name}>{product.name}</option>
            ))}
        </select >
    )
}

const PriceInput = ({ row, allProduct }) => {
    const [inputVal, setinputVal] = useState(row.price || 0)

    const retailHandleInput = (e, selectedProduct) => {
        setinputVal(e.target.value)

        let product = allProduct.filter(product => product.id === selectedProduct.id)[0]
        // console.log(product);
        product.price = e.target.value
    }

    return (
        <input
            type="number"
            value={inputVal}
            className="partyType_pricelist"
            onChange={(e) => retailHandleInput(e, row)}
            placeholder="0"
        />
    )
}

const UnitInput = ({ row, allProduct }) => {
    const [inputVal, setinputVal] = useState(JSON.parse(row.unit)?.[0]?.unitName)

    const [allUnits, setallUnits] = useState([])

    useEffect(() => {
        fetchAllUnit().then(res => setallUnits(res.data.result))
    }, [])

    const retailHandleInput = (e, selectedProduct) => {
        setinputVal(e.target.value)

        let product = allProduct.filter(product => product.id === selectedProduct.id)[0]
        // console.log(product);
        product.unit = JSON.stringify([{ unitName: e.target.value, unitValue: '5' }])
    }

    return (
        <select name="unitName" onChange={(e) => retailHandleInput(e, row)} className="invoice_product_select" >
            <option value="">{inputVal}</option>
            {allUnits?.map((unit) => (
                <option key={unit._id} value={unit.unit}>{unit.unit}</option>
            ))}
        </select>
    )
}

const QuantityInput = ({ row, allProduct }) => {
    const [inputVal, setinputVal] = useState(row.quantity || 0)

    const retailHandleInput = (e, selectedProduct) => {
        setinputVal(e.target.value)

        let product = allProduct.filter(product => product.id === selectedProduct.id)[0]
        // console.log(product);
        product.quantity = e.target.value
    }

    return (
        <input
            type="number"
            value={inputVal}
            className="partyType_pricelist"
            onChange={(e) => retailHandleInput(e, row)}
            placeholder="0"
        />
    )
}

const TotalAmountInput = ({ row, allProduct, taxTable, onChange }) => {
    const { state, dispatch } = useContext(AdminContext)

    const [inputVal, setinputVal] = useState(row.sub_total || 0)

    const retailHandleInput = (e, selectedProduct) => {
        setinputVal(e.target.value)
        console.log("taxTable", taxTable)

        let table = taxTable.filter(table => table.tax_rate == "12")[0]
        table.taxable_ammount = table.taxable_ammount + 1
        // 
        let product = allProduct.filter(product => product.id === selectedProduct.id)[0]
        // console.log(product);
        product.sub_total = e.target.value

    }


    return (
        <input
            type="number"
            value={inputVal}
            className="partyType_pricelist"
            onChange={(e) => {
                onChange(taxTable)
                retailHandleInput(e, row)
                dispatch({ type: "ADMIN", payload: { ...state, tax: taxTable } });
            }}
            placeholder="0"
        />
    )
}


export default OldInvoice;