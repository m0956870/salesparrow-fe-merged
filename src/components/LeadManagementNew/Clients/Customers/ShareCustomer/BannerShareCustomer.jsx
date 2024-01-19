import React, { useEffect, useState } from "react";
import { getBannerData } from "../../../../../api/leadApi";
import { toast } from "react-toastify";
import "../../../Content/LMContent.css";
import { useLocation, useNavigate } from "react-router-dom";
import CategoryBannerListing from "../../../Content/Banner/CategoryBannerListing"
import SendLeadCustomerPopUp from "./SendCustomerPopUp";

const BannerShareCustomer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [banner, setBanner] = useState([]);
  const [pageLength, setpageLength] = useState();
  const [catName , setCatName] =  useState()
  const [catListActive , setCatListActive] = useState(false)
  const [sendMessagePopup , setsendMessagePopup] = useState(false)
  const [message, setMessage] = useState({
    title: "",
    body: "",
  });

  const getBannerList = async (p, s) => {
    const data = {
      search: s ?? "",
      page: p ? String(p) : "1",
      limit: "5",
    };
    try {
      const res = await getBannerData(data);
      if (res.data.status) {
        setBanner(res.data.data);
        setpageLength(res.data.total_page);
        // toast.success("");
      } else {
        toast.error(res.data.File);
      }
    } catch (error) {
      toast.error(error.File);
    }
  };

  useEffect(() => {
    getBannerList();
  }, []);

  const handleNavigate =(catName)=>{
 setCatName(catName)
    setCatListActive(true)
  }

  const handleImage=(item)=>{
    // navigate("/banner_review" , {state:{data:item , pageName : "clients"}})

    setsendMessagePopup(true);
    setMessage({
        ...message,
        // title:row.title,
        // body:row.description,
        banner:item.banner_image,
        name:"banner"
    })
  }

  return (
    <div className="container">
      <div className="">
        {!catListActive?banner.map((elem, id) => {
          return (
            <>
              <div className="banner-head">
                <div className="banner_title" onClick={()=>handleNavigate(elem.category_name)}>{elem.category_name}</div>
                <div className="banner_title"  onClick={()=>handleNavigate(elem.category_name)}>See all</div>
              </div>

                <div className="banner_img">
                  {elem.banners.map((item, id) => {
                    return (
                      <div className="banner_cat_img" onClick={()=>handleImage(item)}>
                        <img src={item.banner_image} />
                      </div>
                    );
                  })}
                </div>
            </>
          );
        })
      :
      <CategoryBannerListing catName={catName} setCatListActive={setCatListActive} />
      }

<SendLeadCustomerPopUp
      open={sendMessagePopup}
      close={() => setsendMessagePopup(!sendMessagePopup)}
      messageData={message}
      sentLead={location?.state?.id}
      pageType={location?.state?.pageType}
      />
      </div>
    </div>
  );
};

export default BannerShareCustomer;
