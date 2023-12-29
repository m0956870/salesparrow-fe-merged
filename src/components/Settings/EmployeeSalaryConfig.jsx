import "./Settings.css"
import React, { useEffect, useState } from 'react'
import group from "../../images/group.png";
import { CircularProgress } from "@mui/material";
import { toast } from 'react-toastify';
import { addEmpSalaryConfig, getEmpSalaryConfig } from '../../api/settingAPI';
import { blankValidator } from '../../utils/Validation';

const EmployeeSalaryConfig = () => {
    const [isLoading, setisLoading] = useState(false);
    const [btnLoading, setbtnLoading] = useState(false);

    const [salary, setsalary] = useState({
        basic_salary_percentage: "",
        hra_allowance_percentage: "",
        others_percentage: "",
        pf_percentage: "",
        esi_percentage: "",
        professional_tax_percentage: "",
        tds_percentage: "",
    })

    const [error, setError] = useState({
        basic_salary_percentage: { status: false },
        hra_allowance_percentage: { status: false },
        others_percentage: { status: false },
        pf_percentage: { status: false },
        esi_percentage: { status: false },
        professional_tax_percentage: { status: false },
        tds_percentage: { status: false },
    });

    useEffect(() => {
        getEmpSalaryConfigFunc()
    }, [])

    const getEmpSalaryConfigFunc = async () => {
        setisLoading(true);
        let { data } = await getEmpSalaryConfig()
        if (data.status) {
            setsalary({
                basic_salary_percentage: data.result?.basic_salary_percentage,
                hra_allowance_percentage: data.result?.hra_allowance_percentage,
                others_percentage: data.result?.others_percentage,
                pf_percentage: data.result?.pf_percentage,
                esi_percentage: data.result?.esi_percentage,
                professional_tax_percentage: data.result?.professional_tax_percentage,
                tds_percentage: data.result?.tds_percentage,
            })
        } else {
            setisLoading(false);
            toast.error(data.message);
        }
    }


    const handleInput = (e) => {
        if (isNaN(e.target.value)) return;
        Object.values(error).map(item => item.status = false)
        setsalary({ ...salary, [e.target.name]: e.target.value });
    };

    const empSalaryConfigFunc = async () => {
        let sum = 0
        for (const key in salary) {
            if (key === "basic_salary_percentage" || key === "hra_allowance_percentage" || key === "others_percentage") sum += Number(salary[key])
        }
        console.log(salary)
        if (sum > 100) return toast.error("Total calculation of all percentages should be lower than 100!")

        if (!salary.basic_salary_percentage) return setError({ ...error, basic_salary_percentage: { status: true, }, });
        if (!salary.hra_allowance_percentage) return setError({ ...error, hra_allowance_percentage: { status: true, }, });
        if (!salary.others_percentage) return setError({ ...error, others_percentage: { status: true, }, });
        if (!salary.pf_percentage) return setError({ ...error, pf_percentage: { status: true, }, });
        if (!salary.esi_percentage) return setError({ ...error, esi_percentage: { status: true, }, });
        if (!salary.professional_tax_percentage) return setError({ ...error, professional_tax_percentage: { status: true, }, });
        if (!salary.tds_percentage) return setError({ ...error, tds_percentage: { status: true, }, });

        setbtnLoading(true);
        let res = await addEmpSalaryConfig(salary);
        console.log(res);
        if (res.data.status) {
            toast.success("Salary submitted successfully!");
            setbtnLoading(false);
        } else {
            toast.error(res.data.message);
            setbtnLoading(false);
        }
    }

    return (
        <div className="container">
            <div className="beat_heading">
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">Employee Salary Config</div>
                </div>
                <div className="beat_right">
                </div>
            </div>

            <div className="addbeat_container">
                <div className="config_head"></div>

                <div className="addbeat_form">
                    <div className="addbeat_left">
                        <h2>Earning</h2>
                        <div className="user_right_btn"></div>

                        <label>Basic Salary (%)</label>
                        <input
                            type="text"
                            name="basic_salary_percentage"
                            value={salary.basic_salary_percentage}
                            onChange={handleInput}
                            placeholder={`Basic Salary`}
                        />
                        {error.basic_salary_percentage.status && (
                            <p className='salary_config_input_error'>Please enter basic salary percentage!</p>
                        )}
                        <label>HRA Allowance (%)</label>
                        <input
                            type="text"
                            name="hra_allowance_percentage"
                            value={salary.hra_allowance_percentage}
                            onChange={handleInput}
                            placeholder="HRA Allowance"
                        />
                        {error.hra_allowance_percentage.status && (
                            <p className='salary_config_input_error'>Please enter basic salary percentage!</p>
                        )}
                        <label>Others (%)</label>
                        <input
                            type="text"
                            name="others_percentage"
                            value={salary.others_percentage}
                            onChange={handleInput}
                            placeholder="Others"
                        />
                        {error.others_percentage.status && (
                            <p className='salary_config_input_error'>Please enter basic salary percentage!</p>
                        )}
                    </div>

                    <div className="addbeat_right">
                        <h2>Deducations</h2>
                        <div className="user_right_btn"></div>

                        <label>PF (%)</label>
                        <input
                            type="text"
                            name="pf_percentage"
                            value={salary.pf_percentage}
                            onChange={handleInput}
                            placeholder="PF"
                        />
                        {error.pf_percentage.status && (
                            <p className='salary_config_input_error'>Please enter basic salary percentage!</p>
                        )}
                        <label>ESI (%)</label>
                        <input
                            type="text"
                            name="esi_percentage"
                            value={salary.esi_percentage}
                            onChange={handleInput}
                            placeholder="ESI"
                        />
                        {error.esi_percentage.status && (
                            <p className='salary_config_input_error'>Please enter basic salary percentage!</p>
                        )}
                        <label>Professional Tax (%)</label>
                        <input
                            type="text"
                            name="professional_tax_percentage"
                            value={salary.professional_tax_percentage}
                            onChange={handleInput}
                            placeholder="Professional Tax"
                        />
                        {error.professional_tax_percentage.status && (
                            <p className='salary_config_input_error'>Please enter basic salary percentage!</p>
                        )}
                        <label>TDS (%)</label>
                        <input
                            type="text"
                            name="tds_percentage"
                            value={salary.tds_percentage}
                            onChange={handleInput}
                            placeholder="TDS"
                        />
                        {error.tds_percentage.status && (
                            <p className='salary_config_input_error'>Please enter basic salary percentage!</p>
                        )}
                    </div>
                </div>
                <div className="btn changepass_btn" onClick={() => empSalaryConfigFunc()}>
                    {btnLoading ? (
                        <CircularProgress style={{ color: "#fff" }} size={26} />
                    ) : (
                        "SAVE"
                    )}
                </div>
            </div>
        </div>
    )
}

export default EmployeeSalaryConfig