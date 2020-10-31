import React, { useEffect } from "react";
import makeToast from "../../Toaster";
import axios from "axios";
import { withRouter, Redirect } from "react-router-dom";
import Button from "../../components/Button/Button";

const LoginPage = (props) => {
  const emailRef = React.createRef();
  const passwordRef = React.createRef();

  const loginUser = () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    axios
      .post(
        "http://localhost:3001/users/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        makeToast("success", response.data.message);
        localStorage.setItem("LoggedIn", "true");
        localStorage.setItem("_id", response.data._id);
        localStorage.setItem("name", response.data.name);
        window.location.pathname = "/dashboard";
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
      <div className="cardHeader">Wecome back</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="abc@example.com"
            ref={emailRef}
            className="input-field"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Your Password"
            ref={passwordRef}
            className="input-field"
          />
        </div>
        <Button onClick={loginUser} title="Login"></Button>
      </div>
    </div>
  );
};

export default withRouter(LoginPage);
