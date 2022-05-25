import React from 'react'
import "./GeoMessage.css"
import Geo from "../Geo/Geo"
const GeoMessage = (props) => {
    return (
        <div id={props.id} className={`${props.isSender && "ms-auto"} bubble-wrapper`}>
          <div
            className={`d-inline-flex flex-column p-2 ms-2 mb-2 bd-highlight ${
              !props.isSender && "Vmessage-reciever"
            } ${props.isSender && "Vmessage-sender"}`}
          >
            <div className="left-point"></div>
            <Geo>{props.children}</Geo>

            <div className="ms-auto message-time">{props.time}</div>
            <div></div>
          </div>
        </div>
      );
}

export default GeoMessage