import React from "react";
import "./UserDeatils.css";
import ContactModal from "../ContactModal/ContactModal.js";

const UserDeatils = (props) => {
  return (
    <div className="d-flex text-light bd-highlight align-items-center user-details-box">
      <div className="p-2 user-img-div">
        <img className="user-img" src={props.img} ></img>
      </div>
      <div className="p-2 bd-highlight name">{props.children}</div>
      <ContactModal onsubmit={props.onsubmit}></ContactModal>
    </div>
  );
};

export default UserDeatils;
