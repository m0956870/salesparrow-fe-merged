import './AddBanner.css';
import React, { useState } from 'react';
import group from '../../../images/group.png';

import uploadImg from '../../../images/upload2.png';
import { addBanner } from '../../../api/leadApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const AddBanner = () => {
  const [apiRes, setApiRes] = useState({ loading: false, error: '' });
  const [errors, setErrors] = useState({});
  const navigateTo = useNavigate();
  const [occType, setOccType] = useState('');
  const [bannerName, setBannerName] = useState('');
  const [bdate, setBdate] = useState('');
  const [bannerImage, setBannerImage] = useState(null);

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
    const data = {
      type: occType,
      name: bannerName,
      date: bdate,
      file: bannerImage,
    };
    setApiRes({ loading: true, error: '' });
    try {
      const res = await addBanner(data);
      if (res.data.status) {
        console.log(res.data);
        toast.success(res.data.message);
        setApiRes({ loading: false, error: '' });
        navigateTo('/banner_list');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
      setApiRes({ loading: false, error: error.message });
    }
  }

  function getURL(obj) {
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

          <input type="date" value={bdate} onChange={(e) => setBdate(e.target.value)} placeholder="Select date" />
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

export default AddBanner;
