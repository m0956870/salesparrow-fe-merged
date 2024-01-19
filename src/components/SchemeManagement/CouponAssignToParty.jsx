import './CouponAssignToParty.css'
import React, { useState } from 'react'
import group from "../../images/group.png";

const CouponAssignToParty = () => {
    const [couponList, setcouponList] = useState([])

    const cardLength = [];
    for (let i = 1; i <= 100; i++) {
        cardLength.push(i);
    }

    const countClickFunc = (e) => {
        // console.log(couponList);

        if (!e.target.className.includes("clicked")) {
            e.target.className = "count clicked"
            if (couponList.includes(e.target.innerText)) {
                return;
            }
            setcouponList((couponList) => [...couponList, e.target.innerText])
        } else {
            e.target.className = "count"
            const filteredCount = couponList.filter(item => item !== e.target.innerText)
            setcouponList(filteredCount)
        }
    }

    // console.log(cardLength);
    console.log(couponList);
    return (
        <div className="container">
            <div className="beat_heading">
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">Coupon Assign To Party</div>
                </div>
            </div>

            <div className="tracking_tabs">
                <div className="tarcking_tab_left coupon">
                    <select name="city">
                        <option value="City">Party Type</option>
                        <option value="saab">Saab</option>
                        <option value="mercedes">Mercedes</option>
                        <option value="audi">Audi</option>
                    </select>
                    <select name="state">
                        <option value="State">Party Name</option>
                        <option value="saab">Saab</option>
                        <option value="mercedes">Mercedes</option>
                        <option value="audi">Audi</option>
                    </select>

                </div>
            </div>

            <div className="assign_container">
                <div className="assign_head">
                    <div className="head_div">
                        <div className="assign_heading">Point Earned :</div>
                        <div className="assign_detail">5,000</div>
                    </div>
                    <div className="head_div">
                        <div className="assign_heading">Total No. of Coupon :</div>
                        <div className="assign_detail">1,000</div>
                    </div>
                </div>
                <div className="assign_head">
                    <div className="head_div">
                        <div className="assign_heading">Remaining Coupon :</div>
                        <div className="assign_detail">500</div>
                    </div>
                    <div className="head_div">
                        <div className="assign_heading">Select Series</div>
                        <select className="assign_select" name="series">
                            <option value="1">1-100</option>
                        </select>
                    </div>
                </div>

                <div className="tarcking_tab_left coupon">
                    <input type="text" placeholder='First Coupon No.' />
                    <input type="text" placeholder='Last Coupon No.' />
                </div>
                <div className="grid_box">
                    {cardLength.map((i, item) => (
                        <span className="count" onClick={(e) => countClickFunc(e)}>
                            {item + 1}
                        </span>
                    ))}
                </div>
            </div>

            <div className="assign_btn">Assign</div>
        </div>
    )
}

export default CouponAssignToParty