import './AddBanner.css';
import React, { useState } from 'react';
import group from '../../../images/group.png';

import uploadImg from '../../../images/upload2.png';
import { addBanner, editBanner } from '../../../api/leadApi';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const EditBanner = () => {
  const { state: banner } = useLocation();
  const navigateTo = useNavigate();

  const [apiRes, setApiRes] = useState({ loading: false, error: '' });
  const [errors, setErrors] = useState({});
  const [occType, setOccType] = useState(banner.type || '');
  const [bannerName, setBannerName] = useState(banner.name || '');
  const [bdate, setBdate] = useState(banner.date || '');
  const [bannerImage, setBannerImage] = useState(banner.file || null);
  console.log(banner);
  function changeFile(e) {
    if (e.target.files.length) {
      setBannerImage(e.target.files[0]);
    }
  }
  async function submitHandler() {
    let tempErrs = {};
    if (!occType) tempErrs.occType = 'Occupation type is required';
    if (!bannerName) tempErrs.bannerName = 'Banner name is required';
    if (!bdate) tempErrs.bdate = 'Banner date is invalid';
    if (!bannerImage) tempErrs.bannerImage = 'Please select banner image';
    setErrors(tempErrs);
    if (Object.keys(tempErrs).length) return;
    updateBanner();
  }

  async function updateBanner() {
    setApiRes({ loading: true, error: '' });
    const data = {
      leadBanner_id: banner._id,
      is_delete: '0',
      type: occType,
      name: bannerName,
      date: bdate,
      file: bannerImage,
    };
    try {
      const res = await editBanner(data);
      if (res.data.status) {
        toast.success(res.data.message);
        setApiRes({ loading: false, error: '' });
        navigateTo('/banner_list');
      } else {
        setApiRes({ loading: false, error: res.data.message });
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
      setApiRes({ loading: false, error: error.message });
    }
  }

  function getURL(obj) {
    if (obj === banner.file) return obj;
    if (obj) {
      return URL.createObjectURL(obj);
    }
    return uploadImg;
  }
  return (
    <div className="container">
      <div className="dash_heading">
        <div className="icon">
          <img src={group} alt="icon" />
        </div>
        <div className="title">Add Banner</div>
      </div>

      <div className="changepass_container">
        <div className="changepass_form">
          <select value={occType} onChange={(e) => setOccType(e.target.value)}>
            <option value="">Occassion Type</option>
            <option value="type1">Type 1</option>
            <option value="type2">Type 2</option>
          </select>
          {errors.occType && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.occType}</p>}

          <input type="text" value={bannerName} onChange={(e) => setBannerName(e.target.value)} placeholder="Banner Name" />
          {errors.bannerName && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.bannerName}</p>}

          <input type="date" value={bdate} onChange={(e) => setBdate(e.target.value)} />
          {errors.bdate && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.bdate}</p>}

          <div className="banner_image">
            <a>Banner Template Upload</a>
            <label>
              <img src={getURL(bannerImage)} alt="banner" />
              <input type="file" accept="image/jpeg, image/png" onChange={changeFile} style={{ display: 'none' }} />
            </label>
            {errors.bannerImage && <p style={{ width: '98%', fontSize: '0.9rem', color: 'red' }}>{errors.bannerImage}</p>}
          </div>
          <div className="btn changepass_btn" onClick={(e) => !apiRes.loading && submitHandler()}>
            {apiRes.loading ? <CircularProgress style={{ color: '#fff' }} size={26} /> : 'SAVE'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBanner;
