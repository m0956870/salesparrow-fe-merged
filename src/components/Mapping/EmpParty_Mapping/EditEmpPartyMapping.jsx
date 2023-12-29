import React, { useEffect, useState } from "react";
import group from "../../../images/group.png";
import { useLocation, useNavigate } from "react-router-dom";
import { BsArrowRightSquareFill, BsFillArrowLeftSquareFill } from "react-icons/bs"

import fetchAllEmployee from "../../../api/employeeAPI";
import getStateFunc from "../../../api/locationAPI";
import fetchAllParty, { getPartyType } from "../../../api/partyAPI";
import { toast } from "react-toastify";
import { addEmpPartyMapping, editEmpPartyMapping } from "../../../api/mappingAPI";
import { CircularProgress } from "@mui/material";


const EditEmpPartyMapping = () => {
    const location = useLocation()
    // console.log("location.state", location.state)

    const navigate = useNavigate()

    const [isLoading, setisLoading] = useState(false)
    const [btnLoading, setbtnLoading] = useState(false);

    const [allState, setallState] = useState([]);

    const [partyTypes, setpartyTypes] = useState()
    const [partySelected, setpartySelected] = useState(false);
    const [selectedPartyState, setselectedPartyState] = useState("");
    const [selectedPartyType, setselectedPartyType] = useState("");

    const [selectedEmp, setselectedEmp] = useState("");
    const [partyArr, setpartyArr] = useState([]);
    const [selectedPartyArr, setselectedPartyArr] = useState([]);

    useEffect(() => {
        getStateFunc().then((res) => setallState(res.data.result));
        getPartyType().then(res => setpartyTypes(res.data.result))

        // location state
        setselectedEmp(location.state.emp_id)
        setselectedPartyArr(location.state.parties)
        if (location.state.parties.length !== 0) setpartySelected(true)
    }, [])

    // console.log("partyArr", partyArr)
    // console.log("selectedPartyArr", selectedPartyArr)

    const partyHandleInput = async (e, type) => {
        // return console.log(e.target.value, type)
        setisLoading(true)

        if (type === "state") {
            setselectedPartyState(e.target.value)
            let res = await fetchAllParty({ state: e.target.value, partyType: selectedPartyType })
            if (!res.data.status) {
                return console.log("Some error in getParty api")
            }
            setpartyArr(res.data.result)
            setisLoading(false)
            setpartySelected(true)
        } else {
            setselectedPartyType(e.target.value)
            let res = await fetchAllParty({ state: selectedPartyState, partyType: e.target.value })
            if (!res.data.status) {
                return console.log("Some error in getParty api")
            }
            setpartyArr(res.data.result)
            setisLoading(false)
            setpartySelected(true)
        }
    }

    const partyArrHandleInput = (party, type) => {
        // return console.log(party, type)

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
    }

    const editEmpPartyMappingFunc = async () => {
        let arr = selectedPartyArr.map(party => party.id)
        let data = { party_id_arr: arr, emp_id: selectedEmp }

        // return console.log(data)

        setbtnLoading(true)
        let res = await editEmpPartyMapping(data)
        if (!res.data.status) {
            setbtnLoading(false)
            return toast.error(res.data.message)
        }

        toast.success("Edited Successfully!")
        navigate("/employee_party_mapping_listing")
    }

    return (
        <div className="container">
            <div className="beat_heading">
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">Edit Employee - Party Mapping ({location.state.emp_name})</div>
                </div>
                <div className="beat_right">
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
                        {partySelected === true && partyArr.length === 0 && selectedPartyArr.length === 0 ? (
                            <div className="no_data">
                                No Data
                            </div>
                        ) : partySelected === false ? (
                            <div className="no_data">
                                Select Party
                            </div>
                        ) : null}

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
                            onClick={() => editEmpPartyMappingFunc()}
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

export default EditEmpPartyMapping