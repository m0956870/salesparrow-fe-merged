import React, { useEffect, useRef, useState } from "react";
import logo_white from "../../images/logo_1.png";
import group from "../../images/group.png";
import { useParams } from "react-router-dom";
import { getInvoice } from "../../api/reportsAPI";
import { CircularProgress } from "@mui/material";
import { saveToPdf } from "../../utils/saveToPdf";
import { toast } from "react-toastify";
import { BsFilterLeft } from "react-icons/bs";
import isAllowed from "../../utils/isAllowed";
import { VIEW_GENERATE_INVOICE } from "../../constants";

const TaxInvoice = () => {
  const params = useParams()
  // console.log(params.id);
  const pdfView = useRef(null);
  const [isLoading, setisLoading] = useState(false);
  const [pdfBtnLoading, setpdfBtnLoading] = useState(false)
  const [filterDivExtended, setfilterDivExtended] = useState(false);

  const [btnLoading, setbtnLoading] = useState(false);
  const [invoiceData, setinvoiceData] = useState()

  const [hsxTableState, sethsxTableState] = useState([])
  const [totalTaxableAmountState, settotalTaxableAmountState] = useState(0)
  const [totalIGSTState, settotalIGSTState] = useState(0)
  const [totalTaxAmountState, settotalTaxAmountState] = useState(0)
  const [totalProductTotalState, settotalProductTotalState] = useState(0)

  useEffect(() => {
    getInvoiceFunc()
  }, [])
  console.log("invoiceData", invoiceData)

  async function getInvoiceFunc() {
    setisLoading(true)
    if (!await isAllowed(VIEW_GENERATE_INVOICE)) {
        toast.error("Module is not purchased!");
        return setisLoading(false);
    }

    let { data } = await getInvoice(params.id)
    if (data.status) {
      setinvoiceData(data.result)
      setisLoading(false)
      hsnTaxTableFunc(data.result.product_list)
      return
    }
    console.log("Invoide Order API Error!");
  }

  let hsnArray = [];
  let hsnTaxTable = [];
  function hsnTaxTableFunc(product_list) {
    product_list?.map(p => {
      if (!hsnArray.includes(p.product_hsn)) hsnArray.push(p.product_hsn)
    })

    hsnArray?.map(hsn => {
      hsnTaxTable.push({
        hsn: hsn,
        tax: [{
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
        },]
      })
    })

    product_list.map(p => {
      hsnTaxTable.map(h => {
        if (p.product_hsn === h.hsn) {
          h.tax.map(hsn => {
            if (hsn.gst == p.gst) {
              console.log("p&h ->", p, h)
              console.log("hsn ->", hsn)
              let total_tax = Number(p.amount) - Number(p.taxable_amount)
              hsn.hsn = h.hsn;
              hsn.total_amount = Number(hsn.total_amount) + Number(p.amount);
              hsn.taxable_amount = Number(hsn.taxable_amount) + Number(p.taxable_amount);
              hsn.total_tax = Number(hsn.total_tax) + Number(total_tax);
              hsn.igst = Number(hsn.igst) + Number(total_tax);
              hsn.cgst = Number(hsn.cgst) + Number(total_tax) / 2;
              hsn.sgst = Number(hsn.sgst) + Number(total_tax) / 2;

              console.log("hsn", hsn)

              settotalProductTotalState(prev => prev += Number(p.amount))
            }
          })
        }
      })
    })
    sethsxTableState(hsnTaxTable);

    hsnTaxTable.map(x => x.tax.map(elem => {
      if (elem.hsn) {
        settotalTaxableAmountState(prev => prev += Number(elem.taxable_amount));
        settotalIGSTState(prev => prev += Number(elem.igst));
        settotalTaxAmountState(prev => prev += Number(elem.total_tax));
      }
    }))
  }


  console.log("hsn", hsnTaxTable, hsxTableState)

  const filterAndExportFunc = (type) => {
    setTimeout(() => {
      // setexportBtnLoading(false)
      setpdfBtnLoading(false);
    }, 2000);

    if (type === "column_filter") return setfilterDivExtended(!filterDivExtended);
    else if (type === "export") {
      // setexportBtnLoading(true)
      setfilterDivExtended(false);
      // return exportFunc();
    } else if (type === "pdf") {
      setpdfBtnLoading(true)
      setfilterDivExtended(false);
      if (invoiceData.length < 1) return toast.error("Report list is empty!");
      return saveToPdf(pdfView, "Invoice");
    }
  }

  // Filter
  const [tableCols, setTableCols] = useState([
    {
      label: 'Description of Goods',
      key: 'product_name',
      type: "state_value",
      active: true,
    },
    {
      label: 'HSN Code',
      key: 'product_hsn',
      type: "value",
      active: true,
    },
    {
      label: 'Nug',
      key: "nug",
      type: "value",
      active: true,
    },
    {
      label: 'MRP',
      key: "mrp",
      type: "value",
      active: true,
    },
    {
      label: 'Qty.',
      key: "qty",
      type: "value",
      active: true,
    },
    {
      label: 'Unit',
      key: "unit",
      type: "unit_value",
      active: true,
    },
    {
      label: 'List Price',
      key: "list_price",
      type: "value",
      active: true,
    },
    {
      label: 'Disc.',
      key: "discount",
      type: "value",
      active: true,
    },
    {
      label: 'Net Price',
      key: "net_price",
      type: "value",
      active: true,
    },
    {
      label: 'Taxable Amount',
      key: "taxable_amount",
      type: "taxable_value",
      active: true,
    },
    {
      label: 'GST %',
      key: "gst",
      type: "value",
      active: true,
    },
    {
      label: 'Amount',
      key: "amount",
      type: "value",
      active: true,
    },
  ]);

  let filterCols = tableCols.filter(col => col.active);
  const toogleTableCol = (key) => {
    // if (key === "emp_name") return;
    const temp = tableCols.map(col => {
      if (col.key === key) return { ...col, active: !col.active }
      return col;
    })
    setTableCols(temp)
  }

  const TCComponent = ({ data }) => {
    let { row, col } = data;
    if (col.type === "unit_value") {
      return (
        <td>{JSON.parse(row[col.key]?.[0])?.[0]?.unitName}</td>
      )
    } else if (col.type === "taxable_value") {
      return (
        <td>{Number(row[col.key]).toFixed(2)}</td>
      )
    }
    return <td>{row[col.key]}</td>
  }

  return (
    <div className="container">
      <div className="beat_heading">
        <div className="beat_left">
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Order Invoice</div>
        </div>
        <div className="beat_right">
          <div className="top_right_filter">
            <div className="other_functionality_section" style={{ marginRight: 0 }}>
              <div className="section_options" onClick={() => filterAndExportFunc("column_filter")}>
                <span className="filter_icon" ><BsFilterLeft size={22} /></span> Filter
              </div>
              <div className="section_options" onClick={() => filterAndExportFunc("pdf")} >
                {pdfBtnLoading ? <CircularProgress size={24} /> : "PDF"}
              </div>
              <div className="section_options" onClick={() => {
                var printContents = document.getElementById("tax_invoice").innerHTML;
                var originalContents = document.body.innerHTML;
                document.body.innerHTML = printContents;
                window.print();
                document.body.innerHTML = originalContents;
              }} >
                Print
              </div>
              <div style={{ display: filterDivExtended ? "block" : "none" }} className="col_filter_section">
                {tableCols?.map((col) => (
                  <div className="col_filter" >
                    <label >
                      <input type="checkbox" checked={col.active} onChange={() => toogleTableCol(col.key)} />
                      <span onChange={() => toogleTableCol(col.key)} >{col.label}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ margin: "auto", }}>
          <CircularProgress />
        </div>
      ) : (
        <div className="tax_invoice" ref={pdfView} id="tax_invoice" >
          <h3 style={{ justifyContent: "center", display: "flex", }}>
            Tax Invoice
          </h3>
          <div className="invoice_container">
            <div className="d_flex">
              <div className="invoice_logo">
                <img src={invoiceData?.company_logo || ""} alt="icon" />
              </div>
              <div className="invoice_head" style={{ paddingRight: "8rem" }} >
                <h4 style={{ fontSize: "2rem" }} >{invoiceData?.company_name}</h4>
                <h5 style={{ fontSize: "1.5rem" }}>{invoiceData?.company_address || ""}</h5>
                <h5 style={{ fontSize: "1.5rem" }}>GST: {invoiceData?.company_GST}</h5>
                <h5 style={{marginBottom: "1.5rem"}} >Tel No. {invoiceData?.company_phone}</h5>
              </div>
            </div>
            <table className="invoice_third_table">
              <tr>
                <th rowSpan={3}>
                  <div className="invoice_col">
                    <div className="party_hear_part" style={{ fontSize: "1rem" }}>Bill to:</div>
                    <div className="d_flex">
                      <div className="party_hear_part">Party To</div>
                      <h6 className="party_detail_part"><span style={{ paddingRight: "0.8rem" }}>:</span>{invoiceData?.party_name},<br /> <span style={{ paddingLeft: "1rem" }}>{invoiceData?.party_address}</span></h6>
                    </div>
                    <div className="d_flex">
                      <div className="party_hear_part">GST</div>
                      <h6 className="party_detail_part"><span style={{ paddingRight: "0.8rem" }}>:</span>{invoiceData?.party_gstin}</h6>
                    </div>
                    <div className="d_flex">
                      <div className="party_hear_part">Station</div>
                      <h6 className="party_detail_part"><span style={{ paddingRight: "0.8rem" }}>:</span>{invoiceData?.party_city}</h6>
                    </div>
                    <div className="d_flex">
                      <div className="party_hear_part">PIN</div>
                      <h6 className="party_detail_part"><span style={{ paddingRight: "0.8rem" }}>:</span>{invoiceData?.party_phone}</h6>
                    </div>
                  </div>
                </th>
                <td>
                  <h4>Invoice #</h4>
                  <h5>{invoiceData?.invoice_no}</h5>
                </td>
                <td>
                  <h4>Invoice Date:</h4>
                  <h5>{invoiceData?.invoice_date}</h5>
                </td>
              </tr>
              <tr>
                {/* <td>Vehicle No.</td>
                <td>Transporter Name</td> */}
                <td>
                  <h4>GR/Vehycal No.</h4>
                  <h5>{invoiceData?.vehicle_no}</h5>
                </td>
                <td>
                  <h4>Transporter Name</h4>
                  <h5>{invoiceData?.transporter_name}</h5>
                </td>
              </tr>
              <tr>
                <td>
                  <h4>E - Waybill No.</h4>
                  <h5>{invoiceData?.e_waybill_no}</h5>
                </td>
                <td>
                  <h4>Total Nug</h4>
                  <h5>{invoiceData?.total_nugs}</h5>
                </td>
              </tr>
            </table>

            <table className="invoice_third_table">
              <thead>
                <tr>
                  <th style={{ fontSize: "0.9rem" }} >S.No.</th>
                  {filterCols?.map(col => <th style={{ whiteSpace: "nowrap", fontSize: "0.9rem" }} >{col.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {invoiceData?.product_list?.map((row, i) => (
                  <tr key={i} >
                    <td>{i + 1}</td>
                    {filterCols?.map(col => <TCComponent data={{ row, col }} />)}
                  </tr>
                ))}
              </tbody>
            </table>

            <div
              className="d_flex"
              style={{ justifyContent: "space-between", padding: "5px" }}
            >
              <p></p>
              <h3>Sub Total : {totalProductTotalState}</h3>
            </div>
            <div className="hr"></div>
            <div
              className="d_flex"
              style={{ justifyContent: "end", padding: "10px" }}
            >
              <p>Discount: </p>
            </div>
            <div className="hr"></div>
            <div
              className="d_flex"
              style={{ justifyContent: "end", padding: "10px" }}
            >
              <h3>Total : {totalProductTotalState}</h3>
            </div>
            <div className="hr"></div>

            <table className="invoice_third_table" style={{ fontWeight: 600, textAlign: "center" }}>
              <thead>
                <tr>
                  <th rowSpan={2} colSpan={2}>
                    HSN/SAC
                  </th>
                  <th colSpan={2}>Taxable Value</th>
                  {invoiceData?.tax_type === "IGST" ? (
                    <th colSpan={2}>IGST</th>
                  ) : (
                    <>
                      <th colSpan={2}>CGST</th>
                      <th colSpan={2}>SGST</th>
                    </>
                  )}
                  <th colSpan={2}>Totable Tax Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="">
                  <td colSpan={2}>&nbsp;</td>
                  <td colSpan={2}>&nbsp;</td>
                  {invoiceData?.tax_type === "IGST" ? (
                    <>
                      <td>Rate</td>
                      <td>&nbsp;Amount</td>
                    </>
                  ) : (
                    <>
                      <td>&nbsp;Rate</td>
                      <td>&nbsp;Amount</td>
                      <td>&nbsp;Rate</td>
                      <td>&nbsp;Amount</td>
                    </>
                  )}
                  <td>&nbsp;</td>
                </tr>
                {hsxTableState?.map(hsnCode => (
                  hsnCode.tax.map((tax, i) => {
                    if (tax.hsn) {
                      return (
                        <tr>
                          <td style={{ textAlign: "start" }} colSpan={2}>{tax.hsn}</td>
                          <td colSpan={2}>{Number(tax.taxable_amount).toFixed(2)}</td>
                          {invoiceData?.tax_type === "IGST" ? (
                            <>
                              <td>{Number(tax.gst)}</td>
                              <td>{Number(tax.igst).toFixed(2)}</td></>
                          ) : (
                            <>
                              <td>{Number(tax.gst) / 2}</td>
                              <td>{Number(tax.cgst).toFixed(2)}</td>
                              <td>{Number(tax.gst) / 2}</td>
                              <td>{Number(tax.sgst).toFixed(2)}</td>
                            </>
                          )}
                          <td colSpan={2}>{Number(tax.total_tax).toFixed(2)}</td>
                        </tr>
                      )
                    }
                  })
                ))}
                <tr>
                  <td colSpan={2}>Total</td>
                  <td colSpan={2}>{totalTaxableAmountState.toFixed(2)}</td>
                  {invoiceData?.tax_type === "IGST" ? (
                    <>
                      <td />
                      <td>{(totalIGSTState).toFixed(2)}</td>
                    </>
                  ) : (
                    <>
                      <td />
                      <td>{(totalIGSTState / 2).toFixed(2)}</td>
                      <td />
                      <td>{(totalIGSTState / 2).toFixed(2)}</td>
                    </>
                  )}

                  <td colSpan={2}>{totalTaxAmountState.toFixed(2)}</td>
                </tr>
                <tr className="total-tax-row">
                  <td style={{ textAlign: "end" }} colSpan={12}>&nbsp;Total Tax: {totalTaxAmountState.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <div
              className="d_flex"
              style={{ justifyContent: "space-between", padding: "5px" }}
            >
              <h5>Bank : <span>{invoiceData?.company_bank_name}</span></h5>
              <h5>Account No. : <span>{invoiceData?.company_account_no}</span></h5>
              <h5>IFSC : <span>{invoiceData?.company_ifsc_code}</span></h5>
              <h5>Branch : <span>{invoiceData?.company_bank_branch_name}</span></h5>
            </div>
            <div className="hr"></div>
            <table className="invoice_third_table">
              <thead>
                <tr>
                  <th className="border_none">Term and Condition</th>
                  <th className="border_none">E-Invoice</th>
                  <th className="border_none_last">{invoiceData?.company_name}</th>
                </tr>
              </thead>
              <tbody style={{ borderBottom: "none" }}>
                <tr>
                  {/* <td className="border_none">{invoiceData?.terms_and_conditions}</td> */}
                  <td className="border_none" style={{ width: "30rem" }}>
                    <span>All sales are final, and we do not accept returns or provide refunds unless the product is damaged or defective.</span>
                  </td>
                  <td className="border_none"> </td>
                  <td className="border_none_last" style={{ textAlign: "end" }} >
                    <div>
                      <img src={invoiceData?.company_signature} style={{ height: "3rem", width: "10rem" }} alt="Company Signature" />
                      <div style={{ fontWeight: "500" }} >Authoried Signature</div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div >
      )}
    </div >
  );
};

export default TaxInvoice;
