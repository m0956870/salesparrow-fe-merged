const { GoogleMap, LoadScript } = require("../../");
const ScriptLoaded = require("../../docs/ScriptLoaded").default;

const mapContainerStyle = {
  height: "400px",
  width: "800px"
}

const center = {
  lat: 0,
  lng: -180
}

const position = {
  lat: 37.772,
  lng: -122.214
}

const onLoad = marker => {
  console.log('marker: ', marker)
}

<ScriptLoaded>
  <GoogleMap
    id="marker-example"
    mapContainerStyle={mapContainerStyle}
    zoom={2}
    center={center}
  >
    <Marker
      onLoad={onLoad}
      position={position}
    />
    <Marker
      onLoad={onLoad}
      position={{
        lat: 37.572,
        lng: -122.214
      }}
    />
    <Marker
      onLoad={onLoad}
      position={{
        lat: 37.872,
        lng: -122.114
      }}
      title="title: title\nbody: body"
    />
  </GoogleMap>
</ScriptLoaded>