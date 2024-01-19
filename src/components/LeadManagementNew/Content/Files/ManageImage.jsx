import React, { useState, useEffect , useRef, useContext } from "react";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  CircularProgress,
  colors,
} from "@mui/material";
import { createMessage } from "../../../../api/leadApi";
import { toast } from "react-toastify";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdRemoveRedEye } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { AdminContext } from "../../../../App";



const ManageImage = (props) => {
    const imageRef = useRef(null);
    const { state, dispatch } = useContext(AdminContext);
  const [manageOption, setManageOption] = useState({
    popUp:false,
    id:""
  });

  console.log(state)

  const handleOption=(id)=>{
    setManageOption({
        ...manageOption,
        popUp:!manageOption.popUp,
        id:id
    })
  }

  const handleDeleteImg=(id)=>{
   const updateManageList = props.imageList.imageShows.filter((elem, ind)=>{
    return id !== ind
   })
   props.setImageList((prevImageList) => ({
    ...prevImageList,
    imageShows: updateManageList
  }));

   const updateImageList = props.imageList.imgList.filter((elem, ind)=>{
    return id !== ind
   })
   props.setImageList((prevImageList) => ({
    ...prevImageList,
    imgList: updateImageList
  }));

   setManageOption({
    ...manageOption,
    popUp:false,
    id:""
})
  }

  console.log(props.imageList , "imageList")


const handleBack=()=>{
    if(!props.editFilePopup){
       props.setaddFilePopup(true)
    }
         props.close()
}

  const handleViewFull =(id)=>{
    const image = imageRef.current;
    const selectedImage = props.manageImageList.find((img,ind) => ind === id);

    if (selectedImage) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        image.src = selectedImage;
        image.requestFullscreen();
      }
    }
    setManageOption({
        ...manageOption,
        popUp:false,
        id:""
    })
  }

  const handleUp=(id)=>{
    if (id > 0 && id < props.imageList.imageShows.length) {
      // Swap the elements
      let temp = props.imageList.imageShows[id];
      props.imageList.imageShows[id] = props.imageList.imageShows[id - 1];
      props.imageList.imageShows[id - 1] = temp;
      //  props.setManageImageList(prev=>({...prev, ...props.manageImageList}));
      setManageOption({
        ...manageOption,
        popUp:false,
        id:""
    })

    } else {
      console.log("Invalid index for swapping");
    }

    if (id > 0 && id < props.imageList.imgList.length) {
      // Swap the elements
      let temp = props.imageList.imgList[id];
      props.imageList.imgList[id] = props.imageList.imgList[id - 1];
      props.imageList.imgList[id - 1] = temp;
      
      setManageOption({
        ...manageOption,
        popUp: false,
        id: ""
      });
    } else {
      console.log("Invalid index for swapping");
    }
  }

  const handleCoverImg=(id)=>{
      let updateArr = props.imageList.imageShows.splice(id , 1)
      props.imageList.imageShows.unshift(updateArr[0])

      let updateImageList = props?.imageList?.imgList.splice(id , 1);
      props?.imageList?.imgList.unshift(updateImageList[0])

      setManageOption({
        ...manageOption,
        popUp:false,
        id:""
      })

  }

  return (
    <Dialog
      open={props.manageImage}
      aria-labelledby="form-dialog-title"
      maxWidth="sm"
      fullWidth={true}
      onClose={props.close}
    >
      <DialogContent style={{ padding: 0 }}>
        <div className="content_create_msg_popup">
          <div className="create_msg_heading">Manage Image</div>
          <div className="msg_body_section">
            {props?.imageList?.imageShows?.map((elem , id) => {
              return (
                <>
                  <div className="image_body_list_div position-relative">
                    <div className="image_body_list">
                      <img 
                      src={elem} 
                      ref={imageRef}
                      style={{ cursor: 'pointer', maxWidth: '60%', maxHeight: '60vh' }}
                      />
                      <p>
                        {id+1} of {props?.imageList?.imageShows.length} <span style={{marginLeft:"1rem"}}>{id==0?"Cover image":""}</span>
                      </p>
                    </div>
                    <p onClick={()=>handleOption(id)}><BsThreeDotsVertical fontSize={"22px"}/></p>
                    {manageOption.popUp && id===manageOption.id ? (
                      <div
                        className="option_lists_manageImg"
                        style={{ right: "5%", top: "0%" }}
                      >
                        {/* <div className="option_lists_div_manageImg">Option for image {manageOption.id+1}</div> */}
                        <div className="option_lists_div_manageImg" onClick={()=>handleViewFull(id)}><MdRemoveRedEye fontSize={"20px"} color={"#28A9E2"}/>View full image</div>
                        <div className="option_lists_div_manageImg" onClick={()=>handleCoverImg(id)}><FaStar fontSize={"18px"} color={"#28A9E2"}/>Set as cover image</div>
                        <div className="option_lists_div_manageImg" onClick={()=>handleUp(id)}><FaArrowUp  fontSize={"18px"} color={"#28A9E2"}/>Move Up</div>
                        <div className="option_lists_div_manageImg" onClick={()=>handleDeleteImg(id)}><FaTrash   fontSize={"18px"} color={"#28A9E2"}/>Delete image</div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </>
              );
            })}
          </div>
          <div className="content_create_msg_btn" onClick={handleBack}>
           Back
          </div>
          {/* <div className="content_create_msg_btn" >
            Done
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageImage;
