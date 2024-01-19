import React, { useEffect, useState } from "react";
import { getCatBannerData } from "../../../../api/leadApi";
import { toast } from "react-toastify";
import "../LMContent.css";
import { FaLongArrowAltLeft } from "react-icons/fa";

const CategoryBannerListing = ({ catName, setCatListActive }) => {
  const [banner, setBanner] = useState([]);
  const [pageLength, setpageLength] = useState();

  const getCatBannerlList = async (p, s) => {
    const data = {
      search: s ?? "",
      page: p ? String(p) : "1",
      limit: "5",
      category: catName,
    };
    try {
      const res = await getCatBannerData(data);
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
    getCatBannerlList();
  }, []);

  return (
    <div className="">
      <div className="banner_title" onClick={() => setCatListActive(false)}>
        <FaLongArrowAltLeft fontSize={"22px"} />
      </div>
      <div className="banner_title">{catName}</div>
      <div className="banner">
        {banner.map((elem, id) => {
          return (
            <>
              <div className="banner_img">
                <div className="banner_cat_img">
                  <img src={elem.banner_image} />
                </div>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBannerListing;
