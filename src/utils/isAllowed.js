import { toast } from "react-toastify";
import getProfile from "../api/auth";

async function isAllowed(module) {
    let { data } = await getProfile();
    let company = data.result[0];
    let { sfa, demo_control } = company;

    if (demo_control.startDate && demo_control.endDate) {
        if (notExpired(company, "demo_control")) {
            return isIncludedFunc(company, "demo_control", module);
        }
    } else if (sfa.startDate && sfa.endDate) {
        if (notExpired(company, "sfa")) {
            return isIncludedFunc(company, "sfa", module);
        }
    } else {
        if(!sfa.billed) return true;
        return false;
    }
}

function notExpired(company, type) {
    let date = new Date().getTime();
    let startDate = new Date(company[type].startDate).getTime();
    let endDate = new Date(company[type].endDate).getTime();
    if (startDate < date && endDate > date) {
        return true;
    }
    return false;
}

function isIncludedFunc(company, type, module) {
    if (company[type].plan.feature_includes.includes(module)) {
        return true;
    } else {
        return false;
    }
}


export default isAllowed;

// let allPermissions = [
//     "Live Dashboard",          ---------------------
//     "Live Tracking",
// --    "Team Location",
//     "Beat & Route Management", --------------------
//     "Employee Management",     ---------------------
//     "Party Management",        -------------------
//     "Attendance & Expanse Report" -----------------,
//     "Product Management",      ------------------------
//     "Primary Order Management", -----------------
//     "Secondary Order Manahement", ------------------
//     "Multiple Price List", --------------------------
//     "View & Generate invoice", ------------------
// --    "Team Dashboard",
//     "Dynamic report",          ------------------
//     "View Catalogue",
//     "Collection Management", -------------------

//     "Scheme Management",
//     "Create Target Scheme",
//     "Create Coupons",
//     "Live Lucky Draw",
//     "Achieved Price Management",
//     "Pending Price Management",
//     "Delivered Price Management"
// ]