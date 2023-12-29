import "./PartyGrouping.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import group from "../../images/group.png";

import Slider from "@mui/material/Slider";
import getStateFunc from "../../api/locationAPI";
import fetchAllParty, { addPartyGrouping, getPartyType } from "../../api/partyAPI";
import { blankValidator } from "../../utils/Validation";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import isAllowed from "../../utils/isAllowed";
import { PARTY_MANAGEMENT } from "../../constants";

const PartyGrouping = () => {
  const navigate = useNavigate();

  const [btnLoading, setbtnLoading] = useState(false);

  const [partyTypes, setpartyTypes] = useState()
  const [allPartyList, setallPartyList] = useState([]);

  const [allState, setallState] = useState([]);
  const [stateID, setstateID] = useState("");

  const [groupEmp, setgroupEmp] = useState([]);
  const [selectedName, setselectedName] = useState([]);

  const [partyGroup, setpartyGroup] = useState({
    grp_name: "",
    grp_description: "",
    partyIdStr: "",
    state: "",
  });

  const [error, setError] = useState({
    gname: {
      status: false,
    },
    gdesc: {
      status: false,
    },
  });

  const handleInput = (e) => {
    setError({
      gname: {
        status: false,
      },
      gdesc: {
        status: false,
      },
    });
    setpartyGroup({ ...partyGroup, [e.target.name]: e.target.value });
  };

  const toggleEmpGroup = (e) => {
    const shouldAdd = e.target.checked;
    const empId = e.target.value;
    if (shouldAdd) {
      setgroupEmp([...groupEmp, empId]);
      setselectedName([...selectedName, e.target.name]);
      return;
    }
    setgroupEmp(groupEmp.filter((id) => id !== empId));
    setselectedName(selectedName.filter((name) => name !== e.target.name));
  };

  const createPartyGroup = async () => {
    setbtnLoading(true)
    if (!await isAllowed(PARTY_MANAGEMENT)) {
      toast.error("Module is not purchased!");
      return setbtnLoading(false);
    }

    // console.log(partyGroup, groupEmp.length)
    if (partyGroup.state === "") return toast.error("Please Select State!")
    if (groupEmp.length === 0) return toast.error("Please Select Parties!")

    if (!blankValidator(partyGroup.grp_name)) {
      return setError({
        ...error,
        gname: {
          status: true,
        },
      });
    }
    if (!blankValidator(partyGroup.grp_description)) {
      return setError({
        ...error,
        gdesc: {
          status: true,
        },
      });
    }

    const empIds = groupEmp.join(",").trim();
    // console.log(empIds);

    let groupData = {
      ...partyGroup,
      partyIdStr: empIds,
    };

    // console.log(groupData);

    let res = await addPartyGrouping(groupData);
    // console.log(res);
    if (res.data.status) {
      toast.success("Party created Successfully!");
      navigate("/party_grouping_list");
      setbtnLoading(false);
    } else {
      toast.error(res.data.message);
      setbtnLoading(false);
    }
  };

  // Location API

  const stateHandleInput = async (e) => {
    setstateID(e.target.value);
    setpartyGroup({ ...partyGroup, [e.target.name]: e.target.value });
    try {
      fetchAllParty({ state: e.target.value }).then((res) => {
        setallPartyList(res.data.result);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const partyTypeFilter = async (e) => {
    // console.log(e.target.value);
    try {
      let res = await fetchAllParty({ state: stateID, partyType: e.target.value });
      // console.log(res);
      if (res.data.status) {
        setallPartyList(res.data.result);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStateFunc().then((res) => setallState(res.data.result));
    getPartyType().then(res => setpartyTypes(res.data.result))
  }, []);


  return (
    <div className="container">
      <div className="dash_heading">
        <div className="icon">
          <img src={group} alt="icon" />
        </div>
        <div className="title">Party Grouping</div>
      </div>

      <div className="party_container">
        <div className="grouping_title">Party List</div>
        <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
          <select
            name="state"
            className="grouping_select"
            onChange={stateHandleInput}
          >
            <option value="">Select State</option>
            {allState?.map((state) => (
              <option key={state.id} value={state.id}>{state.name}</option>
            ))}
          </select>

          {/* <select className="grouping_select" name="city" onChange={partyTypeFilter} > */}
          {/* <option
              value=""
              name="partyType"
              // onChange={partyTypeFilter}
            >
              Party Type
            </option>
            <option value="">Distributor</option>
            <option value="63766b79043f582fcc7a80e1">SS</option> 
              </select> */}
          <select
            // class="grouping_select"
            name="partyType"
            onChange={partyTypeFilter}
          >
            <option value="">All Party Type</option>
            {partyTypes?.map((type) => (
              <option key={type._id} value={type._id}>{type.party_type}</option>
            ))}
          </select>
        </div>

        <div className="grouping_checkbox">
          {allPartyList?.map((party) => (
            <div className="grouping_row">
              <input
                type="checkbox"
                value={party.id}
                name={party.firmName}
                onChange={toggleEmpGroup}
                checked={groupEmp.includes(party.id)}
              />
              <label htmlFor="">{party.firmName}</label>
            </div>
          ))}
        </div>
        {/* <div className="grouping_slider">
          <Slider
            defaultValue={2}
            onChange={sliderHandleChange}
            aria-label="Default"
            valueLabelDisplay="auto"
            style={{ color: "var(--main-color)" }}
          />
        </div> */}
      </div>

      <div className="party_container">
        <div className="grouping_title">Selected Party</div>

        <div className="grouping_checkbox grouping_select">
          {selectedName?.map((i, name) => (
            <div className="grouping_row">
              <div>
                {name + 1}. {i}
              </div>
            </div>
          ))}
        </div>
        {/* <div className="grouping_slider">
          <Slider
            defaultValue={2}
            onChange={sliderHandleChange}
            aria-label="Default"
            valueLabelDisplay="auto"
            style={{ color: "var(--main-color)" }}
          />
        </div> */}
      </div>

      <div className="party_container">
        <div className="grouping_submit">
          <div className="message_left">
            <div className="message_form">
              <input
                type="text"
                name="grp_name"
                value={partyGroup.grp_name}
                onChange={handleInput}
                placeholder="Party Group Name"
              />
              {error.gname.status && (
                <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                  Please Party Group Name
                </p>
              )}
            </div>
          </div>
          <div className="message_right">
            <div className="message_form">
              <input
                type="text"
                name="grp_description"
                value={partyGroup.grp_description}
                onChange={handleInput}
                placeholder="Party Group Description"
              />
              {error.gdesc.status && (
                <p style={{ width: "98%", fontSize: "0.9rem", color: "red" }}>
                  Please Party Group Description
                </p>
              )}
            </div>
          </div>
        </div>

        <div
          className="message_btn submit_btn"
          onClick={() => createPartyGroup()}
        >
          {btnLoading ? (
            <CircularProgress style={{ color: "#fff" }} size={26} />
          ) : (
            "SUBMIT"
          )}
        </div>
      </div>
    </div>
  );
};

export default PartyGrouping;
