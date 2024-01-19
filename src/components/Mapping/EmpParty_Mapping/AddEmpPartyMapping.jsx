import React, { useEffect, useState } from "react";
import group from "../../../images/group.png";
import { useNavigate } from "react-router-dom";
import { BsArrowRightSquareFill, BsFillArrowLeftSquareFill } from "react-icons/bs"

import fetchAllEmployee from "../../../api/employeeAPI";
import getStateFunc from "../../../api/locationAPI";
import fetchAllParty, { getPartyType } from "../../../api/partyAPI";
import { toast } from "react-toastify";
import { addEmpPartyMapping } from "../../../api/mappingAPI";
import { CircularProgress } from "@mui/material";


const AddEmpPartyMapping = () => {
    const navigate = useNavigate()

    const [isLoading, setisLoading] = useState(false)
    const [btnLoading, setbtnLoading] = useState(false);

    const [allState, setallState] = useState([]);
    const [allEmployee, setallEmployee] = useState([]);

    const [partyTypes, setpartyTypes] = useState()
    const [partySelected, setpartySelected] = useState(false);
    const [selectedPartyState, setselectedPartyState] = useState("");
    const [selectedPartyType, setselectedPartyType] = useState("");

    const [selectedEmp, setselectedEmp] = useState("");
    const [partyArr, setpartyArr] = useState([]);
    const [selectedPartyArr, setselectedPartyArr] = useState([]);

    useEffect(() => {
        getStateFunc().then((res) => setallState(res.data.result));
        fetchAllEmployee().then((res) => setallEmployee(res.data.result));
        getPartyType().then(res => setpartyTypes(res.data.result))
    }, [])

    const stateHandleInput = async (e) => {
        fetchAllEmployee({ state: e.target.value }).then(res => setallEmployee(res.data.result));
    };

    const partyHandleInput = async (e, type) => {
        // console.log(e.target.value, type)

        if (type === "state") {
            // setisLoading(true)
            setselectedPartyState(e.target.value)
            // fetchAllParty(null, e.target.value, selectedPartyType).then(res => {
            //     setpartyArr(res.data.result)
            //     setisLoading(false)
            // })
            fetchAllParty({ state: e.target.value, partyType: selectedPartyType }).then(res => {
                setpartyArr(res.data.result)
                setisLoading(false)
            })
            setpartySelected(true)
        } else {
            // setisLoading(true)
            setselectedPartyType(e.target.value)
            // fetchAllParty(null, selectedPartyState, e.target.value).then(res => {
            //     setpartyArr(res.data.result)
            //     setisLoading(false)
            // })
            fetchAllParty({ state: selectedPartyState, partyType: e.target.value }).then(res => {
                setpartyArr(res.data.result)
                setisLoading(false)
            })
            setpartySelected(true)
        }
    }

    const partyArrHandleInput = (party, type) => {
        // console.log(party, type)

        if (type === "nonselected") {
            let newincluded = selectedPartyArr.some(selected => selected.id === party.id)
            if (newincluded) {
                return toast.error("Party Already Selected!")
            } else {
                setpartyArr(partyArr.filter(selected => selected.id !== party.id))
                setselectedPartyArr(selectedPartyArr => [...selectedPartyArr, party])
            }
        }

        if (type === "selected") {
            let partyincluded = partyArr.some(selected => selected.id === party.id)
            if (partyincluded) {
                setselectedPartyArr(selectedPartyArr.filter(selected => selected.id !== party.id))
            } else {
                setpartyArr(partyArr => [...partyArr, party])
                setselectedPartyArr(selectedPartyArr.filter(selected => selected.id !== party.id))
            }
        }

        // let included = selectedPartyArr.some(selected => selected.id === party.id)
        // if (included) {
        //     setpartyArr(partyArr => [...partyArr, party])
        //     setselectedPartyArr(selectedPartyArr.filter(selected => selected.id !== party.id))
        // } else {
        //     setpartyArr(partyArr.filter(selected => selected.id !== party.id))
        //     setselectedPartyArr(selectedPartyArr => [...selectedPartyArr, party])
        // }
    }

    const sort1 = (a, b) => {
        const nameA = a; // ignore upper and lowercase
        const nameB = b; // ignore upper and lowercase
        if (nameA < nameB) return -1;
        else if (nameA > nameB) return 1
        else return 0;
    }

    const addEmpPartyMappingFunc = async () => {
        if (selectedEmp === "") return toast.error("Please Select Employee!")
        let arr = selectedPartyArr.map(party => party.id)
        if (arr.length === 0) return toast.error("Please Select Parties!")

        let data = { party_id_arr: arr, emp_id: selectedEmp }
        // console.log(data)

        setbtnLoading(true)
        let res = await addEmpPartyMapping(data)
        if (!res.data.status) {
            setbtnLoading(false)
            return toast.error(res.data.message)
        }

        toast.success("Employee Party Mapped Successfully!")
        navigate("/employee_party_mapping_listing")
    }


    return (
        <div className="container">
            <div className="beat_heading">
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">Employee - Party Mapping</div>
                </div>
                <div className="beat_right">
                </div>
            </div>

            <div className="party_container" style={{ marginBottom: "1.5rem" }}>
                <div className="emp_party_emp_container">
                    <select onChange={stateHandleInput}>
                        <option value="">Select State (Employee)</option>
                        {allState?.map((state) => (
                            <option key={state.id} value={state.id}>{state.name}</option>
                        ))}
                    </select>
                    <select name="emp_id" onChange={(e) => setselectedEmp(e.target.value)} >
                        <option value="">Select Employee</option>
                        {allEmployee.length === 0 && <option disabled value="">No Employee Found</option>}
                        {allEmployee?.map((employee) => (
                            <option key={employee.id} value={employee?.id} >{employee?.employeeName} </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="party_container">
                <div className="emp_party_emp_container">
                    <select onChange={(e) => partyHandleInput(e, "state")}>
                        <option value="">Select State (Party)</option>
                        {allState?.map((state) => (
                            <option key={state.id} value={state.id}>{state.name}</option>
                        ))}
                    </select>
                    <select onChange={(e) => partyHandleInput(e, "party_type")} >
                        <option value="">Party Type</option>
                        {partyTypes?.map((type) => (
                            <option key={type._id} value={type._id}>{type.party_type}</option>
                        ))}
                    </select>
                </div>

                {isLoading === true ? (
                    <div style={{ display: "flex", alignItems: "center", minHeight: "300px" }} >
                        <CircularProgress />
                    </div>
                ) : (
                    <>
                        {/* {partySelected === true && partyArr.length === 0 && selectedPartyArr.length === 0 ? (
                            <div className="no_data">
                                No Data
                            </div>
                        ) : partySelected === false ? (
                            <div className="no_data">
                                Select Party
                            </div>
                        ) : null} */}

                        <div className="emp_party_select_arr_container" >
                            <div className="ep_select_arr">
                                <div className="heading">
                                    <h3>Parties</h3>
                                </div>
                                <div className="ep_arr_left">
                                    {partyArr?.map(party => (
                                        <div key={party.id} className="party_name" >
                                            {party.firmName}
                                            <BsArrowRightSquareFill onClick={() => partyArrHandleInput(party, "nonselected")} className="party_mapping_icon" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="ep_selected_arr">
                                <div className="heading">
                                    <h3>Assigned Parties</h3>
                                </div>
                                <div className="ep_arr_left">
                                    {selectedPartyArr?.map(party => (
                                        <div key={party.id} className="party_name" >
                                            <BsFillArrowLeftSquareFill onClick={() => partyArrHandleInput(party, "selected")} className="party_mapping_icon" />
                                            {party.firmName}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="emp_party_mapping_add_btn"
                            onClick={() => addEmpPartyMappingFunc()}
                        >
                            {btnLoading ? (
                                <CircularProgress style={{ color: "#fff" }} size={26} />
                            ) : (
                                "ADD"
                            )}
                        </div>
                    </>
                )}
            </div>

        </div >
    )
}

export default AddEmpPartyMapping