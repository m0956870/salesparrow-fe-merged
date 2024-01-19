import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import group from "../../../images/group.png";

import { toast } from "react-toastify";
import { blankValidator } from "../../../utils/Validation";
import { CircularProgress } from "@mui/material";
import { addProductGrouping, fetchAllCategory, fetchAllProduct } from "../../../api/productAPI";
import isAllowed from "../../../utils/isAllowed";
import { PRODUCT_MANAGEMENT } from "../../../constants";

const ProductGrouping = () => {
  const navigate = useNavigate();

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

  const [groupID, setgroupID] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  const [groupEmp, setgroupEmp] = useState([]);
  const [selectedName, setselectedName] = useState([]);

  useEffect(() => {
    fetchAllCategory().then((res) => setallCategory(res.data.result));
  }, [])


  const categoryHandleInput = async (e) => {
    // console.log(e.target.value);
    setgroupID(e.target.value);
    try {
      let res = await fetchAllProduct({ catagory_id: e.target.value, brand_id: "", sub_catagory_id: "" })
      if (res.data.status) {
        setallProduct(res.data.result);
        setgroupEmp([])
        setselectedName([])
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

  const handleCreateEmpGroup = async () => {
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
      grp_name: groupName,
      grp_description: groupDescription,
      productIdStr: empIds,
      catagory_id: groupID,
    };

    // console.log(groupData)

    try {
      let res = await addProductGrouping(groupData);
      // console.log(res);
      if (res.data.status) {
        toast.success("Product Group Created Successfully!");
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

  // console.log(allCategory)
  // console.log(allProduct)
  // console.log(groupEmp)

  return (
    <div className="container">
      <div className="dash_heading">
        <div className="icon">
          <img src={group} alt="icon" />
        </div>
        <div className="title">Product Grouping</div>
      </div>

      <div className="party_container">
        <div className="grouping_title">Product List</div>
        <select style={{ width: "50%" }} onChange={categoryHandleInput} >
          <option value="">Category</option>
          {allCategory.length === 0 && <option disabled value="">No Category Found</option>}
          {allCategory?.map((category) => (
            <option key={category._id} value={category._id}>{category.name}</option>
          ))}
        </select>
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
          onClick={() => handleCreateEmpGroup()}
        >
          {btnLoading ? (
            <CircularProgress style={{ color: "#fff" }} size={26} />
          ) : (
            "SUBMIT"
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGrouping;