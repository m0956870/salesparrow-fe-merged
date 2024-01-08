import React, { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { IoLogoWhatsapp } from "react-icons/io5";
import "../LMContent.css";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { getBaseUrl } from "../../../../utils/baseUrl";
import axios from "axios";
import { FaYoutube } from "react-icons/fa";
import { toast } from "react-toastify";
import { createFile, updateFile } from "../../../../api/leadApi";

const Item = styled(Paper)(({ theme }) => ({
  //   backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Preview = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [details, setDetails] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);

  const getadminprofile = async () => {
    const token = localStorage.getItem("token");

    try {
      var config = {
        method: "get",
        url: getBaseUrl() + "auth_api/getadminprofile",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      };
      let res = await axios(config);
      if (res.data.status) {
        setDetails(res.data.result[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getThumbnail = async (link) => {
    try {
      const response = await axios.get(
        `https://www.youtube.com/oembed?url=${link}&format=json`
      );
      let youtubedata={
        thumbnailurl:response.data.thumbnail_url,
        url:link
      }
      setThumbnails((prevThumbnails) => [
        ...prevThumbnails,
        youtubedata,
      ]);
    } catch (error) {
      console.error("Error fetching YouTube data:", error);
    }
  };

  useEffect(() => {
    getadminprofile();
    if (location?.state?.youtubeList) {
      location?.state?.youtubeList.forEach((link) => getThumbnail(link));
    }
  }, []);

  const handleYoutube=(url)=>{
    window.open(url, '_blank');
  }

  const handleDone=async()=>{
    let formFile = new FormData();
    formFile.append("title" , location?.state?.message?.title)
    formFile.append("description" , location?.state?.message?.body)
    formFile.append("fileType" , location?.state?.fileType?"Catalogue":"Pdf")
    Array.from(location?.state?.message?.file).map((file, index) => {
      formFile.append("file", file);
    });
    formFile.append("pdf" , location?.state?.message?.fileAttachment)
    formFile.append("mediaUrl" , location?.state?.youtubeList)
    formFile.append("websiteUrl" , location?.state?.message.websiteLink)
    formFile.append("websiteName" , location?.state?.message.websiteName)
    if(location?.state?.update ){
      formFile.append("fileId",  location?.state?.id );
    }
   
    try {
      const res = await (location.state.update ? updateFile(formFile) : createFile(formFile));
    
      if (res.data.status) {
        toast.success(res.data.message);
        navigate(-1);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred');
      // setApiRes({ loading: false, error: error.message || 'An error occurred' });
    }
  }    

  const handleBack=()=>{
    navigate(-1)
  }

  return (
    <Container maxWidth="lg">
      <div className="page_preview">
        <Grid container>
          <Grid item xs={12}>
            <div className="preview_heading">Page Preview</div>
          </Grid>
          <hr />
          <Grid item xs={12}>
            <div className="preview_banner">
              <img src={location?.state?.imageList[0]} />
            </div>
          </Grid>
          <Grid container style={{ display: "flex", justifyContent: "center" }}>
            <Grid item xs={10} className="preview_text">
              <div className="preview_text1">
                <h3 style={{textAlign:"center"}}>{location?.state?.message?.title}</h3>
                <p>{location?.state?.message?.body}</p>
              </div>
            </Grid>
          </Grid>
          <Grid container style={{ display: "flex", justifyContent: "center" }}>
            <Grid item xs={10} className="preview_text">
              <div className="preview_text1">
                <h3 style={{textAlign:"center"}}>Website Add</h3>
                <a
                  href={location?.state?.message?.websiteLink}
                  target="_blank"
                  className="align-center"
                >
                  {location?.state?.message?.websiteName}
                </a>
              </div>
            </Grid>
          </Grid>
          <Grid container style={{ display: "flex", justifyContent: "center" }}>
            <Grid item xs={6} md={10} sm={10} className="preview_text">
              <div className="preview_text2">
                <h3>Want to find out more</h3>
                <a
                  href={`https://api.whatsapp.com/send?phone=+${details?.phone}&text=Hi%20I%20Found%20Your%20Business%20On%20Homeshiftingmart`}
                  target="_blank"
                  className="align-center"
                >
                  <IoLogoWhatsapp
                    style={{ color: "green" }}
                    fontSize={"28px"}
                  />{" "}
                  Connect me
                </a>
              </div>
            </Grid>
          </Grid>
          <Grid
            container
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "2rem",
            }}
          >
            {location?.state?.imageList
              ?.slice(1, location?.state?.imageList.length)
              .map((elem, id) => {
                return (
                  <>
                    <Grid item xs={5} className="preview_list_img">
                      <img src={elem} />
                    </Grid>
                  </>
                );
              })}
          </Grid>
          <Grid container style={{ display: "flex", justifyContent: "center" }}>
            <Grid item xs={10} className="preview_text">
              <div className="preview_text1">
                <h3>Youtube Video</h3>
               
              </div>
            </Grid>
          </Grid>
          <Grid  container
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "2rem",
            }}>
            {thumbnails.map((thumbnail, index) => {
              return (
                <Grid item xs={5} className="preview_list_img" onClick={()=>handleYoutube(thumbnail.url)}>
                    <img
                      src={thumbnail.thumbnailurl}
                      alt={`Thumbnail ${index}`}
                      width={"100%"}
                    />
                    <FaYoutube className="youtube_icon"/>
                  </Grid>
              );
            })}
          </Grid>
          <Grid item xs={12}>
            <div className="preview_profile_img_div">
              <img src={details.profileImage} className="preview_profile_img" />
            </div>
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <h2>{details?.company_name}</h2>
              <p>{details?.phone}</p>
              <p>{details?.companyShortCode}</p>
            </div>
          </Grid>
          <Grid container style={{ display: "flex", justifyContent: "center" }}>
            <Grid xs={8} className="preview_btn">
              <button onClick={handleBack}>Back</button>
              <button onClick={handleDone}>Done</button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default Preview;
