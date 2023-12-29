import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import group from "../../../images/group.png";

import { toast } from "react-toastify";
import { blankValidator } from "../../../utils/Validation";
import { CircularProgress } from "@mui/material";
import { addProductGrouping, editProductGrouping, fetchAllCategory, fetchAllProduct, getSinglePGroup } from "../../../api/productAPI";
import isAllowed from "../../../utils/isAllowed";
import { PRODUCT_MANAGEMENT } from "../../../constants";

const EditProductGrouping = () => {
    const navigate = useNavigate();
    const location = useLocation()
    // console.log(location.state)

    const [error, setError] = useState({
        gname: {
            status: false,
        },
        gdesc: {
            status: false,
        },
    });

    const [btnLoading, setbtnLoading] = useState(false);

    const [allCategory, setallCategory] = useState([]);
    const [allProduct, setallProduct] = useState([]);

    const [groupName, setGroupName] = useState(location.state.grp_name);
    const [groupDescription, setGroupDescription] = useState(location.state.grp_description);

    const [groupEmp, setgroupEmp] = useState([]);
    const [selectedName, setselectedName] = useState([]);

    const [groupData, setgroupData] = useState({});

    useEffect(() => {
        fetchAllCategory().then((res) => setallCategory(res.data.result));
        getProductGroupFunc()
    }, [])

    const getProductGroupFunc = async () => {
        try {
            let res = await getSinglePGroup(location.state.id)
            if (res.data.status) {
                setgroupData(res.data.result)
                setallProduct(res.data.result.products)
                res.data.result?.products.map((data) => {
                    if (groupEmp.length === 0) {
                        if (groupEmp.includes(data.id)) return console.log("included");
                        setgroupEmp((groupEmp) => [...groupEmp, data.id]);
                        setselectedName((selectedName) => [
                            ...selectedName,
                            data.name,
                        ]);
                    }
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    // console.log(allCategory)
    // console.log(allProduct)
    // console.log(groupEmp)
    // console.log(selectedName)

    const categoryHandleInput = async (e) => {
        // console.log(e.target.value);
        try {
            let res = await fetchAllProduct({ catagory_id: e.target.value, brand_id: "", sub_catagory_id: "" })
            // console.log(res.data);
            if (res.data.status) {
                setallProduct(res.data.result);
            } else {
                console.log(res.data.message);
                toast.error("Some Error!");
            }
        } catch (error) {
            console.log(error)
        }
    }

    const toggleEmpGroup = (e) => {
        const shouldAdd = e.target.checked;
        const empId = e.target.value;
        if (shouldAdd) {
            setgroupEmp([...groupEmp, empId]);
            setselectedName([...selectedName, e.target.name]);
            return;
        }
        setgroupEmp(groupEmp.filter((id) => id !== empId));
        setselectedName(selectedName.filter((name) => name !== e.target.name));
    };

    const editProductGroupFunc = async () => {
        setbtnLoading(true);
        if (!await isAllowed(PRODUCT_MANAGEMENT)) {
            toast.error("Module is not purchased!");
            return setbtnLoading(false);
        }

        if (!blankValidator(groupName)) {
            return setError({
                ...error,
                gname: {
                    status: true,
                },
            });
        }
        if (!blankValidator(groupDescription)) {
            return setError({
                ...error,
                gdesc: {
                    status: true,
                },
            });
        }

        const empIds = groupEmp.join(",").trim();
        // console.log(empIds);

        let groupData = {
            id: location.state.id,
            grp_name: groupName,
            grp_description: groupDescription,
            productIdStr: empIds,
        };

        // console.log(groupData)

        try {
            let res = await editProductGrouping(groupData);
            // console.log(res);
            if (res.data.status) {
                toast.success("Product Group Edited Successfully!");
                navigate("/product_grouping_list");
                setbtnLoading(false);
            } else {
                toast.error(res.data.message);
                setbtnLoading(false);
            }
        } catch (error) {
            console.log(error);
            toast.error("Internet Error!");
            setbtnLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="dash_heading">
                <div className="icon">
                    <img src={group} alt="icon" />
                </div>
                <div className="title">Edit Product Grouping</div>
            </div>

            <div className="party_container">
                <div className="grouping_title">Product List</div>
                <select style={{ width: "50%" }} onChange={categoryHandleInput} >
                    <option value="">Selected Category - {location.state.catagory_id}</option>
                    {allCategory.length === 0 && <option disabled value="">No Category Found</option>}
                    {allCategory?.map((category) => (
                        <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                </select>

                {allProduct?.length === 0 || !allProduct ? (
                    <div style={{ padding: "1rem", fontWeight: 600 }} >No product found</div>
                ) : (
                    <div className="grouping_checkbox">
                        {allProduct?.map((product) => (
                            <div className="grouping_row">
                                <input
                                    type="checkbox"
                                    value={product.id}
                                    name={product.name}
                                    onChange={toggleEmpGroup}
                                    checked={groupEmp.includes(product.id)}
                                />
                                <label htmlFor="">{product.name}</label>
                            </div>
                        ))}
                    </div>
                )}


                <div className="grouping_slider">
                    {/* {allEmployeeList.length > 0 && (
                        <Slider
                        defaultValue={2}
                        onChange={sliderHandleChange}
                        aria-label="Default"
                        valueLabelDisplay="auto"
                        style={{ color: "var(--main-color)" }}
                        />
                    )} */}
                </div>
            </div>

            <div className="party_container">
                <div className="grouping_title">Selected Products</div>

                <div className="grouping_checkbox grouping_select">
                    {selectedName?.map((i, name) => (
                        <div className="grouping_row">
                            <div>
                                {name + 1}. {i}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="grouping_slider">
                    {/* {selectedName.length > 0 && (
                        <Slider
                        defaultValue={2}
                        onChange={sliderHandleChange}
                        aria-label="Default"
                        valueLabelDisplay="auto"
                        style={{ color: "var(--main-color)" }}
                        />
                    )} */}
                </div>
            </div>

            <div className="party_container">
                <div className="grouping_submit">
                    <div className="message_left">
                        <div className="message_form">
                            <input
                                type="text"
                                name="group_name"
                                value={groupName}
                                onChange={(e) => {
                                    setError({
                                        ...error,
                                        gname: {
                                            status: false,
                                        },
                                    });
                                    setGroupName(e.target.value);
                                }}
                                placeholder="Product Group Name"
                            />
                            {error.gname.status && (
                                <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                                    Please Enter Product Group Name
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="message_right">
                        <div className="message_form">
                            <input
                                type="text"
                                name="group_desc"
                                value={groupDescription}
                                onChange={(e) => {
                                    setError({
                                        ...error,
                                        gdesc: {
                                            status: false,
                                        },
                                    });
                                    setGroupDescription(e.target.value);
                                }}
                                placeholder="Product Group Description"
                            />
                            {error.gdesc.status && (
                                <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                                    Please Enter Product Group Description
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div
                    className="message_btn submit_btn"
                    onClick={() => editProductGroupFunc()}
                >
                    {btnLoading ? (
                        <CircularProgress style={{ color: "#fff" }} size={26} />
                    ) : (
                        "EDIT"
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditProductGrouping;