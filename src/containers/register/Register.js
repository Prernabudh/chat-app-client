import React from "react";
import axios from "axios";
import makeToast from "../../Toaster";
import { Redirect } from "react-router-dom";

const RegisterPage = (props) => {
  const nameRef = React.createRef();
  const emailRef = React.createRef();
  const passwordRef = React.createRef();
  const usernameRef = React.createRef();

  const registerUser = (props) => {
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const username = usernameRef.current.value;

    axios
      .post("http://localhost:3001/users/register", {
        name,
        email,
        password,
        username,
      })
      .then((response) => {
        makeToast("success", response.data.message);
        window.location.pathname = "/login";
      })
      .catch((err) => {
        // console.log(err);
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        )
          makeToast("error", err.response.data.message);
      });
  };

  return (
    <div className="card">
      {localStorage.getItem("LoggedIn") === "true" ? (
        <Redirect to="/dashboard"></Redirect>
      ) : null}
      <div className="cardHeader">Registration</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="John Doe"
            ref={nameRef}
            className="input-field"
          />
        </div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="abc@example.com"
          ref={emailRef}
          className="input-field"
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Your Password"
          ref={passwordRef}
          className="input-field"
        />
        <label htmlFor="useranem">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Your Username"
          ref={usernameRef}
          className="input-field"
        />
      </div>
      <button onClick={registerUser}>Register</button>
    </div>
  );
};

export default RegisterPage;
