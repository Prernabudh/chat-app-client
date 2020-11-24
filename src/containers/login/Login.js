import React, { useEffect, useState } from "react";
import makeToast from "../../Toaster";
import axios from "axios";
import Button from "../../components/Button/Button";
import loginImage from "../../assets/images/login.svg";
import "./Login.css";
import { black, white, primary } from "../../constants/colorConstants";
import Heading from "../../components/Headings/Headings";

const LoginPage = (props) => {
  const [login, setLogin] = useState(true);
  const emailRef = React.createRef();
  const passwordRef = React.createRef();
  const nameRef = React.createRef();
  const usernameRef = React.createRef();

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
        props.setupSocket();
        localStorage.setItem("loggedIn", "true");
        props.setLoggedIn(true);
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
        setLogin(true);
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
    <div className="login-container">
      <div className="login-image-container">
        <img src={loginImage} className="login-image"></img>
      </div>
      <div className="login-image-container">
        <div className="heading-container">
          <Heading type="heading" color={primary}>
            Chat app
          </Heading>
        </div>
        <div
          className="cardBody"
          style={{ backgroundColor: props.mainColor === black ? white : black }}
        >
          <div className="cardHeader">{login ? "Welcome back" : "Welcome"}</div>
          <div className="inputGroup">
            {!login ? (
              <>
                <label
                  htmlFor="name"
                  style={{
                    color: props.mainColor === black ? "black" : "white",
                  }}
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="John Doe"
                  ref={nameRef}
                  className="input-field"
                  style={{
                    backgroundColor: props.mainColor === black ? white : black,
                    color: props.mainColor === black ? "black" : white,
                  }}
                />
              </>
            ) : null}
            <label
              htmlFor="email"
              style={{ color: props.mainColor === black ? "black" : "white" }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="abc@example.com"
              ref={emailRef}
              className="input-field"
              style={{
                backgroundColor: props.mainColor === black ? white : black,
                color: props.mainColor === black ? "black" : white,
              }}
            />
            <label
              htmlFor="password"
              style={{ color: props.mainColor === black ? "black" : "white" }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Your Password"
              ref={passwordRef}
              className="input-field"
              style={{
                backgroundColor: props.mainColor === black ? white : black,
                color: props.mainColor === black ? "black" : white,
              }}
            />
            {!login ? (
              <>
                <label
                  htmlFor="username"
                  style={{
                    color: props.mainColor === black ? "black" : "white",
                  }}
                >
                  Email
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="John_Doe"
                  ref={usernameRef}
                  className="input-field"
                  style={{
                    backgroundColor: props.mainColor === black ? white : black,
                    color: props.mainColor === black ? "black" : white,
                  }}
                />
              </>
            ) : null}
          </div>
          <Button
            onClick={login ? loginUser : registerUser}
            title={login ? "Login" : "Signup"}
          ></Button>
        </div>
        <div
          style={{
            color: primary,
            position: "absolute",
            bottom: login ? "20%" : "10%",
            left: "50%",
            transform: "translateX(-50%)",
            cursor: "pointer",
          }}
          onClick={() => setLogin(!login)}
        >
          {login
            ? " New to chat app? Signup instead!"
            : "Already a member? Signin"}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
