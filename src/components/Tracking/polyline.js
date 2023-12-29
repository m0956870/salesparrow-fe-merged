const { GoogleMap, LoadScript } = require("../../");
const ScriptLoaded = require("../../docs/ScriptLoaded").default;

const mapContainerStyle = {
  height: "400px",
  width: "800px"
};

const center = {
  lat: 0,
  lng: -180
};ra

const onLoad = polyline => {
  console.log('polyline: ', polyline)
};

const path = [
  { lat: 37.772, lng: -122.214 },
  { lat: 21.291, lng: -157.821 },
  { lat: -18.142, lng: 178.431 },
  { lat: -27.467, lng: 153.027 }
];

const options = {
  path: path,
  strokeColor: "#000",
  strokeOpacity: 1.0,
  strokeWeight: 2,
  geodesic: true,
  icons: [{
    icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
    offset: '100%',
    repeat: '20px'
  }]
};

// const symbolOne = {
//   path: "M 0,-1 0,1",
//   strokeOpacity: 1,
//   scale: 4,
// };
// const symbolTwo = {
//   path: "M 10 80 Q 95 10 180 80",
//   strokeColor: "#00F",
//   rotation: 45,
// };
// const symbolThree = {
//   path: "M -2,-2 2,2 M 2,-2 -2,2",
//   strokeColor: "#292",
//   strokeWeight: 4,
// };

<ScriptLoaded>
  <GoogleMap
    id="marker-example"
    mapContainerStyle={mapContainerStyle}
    zoom={2}
    center={center}
  >
    <Polyline
      onLoad={onLoad}
      path={path}
      options={options}
    />
  </GoogleMap>
</ScriptLoaded>