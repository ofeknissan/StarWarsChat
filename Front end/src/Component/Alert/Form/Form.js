import React, { useState, useEffect } from "react";
import { submitSignIn, submitSignUp } from "../../Util/submitHandler";
import Alert from "../Alert/Alert";
import "./Form.css";
import { useNavigate } from "react-router";
import AuthPop from "../AuthPop/AuthPop";
import SignupAdditionToForm from "../SignupAdditionToFrom/SignupAdditionToForm";

const Form = (props) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setdisplayName] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [imageUpload, setImageUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  let navigate = useNavigate();
  const onSubmit = async (event) => {
    event.preventDefault();
    if (props.signIn) {
      var { message, userData } = await submitSignIn(name, password);
    } else {
      var { message, userData } = await submitSignUp(
        name,
        password,
        confirmPass,
        displayName,
        file
      );
    }
    if (userData == "") {
      setError(message);
    } else {
      setUser(userData);
      setLoggedIn(true);
    }
  };

  const fileHandler = (e) => {
    e.preventDefault();
    setFile(URL.createObjectURL(e.target.files[0]));
  };

  useEffect(() => {
    if (loggedIn) {
      return navigate("/chat");
    }
  }, [loggedIn]);

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="mb-2">
          <label htmlFor="inputUsername" className="form-label text-light fs-5">
            Username
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="form-control"
            id="inputUsername"
            placeholder="Username"
          />
        </div>
        <div className="mb-2">
          <div className="passwordDetails">
            <label
              htmlFor="inputPassword"
              className="form-label text-light fs-5"
            >
              Password
            </label>
            {!props.signIn && <AuthPop />}
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="form-control"
            id="inputPassword"
            placeholder="Password"
          />
        </div>
        {!props.signIn && (
          <SignupAdditionToForm
            displayName={displayName}
            setdisplayName={setdisplayName}
            onImage={fileHandler}
            confirmPass={confirmPass}
            setConfirmPass={setConfirmPass}
          ></SignupAdditionToForm>
        )}
        <div className="button-input">
          <button
            type="submit"
            className="btn btn-md btn-input btn-dark border border-light border-3 mt-2"
          >
            Submit
          </button>
        </div>
        {error != "" && <Alert>{error}</Alert>}
      </form>
    </>
  );
};

export default Form;
