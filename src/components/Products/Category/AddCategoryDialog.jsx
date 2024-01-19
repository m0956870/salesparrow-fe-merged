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
import { addCategory } from "../../../api/productAPI";
import isAllowed from "../../../utils/isAllowed";
import { PRODUCT_MANAGEMENT } from "../../../constants";

const AddCategoryDialog = (props) => {
  const [btnLoading, setbtnLoading] = useState(false);

  const [profilePic, setprofilePic] = useState("");
  const [demoProfilePic, setdemoProfilePic] = useState();

  const [category, setcategory] = useState({
    name: "",
    gst: "",
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

  const addCategoryFunc = async () => {
    setbtnLoading(true);
    if (!await isAllowed(PRODUCT_MANAGEMENT)) {
      toast.error("Module is not purchased!");
      return setbtnLoading(false);
    }
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

    let res = await addCategory(profilePic, category);
    // console.log(res);
    if (res.data.status) {
      props.close()
      toast.success("Category Created Successfully!");
      setbtnLoading(false);
      setcategory({
        name: "",
        gst: "",
        status: "Active",
      })
      setprofilePic(null)
      setdemoProfilePic(null)
    } else {
      toast.error(res.data.message);
      setbtnLoading(false);
    }
  };

  const addPicFunc = async (e) => {
    let file = e.target.files[0];
    setprofilePic(file);
    setdemoProfilePic(URL.createObjectURL(file));
  };

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
          <div>Add Product Category</div>
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
                  onChange={addPicFunc}
                  name="myfile"
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </div>
          <input
            type="text"
            name="name"
            value={category.name}
            onChange={handleInput}
            placeholder="Category Name"
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
          <div className="cardpopup_btn" onClick={() => addCategoryFunc()}>
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

export default AddCategoryDialog;
