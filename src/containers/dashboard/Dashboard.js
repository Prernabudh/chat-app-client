import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [chatrooms, setChatrooms] = useState([]);
  const userId = localStorage.getItem("_id");

  const getChatrooms = () => {
    axios
      .post(
        "http://localhost:3001/chatrooms/",
        {
          withCredentials: true,
        },
        { id: userId }
      )
      .then((response) => {
        setChatrooms(response.data);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    getChatrooms();
  }, []);
  return (
    <div className="card">
      <div className="cardHeader">Chatrooms</div>
      <div className="chatrooms">
        {chatrooms.length !== 0
          ? chatrooms.map((chatroom) => {
              return (
                <div key={chatroom._id} className="chatroom">
                  <div>
                    {chatroom.userA._id === userId
                      ? chatroom.userB.name
                      : chatroom.userA.name}
                  </div>
                  <Link to={"/chatroom/" + chatroom._id}>
                    <div className="join">Join</div>
                  </Link>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default Dashboard;
