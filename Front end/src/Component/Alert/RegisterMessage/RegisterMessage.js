import React from "react";
import "./RegisterMessage.css";
import {Link} from "react-router-dom"

function RegisterMessage(props){
    return (
        <div className="register text-light">
          {props.startMessage} <Link  to={props.link}>Click here</Link> {props.endMessage}
        </div>
      );
}

export default RegisterMessage;