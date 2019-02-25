import React from "react";
import your_icon_url from "./../assets/cab.png";
import {
    withGoogleMap,
    GoogleMap,
    withScriptjs,
    Marker,
    InfoWindow
} from "react-google-maps";
import { compose, withProps, withStateHandlers } from "recompose";

const MapWithPlaces = compose(
    withProps({
        googleMapURL:
            "https://maps.googleapis.com/maps/api/js?key=AIzaSyAq06l5RUVfib62IYRQacLc-KAy0XIWAVs&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `50%` }} />,
        containerElement: <div style={{ height: "50vh", width: "80%",margin:"auto" }} />,
        mapElement: <div style={{ height: "100%" }} />
    }),
    withStateHandlers(
        props => ({
            infoWindows: props.places.map(p => {
                return { isOpen: true };
            })
        }),
        {
            onToggleOpen: ({ infoWindows }) => selectedIndex => ({
                infoWindows: infoWindows.map((iw, i) => {
                    iw.isOpen = selectedIndex === i;
                    return iw;
                })
            })
        }
    ),
    withScriptjs,
    withGoogleMap
)(props => (
    <GoogleMap defaultZoom={props.zoom} defaultCenter={props.center}>
        {props.places &&
        props.places.map((place, i) => {
            let lat = parseFloat(place.lat, 10);
            let lng = parseFloat(place.lng, 10);

            return (
                <Marker
                    id={i}
                    key={i}
                    position={{ lat: lat, lng: lng }}
                    title="Click to zoom"
                    onClick={props.onToggleOpen.bind(this, i)}
                    options={{icon: your_icon_url}}
                >
                    {props.infoWindows[i].isOpen && (
                        <InfoWindow onCloseClick={props.onToggleOpen.bind(i)}>
                            <div>{place.brand}</div>
                        </InfoWindow>
                    )}
                </Marker>
            );
        })}
    </GoogleMap>
));

export default MapWithPlaces;
