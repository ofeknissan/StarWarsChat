import React, {useState} from "react";
import "./ImageMessage.css";
function stringGen(len) {
    var text = "";
    
    var charset = "abcdefghijklmnopqrstuvwxyz";
    
    for (var i = 0; i < len; i++)
      text += charset.charAt(Math.floor(Math.random() * charset.length));
    
    return text;
  }
const ImageMessage = (props) => {
    const [id,setId] = useState(stringGen(7));
    return (
      <>
        <div id={props.id} className={`${props.isSender && "ms-auto"} bubble-wrapper`}>
          <div
            className={`d-inline-flex flex-column p-2 ms-2 mb-2 bd-highlight ${
              !props.isSender && "Imessage-reciever"
            } ${props.isSender && "Imessage-sender"}`}
          >
            <div className="left-point"></div>
            <img
              data-bs-toggle="modal"
              data-bs-target={'#'+id}
              className="img-message"
              src={props.children}
            />
            <div className="ms-auto message-time">{props.time}</div>
            <div></div>
          </div>
        </div>
        <div
          className="modal fade"
          id={id}
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content modal-current-contact">
              <div className="modal-body">
                <center>
                  <img src={props.children} className="message-img" />
                </center>
              </div>
            </div>
          </div>
        </div>
      </>
    );
};
export default ImageMessage;
