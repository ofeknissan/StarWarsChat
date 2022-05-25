import React from "react";
import "./TextMessage.css";

const TextMessage = (props) => {
  return (
    <div id={props.id} className={`${props.isSender && 'ms-auto'} bubble-wrapper`}>
    <div className={`d-inline-flex flex-column p-2 ms-2 mb-2 bd-highlight ${!props.isSender && 'message-reciever'} ${props.isSender && 'message-sender'}`}>
      <div className="left-point"></div>
      <div>{props.children}</div>
      <div className="ms-auto mt-2 message-time">{props.time}</div> 
      <div></div>
    </div>
    </div>
  );
};
export default TextMessage;
