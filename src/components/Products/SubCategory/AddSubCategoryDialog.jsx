import "../Product.css";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Avatar,
  CircularProgress,
} from "@mui/material";

import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { blankValidator } from "../../../utils/Validation";
import { addCategory, fetchAllCategory } from "../../../api/productAPI";

const AddSubCategoryDialog = (props) => {
  const [btnLoading, setbtnLoading] = useState(false);

  const [profilePic, setprofilePic] = useState("");
  const [demoProfilePic, setdemoProfilePic] = useState();

  const [categories, setcategories] = useState([])

  const [category, setcategory] = useState({
    name: "",
    gst: "",
    p_id: "",
    status: "Active",
  });

  const [error, setError] = useState({
    name: {
      status: false,
    },
    gst: {
      status: false,
    },
  });

  const handleInput = (e) => {
    Object.values(error).map(item => item.status = false)
    setcategory({ ...category, [e.target.name]: e.target.value });
  };

  const addBankFunc = async () => {
    if (!profilePic) {
      return toast.error("Please Select Category Image");
    }

    if (!blankValidator(category.name)) {
      return setError({
        ...error,
        name: {
          status: true,
        },
      });
    }

    if (!blankValidator(category.gst)) {
      return setError({
        ...error,
        gst: {
          status: true,
        },
      });
    }

    // console.log(profilePic, category);

    try {
      setbtnLoading(true);
      let res = await addCategory(profilePic, category);
      // console.log(res);
      if (res.data.status) {
        props.close()
        toast.success("Category Created Successfully!");
        setbtnLoading(false);
        setcategory({
          name: "",
          gst: "",
          p_id: "",
          status: "Active",
        })
        setprofilePic(null)
        setdemoProfilePic(null)
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

  const addEmployeePic = async (e) => {
    let file = e.target.files[0];
    setprofilePic(file);
    setdemoProfilePic(URL.createObjectURL(file));
  };

  useEffect(() => {
    fetchAllCategory().then((res) => setcategories(res.data.result));
  }, []);

  return (
    <div>
      <Dialog
        open={props.open}
        aria-labelledby="form-dialog-title"
        maxWidth="xs"
        fullWidth="true"
        onClose={props.close}
      >
        <DialogTitle className="dialog_title">
          <div>Add Product Sub Category</div>
        </DialogTitle>
        <DialogContent className="cardpopup_content">
          <div className="profile_details">
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
                  onChange={addEmployeePic}
                  name="myfile"
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </div>
          <select name="p_id" onChange={handleInput}>
            <option value="">Category</option>
            {categories?.map((category) => (
              <option value={category._id}>{category.name}</option>
            ))}
          </select>
          <input
            type="text"
            name="name"
            value={category.name}
            onChange={handleInput}
            placeholder="Sub Category Name"
          />
          {error.name.status && (
            <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }} >
              Please Enter Category Name
            </p>
          )}
          <input
            type="number"
            name="gst"
            value={category.gst}
            onChange={handleInput}
            placeholder="GST (%)"
          />
          {error.gst.status && (
            <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }} >
              Please Enter GST Percentage
            </p>
          )}

          <select name="status" onChange={handleInput}>
            <option value="Active">Active</option>
            <option value="InActive">InActive</option>
          </select>
          <div className="cardpopup_btn" onClick={() => addBankFunc()}>
            {btnLoading ? (
              <CircularProgress style={{ color: "#fff" }} size={22} />
            ) : (
              "SAVE"
            )}
          </div>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
};

export default AddSubCategoryDialog;
