import "./Tracking.css";
import React, { useEffect, useState } from "react";
import group from "../../images/group.png";
import { useLocation, useNavigate } from "react-router-dom";
import getStateFunc from "../../api/locationAPI";
import { getAllEmpLocation } from "../../api/tracking";
import fetchAllEmployee from "../../api/employeeAPI";
import { toast } from "react-toastify";

// Google Map
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import isAllowed from "../../utils/isAllowed";
import { LIVE_TRACKING } from "../../constants";

const Tracking = () => {
  const navigate = useNavigate()
  const location = useLocation()
  // console.log("location", location)
  const [isLoading, setisLoading] = useState(false)

  const [allState, setallState] = useState([]);
  const [allEmployee, setallEmployee] = useState([]);

  const [center, setcenter] = useState({ lat: 28.38, lng: 77.12 })
  const [allEmpLocation, setallEmpLocation] = useState([]);
  const [allEmpMarkers, setallEmpMarkers] = useState([])
  const [selectedEmp, setselectedEmp] = useState(false)
  const [selectedEmpLocation, setselectedEmpLocation] = useState()

  const [filterData, setfilterData] = useState({
    emp_id: "",
  });

  useEffect(() => {
    getStateFunc().then((res) => setallState(res.data.result));
    fetchAllEmployee().then(res => setallEmployee(res.data.result));
    getAllEmpLocationFunc(filterData)
  }, [])

  useEffect(() => {
    if (selectedEmpLocation?.location) {
      selectedEmpLocation?.location.map(obj => {
        obj.lat = Number(obj.lat);
        obj.lng = Number(obj.long);
      })
      setcenter({ lat: Number(selectedEmpLocation?.location?.[0]?.lat), lng: Number(selectedEmpLocation?.location?.[0]?.long) })
    }
  }, [selectedEmpLocation])

  useEffect(() => {
    if (allEmpMarkers.length > 0) setcenter({ lat: Number(allEmpMarkers?.[0]?.lat), lng: Number(allEmpMarkers?.[0]?.lng), })
  }, [allEmpMarkers])


  // console.log("filterData", filterData)
  // console.log("allEmpLocation", allEmpLocation)
  // console.log("allEmpMarkers", allEmpMarkers);
  // console.log("selectedEmp", selectedEmp);
  // console.log("selectedEmpLocation", selectedEmpLocation);
  // console.log("center", center)


  async function getAllEmpLocationFunc(filterData) {
    setisLoading(true)
    if (!await isAllowed(LIVE_TRACKING)) {
      toast.error("Module is not purchased!");
      return setisLoading(false);
    }

    let { data } = await getAllEmpLocation(filterData)
    if (data.status) {
      setallEmpLocation(data.result)

      setallEmpMarkers([])
      data.result.map(emp => {
        if (Object.keys(emp.location).length !== 0) {
          // console.log(emp)
          let temp = {
            lat: emp.location.lat,
            lng: emp.location.long,
            emp_name: emp.emp_name,
            date: emp.location.date,
            location: emp.location.name
          }
          setallEmpMarkers(allEmpMarkers => [...allEmpMarkers, temp])
        }
      })
    } else {
      console.log("Some Error!")
    }
    setisLoading(false)
  }

  const filterHandleInput = (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value })
    fetchAllEmployee({ state: e.target.value }).then(res => setallEmployee(res.data.result));
  }

  const empHandleInput = (e) => {
    setfilterData({ ...filterData, [e.target.name]: e.target.value });
  };

  async function getEmpLocationFunc(filterData) {
    setisLoading(true)
    if (!await isAllowed(LIVE_TRACKING)) {
      toast.error("Module is not purchased!");
      return setisLoading(false);
    }
    if (filterData.emp_id === "") return toast.error("Select Employee First!")

    setisLoading(true)
    let { data } = await getAllEmpLocation(filterData)
    if (data.status) {
      setselectedEmp(true)
      setselectedEmpLocation(data.result[0])
      if (data.result[0].location.length === 0) return toast.error("No Location Availabe!")
    } else {
      console.log("Some Error!")
    }
    setisLoading(false)
  }

  // Map
  const containerStyle = {
    width: '100%',
    height: '100%'
  };

  const path = [
    { lat: 37.772, lng: -122.214 },
    { lat: 21.291, lng: -157.821 },
    { lat: -18.142, lng: 178.431 },
    { lat: -27.467, lng: 153.027 }
  ];

  const options = {
    // path: path,
    path: selectedEmpLocation?.location,
    strokeColor: "#3366cc",
    strokeOpacity: 1.0,
    strokeWeight: 1.5,
    geodesic: true,
    icons: [{
      icon: {
        path: "m0,0 v-5l10,5l-10,5z",
        rotation: 270,
        fillOpacity: 1,
      },
      offset: '90%',
      repeat: '80px',
    }]
  };


  return (
    <div className="container">
      <div className="dash_heading">
        <div className="icon">
          <img src={group} alt="icon" />
        </div>
        <div className="title">
          All Team Members: Current or Last Known Location!
        </div>
      </div>

      <div className="tracking_tabs">
        <div className="tarcking_tab_left">
          <select name="state" onChange={filterHandleInput}>
            <option value="">Select State</option>
            {allState.length === 0 && <option disabled value="">No States Found</option>}
            {allState?.map((state) => (
              <option key={state.id} value={state.id}>{state.name}</option>
            ))}
          </select>
          <select name="emp_id" onChange={empHandleInput} >
            <option value="">Select an Employee</option>
            {allEmployee.length === 0 && <option disabled value="">No Employee Found</option>}
            {allEmployee?.map((state) => (
              <option key={state.id} value={state.id}>{state.employeeName}</option>
            ))}
          </select>
          <div className="view_btn" onClick={() => getEmpLocationFunc(filterData)}>
            View
          </div>
        </div>
        <div className="tarcking_tab_right">
          <div className="radio_title">Select Option:</div>
          <div className="radio_input">
            <div>
              <input type="radio" name="select" />
              <label>Attendence Wise</label>
            </div>
            <div>
              <input type="radio" name="select" />
              <label>Locaton Wise</label>
            </div>
          </div>
        </div>
      </div>

      <div id="map">
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_KEY}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{
              lat: center.lat,
              lng: center.lng
            }}
            zoom={10}
          >
            {selectedEmp ? (
              <>
                <Polyline
                  options={options}
                />
                {selectedEmpLocation?.location?.slice(1, selectedEmpLocation?.location?.length - 1).map(lc => (
                  <Marker
                    icon={""}
                    // icon={"http://maps.google.com/mapfiles/kml/shapes/man.png"}
                    position={{
                      lat: Number(lc.lat),
                      lng: Number(lc.long)
                    }}
                    title={`Date: ${new Date(lc.date).toLocaleDateString()}\nTime: ${new Date(lc.date).toLocaleTimeString()}\nLocation: ${lc.name}`}
                  />
                ))}
                <Marker
                  position={{
                    lat: Number(selectedEmpLocation?.location?.[0]?.lat),
                    lng: Number(selectedEmpLocation?.location?.[0]?.long)
                  }}
                  // icon={"http://maps.google.com/mapfiles/markerA.png"} // for letter A
                  icon={"http://maps.google.com/mapfiles/kml/paddle/grn-circle.png"}
                  title={`Date: ${new Date(selectedEmpLocation?.location?.[0]?.date).toLocaleDateString()}\nTime: ${new Date(selectedEmpLocation?.location?.[0]?.date).toLocaleTimeString()}\nLocation: ${selectedEmpLocation?.location?.[0]?.name}`}
                />
                <Marker
                  position={{
                    lat: Number(selectedEmpLocation?.location?.[selectedEmpLocation?.location?.length - 1]?.lat),
                    lng: Number(selectedEmpLocation?.location?.[selectedEmpLocation?.location?.length - 1]?.long)
                  }}
                  icon={"http://maps.google.com/mapfiles/kml/paddle/stop.png"}
                  title={`Date: ${new Date(selectedEmpLocation?.location?.[selectedEmpLocation?.location?.length - 1]?.date).toLocaleDateString()}\nTime: ${new Date(selectedEmpLocation?.location?.[selectedEmpLocation?.location?.length - 1]?.date).toLocaleTimeString()}\nLocation: ${selectedEmpLocation?.location?.[selectedEmpLocation?.location?.length - 1]?.name}`}
                />
              </>
            ) : (
              <>
                {allEmpMarkers?.map(marker => (
                  <Marker
                    icon={"https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|69ff8a"}
                    title={`Name: ${marker.emp_name}\nDate: ${new Date(marker.date).toLocaleDateString()}\nTime: ${new Date(marker.date).toLocaleTimeString()}\nLocation: ${marker.location}`}
                    position={{
                      lat: Number(marker.lat),
                      lng: Number(marker.lng)
                    }}
                  />
                ))}
              </>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div >
  );
};

export default Tracking;
