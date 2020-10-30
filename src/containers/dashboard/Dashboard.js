import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import user from "../../assets/images/user.png";

const Dashboard = () => {
  const [chatrooms, setChatrooms] = useState([]);
  const userId = localStorage.getItem("_id");

  const getChatrooms = () => {
    axios
      .post(
        "http://localhost:3001/chatrooms/getChatrooms",
        { id: userId },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        setChatrooms(response.data);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    getChatrooms();
  }, []);
  return (
    <div className="chatroom-container">
      <div className="chats">
        <h1 className="chatroom-heading">Your Chats</h1>
        {chatrooms.length > 0
          ? chatrooms.map((chatroom) => {
              return (
                <Link to={"/chatroom/" + chatroom._id} key={chatroom._id}>
                  <div className="chat">
                    <img src={user} className="chatroom-user-image"></img>
                    <div>
                      {chatroom.userA._id === userId
                        ? chatroom.userB.name
                        : chatroom.userA.name}
                    </div>
                  </div>
                </Link>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default Dashboard;
