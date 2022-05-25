import React from 'react'
import "./VideoMessage.css"
const VideoMessage = (props) => {
    return (
      <div className={`${props.isSender && "ms-auto"} bubble-wrapper`}>
        <div
          className={`d-inline-flex flex-column p-2 ms-2 mb-2 bd-highlight ${
            !props.isSender && "Vmessage-reciever"
          } ${props.isSender && "Vmessage-sender"}`}
        >
          <div className="left-point"></div>
          <video className='video-message' controls>
            <source src={props.children} type="video/mp4" />
            <source src={props.children} type="video/ogg" />
            <source src={props.children} type="video/mp4" />
            <source src={props.children} type="video/webm" />
            <source src={props.children} type="video/ogg" />
          </video>
          <div className="ms-auto message-time">{props.time}</div>
          <div></div>
        </div>
      </div>
    );
}

export default VideoMessage