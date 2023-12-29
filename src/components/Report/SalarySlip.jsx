import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import logo_white from "../../images/logo_1.png";
import { getSalary } from "../../api/reportsAPI";
import { CircularProgress } from "@mui/material";

const SalarySlip = () => {
  const params = useParams();
  console.log("params", params.id);

  const [isLoading, setisLoading] = useState(false);
  const [salary, setsalary] = useState()

  useEffect(() => {
    getSalaryDetailFunc()
  }, []);
  console.log("salary", salary)

  const getSalaryDetailFunc = async () => {
    setisLoading(true)
    let res = await getSalary({ employee_id: params.id, month: String(new Date().getMonth() + 1).padStart(2, 0), year: new Date().getFullYear(), })
    if (res.data.status) {
      setsalary(res.data.result)
      setisLoading(false)
    }
  }

  return (
    <>
      {isLoading ? (
        <div style={{ margin: "auto", }}>
          <CircularProgress />
        </div>
      ) : (
        <div className="ss_section">
          <div>
            <div className="slip-header">
              <div className="Slip_logo">
                <img src={logo_white} alt="icon" />
              </div>
              <div className="slip-date">
                <p>Payslip for the months</p>
                <h4>{salary?.pay_period}</h4>
              </div>
            </div>
          </div>
          <hr />
          <div className="container">
            <div className="slip-row">
              <div className="slip-col">
                <h3>Employee summmary</h3>
                <div className="">
                  <div className="slip-detail ">
                    <h4>Employee Name</h4>:<h3>{salary?.employee_name}</h3>
                  </div>
                  <div className="slip-detail ">
                    <h4>Employee ID</h4>:<h3>{salary?.employee_id}</h3>
                  </div>
                  <div className="slip-detail ">
                    <h4>Pay Period</h4>:<h3>{salary?.pay_period}</h3>
                  </div>
                  <div className="slip-detail ">
                    <h4>Pay Date</h4>:<h3>{salary?.pay_date}</h3>
                  </div>
                  <div className="slip-detail ">
                    <h4>Designation</h4>:<h3>{salary?.designation}</h3>
                  </div>
                  <div className="slip-detail ">
                    <h4>PF No.</h4>:<h3>{salary?.pf_no}</h3>
                  </div>
                  <div className="slip-detail ">
                    <h4>ESI</h4>:<h3>{salary?.esi_no}</h3>
                  </div>
                </div>
              </div>
              <div className="slip-col">
                <div className="salary-box">
                  <div className="salary-amt">
                    <div className="ruppee">
                      <p>&#x20b9; {salary?.net_salary}</p>
                    </div>
                    <p className="ruppee-p">Employee Net Salary</p>
                  </div>
                  <hr />
                  <div className="slip-detail ">
                    <h3 style={{ width: "100px" }}>Paid Days</h3>:<h3>{salary?.paid_days}</h3>
                  </div>
                  <div className="slip-detail ">
                    <h3 style={{ width: "100px" }}>LOP Days</h3>:<h3>{salary?.lop_days}</h3>
                  </div>
                </div>
                <div className="slip-detail ">
                  <h4>Account No</h4>:<h3>{salary?.account_number}</h3>
                </div>
                <div className="slip-detail ">
                  <h4>Bank Name</h4>:<h3>{salary?.bank_name}</h3>
                </div>
                <div className="slip-detail ">
                  <h4>IFSC Code</h4>:<h3>{salary?.ifsc}</h3>
                </div>
              </div>
            </div>
            <hr />
            <div className="salary-desc-box">
              <div className="salary-desc-head">
                <div className="salary-desc-row">
                  <h3>EARNINGS</h3>
                  <h3>AMOUNT</h3>
                </div>
                <div className="salary-desc-row">
                  <h3>DEDUCTION</h3>
                  <h3>AMOUNT</h3>
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div className="salary-details">
                  <div className="slip-detail salary-desc">
                    <h3>Basic</h3><h3>&#x20b9;{salary?.basic}</h3>
                  </div>
                  <div className="slip-detail salary-desc ">
                    <h3>House Rent Allowance</h3><h3>&#x20b9;{salary?.house_rent}</h3>
                  </div>
                  <div className="slip-detail salary-desc ">
                    <h3>Other Earnings</h3><h3>&#x20b9;{salary?.other_earning}</h3>
                  </div>
                </div>
                <div className="salary-details">
                  <div className="slip-detail salary-desc ">
                    <h3>Income Tax</h3><h3>&#x20b9;{salary?.income_tax}</h3>
                  </div>
                  <div className="slip-detail salary-desc ">
                    <h3>Provident Fund</h3><h3>&#x20b9;{salary?.pf}</h3>
                  </div>
                  <div className="slip-detail salary-desc ">
                    <h3></h3><h3></h3>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", backgroundColor: "#c9e3ef" }}>
                <div className="slip-detail salary-desc salary-details ">
                  <h3>Gross Earnings</h3><h3>&#x20b9;{salary?.gross}</h3>
                </div>
                <div className="slip-detail salary-desc salary-details">
                  <h3>Total Deduction</h3><h3>&#x20b9;{salary?.deduction}</h3>
                </div>
              </div>
            </div>
            <div className="salary-desc-box">
              <div style={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
                <div>
                  <h3>TOTAL NET PAYABLE</h3>
                  <p>Gross Earnings - Total Deduction</p>
                </div>
                <h2>&#x20b9; {salary?.net_salary}</h2>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SalarySlip;
