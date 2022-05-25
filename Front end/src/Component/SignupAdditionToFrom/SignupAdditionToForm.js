import React, { useState } from "react";
import "../Form/Form.css"


const SignupAdditionToForm = (props) => {
  return (
    <>
      <div className="mb-2">
        <div className="passwordDetails">
          <label htmlFor="verifyPassword" className="form-label text-light fs-5">
            Confirm Password
          </label>
        </div>
        <input
          type="password"
          value={props.confirmPass}
          onChange={(e) => {
            props.setConfirmPass(e.target.value);
          }}
          className="form-control"
          id="verifyPassword"
          placeholder="Confirm Password"
        />
      </div>
      <div className="mb-2">
        <label htmlFor="displayName" className="form-label text-light fs-5">
          Display Name
        </label>
        <input
          type="text"
          value={props.displayName}
          onChange={(e) => {
            props.setdisplayName(e.target.value);
          }}
          className="form-control"
          id="displayName"
          placeholder="Display Name"
        />
      </div>
      <label htmlFor="imageInput" className="form-label text-light fs-5">
        image
      </label>
      <div className="input-group mb-2">
        <input
          id="imageInput"
          type="file"
          onChange={props.onImage}
          className={`form-control ${props.imageUpload && "image-input"}`}
        />
      </div>
    </>
  );
};

export default SignupAdditionToForm;