// /*global google*/
// import ReactDOM from "react-dom";
// import React from "react";

// import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
// // import data from "./data.json";

// const defaultLocation = { lat: 40.712775, lng: -74.005973 };

// class Map extends React.Component {
//   state = {
//     markerposition: defaultLocation,
//     place: "Default Position - New York"
//   };



//   onMouseOverEvent = place => {
//     this.setState({
//       markerposition: { lat: place.lat, lng: place.lng },
//       place: place.name
//     });
//   };

//   render() {
//     return (
//       <div>
//         <GoogleMap
//           center={defaultLocation}
//           zoom={8}
//           mapContainerStyle={{ height: "400px", width: "800px" }}
//         >
//           <Marker
//             //onLoad={onLoad}
//             position={this.state.markerposition}
//           >
//             <InfoWindow options={{ maxWidth: 100 }}>
//               <span>{this.state.place}</span>
//             </InfoWindow>
//           </Marker>
//         </GoogleMap>
//         {data.map((place, index) => (
//           <p key={index} onMouseOver={() => this.onMouseOverEvent(place)}>
//             {place.name}
//           </p>
//         ))}
//       </div>
//     );
//   }
// }

// export default Map;