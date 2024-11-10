import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Radio } from "react-loader-spinner"; // import Radio from your source

export default function createInfoWindow(map, position) {
  const [radioIsVisible, setRadioIsVisible] = useState(false);

  const infoWindowDiv = document.createElement("div");

  const infoWindow = new window.google.maps.InfoWindow({
    content: infoWindowDiv,
    disableAutoPan: true,
    position,
  });

  ReactDOM.render(
    <div style={{ textAlign: "center" }}>
      <button style={{ padding: "5px 10px", fontSize: "14px" }}>
        Click Me!
      </button>
      <button style={{ padding: "5px 10px", fontSize: "14px" }}>
        ASK FOR RE-ROUTE
      </button>
      <Radio
        visible={radioIsVisible}
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="radio-loading"
      />
    </div>,
    infoWindowDiv
  );

  infoWindow.open(map);
  return infoWindow;
}

 