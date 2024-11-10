import { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  useMapsLibrary,
  useMap,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { Radio } from "react-loader-spinner";
import { MarkerWithLabel } from "@googlemaps/markerwithlabel";
import busStopData from "./stops.json";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import sendEmail from "./components/informPassengers";

export default function App() {
  const position = {
    lat: 43.72384232266183,
    lng: -79.78807121381678,
  };
  let envApiKey = "AIzaSyDz807Drm21mgdUj3Nq_gMZX9QCnnpkeHI";

  const [isHidden, setIsHidden] = useState(true);

  const SetVisibility = (data) => {};

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
      }}
    >
      <APIProvider apiKey={envApiKey}>
        <Map
          zoomControl={false}
          scaleControl={false}
          disableDefaultUI={true}
          center={position}
          fullscreenControl={true}
          scrollwheel={true}
          draggingCursor={true}
          region="UA"
          reuseMaps={true}
          streetViewControl={false}
          streetViewControlclassName="map"
          gestureHandling="cooperative"
          mapId={"a09bde2d184c58b8"}
          zoom={14}
          heading={324}
          tilt={15}
        >
          <Directions isHidden={isHidden} />
          <CustomMarker
            position={{ lat: 43.72912430100662, lng: -79.7992844016058 }}
            func={SetVisibility}
          />
          <BusStopMarkers busStopData={busStopData} />
        </Map>
      </APIProvider>
    </div>
  );
}

function BusStopMarkers({ busStopData }) {
  return (
    <>
      {busStopData.features.map((stop, index) => {
        const position = {
          lat: parseFloat(stop.geometry.coordinates[1]),
          lng: parseFloat(stop.geometry.coordinates[0]),
        };

        return (
          <AdvancedMarker key={index} position={position}>
            <span>🚍</span>
          </AdvancedMarker>
        );
      })}
    </>
  );
}

function CustomMarker({ position, func }) {
  const map = useMap();
  const [marker, setMarker] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDirectionVisible, setIsDirectionVisible] = useState(false);

  useEffect(() => {
    func(isHovered);
  }, [isHovered]);

  useEffect(() => {
    if (!map) return;

    // Create the marker
    const newMarker = new window.google.maps.Marker({
      position,
      map,
      icon: getMarkerIcon(false),
    });
    setMarker(newMarker);

    // Create the InfoWindow but keep it hidden initially
    const newInfoWindow = new window.google.maps.InfoWindow({
      content: `<div id="infoWindowContent" ">
      <button id="markerButton" style="padding: 10px 20px; font-size: 16px; background-color: #ff4d4f; color: #fff; border: none; border-radius: 5px; cursor: pointer;">
        <h1 style="margin: 0; font-size: 18px;">Road Closure Detected, Reroute Required!</h1>
      </button>
    </div>
    `,
      disableAutoPan: true,
    });
    setInfoWindow(newInfoWindow);

    newMarker.addListener("mouseover", (event) => {
      setIsHovered(true);

      newInfoWindow.open(map, newMarker);
    });

    newMarker.addListener("mouseout", (event) => {
      setTimeout(() => {
        setIsHovered(false);
      }, 5000);
    });

    return () => {
      newMarker.setMap(null);
      newInfoWindow.close();
      func(false);
    };
  }, [map, position, isHovered]);

  const getMarkerIcon = (isHovered) => {
    const emoji = "🛑🙅‍♂️";
    return {
      url:
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
              <rect width="40" height="50" fill="white" rx="10" ry="10" />
                <text x="50%" y="40%" font-size="18" text-anchor="middle" dominant-baseline="central">🛑</text>
                     <text x="50%" y="70%" font-size="18" text-anchor="middle" dominant-baseline="central">🙅‍♂️</text>          
            </svg>
          `),
      scaledSize: new window.google.maps.Size(80, 100),
    };
  };
}

function Directions() {
  const isHidden = false;
  console.log(isHidden);
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState();
  const [directionsRenderer, setDirectionsRenderer] = useState();
  const [routes, setRoutes] = useState([]);
  const [originalRoute, setoriginalRoute] = useState();
  const [requestedReRoute, setRequestedReRoute] = useState();
  const [routeIndex, setRouteIndex] = useState(0);
  const [radioIsVisible, setRadioIsVisible] = useState(false);
  const [directionBoxIsVisible, setDirectionBoxIsVisible] = useState(isHidden);
  const [isRerouted, setIsReRouted] = useState(false);
  const [alertPassengers, setAlertPassengers] = useState(false);
  const selected = routes[routeIndex];
  const leg = selected?.legs[0];

  const setResponse = require("./routes.json");
  console.log(setResponse);

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());

    const renderOptions = new routesLibrary.DirectionsRenderer({ map });

    renderOptions.setOptions({
      polylineOptions: {
        strokeColor: "red",
        strokeWeight: "7",
      },
    });
    setDirectionsRenderer(renderOptions);
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    directionsService
      .route({
        origin: "trinity common mall, 80 great lakes dr, brampton, on l6r 2k",
        destination: "Mount Pleasant Go station",
        // travelMode: window.google.maps.TravelMode.DRIVING,
        travelMode: window.google.maps.TravelMode.TRANSIT,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        console.log(response);
        directionsRenderer.setDirections(setResponse);
        setRoutes(setResponse.routes);
        setoriginalRoute(setResponse.routes[0]);
        setRequestedReRoute(setResponse.routes[1]);
      });

    return () => directionsRenderer.setMap(null);
  }, [directionsService, directionsRenderer]);

  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer]);

  useEffect(() => {
    const element = document.querySelector(".directions");

    if (element) {
      const handleMouseOver = () => setDirectionBoxIsVisible(true);
      const handleMouseOut = () => setDirectionBoxIsVisible(false);

      element.addEventListener("mouseover", handleMouseOver);
      element.addEventListener("mouseout", handleMouseOut);

      return () => {
        element.removeEventListener("mouseover", handleMouseOver);
        element.removeEventListener("mouseout", handleMouseOut);
      };
    }
  }, []);

  if (!leg) return null;
  if (directionBoxIsVisible) return null;
  return (
    <div className="directions">
      {routeIndex == 0 ? <h1>Original Route</h1> : <h1>RE Route</h1>}

      <h2>{selected.summary}</h2>
      <p>
        {leg.start_address.split(",")[0]} to {leg.end_address.split(",")[0]}
      </p>
      <p>Distance: {leg.distance?.text}</p>
      <p>Duration: {leg.duration?.text}</p>

      <button
        className={!isRerouted ? "reroute-btn" : "reroute-delivered-btn"}
        disabled={isRerouted}
        onClick={() => {
          setRadioIsVisible(true);

          setTimeout(() => {
            setRadioIsVisible(false);
            setRouteIndex((routeIndex + 1) % 2);
            setIsReRouted(true);
          }, 4500);
        }}
      >
        {!isRerouted ? " ASK FOR RE-ROUTE" : "Re-Routet Delivered"}
      </button>
      <Radio
        visible={radioIsVisible}
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="radio-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />

      {isRerouted && (
        <div className="reroute-container">
          <span className="flex justify-center align-middle">
            {!alertPassengers ? (
              <>
                <h2>ALERT PASSENGERS!</h2>
                <button
                  className="reroute-option-btn"
                  onClick={() => {
                    sendEmail();
                    setAlertPassengers(true);
                  }}
                >
                  Yes
                </button>
              </>
            ) : (
              <h2>NOTIFICATION SENT TO PASSENGERS!</h2>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
