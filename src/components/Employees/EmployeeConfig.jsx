import "./AddEmployee.css";
import React, { useEffect, useState } from "react";
import group from "../../images/group.png";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";
import getStateFunc from "../../api/locationAPI";
import fetchAllEmployee, { deviceConfig, editEmployee, getEmp, resetAllDevice, resetDevice, viewEmpReportees } from "../../api/employeeAPI";
import fetchAllRole, { fetchHierarcyRole } from "../../api/roleAPI";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { getEmpSalaryConfig } from "../../api/settingAPI";
import isAllowed from "../../utils/isAllowed";
import { EMPLOYEE_MANAGEMENT } from "../../constants";

const EmployeeConfig = () => {
  const navigate = useNavigate();
  const [activeTab, setactiveTab] = useState("Role");
  const [btnLoading, setbtnLoading] = useState(false);

  const [allState, setallState] = useState([]);
  const [allEmployeeList, setallEmployeeList] = useState([]);
  const [currentEmployeeID, setcurrentEmployeeID] = useState()
  const [currentEmployee, setcurrentEmployee] = useState(null);

  const [reporteeBtnLoading, setreporteeBtnLoading] = useState(false)
  const [resetBtnLoading, setresetBtnLoading] = useState(false)
  const [reporteePopup, setreporteePopup] = useState(false)
  const [empReportees, setempReportees] = useState([]);

  const [allRole, setallRole] = useState([]);
  const [allReporting, setallReporting] = useState([]);
  const [transportArray, settransportArray] = useState(["Public Transport"])

  const [currentConfigTab, setcurrentConfigTab] = useState("")
  const [deviceConfigPopup, setdeviceConfigPopup] = useState(false)
  const [resetAllDevicePopup, setresetAllDevicePopup] = useState(false)

  const [employeeConfig, setemployeeConfig] = useState({
    stateID: "",
    employeeID: "",
    employeeRole: "",
    employeeManager: "",
  });

  // const [userExpenses, setuserExpenses] = useState({
  //   salaryAll: "",
  //   salaryConvyence: "",
  //   TAKM: "",
  //   DA: "",
  // });

  const [userExpenses, setuserExpenses] = useState({
    gross_salary: "",
    basic_salary: "",
    hra_allowance: "",
    others: "",
    pf: "",
    esi: "",
    professional_tax: "",
    tds: "",
  })

  const [salaryPercentage, setsalaryPercentage] = useState({
    basic_salary_percentage: "",
    hra_allowance_percentage: "",
    others_percentage: "",
    pf_percentage: "",
    esi_percentage: "",
    professional_tax_percentage: "",
    tds_percentage: "",
  })

  const [transportWays, settransportWays] = useState({
    type: "Public Transport",
    TAKMBike: "",
    TAKMCar: "",
    TAKMPublicTransport: "",
    nightMaxiumAllowence: "",
  });

  const [deviceConfigState, setdeviceConfigState] = useState({
    team_view: true,
    gps_alarm: true,
    track_user: true,
  })

  const [error, setError] = useState({
    stateID: { status: false, },
    employeeID: { status: false, },
    employeeRole: { status: false, },
    employeeManager: { status: false, },
  });

  useEffect(() => {
    getStateFunc().then((res) => setallState(res.data.result));
    fetchAllRole().then((res) => setallRole(res.data.result));
    getEmpSalaryConfigFunc()
  }, []);

  useEffect(() => {
    settransportWays({ ...transportWays, type: transportArray });
  }, [transportArray])

  const getEmpSalaryConfigFunc = async () => {
    let { data } = await getEmpSalaryConfig()
    if (data.status) {
      setsalaryPercentage({
        basic_salary_percentage: data.result?.basic_salary_percentage,
        hra_allowance_percentage: data.result?.hra_allowance_percentage,
        others_percentage: data.result?.others_percentage,
        pf_percentage: data.result?.pf_percentage,
        esi_percentage: data.result?.esi_percentage,
        professional_tax_percentage: data.result?.professional_tax_percentage,
        tds_percentage: data.result?.tds_percentage,
      })
    } else {
      toast.error(data.message);
    }
  }

  const handleInput = (e) => {
    setError({
      stateID: { status: false, },
      employeeID: { status: false, },
      employeeRole: { status: false, },
      employeeManager: { status: false, },
    });
    setemployeeConfig({ ...employeeConfig, [e.target.name]: e.target.value });
  };

  const handleInputUC = (e) => {
    console.log("handleInputUC", e.target.value)
    setuserExpenses({
      gross_salary: e.target.value,
      basic_salary: e.target.value * salaryPercentage.basic_salary_percentage / 100,
      hra_allowance: e.target.value * salaryPercentage.hra_allowance_percentage / 100,
      others: e.target.value * salaryPercentage.others_percentage / 100,
      pf: e.target.value * salaryPercentage.pf_percentage / 100,
      esi: e.target.value * salaryPercentage.esi_percentage / 100,
      professional_tax: e.target.value * salaryPercentage.professional_tax_percentage / 100,
      tds: e.target.value * salaryPercentage.tds_percentage / 100,
    })
    // setuserExpenses({ ...userExpenses, [e.target.name]: e.target.value });
  };
  const handleInputTW = (e) => {
    settransportWays({ ...transportWays, [e.target.name]: e.target.value });
  };

  const employeeConfigFunc = async () => {
    if (!employeeConfig.employeeID) return toast.error("Please Select Employee First!")

    setbtnLoading(true);
    let res = await editEmployee({
      roleId: employeeConfig.employeeRole,
      manager: employeeConfig.employeeManager,
      id: employeeConfig.employeeID,
    });
    if (res.data.status) {
      toast.success("Employee edited Successfully!");
      navigate("/employees");
      setbtnLoading(false);
    } else {
      toast.error(res.data.message);
      setbtnLoading(false);
    }
  };

  const userConfigFunc = async () => {
    setbtnLoading(true);
    let res = await editEmployee({
      id: employeeConfig.employeeID,
      userExpenses,
      transportWays,
    });
    if (res.data.status) {
      toast.success("Employee edited Successfully!");
      navigate("/employees");
      setbtnLoading(false);
    } else {
      toast.error(res.data.message);
      setbtnLoading(false);
    }
    setbtnLoading(false);
  };

  const stateHandleInput = async (e) => {
    setemployeeConfig({ ...employeeConfig, [e.target.name]: e.target.value });
    try {
      fetchAllEmployee({ state: e.target.value }).then((res) => {
        setallEmployeeList(res.data.result)
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEmp = async (id) => {
    if (!await isAllowed(EMPLOYEE_MANAGEMENT)) {
      return toast.error("Module is not purchased!");
    }

    try {
      let res = await getEmp(id);
      if (res.data.status) {
        setcurrentEmployee(res.data.result);
        setdeviceConfigState({
          team_view: res.data.result.team_view,
          gps_alarm: res.data.result.gps_alarm,
          track_user: res.data.result.track_user,
        })
        let { gross_salary, basic_salary, hra_allowance, others, pf, esi, professional_tax, tds } = res.data.result.userExpenses
        setuserExpenses({ gross_salary, basic_salary, hra_allowance, others, pf, esi, professional_tax, tds })
        let { type, TAKMBike, TAKMCar, TAKMPublicTransport, nightMaxiumAllowence } = res.data.result.transportWays
        settransportArray(type)
        settransportWays({ type, TAKMBike, TAKMCar, TAKMPublicTransport, nightMaxiumAllowence })
      }
    } catch (error) {
      console.log(error);
    }
  };

  const roleHandleInput = async (e) => {
    setemployeeConfig({ ...employeeConfig, [e.target.name]: e.target.value });
    try {
      let res = await fetchHierarcyRole(e.target.value)
      if (res.data.status) {
        setallReporting(res.data.result)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const transportTabFunc = (item) => {
    if (!transportArray.includes(item)) {
      settransportArray([...transportArray, item])
    } else {
      let filtered = transportArray.filter(arrItem => item !== arrItem)
      settransportArray(filtered)
    }
  }

  const viewEmpReporteesFunc = async () => {
    if (!currentEmployee?.roleId?.id) return toast.error("Please Select Employee First!")

    setreporteeBtnLoading(true)
    let { data } = await viewEmpReportees({ role_id: currentEmployee?.roleId?.id })
    if (data.status) {
      setempReportees(data.result)
      setreporteePopup(true)
    } else {
      console.log("Error!")
    }
    setreporteeBtnLoading(false)
  }

  const resetAllDeviceFunc = async () => {
    setresetBtnLoading(true)
    if (!await isAllowed(EMPLOYEE_MANAGEMENT)) {
      toast.error("Module is not purchased!");
      setresetAllDevicePopup(false)
      return setresetBtnLoading(false)
    }

    let { data } = await resetAllDevice()
    if (data.status) {
      toast.success("All devices reseted successfully.")
    } else {
      console.log("Error!")
    }
    setresetAllDevicePopup(false)
    setresetBtnLoading(false)
  }

  const configTabFunc = async (tab) => {
    setcurrentConfigTab(tab)
    setdeviceConfigPopup(true)
  }
  const resetDeviceFunc = async () => {
    let { data } = await resetDevice(currentEmployee?.id)
    if (data.status) {
      toast.success(data.message)
    } else {
      console.log("Error!")
    }
    setdeviceConfigPopup(false)
  }
  const deviceConfigFunc = async (type) => {
    let temp = { ...deviceConfigState, emp_id: currentEmployee?.id, [type]: !deviceConfigState[type] }

    let { data } = await deviceConfig(temp)
    if (data.status) {
      toast.success(data.message)
      fetchEmp(currentEmployee?.id)
    } else {
      console.log("Error!")
    }
    setdeviceConfigPopup(false)
  }

  const [checked, setChecked] = useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <div className="container">
      <div className="beat_heading">
        <div className="beat_left">
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Manage Employee Configations</div>
        </div>
        <div className="beat_right employee_head">
        </div>
      </div>

      {/* <div className="party_container party">
        <div className="grouping_submit">
          <div className="message_left">
            <div className="message_form">
              <select
                name="stateID"
                value={employeeConfig.stateID}
                onChange={stateHandleInput}
              >
                <option value="">State</option>
                {allState?.map((state) => (
                  <option key={state.id} value={state.id}>{state.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="message_right">
            <div className="message_form">
              <select
                className="grouping_select"
                name="employeeID"
                // value={employeeConfig.employeeID}
                onChange={(e) => {
                  setemployeeConfig({
                    ...employeeConfig,
                    [e.target.name]: e.target.value,
                  });
                  fetchEmp(e.target.value);
                }}
              >
                <option value="">Select an Employee</option>
                {allEmployeeList.length === 0 && <option disabled value="">No Employee Found</option>}
                {allEmployeeList?.map((emp) => (
                  <option value={emp.id}>{emp.employeeName}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div> */}

      <div className="tracking_tabs" style={{ marginBottom: "1.5rem" }} >
        <div className="tarcking_tab_left">
          <select name="stateID" value={employeeConfig.stateID} onChange={stateHandleInput}>
            <option value="">All States</option>
            {allState?.map((state) => (
              <option key={state.id} value={state.id}>{state.name}</option>
            ))}
          </select>
          <select
            name="employeeID"
            // value={employeeConfig.employeeID}
            onChange={(e) => {
              setemployeeConfig({
                ...employeeConfig,
                [e.target.name]: e.target.value,
              });
              setcurrentEmployeeID(e.target.value)
            }} >
            <option value="">All Employees</option>
            {allEmployeeList?.length === 0 && <option disabled value="">No Employee Found</option>}
            {allEmployeeList?.map((employee) => (
              <option key={employee?.id} value={employee?.id} > {employee?.employeeName} </option>
            ))}
          </select>
          <div className="view_btn_2" onClick={() => fetchEmp(currentEmployeeID)}>
            View
          </div>
        </div>
      </div>

      <div className="config_tab">
        <div onClick={() => setactiveTab("Role")} className={`confi_div ${activeTab === "Role" ? "config_active_tab" : ""}`}
        >
          Role Hierarchy
        </div>
        <div onClick={() => setactiveTab("Device")} className={`confi_div ${activeTab === "Device" ? "config_active_tab" : ""}`}
        >
          Device config
        </div>
        <div onClick={() => setactiveTab("Salary")} className={`confi_div ${activeTab === "Salary" ? "config_active_tab" : ""}`}
        >
          Salary
        </div>
        <div onClick={() => setactiveTab("User")} className={`confi_div ${activeTab === "User" ? "config_active_tab" : ""}`}
        >
          User Expensive
        </div>
        <div onClick={() => setresetAllDevicePopup(true)} className={`confi_div config_active_tab`}
        >
          {resetBtnLoading ? (
            <CircularProgress style={{ color: "#fff" }} size={26} />
          ) : (
            "Reset All Device"
          )}
        </div>
      </div>

      {
        currentEmployee ? (
          <>
            {activeTab === "Role" && (
              <div className="addbeat_container">
                <div className="config_head">
                  <h2>Team Hierarchy</h2>
                  <div style={{ display: "flex" }} >
                    <div onClick={() => viewEmpReporteesFunc()} className="config_btn">
                      {reporteeBtnLoading ? (
                        <CircularProgress style={{ color: "#fff" }} size={26} />
                      ) : (
                        "View Reportees"
                      )}
                    </div>
                  </div>
                </div>

                <div className="addbeat_form">
                  <div className="addbeat_left">
                    <select
                      name="employeeRole"
                      value={employeeConfig.employeeRole}
                      onChange={roleHandleInput}
                    >
                      <option value="">
                        {currentEmployee?.roleId === "" || !currentEmployee
                          ? "Assign Role"
                          : currentEmployee?.roleId?.name}
                      </option>
                      {allRole.length === 0 && <option disabled value="">No Role Found</option>}
                      {allRole?.map((role) => (
                        <option key={role._id} value={role._id}>{role.rolename}</option>
                      ))}
                    </select>
                  </div>

                  <div className="addbeat_right">
                    <select
                      name="employeeManager"
                      value={employeeConfig.employeeManager}
                      onChange={handleInput}
                    >
                      <option value="">
                        {currentEmployee?.manager === "" || !currentEmployee?.manager
                          ? "Reporting To (Select Employee's Manager)"
                          : `Reporting to - ${currentEmployee?.manager}`}
                        {/* Reporting To (Select Employee's Manager) */}
                      </option>
                      {allReporting.length === 0 && <option disabled value="">No Reporting Manager Found</option>}
                      {allReporting?.map((emp) => (
                        <option key={emp._id} value={emp._id}>{emp.employeeName}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div
                  className="btn changepass_btn"
                  onClick={() => employeeConfigFunc()}
                >
                  {btnLoading ? (
                    <CircularProgress style={{ color: "#fff" }} size={26} />
                  ) : (
                    "SAVE"
                  )}
                </div>
              </div>
            )}

            {activeTab === "Device" && (
              <div className="addbeat_container">
                <div className="config_head">
                  <h2>Device Config</h2>
                </div>
                <div className="config_head">
                  <div className="device_subh">Change Device Bindings</div>
                </div>

                <div className="device_btns" style={{ margin: "1rem 0 2rem 0" }}>
                  <div onClick={() => configTabFunc("reset_device")} className="device_btn" style={{ background: "#3c8cba" }}>
                    <span>Reset Device</span>
                  </div>
                  {/* <div onClick={() => configTabFunc("team_view")} className="device_btn" style={{ background: deviceConfigState?.team_view ? "#00a65a" : "#dd4c38" }}> */}
                  <div className="device_btn" style={{ background: "#00a65a" }}>
                    <span>Show My Dashboard View</span>
                    <span><Switch checked={deviceConfigState?.team_view} onChange={() => configTabFunc("team_view")} /></span>
                    <span>on</span>
                  </div>
                  {/* <div onClick={() => configTabFunc("gps_alarm")} className="device_btn" style={{ background: deviceConfigState?.gps_alarm ? "#00a65a" : "#dd4c38" }}> */}
                  <div className="device_btn" style={{ background: "#00a65a" }}>
                    <span>Ring GPS Alarm</span>
                    <span><Switch checked={deviceConfigState?.gps_alarm} onChange={() => configTabFunc("gps_alarm")} /></span>
                    <span>on</span>
                  </div>
                  {/* <div onClick={() => configTabFunc("track_user")} className="device_btn" style={{ background: deviceConfigState?.track_user ? "#00a65a" : "#dd4c38" }}> */}
                  <div className="device_btn" style={{ background: "#00a65a" }}>
                    <span>Track This User</span>
                    <span><Switch checked={deviceConfigState?.track_user} onChange={() => configTabFunc("track_user")} /></span>
                    <span>on</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Salary" && (
              <div className="addbeat_container">
                <div className="config_head"></div>

                <div className="addbeat_form">
                  <div className="addbeat_left">
                    <h2>Earning</h2>

                    <div className="user_right_btn"></div>

                    <label>Gross Salary</label>
                    <input
                      type="number"
                      name="gross_salary"
                      value={userExpenses.gross_salary}
                      onChange={handleInputUC}
                      placeholder="Gross Salary"
                    />
                    <label>Basic Salary</label>
                    <input
                      type="number"
                      name="basic_salary"
                      value={userExpenses.basic_salary}
                      onChange={handleInputUC}
                      placeholder="Gross Salary * 50%"
                      disabled
                    />
                    <label>HRA Allowance</label>
                    <input
                      type="number"
                      name="hra_allowance"
                      value={userExpenses.hra_allowance}
                      onChange={handleInputUC}
                      placeholder="HRA Allowance"
                      disabled
                    />
                    <label>Others</label>
                    <input
                      type="number"
                      name="others"
                      value={userExpenses.others}
                      onChange={handleInputUC}
                      placeholder="Others"
                      disabled
                    />
                  </div>

                  <div className="addbeat_right">
                    <h2>Deducations</h2>

                    <div className="user_right_btn"></div>

                    <label>PF</label>
                    <input
                      type="number"
                      name="pf"
                      value={userExpenses.pf}
                      onChange={handleInputUC}
                      placeholder="PF"
                      disabled
                    />
                    <label>ESI</label>
                    <input
                      type="number"
                      name="esi"
                      value={userExpenses.esi}
                      onChange={handleInputUC}
                      placeholder="ESI"
                      disabled
                    />
                    <label>Professional Tax</label>
                    <input
                      type="number"
                      name="professional_tax"
                      value={userExpenses.professional_tax}
                      onChange={handleInputUC}
                      placeholder="Professional Tax"
                      disabled
                    />
                    <label>TDS</label>
                    <input
                      type="number"
                      name="tds"
                      value={userExpenses.tds}
                      onChange={handleInputUC}
                      placeholder="TDS"
                      disabled
                    />
                  </div>
                </div>
                <div className="btn changepass_btn" onClick={() => userConfigFunc()}>
                  {btnLoading ? (
                    <CircularProgress style={{ color: "#fff" }} size={26} />
                  ) : (
                    "SAVE"
                  )}
                </div>
              </div>
            )}

            {activeTab === "User" && (
              <div className="addbeat_container">
                <div className="config_head"></div>

                <div className="addbeat_form">
                  <div className="addbeat_left">
                    <h2>Transport Ways</h2>

                    <div className="user_right_btn">
                      <div
                        onClick={() => transportTabFunc("Bike")}
                        className={`transport_div ${transportArray.includes("Bike") ? "active_transport" : ""}`}
                      >
                        Bike
                      </div>
                      <div
                        onClick={() => transportTabFunc("Car")}
                        className={`transport_div ${transportArray.includes("Car") ? "active_transport" : ""}`}
                      >
                        Car
                      </div>
                      <div
                        className={`transport_div ${transportArray.includes("Public Transport") ? "active_transport" : ""}`}
                      >
                        Public Transport
                      </div>
                    </div>

                    <h4 style={{ margin: "1rem 0" }} >Travelling Allowance (TA/DA)</h4>

                    <label>TA/KM (Bike)</label>
                    <input
                      type="number"
                      name="TAKMBike"
                      value={transportWays.TAKMBike}
                      onChange={handleInputTW}
                      placeholder="TA/KM (Bike)"
                    />
                    <label>TA/KM (Car)</label>
                    <input
                      type="number"
                      name="TAKMCar"
                      value={transportWays.TAKMCar}
                      onChange={handleInputTW}
                      placeholder="TA/KM (Car)"
                    />
                  </div>

                  <div className="addbeat_right">
                    <h2 style={{ visibility: "hidden" }} >Transport Ways</h2>

                    <div style={{ visibility: "hidden" }} className="user_right_btn">
                      <div
                        onClick={() => transportTabFunc("Bike")}
                        className={`transport_div ${transportArray.includes("Bike") ? "active_transport" : ""}`}
                      >
                        Bike
                      </div>
                      <div
                        onClick={() => transportTabFunc("Car")}
                        className={`transport_div ${transportArray.includes("Car") ? "active_transport" : ""}`}
                      >
                        Car
                      </div>
                      <div
                        className={`transport_div ${transportArray.includes("Public Transport") ? "active_transport" : ""}`}
                      >
                        Public Transport
                      </div>
                    </div>

                    <h4 style={{ margin: "1rem 0", visibility: "hidden" }} >Travelling Allowance (TA/DA)</h4>

                    <label>TA/KM (Public Transport)</label>
                    <input
                      type="number"
                      name="TAKMPublicTransport"
                      value={transportWays.TAKMPublicTransport}
                      onChange={handleInputTW}
                      placeholder="TA/KM (Public Transport)"
                    />
                    <label>Night Maximum Allowance</label>
                    <input
                      type="number"
                      name="nightMaxiumAllowence"
                      value={transportWays.nightMaxiumAllowence}
                      onChange={handleInputTW}
                      placeholder="Night Maximum Allowance"
                    />
                  </div>
                </div>
                <div className="btn changepass_btn" onClick={() => userConfigFunc()}>
                  {btnLoading ? (
                    <CircularProgress style={{ color: "#fff" }} size={26} />
                  ) : (
                    "SAVE"
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="no_data">
            Select Employee
          </div>
        )
      }


      {/* Reportees Popup */}
      <Dialog
        open={reporteePopup}
        aria-labelledby="form-dialog-title"
        maxWidth="xs"
        fullWidth={true}
        onClose={() => setreporteePopup(false)}
      >
        <DialogTitle className="dialog_title">
          <div>{currentEmployee?.employeeName} Reportees</div>
        </DialogTitle>
        <DialogContent className='sp_states_popup'>
          {empReportees.length !== 0 ? empReportees?.map((emp, i) => (
            <div className='sp_states_popup_list'>{i + 1}. {emp.employeeName}</div>
          )) : (
            <div style={{ textAlign: "center" }} >No Reportees Found!</div>
          )}
        </DialogContent>
      </Dialog>

      {/* device config popup */}
      <Dialog
        open={deviceConfigPopup}
        aria-labelledby="form-dialog-title"
        maxWidth="xs"
        fullWidth="true"
        onClose={() => setdeviceConfigPopup(false)}
      >
        <DialogTitle className="dialog_title">
          <div>
            {currentConfigTab === "reset_device" && <div>Do you want to reset device?</div>}
            {currentConfigTab === "team_view" && <div>Do you want to {deviceConfigState?.team_view ? "disable" : "enable"} only team view?</div>}
            {currentConfigTab === "gps_alarm" && <div>Do you want to {deviceConfigState?.gps_alarm ? "disable" : "enable"} gps alarm?</div>}
            {currentConfigTab === "track_user" && <div>Do you want to {deviceConfigState?.track_user ? "disable" : "enable"} tracking user?</div>}
          </div>
        </DialogTitle>
        <DialogContent className="cardpopup_content">
          <div style={{ display: "flex", gap: "1rem" }}>
            <div className="employee_gl_popup" onClick={() => setdeviceConfigPopup(false)}            >
              No
            </div>
            <div className="employee_gl_popup_del"
              onClick={() => {
                if (currentConfigTab === "reset_device") resetDeviceFunc()
                if (currentConfigTab === "team_view") deviceConfigFunc("team_view")
                if (currentConfigTab === "gps_alarm") deviceConfigFunc("gps_alarm")
                if (currentConfigTab === "track_user") deviceConfigFunc("track_user")
              }}
            >
              Yes
            </div>
          </div>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>

      {/* reset all device popup */}
      <Dialog
        open={resetAllDevicePopup}
        aria-labelledby="form-dialog-title"
        maxWidth="xs"
        fullWidth="true"
        onClose={() => setresetAllDevicePopup(false)}
      >
        <DialogTitle className="dialog_title">
          <div>Do you want to reset all device?</div>
        </DialogTitle>
        <DialogContent className="cardpopup_content">
          <div style={{ display: "flex", gap: "1rem" }}>
            <div className="employee_gl_popup" onClick={() => setresetAllDevicePopup(false)}            >
              No
            </div>
            <div className="employee_gl_popup_del" onClick={() => resetAllDeviceFunc()}            >
              Yes
            </div>
          </div>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div >
  );
};

export default EmployeeConfig;