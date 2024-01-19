import "./PurchasedPlan.css";
import React, { useContext, useEffect, useState } from "react";
import group from "../../images/group.png";
import { Button, CircularProgress } from "@mui/material";
import { fetchPurchasePlan } from "../../api/subscriptionAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../App";

const PurchasedPlan = () => {
  const navigate = useNavigate();
  const { state } = useContext(AdminContext);
  // console.log("state", state)

  const [sfaPlan, setsfaPlan] = useState();
  const [dmsPlan, setdmsPlan] = useState();
  const [leadManagementPlan, setleadManagementPlan] = useState();

  const [plan, setplan] = useState();

  useEffect(() => {
    getPurchasePlan();
  }, [])

  useEffect(() => {
    if (state) {
      if (new Date(state.result.sfa?.endDate) > new Date()) setsfaPlan(state.result.sfa);
      if (new Date(state.result.dms?.endDate) > new Date()) setdmsPlan(state.result.dms);
      if (new Date(state.result.lead_management?.endDate) > new Date()) setleadManagementPlan(state.result.lead_management);
    }
  }, [state])
  console.log("sfaPlan", sfaPlan);
  console.log("dmsPlan", dmsPlan);
  console.log("leadManagementPlan", leadManagementPlan);

  const getPurchasePlan = async () => {
    let res = await fetchPurchasePlan();
    if (res.data.status) {
      setplan(res.data.result);
    }
  }

  const dateFormat = (date) => {
    return new Date(date).toLocaleDateString();
  }

  return (
    <>
      <div className="container">
        <div className="beat_heading">
          <div className="beat_left">
            <div className="icon">
              <img src={group} alt="icon" />
            </div>
            <div className="title">Purchased Plan</div>
          </div>
        </div>

        {!plan ? (
          <div style={{ margin: "auto", padding: "4rem 0" }}>
            <CircularProgress />
          </div>
        ) : (
          <>
            {sfaPlan && (
              <>
                <h2 style={{ textAlign: "center" }}>Sales Force Automation (SFA)</h2>
                <div className="plan_tracking_tabs">
                  <div className="ems_head">
                    <div className="ems_head_left">
                      <div className="left_head">
                        <div className="left_head_title">Start Date</div>
                        <div>{sfaPlan.startDate}</div>
                      </div>
                      <div className="left_head">
                        <div className="left_head_title">End Date</div>
                        <div>{sfaPlan.endDate}</div>

                      </div>
                      <div className="left_head">
                        <div className="left_head_title">Duration</div>
                        <div>{`${sfaPlan?.durationCount} Months`}</div>
                      </div>
                      <div className="left_head">
                        <div className="left_head_title">Employee Users</div>
                        <div>{sfaPlan?.userCount}</div>
                      </div>
                    </div>
                    <div className="ems_head_right">
                      <div className="right_head">
                        <div className="left_head_title ems_head_price">Price</div>
                      </div>
                      <div className="right_head_title">
                        <div className="big_price">₹{sfaPlan.plan.cost_per_user_per_month || "0"}</div>
                        <div style={{ fontSize: "0.8rem" }}>Per User/Per Month</div>
                      </div>
                    </div>
                  </div>
                  <div className="ems_body">
                    <div className="modules_covered">Modules Covered</div>
                    <div className="ems_body_details">
                      <div className="modules">
                        <div className="modules_list">
                          <ol>
                            {sfaPlan.plan.feature_includes?.map((item) => (
                              <li>{item}</li>
                            ))}
                          </ol>
                        </div>
                        <div className="modules_name">{sfaPlan.plan.features?.toUpperCase()}</div>
                      </div>
                      <div className="upgrade">
                        <Button
                          style={{ background: "var(--main-color)" }}
                          variant="contained"
                          size="large"
                          onClick={() => navigate("/subscription")}
                        >
                          RENEW/UPGRADE
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {dmsPlan && (
              <>
                <h2 style={{ textAlign: "center", marginTop: "2rem" }}>Distributor Management System (DMS)</h2>
                <div className="plan_tracking_tabs" style={{ marginBottom: "2rem" }}>
                  <div className="ems_head" style={{ background: "#4eb548" }}>
                    <div className="ems_head_left">
                      <div className="left_head">
                        <div className="left_head_title">Start Date</div>
                        <div>{dmsPlan.startDate}</div>
                      </div>
                      <div className="left_head">
                        <div className="left_head_title">End Date</div>
                        <div>{dmsPlan.endDate}</div>

                      </div>
                      <div className="left_head">
                        <div className="left_head_title">Duration</div>
                        <div>{`${dmsPlan?.durationCount} Months`}</div>
                      </div>
                      <div className="left_head">
                        <div className="left_head_title">Employee Users</div>
                        <div>{dmsPlan?.userCount}</div>
                      </div>
                    </div>
                    <div className="ems_head_right">
                      <div className="right_head">
                        <div className="left_head_title ems_head_price">Price</div>
                      </div>
                      <div className="right_head_title">
                        <div className="big_price">₹{dmsPlan.plan.cost_per_user_per_month || "0"}</div>
                        <div style={{ fontSize: "0.8rem" }}>Per User/Per Month</div>
                      </div>
                    </div>
                  </div>
                  <div className="ems_body">
                    <div className="modules_covered"></div>
                    <div className="ems_body_details">
                      <div className="modules">
                        {/* <div className="modules_list">
                          <ol>
                            <li>Tracking</li>
                            <li>Sales Force Automation</li>
                            <li>Schema Management</li>
                            <li>Lead Management</li>
                          </ol>
                        </div>
                        <div className="modules_name">BASIC</div> */}
                      </div>
                      <div className="upgrade">
                        <Button
                          style={{ background: "var(--main-color)" }}
                          variant="contained"
                          size="large"
                          onClick={() => navigate("/subscription")}
                        >
                          RENEW/UPGRADE
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {leadManagementPlan && (
              <>
                <h2 style={{ textAlign: "center", marginTop: "2rem" }}>Lead Management</h2>
                <div className="plan_tracking_tabs" style={{ marginBottom: "2rem" }}>
                  <div className="ems_head" style={{ background: "#a6192e" }}>
                    <div className="ems_head_left">
                      <div className="left_head">
                        <div className="left_head_title">Start Date</div>
                        <div>{leadManagementPlan.startDate}</div>
                      </div>
                      <div className="left_head">
                        <div className="left_head_title">End Date</div>
                        <div>{leadManagementPlan.endDate}</div>

                      </div>
                      <div className="left_head">
                        <div className="left_head_title">Duration</div>
                        <div>{`${leadManagementPlan?.durationCount} Months`}</div>
                      </div>
                      <div className="left_head">
                        <div className="left_head_title">Employee Users</div>
                        <div>{leadManagementPlan?.userCount}</div>
                      </div>
                    </div>
                    <div className="ems_head_right">
                      <div className="right_head">
                        <div className="left_head_title ems_head_price">Price</div>
                      </div>
                      <div className="right_head_title">
                        <div className="big_price">₹{leadManagementPlan.plan.cost_per_user_per_month || "0"}</div>
                        <div style={{ fontSize: "0.8rem" }}>Per User/Per Month</div>
                      </div>
                    </div>
                  </div>
                  <div className="ems_body">
                    <div className="modules_covered"></div>
                    <div className="ems_body_details">
                      <div className="modules">
                        {/* <div className="modules_list">
                          <ol>
                            <li>Tracking</li>
                            <li>Sales Force Automation</li>
                            <li>Schema Management</li>
                            <li>Lead Management</li>
                          </ol>
                        </div>
                        <div className="modules_name">BASIC</div> */}
                      </div>
                      <div className="upgrade">
                        <Button
                          style={{ background: "var(--main-color)" }}
                          variant="contained"
                          size="large"
                          onClick={() => navigate("/subscription")}
                        >
                          RENEW/UPGRADE
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}


      </div>
    </>
  );
};

export default PurchasedPlan;