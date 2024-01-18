import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import group from "../../../images/group.png";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { toast } from "react-toastify";
import { blankValidator } from "../../../utils/Validation";
import { Avatar, CircularProgress } from "@mui/material";
import { addProductGrouping, fetchAllCategory, fetchAllProduct } from "../../../api/productAPI";
import isAllowed from "../../../utils/isAllowed";
import { VIEW_CATALOGUE } from "../../../constants";
import { addCatalogueCategory } from "../../../api/catalogueAPI";

const AddCategory = () => {
  const navigate = useNavigate();
  const [profilePic, setprofilePic] = useState("");
  const [demoProfilePic, setdemoProfilePic] = useState();

  const [btnLoading, setbtnLoading] = useState(false);
  const [allCategory, setallCategory] = useState([]);
  const [allProduct, setallProduct] = useState([]);

  const [groupID, setgroupID] = useState("");

  const [groupEmp, setgroupEmp] = useState([]);
  const [selectedName, setselectedName] = useState([]);

  useEffect(() => {
    fetchAllCategory().then((res) => setallCategory(res.data.result));
  }, [])


  const categoryHandleInput = async (e) => {
    setgroupID(e.target.value);
    let res = await fetchAllProduct({ catagory_id: e.target.value, brand_id: "", sub_catagory_id: "" })
    if (res.data.status) {
      setallProduct(res.data.result);
      setgroupEmp([])
      setselectedName([])
    } else {
      console.log(res.data.message);
      toast.error("Some Error!");
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
    if (!profilePic) return toast.error("Please select banner image!")
    if (!groupID) return toast.error("Please select category!")
    if (groupEmp.length === 0) return toast.error("Please select products!")

    setbtnLoading(true);
    if (!await isAllowed(VIEW_CATALOGUE)) {
      toast.error("Module is not purchased!");
      return setbtnLoading(false);
    }

    let groupData = {
      products: groupEmp,
      category_id: groupID,
    };

    try {
      let res = await addCatalogueCategory(profilePic, groupData);
      // console.log(res);
      if (res.data.status) {
        toast.success("Category Created Successfully!");
        navigate("/catalogue_category");
        setbtnLoading(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Internet Error!");
    }
    setbtnLoading(false);
  };

  const addPicFunc = async (e) => {
    let file = e.target.files[0];
    setprofilePic(file);
    setdemoProfilePic(URL.createObjectURL(file));
  };

  return (
    <div className="container">
      <div className="dash_heading">
        <div className="icon">
          <img src={group} alt="icon" />
        </div>
        <div className="title">Add Caatogery</div>
      </div>

      <div className="party_container">
        <div className="profile_details">
          <div className="avatar">
            <Avatar
              alt="Profile Pic"
              src={demoProfilePic || profilePic}
              style={{ height: "9rem", width: "9rem" }}
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
      </div>

      <div className="party_container" style={{ background: "none", boxShadow: "none" }}>
        <div className="message_btn submit_btn" onClick={() => handleCreateEmpGroup()}        >
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

export default AddCategory;