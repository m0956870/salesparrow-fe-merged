import "../Product.css"
import React, { useState, useEffect } from 'react'
import group from "../../../images/group.png";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";

import { CircularProgress, Pagination } from "@mui/material";
import { toast } from "react-toastify";
import fetchAllBrands, { addPriceList, editPriceList, fetchAllCategory, fetchAllProduct, fetchPriceListing, proVarPriceListing } from "../../../api/productAPI";
import { getPartyType } from "../../../api/partyAPI";
import { useLocation, useNavigate } from "react-router-dom";


const Input = ({ row, allProduct }) => {
  // console.log(row);
  const [inputVal, setinputVal] = useState(row.partyType1.value)

  const party1HandleInput = (e, selectedProduct) => {
    let product = allProduct.filter(product => product.id === selectedProduct.id)[0]
    // console.log(product);

    product.partyType1 = {
      ...product.partyType1,
      value: e.target.value || ""
    }
    // updateArr(allProduct)
    setinputVal(e.target.value)
  }

  return (
    <input
      type="number"
      value={inputVal}
      className="partyType_pricelist"
      onChange={(e) => party1HandleInput(e, row)}
      placeholder=""
    />
  )
}

const Input2 = ({ row, allProduct }) => {
  // console.log(row);
  const [inputVal, setinputVal] = useState(row.partyType2.value)

  const party2HandleInput = (e, selectedProduct) => {
    let product = allProduct.filter(product => product.id === selectedProduct.id)[0]
    console.log(product);

    product.partyType2 = {
      ...product.partyType2,
      value: e.target.value || ""
    }
    // updateArr(allProduct)
    setinputVal(e.target.value)
  }

  return (
    <input
      type="number"
      value={inputVal}
      className="partyType_pricelist"
      onChange={(e) => party2HandleInput(e, row)}
      placeholder=""
    />
  )
}

const EditPriceList = () => {

  const navigate = useNavigate()
  const location = useLocation()
  // console.log("location state", location?.state)

  const [isLoading, setisLoading] = useState(false);
  const [btnLoading, setbtnLoading] = useState(false);

  const [allBrand, setallBrand] = useState([]);
  const [allCategory, setallCategory] = useState([]);
  const [allProduct, setallProduct] = useState([]);

  const [allPriceListing, setallPriceListing] = useState([]);

  const [priceListName, setpriceListName] = useState(location.state?.price_list_name)

  const [partyTypes, setpartyTypes] = useState([])

  const [party1, setparty1] = useState({ name: "", id: "" })
  const [party2, setparty2] = useState({ name: "", id: "" })

  const [filtered, setfiltered] = useState({
    brand_id: "",
    catagory_id: "",
  });

  const handleInput = (e) => {
    setfiltered({ ...filtered, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchAllBrands().then((res) => setallBrand(res.data.result));
    fetchAllCategory().then((res) => setallCategory(res.data.result));
    fetchPriceListing().then((res) => setallPriceListing(res.data.result));
    getPartyType().then(res => setpartyTypes(res.data.result))
    setallProduct(location.state?.pricelist_details);
    setparty1(location.state?.party_type_one)
    setparty2(location.state?.party_type_two)
  }, [])

  const fetchAllProductFunc = async () => {
    try {
      setbtnLoading(true);
      proVarPriceListing(filtered).then((res) => {
        // console.log(res.data.result);
        if (res.data.status) {
          setallProduct(res.data.result);
          setisLoading(false);
          setbtnLoading(false)
        } else {
          setisLoading(false);
          toast.error(res.data.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  // console.log("allproducts", allProduct)

  const partySelectInput = (e, type) => {
    console.log(e.target.value);
    let party = JSON.parse(e.target.value)
    // console.log(party);
    if (type === "party1") {
      setparty1({
        name: party.party_type,
        id: party._id
      })
      allProduct.map(products => {
        products.partyType1 = {
          ...products.partyType1,
          id: party._id,
          name: party.party_type,
        }
      })
    } else {
      setparty2({
        name: party.party_type,
        id: party._id
      })
      allProduct.map(products => {
        products.partyType2 = {
          ...products.partyType2,
          id: party._id,
          name: party.party_type,
        }
      })
    }
  };

  // console.log(party1);
  // console.log(party2);

  // const party1HandleInput = (e, selectedProduct) => {
  //   let product = allProduct.filter(product => product.id === selectedProduct.id)[0]
  //   // console.log(product);

  //   product.partyType1 = {
  //     ...product.partyType1,
  //     value: e.target.value || ""
  //   }
  //   // updateArr(allProduct)
  // }

  // const party2HandleInput = (e, selectedVarient, selectedProduct) => {
  //   let product = allProduct.filter(product => product.id === selectedProduct.id)[0]
  //   console.log(product);

  //   product.partyType2 = {
  //     ...product.partyType2,
  //     value: e.target.value || ""
  //   }
  // }


  const editPriceListFunc = async () => {
    if (!priceListName) return toast.error("Please Enter Price List Name!")
    if (!partyTypes) return toast.error("Please Select Both Party Type!")

    let priceListData = {
      id: location.state._id,
      price_list_name: priceListName,
      pricelist_details: allProduct,
      party_type_one: party1,
      party_type_two: party2
    }

    // return console.log(priceListData);

    try {
      setbtnLoading(true);
      let res = await editPriceList(priceListData);
      console.log(res);
      if (res.data.status) {
        toast.success("Price List Created Successfully!");
        navigate("/price_list");
        setbtnLoading(false);
      } else {
        toast.error(res.data.message);
        setbtnLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Internet Error!")
      setbtnLoading(false);
    }
  }

  console.log(allPriceListing)


  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "var(--main-color)",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      backgroundColor: "#fff",
      padding: 10,
      // borderRadius: "0.5rem",
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
          <div className="title">Edit Price List</div>
        </div>
      </div>

      {/* Filter */}
      <div className="tracking_tabs" style={{ marginBottom: "1rem" }}>
        <div className="tarcking_tab_left">
          <select name="brand_id" onChange={handleInput} >
            <option value="">Brand</option>
            {allBrand.length === 0 && <option disabled value="">No Brand Found</option>}
            {allBrand?.map((brand) => (
              <option key={brand._id} value={brand._id}>{brand.name}</option>
            ))}
          </select>
          <select name="catagory_id" onChange={handleInput} >
            <option value="">Category</option>
            {allCategory.length === 0 && <option disabled value="">No Category Found</option>}
            {allCategory?.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>

          <div
            className="view_btn"
            onClick={() => fetchAllProductFunc()}
          >
            {btnLoading ? (
              <CircularProgress style={{ color: "#fff" }} size={20} />
            ) : (
              "Find"
            )}
          </div>
        </div>
      </div>

      <div className="tracking_tabs" style={{ marginBottom: "1.5rem" }}>
        <div className="tarcking_tab_left">
          <div className="copy_from" >
            Copy From
          </div>
          <select className="select" name="catagory_id" onChange={handleInput} >
            <option value="">Price List</option>
            {allPriceListing?.length === 0 && <option disabled value="">No Price List Found</option>}
            {allPriceListing?.map((plist) => (
              <option key={plist._id} value={plist._id}>{plist.price_list_name}</option>
            ))}
          </select>
          <div className="name_input">
            <input
              type="text"
              value={priceListName}
              onChange={(e) => setpriceListName(e.target.value)}
              placeholder="Enter Price List Name"
              style={{ color: "#000" }}
            />
          </div>
        </div>
      </div>

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
              <TableRow sx={{ display: "flex", width: "100%" }}>
                <StyledTableCell style={{ flex: 1 }}>Product</StyledTableCell>
                <StyledTableCell style={{ flex: 1 }} align="center">Unit</StyledTableCell>
                <StyledTableCell style={{ flex: 1 }} align="center">MRP</StyledTableCell>
                <StyledTableCell style={{ flex: 1 }} align="center">Retail Price</StyledTableCell>
                <StyledTableCell style={{ flex: 1 }} align="center">
                  <select
                    className="partyType"
                    onChange={(e) => partySelectInput(e, "party1")}
                  >
                    <option value="">{party1.name}</option>
                    {partyTypes?.map((type) => (
                      <option key={type._id} value={JSON.stringify(type)}>{type.party_type}</option>
                    ))}
                  </select>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <select
                    className="partyType"
                    onChange={(e) => partySelectInput(e, "party2")}
                  >
                    <option value="">{party2.name}</option>
                    {partyTypes?.map((type) => (
                      <option key={type._id} value={JSON.stringify(type)}>{type.party_type}</option>
                    ))}
                  </select>
                </StyledTableCell>
              </TableRow>
            </TableHead>

            {allProduct?.length === 0 ? (
              <div className="no_data" style={{ width: "100%" }}>
                No data
              </div>
            ) : (
              <TableBody>
                {allProduct?.map((row, i) => (
                  <StyledTableRow key={row.id} sx={{ display: "flex", width: "100%", marginBottom: "0.3rem" }}>
                    <StyledTableCell style={{ flex: 1 }}>
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell style={{ flex: 1 }} align="center">
                      {JSON.parse(row.packing_details)[0].unitName}
                    </StyledTableCell>
                    <StyledTableCell style={{ flex: 1 }} align="center">
                      {row.mrp}
                    </StyledTableCell>
                    <StyledTableCell style={{ flex: 1 }} align="center">
                      {row.price}
                    </StyledTableCell>
                    <StyledTableCell style={{ flex: 0.8 }} align="center">

                      <Input row={row} allProduct={allProduct} />

                      {/* <input
                        type="number"
                        // value={row.partyType1.value}
                        className="partyType_pricelist"
                        onChange={(e) => party1HandleInput(e, row)}
                        placeholder={row.partyType1.value}
                      /> */}
                    </StyledTableCell>
                    <StyledTableCell style={{ flex: 0.8 }} align="center">

                      <Input2 row={row} allProduct={allProduct} />

                      {/* <input
                        type="number"
                        // value={row.partyType2.value}
                        className="partyType_pricelist"
                        onChange={(e) => party2HandleInput(e, row)}
                        placeholder={row.partyType2.value}
                      /> */}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </div>
      )}
      <div onClick={() => editPriceListFunc()} className="btn changepass_btn">
        {btnLoading ? (
          <CircularProgress style={{ color: "#fff" }} size={26} />
        ) : (
          "EDIT PRICE LIST"
        )}
      </div>
    </div>
  )
}

export default EditPriceList