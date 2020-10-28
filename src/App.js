import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./containers/Login";
import Dashboard from "./containers/Dashboard";
import Register from "./containers/Register";
import Index from "./containers/Index";
import Chatroom from "./containers/Chatroom";
import makeToast from "./Toaster";
import io from "socket.io-client";

const App = () => {
  const [socket, setSocket] = useState(null);
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
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Index} exact />
        <Route
          path="/login"
          render={() => <Login setupSocket={setupSocket}></Login>}
          exact
        />
        <Route path="/register" component={Register} exact />
        <Route
          path="/dashboard"
          render={() => <Dashboard socket={socket}></Dashboard>}
          exact
        />
        <Route
          path="/chatroom/:id"
          component={() => <Chatroom socket={socket}></Chatroom>}
          exact
        />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
