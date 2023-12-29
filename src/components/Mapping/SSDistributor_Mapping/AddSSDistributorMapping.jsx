import React, { useEffect, useState } from "react";
import group from "../../../images/group.png";
import { useNavigate } from "react-router-dom";
import { BsArrowRightSquareFill, BsFillArrowLeftSquareFill } from "react-icons/bs"

import fetchAllEmployee from "../../../api/employeeAPI";
import getStateFunc from "../../../api/locationAPI";
import fetchAllParty, { fetchAllUnmappedParty, getPartyType } from "../../../api/partyAPI";
import { toast } from "react-toastify";
import { addSSDistributor } from "../../../api/mappingAPI";
import { CircularProgress } from "@mui/material";


const AddSSDistributorMapping = () => {
    const navigate = useNavigate()

    const [isLoading, setisLoading] = useState(false)
    const [btnLoading, setbtnLoading] = useState(false);

    const [allState, setallState] = useState([]);
    const [allSS, setallSS] = useState([]);

    const [selectedSS, setselectedSS] = useState("")
    const [partyArr, setpartyArr] = useState([]);
    const [selectedPartyArr, setselectedPartyArr] = useState([]);

    useEffect(() => {
        getStateFunc().then((res) => setallState(res.data.result));
        fetchAllParty({ partyType: "63766b79043f582fcc7a80e1" }).then(res => setallSS(res.data.result))
        fetchAllUnmappedParty().then(res => setpartyArr(res.data.result))
    }, [])

    const stateHandleInput = async (e) => {
        // fetchAllParty(null, e.target.value, "63766bb0043f582fcc7a80e5").then(res => {
        fetchAllParty({ state: e.target.value, partyType: "63766bb0043f582fcc7a80e5" }).then(res => {
            setpartyArr(res.data.result)
            setisLoading(false)
        })
    };

    const partyHandleInput = async (e, type) => {
        // console.log(e.target.value, type)

        if (type === "state") {
            // setisLoading(true)
            fetchAllUnmappedParty({ state: e.target.value }).then(res => {
                setpartyArr(res.data.result)
                setisLoading(false)
            })
            // setpartySelected(true)
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
    }

    const addEmpPartyMappingFunc = async () => {
        if (setselectedSS === "") return toast.error("Please Select Employee!")
        let arr = selectedPartyArr.map(party => party.id)
        if (arr.length === 0) return toast.error("Please Select Parties!")

        let data = { distributor_id_arr: arr, ss_id: selectedSS }
        // console.log(data)

        setbtnLoading(true)
        let res = await addSSDistributor(data)
        if (!res.data.status) {
            setbtnLoading(false)
            return toast.error(res.data.message)
        }

        toast.success("SS Distributor Mapped Successfully!")
        navigate("/ss_distributor_mapping")
    }


    return (
        <div className="container">
            <div className="beat_heading">
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">SS - Distributor Mapping</div>
                </div>
                <div className="beat_right">
                </div>
            </div>

            <div className="party_container" style={{ marginBottom: "1.5rem" }}>
                <div className="emp_party_emp_container">
                    <select onChange={stateHandleInput}>
                        <option value="">Select State (SS)</option>
                        {allState?.map((state) => (
                            <option key={state.id} value={state.id}>{state.name}</option>
                        ))}
                    </select>
                    <select onChange={(e) => setselectedSS(e.target.value)} >
                        <option value="">Select SS</option>
                        {allSS.length === 0 && <option disabled value="">No Party Found</option>}
                        {allSS?.map((party) => (
                            <option key={party.id} value={party.id}>{party.firmName} </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="party_container">
                <div className="emp_party_emp_container" >
                    <select onChange={(e) => partyHandleInput(e, "state")} style={{ flex: 1 }}>
                        <option value="">Select State (Disributor)</option>
                        {allState?.map((state) => (
                            <option key={state.id} value={state.id}>{state.name}</option>
                        ))}
                    </select>
                    <div style={{ flex: 1 }}></div>
                </div>

                {isLoading === true ? (
                    <div style={{ display: "flex", alignItems: "center", minHeight: "300px" }} >
                        <CircularProgress />
                    </div>
                ) : (
                    <>
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
                                "SAVE"
                            )}
                        </div>
                    </>
                )}
            </div>

        </div >
    )
}

export default AddSSDistributorMapping