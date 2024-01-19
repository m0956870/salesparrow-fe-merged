import "../Product.css";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from "@mui/material";

import { toast } from "react-toastify";
import { blankValidator } from "../../../utils/Validation";
import { addUnit } from "../../../api/productAPI";
import isAllowed from "../../../utils/isAllowed";
import { PRODUCT_MANAGEMENT } from "../../../constants";

const AddUnitDialog = (props) => {
  const [btnLoading, setbtnLoading] = useState(false);

  const [unit, setunit] = useState({
    unit: "",
    status: "Active",
  });

  const [error, setError] = useState({
    unit: {
      status: false,
    },
  });

  const handleInput = (e) => {
    Object.values(error).map(item => item.status = false)
    setunit({ ...unit, [e.target.name]: e.target.value });
  };

  const addUnitFunc = async () => {
    setbtnLoading(true);
    if (!await isAllowed(PRODUCT_MANAGEMENT)) {
      toast.error("Module is not purchased!");
      return setbtnLoading(false);
    }

    if (!blankValidator(unit.unit)) {
      return setError({
        ...error,
        name: {
          status: true,
        },
      });
    }

    console.log(unit);

    try {
      let res = await addUnit(unit);
      // console.log(res);
      if (res.data.status) {
        props.close()
        toast.success("Unit Created Successfully!");
        setbtnLoading(false);
        setunit({
          unit: "",
          status: "Active",
        })
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
          <div>Add Unit</div>
        </DialogTitle>
        <DialogContent className="cardpopup_content">
          <input
            type="text"
            name="unit"
            value={unit.unit}
            onChange={handleInput}
            placeholder="Unit Name"
          />
          {error.unit.status && (
            <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }} >
              Please Enter Unit Name
            </p>
          )}

          <select name="status" onChange={handleInput}>
            <option value="Active">Active</option>
            <option value="InActive">InActive</option>
          </select>
          <div className="cardpopup_btn" onClick={() => addUnitFunc()}>
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

export default AddUnitDialog;
