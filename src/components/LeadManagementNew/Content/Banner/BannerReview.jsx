import { Grid } from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CgFormatText } from "react-icons/cg";
import { FaCalendarAlt } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { CiShare2 } from "react-icons/ci";

const BannerReview = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [description , setDescription] = useState("")
  const [share, setShare] = useState({
    popUp:false,
    id:""
});

  const handleShare=(e , name , row)=>{
    if(name==="lead"){
        navigate("/lead_management_share_lead",{state:{ description:description,banner:location?.state?.data?.banner_image,name:"banner"}} )
    }else if(name==="parties"){
        navigate("/lead_management_share_party",{state:{ description:description,banner:location?.state?.data?.banner_image,name:"banner"}} );
    }else{
        navigate("/lead_management_share_customer",{state:{ description:description,banner:location?.state?.data?.banner_image,name:"banner"}} );
    }
}

const handleSharePopUp=()=>{
    setShare({
        ...share,
        popUp:!share.popUp,
    })
}

  return (
    <div className="page_preview">
      <Grid container>
        <div className="banner_review">
          <h3>Review and Send</h3>
          {/* <h4>
            Sending to{" "}
            <span className="banner_title" style={{ padding: "0px" }}>
              Bhavesh khajuriya
            </span>
          </h4> */}
        </div>
        <Grid item xs={12}>
          <div className="preview_banner">
            <img src={location?.state?.data?.banner_image} />
          </div>
        </Grid>
        <Grid item xs={12} className="banner_review_padding">
          <div className="banner-head">
            <h3>Exclusive Offers</h3>
            <h5>
              <CgFormatText fontSize={"30px"} />
            </h5>
          </div>
          <div className="banner-head">
            <h5 className="banner_title" style={{ padding: "0px" }}>
              {" "}
              <FaCalendarAlt
                fontSize={"30px"}
                style={{ marginRight: "10px" }}
              />{" "}
              Select Scheduled Date
            </h5>
            <FaCalendarAlt fontSize={"30px"} />
          </div>
          {/* <div className="banner-head">
            <h5 className="banner_title" style={{ padding: "0px" }}>
              <IoMdSend fontSize={"30px"} style={{ marginRight: "10px" }} />{" "}
              Quick Send
            </h5>
            <IoMdSend fontSize={"30px"} />
          </div> */}
        </Grid>
        <Grid item xs={12}>
          <textarea
            className="banner_textarea"
            name="description"
            rows="8"
            placeholder="Type your message here"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
          ></textarea>
        </Grid>
        <Grid
          item
          xs={12}
          className=""
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div className="banner_review_btn">
            <CiShare2 fontSize={"30px"} />{" "}
          </div>
          <div className="banner_review_btn" onClick={()=>handleSharePopUp()}>Send Via Whatsapp
          {share.popUp ? (
            <div className="option_lists_banner">
              <div className="option_lists_div_banner option_lists_first">
                Share With
              </div>
              <div
                className="option_lists_div_banner"
                onClick={(e) => handleShare(e, "lead")}
              >
                Leads
              </div>
              <div
                className="option_lists_div_banner"
                onClick={(e) => handleShare(e, "customer")}
              >
                Customer
              </div>
              <div
                className="option_lists_div_banner"
                onClick={(e) => handleShare(e, "parties")}
              >
                Parties
              </div>
            </div>
          ) : (
            ""
          )}
            </div>

        </Grid>
      </Grid>
    </div>
  );
};

export default BannerReview;
