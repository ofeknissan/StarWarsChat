import React from "react";
import "./VoiceMessage.css";

const VoiceMessage = (props) => {
    return (
        <div className={`${props.isSender && 'ms-auto'} bubble-wrapper`}>
            <div className={`d-inline-flex flex-column p-2 ms-2 mb-2 bd-highlight ${!props.isSender && 'Vmessage-reciever'} ${props.isSender && 'Vmessage-sender'}`}>
                <div className="left-point"></div>
                <audio className="audio-message" controls>
                    <source src={props.children} type="audio/mpeg" />
                </audio>
                <div className="ms-auto message-time">{props.time}</div>
                <div></div>
            </div>
        </div>
    );
};
export default VoiceMessage;
