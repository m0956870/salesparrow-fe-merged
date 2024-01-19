import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogTitle, DialogContent, Avatar, CircularProgress, } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { toast } from "react-toastify";
import { addCategory } from "../../../api/productAPI";
import isAllowed from "../../../utils/isAllowed";
import { VIEW_CATALOGUE } from "../../../constants";
import { updateCatalogueBanner } from "../../../api/catalogueAPI";

const EditBannerDialog = (props) => {
    const [btnLoading, setbtnLoading] = useState(false);

    const [profilePic, setprofilePic] = useState("");
    const [demoProfilePic, setdemoProfilePic] = useState("");

    const [category, setcategory] = useState({
        priority: "",
    });

    const handleInput = (e) => {
        setcategory({ ...category, [e.target.name]: e.target.value });
    };

    const addPicFunc = async (e) => {
        let file = e.target.files[0];
        setprofilePic(file);
        setdemoProfilePic(URL.createObjectURL(file));
    };

    const editCategoryFunc = async () => {
        setbtnLoading(true);
        if (!await isAllowed(VIEW_CATALOGUE)) {
            toast.error("Module is not purchased!");
            return setbtnLoading(false);
        }

        let res = await updateCatalogueBanner(profilePic, category);
        if (res.data.status) {
            props.close()
            toast.success("Catalogue banner edited successfully!");
            setcategory({ priority: "", })
            setprofilePic(null)
            setdemoProfilePic(null)
        } else {
            toast.error(res.data.message);
        }
        setbtnLoading(false);
    };

    useEffect(() => {
        setcategory({
            id: props.currCardData._id,
            priority: props.currCardData.priority,
        })
        setprofilePic(null)
        setdemoProfilePic(props.currCardData.image)
    }, [props.open])

    return (
        <div>
            <Dialog
                open={props.open}
                aria-labelledby="form-dialog-title"
                maxWidth="xs"
                fullWidth={true}
                onClose={props.close}
            >
                <DialogTitle className="dialog_title">
                    <div>Edit Catalogue Banner</div>
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
                        name="priority"
                        value={category.priority}
                        onChange={handleInput}
                        placeholder="Priority (In Number)"
                    />
                    <div className="cardpopup_btn" onClick={() => editCategoryFunc()}>
                        {btnLoading ? (
                            <CircularProgress style={{ color: "#fff" }} size={22} />
                        ) : (
                            "EDIT"
                        )}
                    </div>
                </DialogContent>
                <DialogActions></DialogActions>
            </Dialog>
        </div>
    );
};

export default EditBannerDialog;
