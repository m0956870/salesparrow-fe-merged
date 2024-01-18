import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import group from "../../images/group.png";
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { AdminContext } from '../../App';
import { newPurchasePlan } from '../../api/subscriptionAPI';
import { CircularProgress } from '@mui/material';

const Plan = () => {
  const { state, dispatch } = useContext(AdminContext);
  console.log("state", state);
  const navigate = useNavigate();
  const { state: plan } = useLocation();
  console.log("location.state", plan);

  const [btnLoading, setbtnLoading] = useState(false)
  const [userCount, setUserCount] = useState();
  const [durationCount, setDurationCount] = useState(plan.billing_frequency === "monthly" ? 1 : 12);
  const [totalPayment, setTotalPayment] = useState(0);
  const [startDate, setstartDate] = useState(new Date().toLocaleDateString());
  const [endDate, setEndDate] = useState(new Date(new Date().setMonth(new Date(Date.now()).getMonth() + Number(durationCount))).toLocaleDateString())

  const purchasePlanFunc = async () => {
    if (!userCount) return toast.error("Please select users!");
    let finalObj = { companyID: state.result.id, plan, userCount, durationCount, totalPayment, startDate, endDate };

    setbtnLoading(true);
    let { data } = await newPurchasePlan(finalObj);
    if (data.status) {
      toast.success("Plan purchased successfully.");
      dispatch({ type: "ADMIN", payload: { result: { ...data.result.updatedAdmin, id: data.result.updatedAdmin._id } } });
      navigate("/purchased_plan");
    } else {
      toast.error("Some error!");
    }
    setbtnLoading(false);
  }

  useEffect(() => {
    console.log("userCount", userCount, typeof userCount, userCount > plan.minimum_user ? 0 : plan.discount)
  }, [userCount])


  return (
    <div className="container">
      <div className="beat_heading">
        <div className="beat_left">
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">{String(plan.plan_name).toUpperCase().split("_").join(" ")} ({String(plan.features).charAt(0).toUpperCase() + String(plan.features).slice(1)} Plan) </div>
        </div>
        <div className="beat_right">
        </div>
      </div>

      <div className="subs_plan_container">
        <div className="ems_head" style={{ padding: "1rem", borderRadius: "0.4rem", boxShadow: "var(--box-shadow)" }} >
          <div className="ems_head_left">
            <h1>{String(plan.features).charAt(0).toUpperCase() + String(plan.features).slice(1)} Plan</h1>
          </div>
          <div className="ems_head_right">
            <div className="right_head">
              <div className="left_head_title ems_head_price">Price</div>
            </div>
            <div className="right_head_title">
              <div className="big_price">₹{plan.cost_per_user_per_month || "0"}</div>
              <div style={{ fontSize: "0.8rem" }}>Per User/Per Month</div>
            </div>
          </div>
        </div>

        <div className="plan_input_container">
          <div className="input_section">
            <label>Number of Users</label>
            <input
              className='input'
              type="text"
              placeholder='0'
              value={userCount}
              onChange={(e) => {
                if (isNaN(e.target.value)) return;
                setUserCount(e.target.value);
                setTotalPayment((e.target.value * durationCount * plan.cost_per_user_per_month) - ((e.target.value * durationCount * plan.cost_per_user_per_month / 100) * (e.target.value >= plan.minimum_user ? plan.discount : 0)));
              }}
            />
            <label>Select Duration (Months)</label>
            <select
              className='plan_select'
              value={durationCount}
              onChange={(e) => {
                setDurationCount(e.target.value);
                setTotalPayment((userCount * e.target.value * plan.cost_per_user_per_month) - ((e.target.value * userCount * plan.cost_per_user_per_month / 100) * (userCount >= plan.minimum_user ? plan.discount : 0)));
                setEndDate(new Date(new Date().setMonth(new Date(Date.now()).getMonth() + Number(e.target.value))).toLocaleDateString());
              }}
            >
              {plan.billing_frequency === "monthly" && (
                <>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                </>
              )}
              < option value="12">12</option>
            </select>
          </div>

          {plan.discount !== "0" && (
            <div onClick={() => console.log(plan.discount, typeof plan.discount)} className="discount_section">
              <svg className='svg' xmlns='http://www.w3.org/2000/svg' viewBox='-97 0 256 256' fill='orange' width='256'>
                <path d='M48 240 L48 16 L32 0 L16 16 L16 240 L32 256 Z' />
                <path d='M48 240 L48 16 L32 0 L16 16 L16 240 L32 256 Z' />
                <path d='M48 240 L48 16 L32 0 L16 16 L16 240 L32 256 Z' />
                <path d='M48 240 L48 16 L32 0 L16 16 L16 240 L32 256 Z' />
                <path d='M48 240 L48 16 L32 0 L16 16 L16 240 L32 256 Z' />
                <path d='M48 240 L48 16 L32 0 L16 16 L16 240 L32 256 Z' />
                <path d='M48 240 L48 16 L32 0 L16 16 L16 240 L32 256 Z' />
                <path d='M48 240 L48 16 L32 0 L16 16 L16 240 L32 256 Z' />
                <path d='M48 240 L48 16 L32 0 L16 16 L16 240 L32 256 Z' />
                <path d='M48 240 L48 16 L32 0 L16 16 L16 240 L32 256 Z' />
                <path d='M48 240 L48 16 L32 0 L16 16 L16 240 L32 256 Z' />
              </svg>
              <div className="svg_get">GET</div>
              <div className="svg_discount">{plan.discount}%</div>
              <div className="svg_discount_title">Discount</div>
              <div className="svg_min_user">Minimum {plan.minimum_user} users</div>
            </div>
          )}
        </div>

        <div className="ems_head" style={{ marginBottom: "-1rem", padding: "0 1rem", color: "#000", background: "#f9f9fa" }} >
          <div className="ems_head_left">
            <div className="left_head">
              <div className="left_head_title">Start Date</div>
              <div>{startDate}</div>
            </div>
            <div className="left_head">
              <div className="left_head_title">End Date</div>
              <div>{endDate}</div>
            </div>
            <div className="left_head">
              <div className="left_head_title">Duration</div>
              <div>{`${durationCount} Months`}</div>
            </div>
            <div className="left_head">
              <div className="left_head_title">Users</div>
              <div>{userCount}</div>
            </div>
          </div>
          <div className="ems_head_right">
            <div className="right_head">
            </div>
            <div className="right_head_title">
            </div>
          </div>
        </div>

        <div className="ems_head" style={{ padding: "1rem", borderRadius: "0.4rem", boxShadow: "var(--box-shadow)" }} >
          <div className="ems_head_left">
            <h2>{userCount || 0} users * {durationCount} months * {plan.cost_per_user_per_month} - {(userCount >= plan.minimum_user ? plan.discount : 0)}%</h2>
          </div>
          <div className="ems_head_right">

            <div className="right_head_title">
              <div style={{ fontSize: "0.8rem" }}>Total Payment</div>
              <div className="big_price">₹{totalPayment}</div>
            </div>
          </div>
        </div>
        <div
          className="plan_purchase_btn"
          onClick={() => !btnLoading && purchasePlanFunc()}
        >
          {btnLoading ? (
            <CircularProgress style={{ color: "#fff" }} size={26} />
          ) : (
            "PAY NOW"
          )}
        </div>
      </div>
    </div >
  )
}

export default Plan