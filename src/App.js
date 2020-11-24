import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./containers/login/Login";
import makeToast from "./Toaster";
import io from "socket.io-client";
import Card from "./components/Card/Card";
import Switcher from "react-switch";
import { black, white, primary } from "./constants/colorConstants";
import MainBoard from "./containers/MainBoard/MainBoard";
import blob from "./assets/images/blob.svg";
import blob2 from "./assets/images/blob2.svg";
import sunrise from "./assets/images/sunrise.png";
import moon from "./assets/images/moon.png";

const App = () => {
  const [socket, setSocket] = useState(null);
  const [checked, setChecked] = useState(
    localStorage.getItem("mainColor") === black ? true : false
  );
  const [mainColor, setMainColor] = useState(
    localStorage.getItem("mainColor")
      ? localStorage.getItem("mainColor")
      : white
  );
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") ? true : false
  );

  const handleSwitch = async () => {
    await setChecked(!checked);
    setMainColor(!checked ? black : white);
    localStorage.setItem("mainColor", !checked ? black : white);
  };
  const setupSocket = () => {
    const token = localStorage.getItem("_id");
    if (token && !socket) {
      const newSocket = io("http://localhost:3001", {
        query: {
          token: localStorage.getItem("_id"),
        },
      });

      newSocket.on("disconnect", () => {
        setSocket(null);
        setTimeout(setupSocket, 3000);
        makeToast("error", "Socket disconnected");
      });

      newSocket.on("connect", () => {
        makeToast("success", "Socket connected");
      });

      setSocket(newSocket);
    }
  };

  useEffect(() => {
    setupSocket();
    if (!window.Notification) {
      console.log("Browser does not support notifications.");
    } else {
      // check if permission is already granted
      if (Notification.permission === "granted") {
        // show notification here
      } else {
        // request permission from user
        Notification.requestPermission()
          .then(function (p) {
            if (p === "granted") {
              // show notification here
            } else {
              console.log("User blocked notifications.");
            }
          })
          .catch(function (err) {
            console.error(err);
          });
      }
    }
  }, []);
  return (
    <div className="App" style={{ backgroundColor: mainColor }}>
      <div className="switch">
        <img
          src={sunrise}
          style={{ marginRight: "6px", marginBottom: "2px", height: "24px" }}
        ></img>
        <Switcher
          onChange={handleSwitch}
          checked={checked}
          uncheckedIcon={false}
          checkedIcon={false}
          onColor={white}
          offColor={black}
          offHandleColor={primary}
          onHandleColor={primary}
        />
        <img
          src={moon}
          style={{ marginLeft: "6px", height: "16px", marginBottom: "5px" }}
        ></img>
      </div>
      <img src={blob} className="top-design"></img>
      <img src={blob2} className="top-design-2"></img>
      <Card backgroundColor={mainColor}>
        {!loggedIn ? (
          <Login
            setupSocket={setupSocket}
            mainColor={mainColor}
            setLoggedIn={setLoggedIn}
          ></Login>
        ) : (
          <MainBoard socket={socket} mainColor={mainColor}></MainBoard>
        )}
      </Card>
    </div>
  );
};

export default App;
