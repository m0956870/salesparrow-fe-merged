import "./Employees.css";
import React, { useState } from "react";
import group from "../../images/group.png";
import SearchIcon from "@mui/icons-material/Search";
import { useLocation } from "react-router-dom";

import { HiOutlineLink } from "react-icons/hi";

const EmployeeTarget = () => {
  const location = useLocation();
  // console.log(location.state);

  const [beat, setbeat] = useState({
    name: (location.state && location.state.name) || "",
    state: (location.state && location.state.state) || "",
    city: (location.state && location.state.city) || "",
    pincode: (location.state && location.state.pincode) || "",
    district: (location.state && location.state.district) || "",
    area: (location.state && location.state.area) || "",
  });

  const handleInput = (e) => {
    setbeat({ ...beat, [e.target.name]: e.target.value });
  };

  const addBeatFunc = () => {
    console.log(beat);
  };
  const editBeatFunc = () => {
    console.log(beat);
  };

  return (
    <div className="container">
      <div className="beat_heading">
        <div className="beat_left">
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Good Return Details</div>
        </div>
        <div className="beat_right">
          <div className="search">
            <SearchIcon style={{ color: `var(--main-color)` }} />
            <input type="text" placeholder="Search" />
          </div>
        </div>
      </div>

      <div className="addbeat_container" style={{ padding: "2rem 3rem" }}>
        <div className="gd_form">
          <div className="gd_left">
            <div className="good_detail">
              <select name="city">
                <option value="City">Category</option>
                <option value="saab">Saab</option>
                <option value="mercedes">Mercedes</option>
                <option value="audi">Audi</option>
              </select>
              <select name="city">
                <option value="City">Distributor Name</option>
                <option value="saab">Saab</option>
                <option value="mercedes">Mercedes</option>
                <option value="audi">Audi</option>
              </select>
              <select name="city">
                <option value="City">Amount</option>
                <option value="saab">Saab</option>
                <option value="mercedes">Mercedes</option>
                <option value="audi">Audi</option>
              </select>
              <input
                type="date"
                name="phone"
                // value={user.phone}
                // onChange={handleInput}
                placeholder="Company Address"
              />

              <select name="city">
                <option value="State">Salseman</option>
                <option value="saab">Saab</option>
                <option value="mercedes">Mercedes</option>
                <option value="audi">Audi</option>
              </select>
            </div>
          </div>
          <div className="gd_right">
            <div className="good_detail">
              <input
                type="text"
                name="company_name"
                // value={user.company_name}
                // onChange={handleInput}
                placeholder="Product"
              />
              <input
                type="text"
                name="email"
                // value={user.email}
                // onChange={handleInput}
                placeholder="Returned Quantity"
              />
              <input
                type="text"
                name="phone"
                // value={user.phone}
                // onChange={handleInput}
                placeholder="Order invoice"
              />

              <input
                type="text"
                name="phone"
                // value={user.phone}
                // onChange={handleInput}
                placeholder="Return Reason"
              />
              <input
                type="text"
                name="phone"
                // value={user.phone}
                // onChange={handleInput}
                placeholder="Depriciation"
              />
            </div>
          </div>
        </div>

        <textarea
          name=""
          id=""
          cols="30"
          rows="8"
          placeholder="Description"
          style={{ marginTop: "1rem" }}
        ></textarea>
        <a style={{ alignSelf: "flex-start" }} className="dialog_link" href="#">
          Attach Image <HiOutlineLink />
        </a>
        {location.state === null ? (
          <div onClick={() => addBeatFunc()} className="btn changepass_btn">
            RETURN GOOD
          </div>
        ) : (
          <div onClick={() => editBeatFunc()} className="btn changepass_btn">
            RETURN GOOD
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeTarget;
