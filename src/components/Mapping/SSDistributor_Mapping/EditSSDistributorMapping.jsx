import React, { useEffect, useState } from "react";
import group from "../../../images/group.png";
import { useLocation, useNavigate } from "react-router-dom";
import { BsArrowRightSquareFill, BsFillArrowLeftSquareFill } from "react-icons/bs"

import fetchAllEmployee from "../../../api/employeeAPI";
import getStateFunc from "../../../api/locationAPI";
import fetchAllParty, { fetchAllUnmappedParty, getPartyType } from "../../../api/partyAPI";
import { toast } from "react-toastify";
import { addSSDistributor, editSSDistributor } from "../../../api/mappingAPI";
import { CircularProgress } from "@mui/material";


const EditSSDistributorMapping = () => {
    const location = useLocation()
    // console.log("location.state", location.state)

    const navigate = useNavigate()

    const [isLoading, setisLoading] = useState(false)
    const [btnLoading, setbtnLoading] = useState(false);

    const [allState, setallState] = useState([]);
    const [allSS, setallSS] = useState([]);

    const [selectedSS, setselectedSS] = useState("")
    const [partyArr, setpartyArr] = useState([]);
    const [selectedPartyArr, setselectedPartyArr] = useState([]);

    useEffect(() => {
        setselectedSS(location.state.ss_id)
        setselectedPartyArr(location.state.parties)
        getStateFunc().then((res) => setallState(res.data.result));
        fetchAllParty({ partyType: "63766b79043f582fcc7a80e1" }).then(res => setallSS(res.data.result))
        fetchAllUnmappedParty().then(res => setpartyArr(res.data.result))
    }, [])

    // const stateHandleInput = async (e) => {
    //     fetchAllParty(null, e.target.value, "63766b79043f582fcc7a80e1").then(res => setallSS(res.data.result))
    // };

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
        if (setselectedSS === "") return toast.error("Please Select Employee!")
        let arr = selectedPartyArr.map(party => party.id)
        if (arr.length === 0) return toast.error("Please Select Parties!")

        let data = { distributor_id_arr: arr, ss_id: selectedSS }
        // console.log(data)

        setbtnLoading(true)
        let res = await editSSDistributor(data)
        if (!res.data.status) {
            setbtnLoading(false)
            return toast.error(res.data.message)
        }

        toast.success("SS Distributor Mapping Edited Successfully!")
        navigate("/ss_distributor_mapping")
    }


    return (
        <div className="container">
            <div className="beat_heading">
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">Edit SS - Distributor Mapping ({location.state?.ss_name})</div>
                </div>
                <div className="beat_right">
                </div>
            </div>

            <div className="party_container">
                <div className="emp_party_emp_container">
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
                            onClick={() => editEmpPartyMappingFunc()}
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

export default EditSSDistributorMapping