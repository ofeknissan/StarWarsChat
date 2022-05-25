import React from 'react'
import "./CurrentContactDetails.css"
const CurrentContactDetails = (props) => {
    return (
      <>
        <div className="d-flex text-light bd-highlight align-items-center user-details-box">
          <div className="p-2 user-img-div">
            <img
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              className="user-img"
              src={props.img}
            ></img>
          </div>
          <div className="p-2 bd-highlight">{props.children}</div>
        </div>
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content modal-current-contact">
              <div className="modal-body"><center><img src={props.img} className='modal-img'/></center></div>
            </div>
          </div>
        </div>
      </>
    );
    };

export default CurrentContactDetails