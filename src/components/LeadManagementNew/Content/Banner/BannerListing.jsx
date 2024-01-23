import React, { useEffect, useState } from "react";
import { getBannerData } from "../../../../api/leadApi";
import { toast } from "react-toastify";
import "../LMContent.css";
import { useNavigate } from "react-router-dom";
import CategoryBannerListing from "./CategoryBannerListing";
 
const BannerListing = () => {
  const navigate = useNavigate();
  const [banner, setBanner] = useState([]);
  const [pageLength, setpageLength] = useState();
  const [catName , setCatName] =  useState()
  const [catListActive , setCatListActive] = useState(false)

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
    navigate("/banner_review" , {state:{data:item}})
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
      <CategoryBannerListing catName={catName} setCatListActive={setCatListActive}/>
      }
      </div>
    </div>
  );
};

export default BannerListing;
