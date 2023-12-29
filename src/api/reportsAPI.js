import axios from "axios";
import { getBaseUrl } from "../utils/baseUrl";


// Employee Attendence
export const fetchEmpAttendence = async (id) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "app_api/attendanceListOfEmployee",
        data: { employee_id: id }
    };

    try {
        let res = await axios(config);
        // console.log(res);
        return res;
    } catch (error) {
        console.log(error);
    }
};

// Secondary Oders
export const getRetailer = async (filterData) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/getAllRetailers",
        headers: { Authorization: `Bearer ${token}` },
        data: filterData,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}

export const getRetailerType = async (filterData) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "get",
        url: getBaseUrl() + "auth_api/getCustomerType",
        headers: { Authorization: `Bearer ${token}` },
        data: filterData,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}

export const getSecOrders = async (filterData) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/secondary_order_report",
        headers: { Authorization: `Bearer ${token}` },
        data: filterData,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}


// Primary Orders
export const getPrimaryOrders = async (filterData) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/primary_order_reports",
        headers: { Authorization: `Bearer ${token}` },
        data: filterData,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}

export const editPrimaryStatus = async (data) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "app_api/edit_status_primary_order",
        headers: { Authorization: `Bearer ${token}` },
        data,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error);
    }
};

export const getPrimarySaleReports = async (filterData) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/primary_sales_reports",
        headers: { Authorization: `Bearer ${token}` },
        data: filterData,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}



// View Order
export const getOrderDetail = async (id) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/view_primary_order",
        headers: { Authorization: `Bearer ${token}` },
        data: { order_id: id },
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}

// View Secondary Order
export const getSecondaryOrderDetail = async (id) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/view_order",
        headers: { Authorization: `Bearer ${token}` },
        data: { order_id: id },
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}

// Mark As Delivered
export const markAsDelivered = async (data) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/mark_delivered",
        headers: { Authorization: `Bearer ${token}` },
        data,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}

// Generate Invoice
export const getGenerateInvoice = async (data) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/generate_invoice",
        headers: { Authorization: `Bearer ${token}` },
        data,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}


// Invoice
export const getInvoice = async (id) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/view_invoice",
        headers: { Authorization: `Bearer ${token}` },
        data: { order_id: id },
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}

export const deleteInvoice = async (data) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "delete",
        url: getBaseUrl() + "auth_api/delete_invoice",
        headers: { Authorization: `Bearer ${token}` },
        data,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}

// Invoice
export const getALlInvoices = async (data) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/get_invoice",
        headers: { Authorization: `Bearer ${token}` },
        data,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}


// Expense Reports
export const getMonthlyExpReport = async (filterData) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/expense_report",
        headers: { Authorization: `Bearer ${token}` },
        data: filterData,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}

export const editExpenseStatus = async (data) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "app_api/edit_status_expense_report",
        headers: { Authorization: `Bearer ${token}` },
        data,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error);
    }
};


// Complete Perforence reports
export const getCPRAllEmp = async (data) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/complete_performance_report",
        headers: { Authorization: `Bearer ${token}` },
        data,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}


// Collection Report 
export const getCollectionReport = async (filterData) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/collection_transaction",
        headers: { Authorization: `Bearer ${token}` },
        data: filterData,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}

export const editPaymentStatus = async (data) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/edit_status_payment_collection",
        headers: { Authorization: `Bearer ${token}` },
        data,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error);
    }
};


// SS Wise Report 
export const getSSWiseReport = async (filterData) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/ss_wise_performance_report",
        headers: { Authorization: `Bearer ${token}` },
        data: filterData,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}


// Company Report
export const getCompanyReport = async (filterData) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/company_performance_report",
        headers: { Authorization: `Bearer ${token}` },
        data: filterData,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}


// Distributor Current Stock
export const getDistributorStock = async (filterData) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/distributor_current_stock",
        headers: { Authorization: `Bearer ${token}` },
        data: filterData,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}


// Customer Visit Report 
export const getCustomerVisitReport = async (filterData) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/customer_visit_report",
        headers: { Authorization: `Bearer ${token}` },
        data: filterData,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}


// Claim report
export const getClaimReport = async (filterData) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/claim_transaction",
        headers: { Authorization: `Bearer ${token}` },
        data: filterData,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}

export const editClaimStatus = async (data) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/edit_status_claim_report",
        headers: { Authorization: `Bearer ${token}` },
        data,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error);
    }
};

export const editClaimSatus = async (data) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "app_api/edit_status_claim",
        headers: { Authorization: `Bearer ${token}` },
        data,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error);
    }
};


// Good Return Voucher
export const getGoodReturnVoucher = async (filterData) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/goods_return_voucher_report",
        headers: { Authorization: `Bearer ${token}` },
        data: filterData,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}

export const editGoodReturnVoucher = async (data) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "app_api/edit_status_voucher",
        headers: { Authorization: `Bearer ${token}` },
        data,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error);
    }
};


// Good Return Detail
export const getGoodReturnDetail = async (filterData) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/goods_return_voucher_transaction",
        headers: { Authorization: `Bearer ${token}` },
        data: filterData,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}

export const editGoodReturnDetail = async (data) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/edit_status_goodsreturn_voucher",
        headers: { Authorization: `Bearer ${token}` },
        data,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error);
    }
};


// Salary Report
export const getSalaryReport = async (data) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/salary_report",
        headers: { Authorization: `Bearer ${token}` },
        data,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}

export const getSalary = async (data) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/view_salary_slip",
        headers: { Authorization: `Bearer ${token}` },
        data,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}


// Monthly Attendance Report
export const getMonthlyAttendance = async (filterData) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/monthly_attendance_report",
        headers: { Authorization: `Bearer ${token}` },
        data: filterData,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}

export const getMonthlyAttendanceSingle = async (filterData) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/monthly_attendance_report_single_employee",
        headers: { Authorization: `Bearer ${token}` },
        data: filterData,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}


// Today Attendance Report
export const getTodayAttendance = async (filterData) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/todays_attendance_report",
        headers: { Authorization: `Bearer ${token}` },
        data: filterData,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}


// Customer Feedback Report
export const getCusFeedbackReport = async (filterData) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/retailer_feedback_report",
        headers: { Authorization: `Bearer ${token}` },
        data: filterData,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}


// Employee Party Wise Report
export const getEmpPartyWiseReport = async (filterData) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/employee_party_wise_report",
        headers: { Authorization: `Bearer ${token}` },
        data: filterData,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}


// Account Ledger Report
export const getAccountLedgerReport = async (filterData) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/account_ledger",
        headers: { Authorization: `Bearer ${token}` },
        data: filterData,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}


// Market Visit
export const getMMarketVisit = async (filterData) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/customer_visit_report",
        headers: { Authorization: `Bearer ${token}` },
        data: filterData,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}


// Monthly Sale Plan
export const getMonthlySalePlan = async (filterData) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/monthly_sales_target_plan",
        headers: { Authorization: `Bearer ${token}` },
        data: filterData,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}

// Approvel Expense Report
export const approveExpenseReport = async (filterData) => {
    const token = localStorage.getItem("token");

    let config = {
        method: "post",
        url: getBaseUrl() + "auth_api/expense_transaction",
        headers: { Authorization: `Bearer ${token}` },
        data: filterData,
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log(error)
        return error.response
    }
}