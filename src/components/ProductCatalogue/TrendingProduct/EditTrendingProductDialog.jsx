import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogTitle, DialogContent, Avatar, CircularProgress, } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { toast } from "react-toastify";
import { addCategory, fetchAllCategory, fetchAllProduct } from "../../../api/productAPI";
import isAllowed from "../../../utils/isAllowed";
import { VIEW_CATALOGUE } from "../../../constants";
import { updateTrendingProduct } from "../../../api/catalogueAPI";

const EditTrendingProductDialog = (props) => {
    const [btnLoading, setbtnLoading] = useState(false);
    const [allCategory, setallCategory] = useState([]);
    const [allProduct, setallProduct] = useState([]);

    const [category, setcategory] = useState({
        product_id: "",
        priority: "",
    });

    useEffect(() => {
        fetchAllCategory().then((res) => setallCategory(res.data.result));
        fetchAllProduct().then((res) => setallProduct(res.data.result));
    }, [])

    const handleInput = (e) => {
        setcategory({ ...category, [e.target.name]: e.target.value });
    };

    const editCategoryFunc = async () => {
        setbtnLoading(true);
        if (!await isAllowed(VIEW_CATALOGUE)) {
            toast.error("Module is not purchased!");
            return setbtnLoading(false);
        }

        let res = await updateTrendingProduct(category);
        if (res.data.status) {
            props.close()
            toast.success("Trending product edited successfully!");
            setcategory({ product_id: "", priority: "", })
        } else {
            toast.error(res.data.message);
        }
        setbtnLoading(false);
    };

    useEffect(() => {
        setcategory({
            id: props.currCardData._id,
            category_id: props.currCardData.product_id?.catagory_id,
            product_id: props.currCardData.product_id?._id,
            priority: props.currCardData.priority,
        })
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
                    <select value={category.category_id} onChange={(e) => fetchAllProduct({ catagory_id: e.target.value }).then((res) => setallProduct(res.data.result))} >
                        <option value="">All Categories</option>
                        {allCategory.length === 0 && <option disabled value="">No Category Found</option>}
                        {allCategory?.map((category) => (
                            <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                    </select>
                    <select value={category.product_id} name="product_id" onChange={handleInput} >
                        <option value="">All Products</option>
                        {allProduct.length === 0 && <option disabled value="">No Product Found</option>}
                        {allProduct?.map((product) => (
                            <option key={product.id} value={product.id}>{product.name}</option>
                        ))}
                    </select>
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

export default EditTrendingProductDialog;