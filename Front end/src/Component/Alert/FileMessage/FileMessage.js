import React from 'react'
import "./FileMessage.css"
const FileMessage = (props) => {
    return (
      <div id={props.id} className={`${props.isSender && "ms-auto"} bubble-wrapper`}>
        <div
          className={`d-inline-flex flex-column p-2 ms-2 mb-2 bd-highlight ${
            !props.isSender && "Vmessage-reciever"
          } ${props.isSender && "Vmessage-sender"}`}
        >
          <div className="left-point"></div>
          <a href={props.children} download>
            <img className='file-message' src="/Images/file-message.png" alt="fileDownload" />
          </a>

          <div className="ms-auto message-time">{props.time}</div>
          <div></div>
        </div>
      </div>
    );
}

export default FileMessage