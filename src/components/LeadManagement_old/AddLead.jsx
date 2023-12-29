import React, { useState } from "react";
import group from "../../images/group.png";

const AddLard = () => {
  return (
    <div className="container">
      <div className="beat_heading">
        <div className="beat_left">
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Add New Lead (Manual)</div>
        </div>
        <div className="beat_right">
          <div
            className="add_btn"
            // onClick={() => navigate("/add_lead")}
          >
            Add New
          </div>
        </div>
      </div>

      <div className="subadmin_container">
        <div className="subadmin_form">
          <div className="right">
            <div className="input_form">
              <input
                type="text"
                name="company_name"
                // value={user.company_name}
                // onChange={handleInput}
                placeholder="Lead Name"
              />
              <input
                type="text"
                name="email"
                // value={user.email}
                // onChange={handleInput}
                placeholder="Mobile Number"
              />
              <input
                type="text"
                name="phone"
                // value={user.phone}
                // onChange={handleInput}
                placeholder="Pincode"
              />
              <select name="city">
                <option value="District">District</option>
                <option value="saab">Saab</option>
                <option value="mercedes">Mercedes</option>
                <option value="audi">Audi</option>
              </select>
              <select name="city">
                <option value="Role">Lead Source</option>
                <option value="saab">Saab</option>
                <option value="mercedes">Mercedes</option>
                <option value="audi">Audi</option>
              </select>
              <input
                type="text"
                name="phone"
                // value={user.phone}
                // onChange={handleInput}
                placeholder="Note"
              />
              <div className="btn changepass_btn"
              style={{width:"50%", margin:"1rem 0", textAlign:"center"}}
              >SAVE</div>
            </div>
          </div>
          <div className="right">
            <div className="input_form">
              <input
                type="text"
                name="company_name"
                // value={user.company_name}
                // onChange={handleInput}
                placeholder="Display Name"
              />
              <input
                type="text"
                name="email"
                // value={user.email}
                // onChange={handleInput}
                placeholder="Email ID"
              />
              <select name="city">
                <option value="Role">State</option>
                <option value="saab">Saab</option>
                <option value="mercedes">Mercedes</option>
                <option value="audi">Audi</option>
              </select>
              <select name="city">
                <option value="Role">City</option>
                <option value="saab">Saab</option>
                <option value="mercedes">Mercedes</option>
                <option value="audi">Audi</option>
              </select>

              <input
                type="text"
                name="phone"
                // value={user.phone}
                // onChange={handleInput}
                placeholder="Add by Admin/Employee"
              />
              <select name="city">
                <option value="Role">Assign to Employee</option>
                <option value="saab">Saab</option>
                <option value="mercedes">Mercedes</option>
                <option value="audi">Audi</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLard;
