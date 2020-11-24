import React, { useState, useEffect } from "react";
import "./MainBoard.css";
import * as colors from "../../constants/colorConstants";
import Dashboard from "../dashboard/Dashboard";
import home from "../../assets/images/home.png";
import searchIcon from "../../assets/images/searchIcon.png";
import FindPeople from "../findPeople/FindPeople";

const MainBoard = ({ socket, mainColor }) => {
  const [display, setDisplay] = useState("dashboard");
  const userId = localStorage.getItem("_id");
  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", {
        chatroomId: userId,
      });
      socket.emit("userOnline", {
        userId: userId,
      });
    }
  }, [socket]);
  return (
    <div className="main-board-container">
      <div className="navbar" style={{ backgroundColor: colors.primary }}>
        <div className="navbar-icons">
          <img
            src={home}
            className="navbar-icon"
            onClick={() => setDisplay("dashboard")}
          ></img>
          <img
            src={searchIcon}
            className="navbar-icon"
            onClick={() => setDisplay("find")}
          ></img>
        </div>
      </div>
      <div>
        {display === "dashboard" ? (
          <Dashboard socket={socket} mainColor={mainColor}></Dashboard>
        ) : null}
        {display === "find" ? (
          <FindPeople socket={socket} mainColor={mainColor}></FindPeople>
        ) : null}
      </div>
    </div>
  );
};

export default MainBoard;
