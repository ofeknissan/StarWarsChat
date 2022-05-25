import React, { useRef } from "react";
import EmojiPicker from "./EmojiPicker/EmojiPicker";
import "./Toolbox.css"
import ToolBoxPaperclip from "./ToolBoxPaperclip";

const ToolBox = (props) => {
  const message = useRef(null);
  return (
    <div className="d-flex flex-row align-items-center toolbox">
      <EmojiPicker message={message}/>
      <ToolBoxPaperclip contact={props.contactName} server={props.contactServer} addMessage={props.addMessage}/>
      <div className="p-2 flex-grow-1 ">
        <form onSubmit={(e) => {
          e.preventDefault();
          if(message.current.value === "") {
            return;
          }
          props.addMessage(message.current.value, "Text",props.contactName, props.contactServer);
          //element.scrollTop = element.scrollHeight;
          message.current.value = "";
        }}>
        <div className="input-group">
          <input ref={message}
            type="text"
            className="form-control"
            placeholder="New Message Here..."
            aria-describedby="basic-addon2"
          />
          <div className="input-group-append ">
            <button className="btn btn-outline-light text-light " >
              <a className="btn-text">Send</a>
            </button>
          </div>
        </div>
        </form>
      </div>
    </div>
  );
};

export default ToolBox;
