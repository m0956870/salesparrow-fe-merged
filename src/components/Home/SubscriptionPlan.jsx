import "./SubscriptionPlan.css"
import React, { useState, useEffect } from "react";
import group from "../../images/group.png";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import fetchAllPlans, { purchasePlan } from "../../api/subscriptionAPI";
import { CircularProgress } from "@mui/material";
import { Dialog, DialogActions, DialogTitle, DialogContent, } from "@mui/material";

const SubscriptionPlan = () => {
    const navigate = useNavigate()
    const [isLoading, setisLoading] = useState(false);

    const [allSubsOffer, setallSubsOffer] = useState([])

    const [deletePopup, setdeletePopup] = useState(false);
    const [currentGroup, setcurrentGroup] = useState({});

    const [emsbtnLoading, setemsbtnLoading] = useState(false)
    const [dmsbtnLoading, setdmsbtnLoading] = useState(false)
    const [modelbtnLoading, setmodelbtnLoading] = useState(false)

    const [moduleArr, setmoduleArr] = useState([])
    const [emsTotal, setemsTotal] = useState(0)

    const [emsPlan, setemsPlan] = useState({
        users: 20,
        duration: 6,
        price: 400
    })

    const [dmsPlan, setdmsPlan] = useState({
        users: 20,
        duration: 6,
        price: 100
    })

    const emsHandleInput = (e) => {
        setemsPlan({ ...emsPlan, [e.target.name]: e.target.value })
    }
    const dmsHandleInput = (e) => {
        setdmsPlan({ ...dmsPlan, [e.target.name]: e.target.value })
    }

    let colorArray = [
        { name: "basic", main: "#981D50", secondary: "#891A48" },
        { name: "standard", main: "#4267B2", secondary: "#3B5CA0" },
        { name: "premium", main: "#333333", secondary: "#2E2E2E" },
        { name: "executive", main: "#5F0A88", secondary: "#55097A" }
    ]

    let customModules = [
        {
            module: "Tracking",
            detail: "₹150 / Employee / Month",
        },
        {
            module: "Sales Force Automation",
            detail: "₹250 / Employee / Month",
        },
        {
            module: "Scheme Management",
            detail: "₹250 / Employee / Month",
        },
        {
            module: "Lead Management",
            detail: "₹250 / Employee / Month",
        },
    ]

    const purchaseOfferFunc = async (plan) => {
        // console.log(plan);

        let data = {
            type: plan.type,
            ems: {
                duration: plan.ems.duration,
                modules: plan.ems.modules,
                price: plan.ems.price,
                totalPrice: (plan.ems.price * plan.ems.minUsers * plan.ems.duration),
                users: plan.ems.minUsers
            }
        }
        // console.log(data);
        try {
            let res = await purchasePlan(data)
            console.log(res);
            if (res.data.status) {
                navigate("/purchased_plan")
            }
        } catch (error) {
            console.log(error);
        }
    }

    const planClicked = async (e, module) => {
        // console.log(moduleArr);

        let price = module.detail.slice(1, 4)
        // console.log(price);

        if (!moduleArr.includes(module.module)) {
            moduleArr.push(module.module)
            setemsTotal(emsTotal + parseInt(price))
        } else {
            let filterArr = moduleArr.filter((item) => item !== module.module)
            setmoduleArr(filterArr)
            setemsTotal(emsTotal - parseInt(price))
        }
    }

    const emsPayBtn = async () => {
        // console.log(moduleArr);
        let { users, duration, price } = emsPlan
        if (moduleArr.length === 0) return toast.error("Plase Select Modules First!")
        if (users < 1) return toast.error("Choose employee users count first!")

        let emsData = {
            type: "custom",
            ems: {
                duration: parseInt(duration),
                modules: moduleArr,
                price: emsTotal,
                totalPrice: users * duration * emsTotal,
                users
            }
        }
        // console.log(emsData);


        try {
            setemsbtnLoading(true)
            let res = await purchasePlan(emsData)
            // console.log(res);
            if (res.data.status) {
                navigate("/purchased_plan")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const dmsPayBtn = async () => {
        // console.log(moduleArr);
        let { users, duration, price } = dmsPlan
        if (users < 1) return toast.error("Choose distributor users count first!")

        let dmsData = {
            type: "custom",
            dms: {
                duration: parseInt(duration),
                price,
                totalPrice: users * duration * price,
                users
            }
        }
        // console.log(dmsData);

        try {
            setdmsbtnLoading(true)
            let res = await purchasePlan(dmsData)
            // console.log(res);
            if (res.data.status) {
                navigate("/purchased_plan")
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deleteBeatFunc = async () => {
        // console.log(currentGroup);
        try {
            setmodelbtnLoading(true)
            purchaseOfferFunc(currentGroup)
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setisLoading(true)
        fetchAllPlans().then(res => {
            setallSubsOffer(res.data.result);
            setisLoading(false)
        }).catch((err) => console.log(err))
    }, [])

    // console.log(emsTotal);


    return (
        <div className="container">
            <div className="beat_heading">
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">Subscription Plan</div>
                </div>
            </div>

            {isLoading ? (
                <div
                    style={{
                        margin: "auto",
                        padding: "4rem 0"
                    }}
                >
                    <CircularProgress />
                </div>
            ) : (
                <>
                    {/* Subscription Offers */}
                    < div id="subscription_offers">
                        {allSubsOffer?.map((plan, i) => (
                            <div className="offer_card" style={{ background: colorArray[i].main }}>
                                <div className="offer_left" style={{ background: colorArray[i].secondary }} >
                                    <div className="type">{plan.type.toUpperCase()}</div>
                                    <div className="price_div">
                                        <div className="mrp">₹{plan.ems.mrp}</div>
                                        <div className="price">₹{plan.ems.price}</div>
                                    </div>
                                    <div className="user_per_month">
                                        Per User/Per Month
                                    </div>
                                    <div className="duration" >Billed Annually</div>
                                </div>
                                <div className="offer_right">
                                    <div className="offer_right_head">
                                        <div className="modules">
                                            <div className="module_head">
                                                Modules to be covered
                                            </div>
                                            <ul>
                                                {/* <li>Tracking</li> */}
                                                {plan.ems.modules.map((module) => (
                                                    <li>{module}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="count_section">
                                            <div className="min_users">
                                                <div className="title" style={{ color: `${colorArray[i].main}` }} >Minimum Users</div>
                                            </div>
                                            <div className="user_count" style={{ border: `2px solid ${colorArray[i].main}`, color: `${colorArray[i].main}` }} >{plan.ems.minUsers}</div>
                                        </div>
                                    </div>
                                    <div className="subs_btn">
                                        <div className="subscribe"
                                            //  onClick={() => purchaseOfferFunc(plan)} 
                                            onClick={() => {
                                                setdeletePopup(true);
                                                setcurrentGroup(plan);
                                            }}
                                        >
                                            Subscribe
                                            {/* <CircularProgress size={16} style={{color:"#fff"}} /> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Customise Plan */}
            <div id="customise_plan">
                <div className="beat_heading">
                    <div className="beat_left">
                        <div className="icon">
                            <img src={group} alt="icon" />
                        </div>
                        <div className="title">Customise Your Plan</div>
                    </div>
                </div>
                <div id="plan_table">
                    <div className="plan_column modules_column">Modules</div>
                    {customModules.map((item) => (
                        <div className="plan_column custom_modules">
                            <div className="plan_module_name">{item.module}</div>
                            <div className="module_detail">{item.detail}</div>
                            <input className="module_checkbox" type="checkbox" onChange={(e) => planClicked(e, item)} />
                        </div>
                    ))}

                    <div className="plan_column ems_details">₹{emsTotal} Per User/Per Month</div>
                    <div className="plan_column column_2">
                        <div className="column_2_left" >
                            <div className="no_of_user">No. of Employees app users</div>
                            <input type="number" placeholder="20" name="users" value={emsPlan.users} onChange={emsHandleInput} />
                        </div>
                        <div className="all_details">Rs. {emsTotal}*{emsPlan.users || 0} Users* {emsPlan.duration || 6} Months</div>
                    </div>
                    <div className="plan_column column_2">
                        <div className="column_2_left" >
                            <div className="no_of_user">Select Duration (Months)</div>
                            <select name="duration" value={emsPlan.duration} onChange={emsHandleInput}  >
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                                <option value={6}>6</option>
                                <option value={7}>7</option>
                                <option value={8}>8</option>
                                <option value={9}>9</option>
                                <option value={10}>10</option>
                                <option value={11}>11</option>
                                <option value={12}>12</option>
                            </select>
                        </div>
                        <div className="all_details">
                            <button className="total_rs_btn">Rs. {emsTotal * emsPlan.users * emsPlan.duration}</button>
                            <button className="pay_now" onClick={() => emsPayBtn()} >
                                {emsbtnLoading ? (
                                    <CircularProgress style={{ color: "#fff" }} size={16} />
                                ) : (
                                    "PAY NOW"
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="plan_column dms_details">Distributor Management System</div>
                    <div className="plan_column column_2">
                        <div className="column_2_left" >
                            <div className="no_of_user">Distributor App Users</div>
                            <input type="number" placeholder="20" name="users" value={dmsPlan.users} onChange={dmsHandleInput} />
                        </div>
                        <div className="all_details">Rs. {dmsPlan.price || 100}*{dmsPlan.users || 0} Users* {dmsPlan.duration} Months</div>
                    </div>
                    <div className="plan_column column_2">
                        <div className="column_2_left" >
                            <div className="no_of_user">Select Duration (Months)</div>
                            <select name="duration" value={dmsPlan.duration} onChange={dmsHandleInput}  >
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                                <option value={6}>6</option>
                                <option value={7}>7</option>
                                <option value={8}>8</option>
                                <option value={9}>9</option>
                                <option value={10}>10</option>
                                <option value={11}>11</option>
                                <option value={12}>12</option>
                            </select>
                        </div>
                        <div className="all_details">
                            <button className="total_rs_btn">Rs. {dmsPlan.price * dmsPlan.users * dmsPlan.duration}</button>
                            <button className="pay_now" onClick={() => dmsPayBtn()} >
                                {dmsbtnLoading ? (
                                    <CircularProgress style={{ color: "#fff" }} size={16} />
                                ) : (
                                    "PAY NOW"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog
                open={deletePopup}
                aria-labelledby="form-dialog-title"
                maxWidth="xs"
                onClose={() => setdeletePopup(false)}
            >
                <DialogTitle className="dialog_title">
                    <div>Do you want to buy {currentGroup?.type?.toUpperCase()} plan?</div>
                </DialogTitle>
                <DialogContent className="cardpopup_content">
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div
                            className="employee_gl_popup"
                            style={{ cursor: "pointer" }}
                            onClick={() => deleteBeatFunc()}
                        >
                            {modelbtnLoading ? (
                                <CircularProgress style={{ color: "#fff" }} size={20} />
                            ) : (
                                "SUBSCRIBE"
                            )}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions></DialogActions>
            </Dialog>
        </div >
    )
}

export default SubscriptionPlan