import React, { useState, useEffect } from "react";
import {Dialog,DialogActions,DialogTitle,DialogContent,CircularProgress,} from "@mui/material";
import { createFile, createMessage, updateFile } from "../../../../api/leadApi";
import { toast } from "react-toastify";
import ManageImage from "./ManageImage";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditFile = (props) => {
    const navigate = useNavigate();
  const [message, setMessage] = useState({
    title: "",
    body: "",
    youtubeLink:[],
    fileAttachment:"",
    map:"",
    websiteLink:"",
    websiteName:"",
    file:[]
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [fileName , setFileName] = useState("+ Add File Attachment")
  const [thumbnails, setThumbnails] = useState();
  const [youtubeLink, setyoutubeLink] = useState();
 




  const handleUpdate =async() => {
    if(props.fileData.fileType==="CATALOGUE"){
      if(message.title && message.body){
        navigate("/preview" ,{state:{message , imageList:imagePreviews , youtubeList:youtubeLink , fileName:fileName , fileType:props.catalogue , update:true ,id:props.fileData._id}})
      }else{
        toast.warning("Please enter title and description")
      }
    }else{
      if(message.title ){
        let formFile = new FormData();
        formFile.append("title" ,message?.title)
        formFile.append("fileType" , "Pdf")
        formFile.append("fileId" , props.fileData._id)
        formFile.append("pdf" , message?.fileAttachment)
        try {
          const res = await updateFile(formFile);
          if (res.data.status) {
            toast.success(res.data.message);
            props.close()
            props.getFile()
          } else {
            toast.error(res.data.message);
          }
         
        } catch (error) {
          toast.error(error.message);
          // setApiRes({ loading: false, error: res.data.message });
        }
      }else{
        toast.warning("Please enter title and description")
      }
    }
    };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name==="youtubeLink"){
      setyoutubeLink(value);
        const youtubeLinks = value.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/g );
      
         getThumbnail(youtubeLinks);
          
    }
    setMessage({
      ...message,
      [name]: value,
    });
  };

  const handleImage = (e) => {
    const files = e.target.files;
    
      setMessage(prevMessage=>({
        ...message,
        file:[...prevMessage.file , ...files]
      }))
      const imageFiles = Array.from(files).filter((file) => {
        return ["image/jpeg", "image/png", "image/svg+xml"].includes(file.type);
      });
      Promise.all(imageFiles.map((file) => getImageDataUrl(file))).then(
        (newPreviews) => {
          setImagePreviews(previews=>[...previews , ...newPreviews]);
        }
      );
  };
  const getImageDataUrl = (file) => {
    return new Promise((resolve) => {
      const objectUrl = URL.createObjectURL(file);
      resolve(objectUrl);
    });
  };

  useEffect(()=>{
    if(props.imageList.imageShows){
     setImagePreviews(props?.imageList?.imageShows)
     setMessage({
      ...message,
      file:props?.imageList?.imgList
     })
 }
   },[props?.imageList.imageShows])


  const handleManageImage=()=>{
    // props.close()
    props.setManageImage(true)
    props.setManageImageList(imagePreviews)
    props.setImageList({
      imageShows: imagePreviews, // Assuming imagePreviews is an array
      imgList: message.file // Assuming message.file is an array
    });
  }

  const getThumbnail = async (link) => {
    
    try {
      const response = await axios.get(
        `https://www.youtube.com/oembed?url=${link}&format=json`
      );
      // setThumbnails((prevThumbnails) => [...prevThumbnails, response.data.thumbnail_url]);
      setThumbnails(response.data.thumbnail_url);
    } catch (error) {
      console.error('Error fetching YouTube data:', error);
    }
    // setMessage({
    //     ...message,
    //     youtubeLink:""
    //  })
  };

  const handleFile=(e)=>{
    const file = e.target.files[0];
    if (file) {
        const fileType = file.type;
        const allowedFileTypes = ['application/pdf','image/jpeg','image/jpg','image/png','audio/mpeg','audio/wav','audio/mp3','video/mp4','video/mpeg',];
  
        if (allowedFileTypes.includes(fileType)) {
            setMessage({
                ...message,
                fileAttachment:file
            })
            setFileName(file.name)
         
  
        } else {
          console.log('File type not allowed. Please upload a PDF, JPG, JPEG, or PNG file.');
        }
      }
  }

  const getFileDataUrl = (file) => {
    return new Promise((resolve) => {
      const objectUrl = URL.createObjectURL(file);
      resolve(objectUrl);
    });
  };

  useEffect(() => {
      setMessage({
        ...message,
        title: props.fileData.title,
        body: props.fileData.description,
        websiteLink: props.fileData.websiteUrl,
        youtubeLink: props.fileData.mediaUrl,
        file: props?.fileData?.images,
        websiteName: props?.fileData?.websiteName,
      });
  
      if (props && props.fileData && props.fileData.pdf && props.fileData.pdf.length > 0) {
        setFileName(props.fileData.pdf[0].split('/').pop());
      } else {
        setFileName("+ add file");
      }
      setImagePreviews(props?.fileData?.images);
      setyoutubeLink(props.fileData.mediaUrl);
  }, [props.fileData]);

  useEffect(()=>{
    setTimeout(() => {
      getThumbnail(props.fileData.mediaUrl);
    }, 500);
    //
  },[props.fileData.mediaUrl])

  return (
    <Dialog
      open={props.open}
      aria-labelledby="form-dialog-title"
      maxWidth="sm"
      fullWidth={true}
      onClose={props.close}
    >
      <DialogContent style={{ padding: 0 }}>
        <div className="content_create_msg_popup">
          <div className="create_msg_heading">Edit File</div>
          <div className="msg_body_section">
            <div className="msg_body_title">Title</div>
            <textarea
              className="msg_body_txtarea_title"
              name="title"
              placeholder="Enter your title"
              value={message.title}
              onChange={handleChange}
            />
            {props.fileData.fileType==="CATALOGUE"?<><div className="msg_body_title">Description</div>
            <textarea
              className="msg_body_txtarea_msg"
              name="body"
              placeholder="Enter your description"
              value={message.body}
              onChange={handleChange}
            /></>:""}
           
           {props.fileData.fileType==="CATALOGUE"?<> 
            <div className="msg_body_txtarea_title msg_body_txtarea_ImageBox ">
              Image (* Required)
            </div>
           <div className="msg_body_txtarea_title msg_body_txtarea_ImageBox ">
              {imagePreviews?.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index}`}
                />
              ))}
             {props.fileData.fileType==="CATALOGUE"?<> <input
                type="file"
                id="input-img"
                multiple 
                onChange={handleImage}
                style={{ display: "none" }}
              />
              <label htmlFor="input-img" className="add_image_btn">+Add Image</label></>:""}
            </div>
           {imagePreviews?.length>0?<p style={{color:"#28A9E2" , cursor:"pointer" , marginLeft:"5px" , textDecoration:"underline"}} onClick={handleManageImage}>Manage Image</p>:""} 
            
    
        {thumbnails?<div  style={{position:"relative"}}>
          <img src={thumbnails} alt='Thumbnail' width={"100%"}/>
        </div>:""}
      
            <textarea
              className="msg_body_txtarea_title"
              name="youtubeLink"
              placeholder="+ Add Your Youtube Video"
              value={message.youtubeLink}
              onChange={handleChange}
            />
             <textarea
              className="msg_body_txtarea_title"
              name="websiteLink"
              placeholder="+ Add Website Link"
              value={message.websiteLink}
              onChange={handleChange}
            />
            <textarea
              className="msg_body_txtarea_title"
              type="text"
              placeholder="Website name"
              onChange={handleChange}
              name="websiteName"
              value={message.websiteName}
            />
            </>:""}
            <div className="msg_body_txtarea_title msg_body_txtarea_ImageBox ">
            <input
                type="file"
                id="input-fileAttachment"
                multiple
                onChange={handleFile}
                style={{ display: "none" }}
                accept=".pdf, .jpg, .jpeg, .png"
              />
              <label htmlFor="input-fileAttachment" className="">{fileName}</label>
            </div>
            
          </div>
          <div className="content_create_msg_btn" onClick={handleUpdate}>
            Update {props.fileData.fileType==="CATALOGUE"?"Catalogue":"File"}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditFile;
