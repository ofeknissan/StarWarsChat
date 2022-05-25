import React, { useState } from "react";
import "./Signup.css";
import "../SignIn/SignIn.css";
import Alert from "../Alert/Alert";
import Form from "../Form/Form";
import RegisterMessage from "../RegisterMessage/RegisterMessage.js";

const Signup = () => {
  return (
    <div className="fullPage">
      <video className="signUpVideo"
        playsInline="playsinline"
        poster="/Images/Poster.png"
        autoPlay="autoplay"
        muted="muted"
        loop="loop"
      >
        <source src="/videos/background-signup.mp4" type="video/mp4" />
      </video>
      <div className="signIn">
        <div className="container form-container">
          <div className="row mb-3">
            <h1 className="text-light">Sign Up</h1>
          </div>
          <div className="row mb-5">
            <Form signIn={false}/>
            <div className="rate text-light">
              <a className="rateLink" href="http://localhost:5018">Click here</a> to rate us!
            </div>
            <RegisterMessage link = "/signin" startMessage = "Already registered? " endMessage = " to sign in" ></RegisterMessage>
          </div>
          </div>
        </div>
      </div>
  );
};

export default Signup;
