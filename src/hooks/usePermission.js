import { useContext, useEffect } from "react";
import { AdminContext } from "../App";
import { useState } from "react";

const usePermission = (module) => {
    const { state } = useContext(AdminContext);
    const [stateLoaded, setstateLoaded] = useState();
    const [permissionAllowed, setpermissionAllowed] = useState();

    useEffect(() => {
        if (state) permissionAllowedFunc(state);
    }, [state])

    function permissionAllowedFunc({ result: company }) {
        console.log("company", company);
        let { sfa, demo_control } = company;

        if (demo_control.startDate && demo_control.endDate) {
            if (notExpired(company, "demo_control")) {
                isIncludedFunc(company, "demo_control", module, stateLoaded, setstateLoaded, permissionAllowed, setpermissionAllowed);
            }
        } else if (sfa.startDate && sfa.endDate) {
            if (notExpired(company, "sfa")) {
                isIncludedFunc(company, "sfa", module, stateLoaded, setstateLoaded, permissionAllowed, setpermissionAllowed);
            }
        } else {
        }
    }
    return { stateLoaded, permissionAllowed };
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

function isIncludedFunc(company, type, module, stateLoaded, setstateLoaded, permissionAllowed, setpermissionAllowed) {
    if (company[type].plan.feature_includes.includes(module)) {
        setstateLoaded(true);
        setpermissionAllowed(true);
    } else {
        setstateLoaded(true);
        setpermissionAllowed(false);
    }
    return { stateLoaded, permissionAllowed };
}


export default usePermission;