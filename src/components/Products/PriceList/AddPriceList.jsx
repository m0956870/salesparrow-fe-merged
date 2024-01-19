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

import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import fetchAllBrands, { addPriceList, fetchAllCategory, fetchAllProduct, fetchPriceListing, proVarPriceListing } from "../../../api/productAPI";
import { getPartyType } from "../../../api/partyAPI";
import { useNavigate } from "react-router-dom";

const RetailPriceInput = ({ row, allProduct }) => {
    const [inputVal, setinputVal] = useState(row.price || 0)

    const retailHandleInput = (e, selectedProduct) => {
        let product = allProduct.filter(product => product.id === selectedProduct.id)[0]
        // console.log(product);
        product.price = e.target.value
        setinputVal(e.target.value)
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

const Party1Input = ({ row, allProduct }) => {
    const [inputVal, setinputVal] = useState(row.partyType1?.value || "")

    const party1HandleInput = (e, selectedProduct) => {
        let product = allProduct.filter(product => product.id === selectedProduct.id)[0]
        // console.log(product);
        product.partyType1 = {
            ...product.partyType1,
            value: e.target.value
        }
        setinputVal(e.target.value)
    }

    return (
        <input
            type="number"
            value={inputVal}
            className="partyType_pricelist"
            onChange={(e) => party1HandleInput(e, row)}
            placeholder="0"
        />
    )
}

const Party2Input = ({ row, allProduct }) => {
    const [inputVal, setinputVal] = useState(row.partyType2?.value || "")

    const party2HandleInput = (e, selectedProduct) => {
        let product = allProduct.filter(product => product.id === selectedProduct.id)[0]
        // console.log(product);
        product.partyType2 = {
            ...product.partyType2,
            value: e.target.value
        }
        setinputVal(e.target.value)
    }

    return (
        <input
            type="number"
            value={inputVal}
            className="partyType_pricelist"
            onChange={(e) => party2HandleInput(e, row)}
            placeholder="0"
        />
    )
}

const AddPriceList = () => {
    const navigate = useNavigate()
    const [isLoading, setisLoading] = useState(false);
    const [btnLoading, setbtnLoading] = useState(false);

    const [allBrand, setallBrand] = useState([]);
    const [allCategory, setallCategory] = useState([]);
    const [allProduct, setallProduct] = useState([]);

    const [allPriceList, setallPriceList] = useState([])
    const [priceListName, setpriceListName] = useState("")

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
        getPartyType().then(res => setpartyTypes(res.data.result))
        fetchPriceListing().then((res) => setallPriceList(res.data.result));
    }, [])

    const fetchAllProductFunc = async () => {
        try {
            setbtnLoading(true);
            fetchAllProduct(filtered).then((res) => {
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

    // console.log(allProduct)
    // console.log(allProduct.map(product => console.log(product.varient_details)))
    // console.log(JSON.parse(allProduct?.[0].varient_details?.[0].packing_details[0]))

    const partySelectInput = (e, type) => {
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

    const addPriceListFunc = async () => {
        if (!priceListName) return toast.error("Please Enter Price List Name!")
        if (!party1.id || !party2.id) return toast.error("Please Select Both Party Type!")

        let priceListData = {
            price_list_name: priceListName,
            pricelist_details: allProduct,
            party_type_one: party1,
            party_type_two: party2
        }

        // return console.log("priceListData", priceListData)

        try {
            setbtnLoading(true);
            let res = await addPriceList(priceListData);
            // console.log(res);
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

    // console.log(allPriceList);

    const priceListSelectFunc = (e) => {
        let priceListProduct = JSON.parse(e.target.value)
        // console.log(priceListProduct)

        setpriceListName(priceListProduct.price_list_name)
        setallProduct(priceListProduct.pricelist_details)

        setparty1({
            ...party1,
            id: priceListProduct.party_type_one.id,
            name: priceListProduct.party_type_one.name
        })
        setparty2({
            ...party2,
            id: priceListProduct.party_type_two.id,
            name: priceListProduct.party_type_two.name
        })
    }

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
                    <div className="title">Add Price List</div>
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
                    <select  onChange={priceListSelectFunc} >
                        <option value="">Price List</option>
                        {allPriceList.length === 0 && <option disabled value="">No Price List Found</option>}
                        {allPriceList?.map((priceList) => (
                            <option key={priceList._id} value={JSON.stringify(priceList)}>{priceList.price_list_name}</option>
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
                                        <option value="">{party1.name || "Party Type"}</option>
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
                                        <option value="">{party2.name || "Party Type"}</option>
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
                                {allProduct?.map((row) => (
                                    <>
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
                                                <RetailPriceInput row={row} allProduct={allProduct} />
                                                {/* {row.price} */}
                                            </StyledTableCell>
                                            <StyledTableCell style={{ flex: 0.8 }} align="center">
                                                <Party1Input row={row} allProduct={allProduct} />
                                                {/* <input
                                                    type="number"
                                                    className="partyType_pricelist"
                                                    onChange={(e) => party1HandleInput(e, row)}
                                                    placeholder="0"
                                                /> */}
                                            </StyledTableCell>
                                            <StyledTableCell style={{ flex: 0.8 }} align="center">
                                                <Party2Input row={row} allProduct={allProduct} />
                                                {/* <input
                                                    type="number"
                                                    className="partyType_pricelist"
                                                    onChange={(e) => party2HandleInput(e, row)}
                                                    placeholder="0"
                                                /> */}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    </>
                                ))}
                            </TableBody>
                        )}
                    </Table>
                </div>
            )}
            <div onClick={() => addPriceListFunc()} className="btn changepass_btn">
                {btnLoading ? (
                    <CircularProgress style={{ color: "#fff" }} size={26} />
                ) : (
                    "ADD PRICE LIST"
                )}
            </div>
        </div>
    )
}

export default AddPriceList