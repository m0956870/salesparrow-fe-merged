import React, { useEffect, useState } from 'react'
import group from "../../images/group.png";
import { useLocation } from 'react-router-dom'

// Google Map
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import isAllowed from '../../utils/isAllowed';
import { toast } from 'react-toastify';
import { LIVE_TRACKING } from '../../constants';

const EmployeeTravelPath = () => {
    const { state: employee } = useLocation();
    console.log("location: employee", employee);

    const [center, setcenter] = useState({ lat: 28.38, lng: 77.12 })

    useEffect(() => {
        getEmpLocationFunc()
    }, [employee])

    let getEmpLocationFunc = async () => {
        if (!await isAllowed(LIVE_TRACKING)) return toast.error("Module is not purchased!");
        if (employee?.location) {
            employee?.location.map(obj => {
                obj.lat = Number(obj.lat);
                obj.lng = Number(obj.long);
            })
            setcenter({ lat: Number(employee?.location?.[0]?.lat), lng: Number(employee?.location?.[0]?.long) })
        }
    }

    //   Map
    const containerStyle = {
        width: '100%',
        height: '100%'
    };

    const options = {
        // path: path,
        path: employee?.location,
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
            <div className="beat_heading">
                <div className="beat_left">
                    <div className="icon">
                        <img src={group} alt="icon" />
                    </div>
                    <div className="title">{employee.emp_name}</div>
                </div>
                <div className="beat_right">
                </div>
            </div>

            <div id="map" style={{ marginTop: 0 }}>
                <LoadScript
                    googleMapsApiKey={process.env.REACT_APP_GOOGLE_KEY}
                >
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={{
                            lat: center.lat,
                            lng: center.lng
                        }}
                        zoom={9}
                    >
                        <Polyline
                            options={options}
                        />
                        {employee?.location?.slice(1, employee?.location?.length - 1).map(lc => (
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
                                lat: Number(employee?.location?.[0]?.lat),
                                lng: Number(employee?.location?.[0]?.long)
                            }}
                            icon={"http://maps.google.com/mapfiles/kml/paddle/grn-circle.png"}
                            title={`Date: ${new Date(employee?.location?.[0]?.date).toLocaleDateString()}\nTime: ${new Date(employee?.location?.[0]?.date).toLocaleTimeString()}\nLocation: ${employee?.location?.[0]?.name}`}
                        />
                        <Marker
                            position={{
                                lat: Number(employee?.location?.[employee?.location?.length - 1]?.lat),
                                lng: Number(employee?.location?.[employee?.location?.length - 1]?.long)
                            }}
                            icon={"http://maps.google.com/mapfiles/kml/paddle/stop.png"}
                            title={`Date: ${new Date(employee?.location?.[employee?.location?.length - 1]?.date).toLocaleDateString()}\nTime: ${new Date(employee?.location?.[employee?.location?.length - 1]?.date).toLocaleTimeString()}\nLocation: ${employee?.location?.[employee?.location?.length - 1]?.name}`}
                        />
                    </GoogleMap>
                </LoadScript>
            </div>
        </div >
    )
}

export default EmployeeTravelPath