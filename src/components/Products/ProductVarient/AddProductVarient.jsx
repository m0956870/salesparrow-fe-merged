import "./../Product.css"
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

import group from "../../../images/group.png";
import { toast } from "react-toastify";

import { blankValidator } from "../../../utils/Validation";
import { CircularProgress } from "@mui/material";
import { addProductVarient, fetchAllUnit } from "../../../api/productAPI";

const AddProductVarient = () => {
  const navigate = useNavigate();
  const location = useLocation()
  // console.log(location.state)

  const [btnLoading, setbtnLoading] = useState(false);

  const [profilePic, setprofilePic] = useState("");
  const [demoProfilePic, setdemoProfilePic] = useState();

  const [product, setproduct] = useState({
    product_id: location.state?.id,
    varient_name: "",
    mrp: "",
    price: "",
    sku_id: "",
  });

  const [allUnits, setallUnits] = useState([])

  const [error, setError] = useState({
    varient_name: {
      status: false,
    },
    mrp: {
      status: false,
    },
    price: {
      status: false,
    },
    pricelimit: {
      status: false,
    },
  });

  const handleInput = (e) => {
    Object.values(error).map(item => item.status = false)
    setproduct({ ...product, [e.target.name]: e.target.value });
  };

  const [unit1, setunit1] = useState({ unitName: "", unitValue: "", })
  const [unit2, setunit2] = useState({ unitName: "", unitValue: "", })
  const [unit3, setunit3] = useState({ unitName: "", unitValue: "", })

  const unit1handleInput = (e) => {
    setunit1({ ...unit1, [e.target.name]: e.target.value });
  };
  const unit2handleInput = (e) => {
    setunit2({ ...unit2, [e.target.name]: e.target.value });
  };
  const unit3handleInput = (e) => {
    setunit3({ ...unit3, [e.target.name]: e.target.value });
  };

  const addPicFunc = async (e) => {
    let file = e.target.files[0];
    setprofilePic(file);
    setdemoProfilePic(URL.createObjectURL(file));
  };

  const addProductVFunc = async () => {

    if (!blankValidator(product.varient_name)) {
      return setError({
        ...error,
        varient_name: {
          status: true,
        },
      });
    }

    if (!blankValidator(product.mrp)) {
      return setError({
        ...error,
        mrp: {
          status: true,
        },
      });
    }

    if (!blankValidator(product.price)) {
      return setError({
        ...error,
        price: {
          status: true,
        },
      });
    }

    if (Number(product.price) > Number(product.mrp)) {
      return setError({
        ...error,
        pricelimit: {
          status: true,
        },
      });
    }

    if (!profilePic) {
      return toast.error("Please Select Product Varient Image");
    }

    // console.log(profilePic, product);

    let allData = {
      ...product,
      packing_details: [unit1, unit2, unit3]
    }

    try {
      setbtnLoading(true);
      let res = await addProductVarient(profilePic, allData);
      // console.log(res);
      if (res.data.status) {
        toast.success("Product Varient Created Successfully!");
        navigate("/product_varient", { state: location.state });
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
  };

  useEffect(() => {
    fetchAllUnit().then(res => setallUnits(res.data.result))
  }, [])

  // console.log(allUnits)


  return (
    <div className="container">
      <div className="beat_heading">
        <div
          className="beat_left"
        >
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title"> Add Product Varient</div>
        </div>
      </div>

      <div className="addbeat_container" style={{ paddingBottom: "2rem" }}>
        <div className="profile_details" style={{ marginTop: "1rem" }}>
          <div className="avatar">
            <Avatar
              alt="Profile Pic"
              src={demoProfilePic || profilePic}
              style={{ height: "9rem", width: "9rem" }}
            // onClick={handleClick}
            />
            <label>
              <CameraAltIcon className="camera_icon" />
              <input
                type="file"
                onChange={addPicFunc}
                name="myfile"
                accept="image/*"
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>
        <div className="addbeat_form addemployee_form">
          <div className="addbeat_left">
            <input
              type="text"
              name="varient_name"
              value={product.varient_name}
              onChange={handleInput}
              placeholder="Product Varient Name"
            />
            {error.varient_name.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                Please Enter Product Variet Name
              </p>
            )}
            <input
              type="number"
              name="mrp"
              value={product.mrp}
              onChange={handleInput}
              placeholder="MRP"
            />
            {error.mrp.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }} >
                Please Enter MRP
              </p>
            )}
            <input
              type="text"
              name="sku_id"
              value={product.sku_id}
              onChange={handleInput}
              placeholder="SKU Code"
            />
          </div>

          <div className="addbeat_right">
            <input
              // type="text"
              // name="varient_name"
              value={location.state?.name || "Product Name"}
              style={{ caretColor: "transparent" }}
            // onChange={handleInput}
            // placeholder="Product Varient Name"
            />
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleInput}
              placeholder="Retail Price"
            />
            {error.price.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }} >
                Please Enter Price
              </p>
            )}
            {error.pricelimit.status && (
              <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }} >
                Retail Price should be lower than MRP
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Packaging details */}

      <div className="addbeat_container">
        <h4 style={{ margin: "1rem 0" }} >Packing Details</h4>
        <div className="packeging_details">
          <div className="flex_1">
            <div className="details" style={{ background: "#f2f7fb" }} >
              <div>Unit 1</div>
            </div>
          </div>
          <div className="flex_half">
            <select name="unitName" onChange={unit1handleInput} >
              <option value="">Unit</option>
              {allUnits.length === 0 && <option disabled value="">No Unit Found</option>}
              {allUnits?.map((unit) => (
                <option key={unit._id} value={unit.unit}>{unit.unit}</option>
              ))}
            </select>
          </div>
          <div className="flex" >=</div>
          <div className="flex_1">
            <input
              type="number"
              name="unitValue"
              value={unit1.unitValue}
              onChange={unit1handleInput}
              placeholder="Enter Unit"
            />
          </div>
          <div className="flex_1">
            <div className="details" >
              <div>Pcs</div>
            </div>
          </div>
        </div>

        <div className="packeging_details">
          <div className="flex_1">
            <div className="details" style={{ background: "#f2f7fb" }} >
              <div>Unit 2</div>
            </div>
          </div>
          <div className="flex_half">
            <select name="unitName" onChange={unit2handleInput} >
              <option value="">Unit</option>
              {allUnits.length === 0 && <option disabled value="">No Unit Found</option>}
              {allUnits?.map((unit) => (
                <option key={unit._id} value={unit.unit}>{unit.unit}</option>
              ))}
            </select>
          </div>
          <div className="flex" >=</div>
          <div className="flex_1">
            <input
              type="number"
              name="unitValue"
              value={unit2.unitValue}
              onChange={unit2handleInput}
              placeholder="Enter Unit"
            />
          </div>
          <div className="flex_1">
            <div className="details" >
              <div>{unit2.unitValue} {unit1.unitName || "kg"}</div>
              <div>=</div>
              <div>{unit1.unitValue * unit2.unitValue} pcs</div>
            </div>
          </div>
        </div>

        {/* <div className="packeging_details">
          <div className="flex_1">
            <div className="details" style={{ background: "#f2f7fb" }} >
              <div>1</div>
            </div>
          </div>
          <div className="flex_half">
            <select name="unitName" onChange={unit3handleInput} >
              <option value="">Unit</option>
              {allUnits.length === 0 && <option disabled value="">No Unit Found</option>}
              {allUnits?.map((unit) => (
                <option key={unit._id} value={unit.unit}>{unit.unit}</option>
              ))}
            </select>
          </div>
          <div className="flex" >=</div>
          <div className="flex_1">
            <input
              type="number"
              name="unitValue"
              value={unit3.unitValue}
              onChange={unit3handleInput}
              placeholder="Enter Unit"
            />
          </div>
          <div className="flex_1">
            <div className="details" >
              <div>{unit2.unitName || "Unit 2"}</div>
              <div>=</div>
              <div>{unit1.unitValue * unit2.unitValue * unit3.unitValue} Pcs</div>
            </div>
          </div>
        </div> */}
        <div onClick={() => addProductVFunc()} className="btn changepass_btn">
          {btnLoading ? (
            <CircularProgress style={{ color: "#fff" }} size={26} />
          ) : (
            "ADD"
          )}
        </div>
      </div>

    </div>
  );
};

export default AddProductVarient;