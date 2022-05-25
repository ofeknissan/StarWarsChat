import React from 'react'
import "./ContactDetails.css"
import {convertLastTime} from "../../Util/TimeCompute"
const ContactDetails = (props) => {
  const getHourDate = (time) => {
    if (time[0] == 'F') {
      // In Case That sending was failed
      return "Sending Failed"
    }
    const date = time.substring(0,10);
    const hour = time.substring(11,16);
    return date + " " + hour;
  }
  const gettotalSeconds = (time) => {
    if (time[0] == 'F') {
      // In Case That sending was failed
      return Math.floor(new Date().getTime()/1000)
    }
    console.log(parseInt(time.substring(20,time.length)));
    return parseInt(time.substring(20,time.length));
  }
  return (
    <div
      onClick={() => {
        props.onClick(props.name, props.img, props.display, props.server);
      }}
      className={`d-flex text-light bd-highlight align-items-center contact-details ${
        props.isClicked && "contact-clicked"
      }`}
    >
      <div className="p-2  flex-shrink-0 ">
        <img className="contactImage" src={props.img}></img>
      </div>
      <div className="ms-4 Contact-message flex-grow-1">
        <div className="bd-highlight Contact-Name">
          {props.display} {props.time != null && <h6 className="ms-auto time-ago">{convertLastTime(gettotalSeconds(props.time))}</h6>}
        </div>
        <div className="lastMessage">{props.children}</div>
        {props.time != null &&<h6 className="ms-auto time-ago">{getHourDate(props.time)}</h6>}
      </div>
    </div>
  );
}

export default ContactDetails