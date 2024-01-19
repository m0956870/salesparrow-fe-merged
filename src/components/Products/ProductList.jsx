import React, { useState } from "react";
import group from "../../images/group.png";
import excel_in from "../../images/excel_in.png";
import excel_out from "../../images/excel_out.png";

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
import { useNavigate } from "react-router-dom";

const ProductList = () => {

  const allData = [
    {
      product_name: "Haldi Powder Masala 100 Gm",
      sku_id: "1234",
      hsn_code: "1234",
      mrp: "200",
      ss_price: "150.00/kg",
      distributor_price: "160.00/kg",
      retailer_price: "170.00/kg",
      packaging: ["1kg=10pcs", "1Box=15kg"]
    },
    {
      product_name: "Haldi Powder Masala 100 Gm",
      sku_id: "1234",
      hsn_code: "1234",
      mrp: "200",
      ss_price: "150.00/kg",
      distributor_price: "160.00/kg",
      retailer_price: "170.00/kg",
      packaging: ["1kg=10pcs", "1Box=15kg"]
    },
    {
      product_name: "Haldi Powder Masala 100 Gm",
      sku_id: "1234",
      hsn_code: "1234",
      mrp: "200",
      ss_price: "150.00/kg",
      distributor_price: "160.00/kg",
      retailer_price: "170.00/kg",
      packaging: ["1kg=10pcs", "1Box=15kg"]
    },
    {
      product_name: "Haldi Powder Masala 100 Gm",
      sku_id: "1234",
      hsn_code: "1234",
      mrp: "200",
      ss_price: "150.00/kg",
      distributor_price: "160.00/kg",
      retailer_price: "170.00/kg",
      packaging: ["1kg=10pcs", "1Box=15kg"]
    },
    {
      product_name: "Haldi Powder Masala 100 Gm",
      sku_id: "1234",
      hsn_code: "1234",
      mrp: "200",
      ss_price: "150.00/kg",
      distributor_price: "160.00/kg",
      retailer_price: "170.00/kg",
      packaging: ["1kg=10pcs", "1Box=15kg"]
    },
    {
      product_name: "Haldi Powder Masala 100 Gm",
      sku_id: "1234",
      hsn_code: "1234",
      mrp: "200",
      ss_price: "150.00/kg",
      distributor_price: "160.00/kg",
      retailer_price: "170.00/kg",
      packaging: ["1kg=10pcs", "1Box=15kg"]
    },
    {
      product_name: "Haldi Powder Masala 100 Gm",
      sku_id: "1234",
      hsn_code: "1234",
      mrp: "200",
      ss_price: "150.00/kg",
      distributor_price: "160.00/kg",
      retailer_price: "170.00/kg",
      packaging: ["1kg=10pcs", "1Box=15kg"]
    },
    {
      product_name: "Haldi Powder Masala 100 Gm",
      sku_id: "1234",
      hsn_code: "1234",
      mrp: "200",
      ss_price: "150.00/kg",
      distributor_price: "160.00/kg",
      retailer_price: "170.00/kg",
      packaging: ["1kg=10pcs", "1Box=15kg"]
    },
    {
      product_name: "Haldi Powder Masala 100 Gm",
      sku_id: "1234",
      hsn_code: "1234",
      mrp: "200",
      ss_price: "150.00/kg",
      distributor_price: "160.00/kg",
      retailer_price: "170.00/kg",
      packaging: ["1kg=10pcs", "1Box=15kg"]
    },
    {
      product_name: "Haldi Powder Masala 100 Gm",
      sku_id: "1234",
      hsn_code: "1234",
      mrp: "200",
      ss_price: "150.00/kg",
      distributor_price: "160.00/kg",
      retailer_price: "170.00/kg",
      packaging: ["1kg=10pcs", "1Box=15kg"]
    },
    {
      product_name: "Haldi Powder Masala 100 Gm",
      sku_id: "1234",
      hsn_code: "1234",
      mrp: "200",
      ss_price: "150.00/kg",
      distributor_price: "160.00/kg",
      retailer_price: "170.00/kg",
      packaging: ["1kg=10pcs", "1Box=15kg"]
    },
    {
      product_name: "Haldi Powder Masala 100 Gm",
      sku_id: "1234",
      hsn_code: "1234",
      mrp: "200",
      ss_price: "150.00/kg",
      distributor_price: "160.00/kg",
      retailer_price: "170.00/kg",
      packaging: ["1kg=10pcs", "1Box=15kg"]
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
        <div className="beat_left">
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Product's List</div>
        </div>
        <div className="beat_right employee_head">
          <img src={excel_in} alt="icon" />
          <img src={excel_out} alt="icon" />
          <div className="search">
            <SearchIcon style={{ color: `var(--main-color)` }} />
            <input type="text" placeholder="Search" />
          </div>
          <div className="">
            <select className="select_btn" name="city">
              <option value="City">Select Product Category</option>
              <option value="saab">Saab</option>
              <option value="mercedes">Mercedes</option>
              <option value="audi">Audi</option>
            </select>
          </div>
        </div>
      </div>

      <div className="beat_table">
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Product Name</StyledTableCell>
              <StyledTableCell align="left">SKU ID</StyledTableCell>
              <StyledTableCell align="left">HSN Code</StyledTableCell>
              <StyledTableCell align="left">MRP</StyledTableCell>
              <StyledTableCell align="left">SS Price</StyledTableCell>
              <StyledTableCell align="left">Distributor Price</StyledTableCell>
              <StyledTableCell align="left">Retailer Price</StyledTableCell>
              <StyledTableCell align="left">Packaging</StyledTableCell>

            </TableRow>
          </TableHead>
          {/* <div style={{ margin: "0.5rem 0" }}></div> */}
          <TableBody>
            {allData.map((row) => (
              <>
                <StyledTableRow key={row.product_name}>
                  <StyledTableCell component="th" scope="row">
                    {row.product_name}
                  </StyledTableCell>
                  <StyledTableCell align="left" component="th" scope="row">
                    {row.sku_id}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {row.hsn_code}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    ₹{row.mrp}
                  </StyledTableCell>
                  <StyledTableCell align="left" component="th" scope="row">
                    ₹{row.ss_price}
                  </StyledTableCell>
                  <StyledTableCell align="left" component="th" scope="row">
                    ₹{row.distributor_price}
                  </StyledTableCell>
                  <StyledTableCell align="left" component="th" scope="row">
                    ₹{row.retailer_price}
                  </StyledTableCell>
                  <StyledTableCell align="left" component="th" scope="row">
                    <div>{row.packaging[0]}</div>
                    <div>{row.packaging[1]}</div>
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

export default ProductList