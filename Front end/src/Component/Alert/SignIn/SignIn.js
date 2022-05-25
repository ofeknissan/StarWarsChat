import React, { useState } from "react";
import "./SignIn.css";
import RegisterMessage from "../RegisterMessage/RegisterMessage.js";
import Form from "../Form/Form";
import Alert from "../Alert/Alert";
const SignIn = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('')
  const onSubmit = (event) => {
    event.preventDefault();
  };
  return (
    <div className="fullPage">
      <video className="signInVideo"
        poster="/Images/Poster.png"
        playsInline="playsinline"
        autoPlay="autoplay"
        muted="muted"
        loop="loop"
      >
        <source src="/videos/background-signup.mp4" type="video/mp4" />
      </video>
      <div className="signIn">
        <div className="container form-container">
          <div className="row mb-3">
            <h1 className="text-light">Sign In</h1>

          </div>
          <div className="row">
            <Form signIn={true}/>
            <div className="rate text-light">
              <a className="rateLink" href="http://localhost:5018">Click here</a> to rate us!
            </div>
            <RegisterMessage link = "/signup" startMessage = "Not registered? " endMessage = " to sign up" ></RegisterMessage>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
