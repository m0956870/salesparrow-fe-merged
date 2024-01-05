import React, { useState, useEffect } from "react";
import {Dialog,DialogActions,DialogTitle,DialogContent,CircularProgress,} from "@mui/material";
import { createFile, createMessage } from "../../../../api/leadApi";
import { toast } from "react-toastify";
import ManageImage from "./ManageImage";
import { useNavigate } from "react-router-dom";
import YouTube from 'react-youtube';
import axios from "axios";

const CreateFile = (props) => {
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
  const [thumbnails, setThumbnails] = useState([]);
  const [youtubeLink, setyoutubeLink] = useState([]);


  const handleCreate =async() => {
  if(props.catalogue){
    if(message.title && message.body){
      navigate("/preview" ,{state:{message , imageList:imagePreviews , youtubeList:youtubeLink , fileName:fileName , fileType:props.catalogue}})
    }else{
      toast.warning("Please enter title and description")
    }
  }else{
    if(message.title ){
      let formFile = new FormData();
      formFile.append("title" ,message?.title)
      formFile.append("fileType" , "Pdf")
     
      formFile.append("pdf" , message?.fileAttachment)
      try {
        const res = await createFile(formFile);
        if (res.data.status) {
          toast.success(res.data.message);
          props.close()
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
      setyoutubeLink(previews=>[...previews ,value]);
        const youtubeLinks = value.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/g );
      
          if (youtubeLinks) {
            youtubeLinks.forEach((link) => getThumbnail(link));
          }
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
   if(props.setManageImageList){
    setImagePreviews(props.manageImageList)
}
  },[props.manageImageList])


  const handleManageImage=()=>{
    props.close()
    props.setManageImage(true)
    props.setManageImageList(imagePreviews)
  }

  const getThumbnail = async (link) => {
    
    try {
      const response = await axios.get(
        `https://www.youtube.com/oembed?url=${link}&format=json`
      );
      setThumbnails((prevThumbnails) => [...prevThumbnails, response.data.thumbnail_url]);
    } catch (error) {
      console.error('Error fetching YouTube data:', error);
    }
    setMessage({
        ...message,
        youtubeLink:""
     })
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
            // Promise.all( getFileDataUrl(file).then(
            //   (newPreviews) => {
            //     setMessage({
            //     ...message,
            //     fileAttachment:newPreviews
            // })
            // setFileName(file.name)
            //   }
            // ));
  
        } else {
          toast.warning('File type not allowed. Please upload a PDF, JPG, JPEG, or PNG file.');
        }
      }
  }

  const getFileDataUrl = (file) => {
    return new Promise((resolve) => {
      const objectUrl = URL.createObjectURL(file);
      resolve(objectUrl);
    });
  };


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
          <div className="create_msg_heading">Create File</div>
          <div className="msg_body_section">
            <div className="msg_body_title">Title</div>
            <textarea
              className="msg_body_txtarea_title"
              name="title"
              placeholder="Enter your title"
              value={message.title}
              onChange={handleChange}
            />
            {props.catalogue?<><div className="msg_body_title">Description</div>
            <textarea
              className="msg_body_txtarea_msg"
              name="body"
              placeholder="Enter your description"
              value={message.body}
              onChange={handleChange}
            /></>:""}
           
           {props.catalogue?<> 
            <div className="msg_body_txtarea_title msg_body_txtarea_ImageBox ">
              Image (* Required)
            </div>
           <div className="msg_body_txtarea_title msg_body_txtarea_ImageBox ">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index}`}
                />
              ))}
             {props.catalogue?<> <input
                type="file"
                id="input-img"
                multiple
                onChange={handleImage}
                style={{ display: "none" }}
              />
              <label htmlFor="input-img" className="add_image_btn">+Add Image</label></>:""}
            </div>
           {imagePreviews.length>0?<p style={{color:"#28A9E2" , cursor:"pointer" , marginLeft:"5px" , textDecoration:"underline"}} onClick={handleManageImage}>Manage Image</p>:""} 
            
           {thumbnails.map((thumbnail, index) => (
        <div key={index}>
          <img src={thumbnail} alt={`Thumbnail ${index}`} width={"100%"}/>
        </div>
      ))}
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
          <div className="content_create_msg_btn" onClick={handleCreate}>
            Create {props.catalogue?"Catalogue":"File"}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFile;
