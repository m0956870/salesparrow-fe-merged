import "./Subscription.css";
import React, { useEffect, useState } from 'react';
import group from "../../images/group.png";
import { getAllPlans } from '../../api/subscriptionAPI';
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const Subscription = () => {
    const navigate = useNavigate();
    const [isLoading, setisLoading] = useState(false);
    const [activeTab, setactiveTab] = useState("sfa");
    const [planData, setPlanData] = useState();

    // let planArr = [
    //     { plan_name: "sfa", features: "basic" },
    //     { plan_name: "sfa", features: "standard" },
    //     { plan_name: "sfa", features: "premium" },
    // ];

    useEffect(() => {
        getAllPlansFunc();
    }, [])
    // console.log("planData", planData);

    const getAllPlansFunc = async () => {
        setisLoading(true);
        let { data } = await getAllPlans();
        if (data.status) {
            data.data.sfa = [];
            data.data.map(plan => {
                if (plan.plan_name === "sfa") data.data.sfa.push(plan);
                if (plan.plan_name === "dms") data.data.dms = plan;
                if (plan.plan_name === "lead_management") data.data.lead_management = plan;
            })
            setPlanData(data.data);
        } else {
            console.log(data.messaage);
        }
        setisLoading(false);
    }

    const navigateToPlanFunc = (plan) => {
        navigate("/subscription_plan", { state: plan });
    }

    return (
        <>
            <div className="container">
                <div className="beat_heading">
                    <div className="beat_left">
                        <div className="icon">
                            <img src={group} alt="icon" />
                        </div>
                        <div className="title">Subscription Plans</div>
                    </div>
                    <div className="beat_right">

                    </div>
                </div>

                <div className="lm_content_tab_container">
                    <div className="lm_content_tab_wrapper" >
                        <div onClick={() => setactiveTab("sfa")} className={`tabs ${activeTab === "sfa" ? "active" : ""}`} >
                            SFA
                        </div>
                        {/* <div onClick={() => setactiveTab("dms")} className={`tabs ${activeTab === "dms" ? "active" : ""}`} > */}
                        <div onClick={() => navigateToPlanFunc(planData?.dms)} className={`tabs ${activeTab === "dms" ? "active" : ""}`} >
                            DMS
                        </div>
                        {/* <div onClick={() => setactiveTab("lead management")} className={`tabs ${activeTab === "lead management" ? "active" : ""}`} > */}
                        <div onClick={() => navigateToPlanFunc(planData?.lead_management)} className={`tabs ${activeTab === "lead management" ? "active" : ""}`} >
                            Lead Management
                        </div>
                    </div>
                </div>


                {activeTab === "sfa" && (
                    < div className="all_sfa_plan_section">
                        {isLoading ? (
                            <div style={{ margin: "auto", }} >
                                <CircularProgress />
                            </div>
                        ) : (
                            <>
                                {planData?.sfa?.map(plan => (
                                    <>
                                        {plan.features === "basic" && (
                                            <div className="relative_div">
                                                <div className="sfa_plan_container" style={{ backgroundColor: "#801642" }}>
                                                    <div className="sfa_discount">{plan.discount}%</div>
                                                    <div className="sfa_min_user">Discount minimum {plan.minimum_user} user</div>
                                                    <div className="sfa_cost_per_month">₹{plan.cost_per_user_per_month}</div>
                                                    <div>per month</div>
                                                    <div className="sfe_feature_section" style={{ background: "rgb(115,19,59)", background: "linear-gradient(183deg, rgba(115,19,59,1) 0%, rgba(128,22,66,1) 99%)" }} >
                                                        <div className="sfa_feature_title">{plan.features}</div>
                                                        <div className="sfa_features_incldes">
                                                            {plan.feature_includes.map(feature => (
                                                                <div className="sfa_feature" >✔ {feature}</div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="sfa_subscribe_btn" onClick={() => navigateToPlanFunc(plan)}>Subscribe</div>
                                            </div>
                                        )}
                                    </>
                                ))}
                                {planData?.sfa?.map(plan => (
                                    <>
                                        {plan.features === "standard" && (
                                            <div className="relative_div">
                                                <div className="sfa_plan_container" style={{ backgroundColor: "#1c3f87" }}>
                                                    <div className="sfa_discount">{plan.discount}%</div>
                                                    <div className="sfa_min_user">Discount minimum {plan.minimum_user} user</div>
                                                    <div className="sfa_cost_per_month">₹{plan.cost_per_user_per_month}</div>
                                                    <div>per month</div>
                                                    <div className="sfe_feature_section" style={{ background: "rgb(25,56,121)", background: "linear-gradient(183deg, rgba(25,56,121,1) 0%, rgba(28,63,135,1) 99%)" }} >
                                                        <div className="sfa_feature_title">{plan.features}</div>
                                                        <div className="sfa_features_incldes">
                                                            <div className="sfa_feature" >✔ All Basic Plan</div>
                                                            {plan.feature_includes.slice(7, plan.feature_includes.length).map(feature => (
                                                                <div className="sfa_feature" >✔ {feature}</div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="sfa_subscribe_btn" onClick={() => navigateToPlanFunc(plan)}>Subscribe</div>
                                            </div>
                                        )}
                                    </>
                                ))}
                                {planData?.sfa?.map(plan => (
                                    <>
                                        {plan.features === "premium" && (
                                            <div className="relative_div">
                                                <div className="sfa_plan_container" style={{ backgroundColor: "#2a2828" }}>
                                                    <div className="sfa_discount">{plan.discount}%</div>
                                                    <div className="sfa_min_user">Discount minimum {plan.minimum_user} user</div>
                                                    <div className="sfa_cost_per_month">₹{plan.cost_per_user_per_month}</div>
                                                    <div>per month</div>
                                                    <div className="sfe_feature_section" style={{ backgroundColor: "#252424" }} >
                                                        <div className="sfa_feature_title">{plan.features}</div>
                                                        <div className="sfa_features_incldes">
                                                            <div className="sfa_feature" >✔ All Standard Plan</div>
                                                            {plan.feature_includes.slice(16, plan.feature_includes.length).map(feature => (
                                                                <div className="sfa_feature" >✔ {feature}</div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="sfa_subscribe_btn" onClick={() => navigateToPlanFunc(plan)}>Subscribe</div>
                                            </div>
                                        )}
                                    </>
                                ))}
                            </>
                        )}
                    </div>
                )}
                {activeTab === "dms" && (
                    <div>dms</div>
                )}
                {activeTab === "lead management" && (
                    <div>lead management</div>
                )}
            </div >
        </>
    )
}

export default Subscription