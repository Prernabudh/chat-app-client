import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import user from "../../assets/images/user.png";
import Heading from "../../components/Headings/Headings";
import Button from "../../components/Button/Button";
import { withRouter } from "react-router-dom";

const Dashboard = ({ socket, history }) => {
  const [chatrooms, setChatrooms] = useState([]);
  const [username, setUsername] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const userId = localStorage.getItem("_id");

  const handleInput = (e) => {
    setUsername(e.target.value);
  };

  const handleSearch = () => {
    axios
      .post(
        "http://localhost:3001/users/findByUsername",
        { username },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        setSearchResult(response.data);
      })
      .catch((err) => {});
  };

  const handleConversation = (id) => {
    axios
      .post(
        "http://localhost:3001/chatrooms/createChatroom",
        { userA: userId, userB: id },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        history.push("/chatroom/" + response.data._id);
      })
      .catch((err) => {});
  };

  const getChatrooms = () => {
    console.log("I get called again");
    axios
      .post(
        "http://localhost:3001/chatrooms/getChatrooms",
        { id: userId },
        { withCredentials: true }
      )
      .then((response) => {
        const temp = [...response.data].sort(
          (a, b) =>
            new Date(b.lastMessage.timestamp) -
            new Date(a.lastMessage.timestamp)
        );
        console.log(temp);
        setChatrooms(temp);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    console.log("Reached here");
    getChatrooms();
    if (socket) {
      socket.emit("joinRoom", {
        chatroomId: userId,
      });
      socket.emit("userOnline", {
        userId: userId,
      });
      socket.on("newMessage", (message) => {
        console.log("I received a message");
        getChatrooms();
        if (message.userId !== userId)
          new Notification("You have a new message!", {
            body: "From: " + message.name,
          });
      });
    }
  }, [socket]);
  return (
    <div className="chatroom-container">
      <div className="chats">
        <h1 className="chatroom-heading">Your Chats</h1>
        <Heading type="sub-heading">Find people</Heading>
        <input
          className="input-field"
          placeholder="Enter username"
          value={username}
          onChange={handleInput}
        ></input>
        <Button title="Find" onClick={handleSearch}></Button>
        {searchResult ? (
          <div className="chat" style={{ marginTop: "10px" }}>
            <img src={user} className="chatroom-user-image"></img>
            <Heading type="sub-heading">{searchResult.username}</Heading>
            <div style={{ width: "35%", marginLeft: "20px" }}>
              <Button
                title="Start conversation"
                onClick={() => handleConversation(searchResult._id)}
              ></Button>
            </div>
          </div>
        ) : null}
        {chatrooms.length > 0
          ? chatrooms.map((chatroom) => {
              return chatroom.messages.length > 0 ? (
                <Link to={"/chatroom/" + chatroom._id} key={chatroom._id}>
                  <div className="chat">
                    <img src={user} className="chatroom-user-image"></img>
                    <div style={{ width: "100%" }}>
                      {chatroom.userA._id === userId
                        ? chatroom.userB.username
                        : chatroom.userA.username}
                      {chatroom.userA._id === userId ? (
                        new Date(chatroom.userAleave).getTime() <
                        new Date(chatroom.lastMessage.timestamp).getTime() ? (
                          <div className="last-message-dark">
                            {console.log(
                              new Date(chatroom.userAleave).getTime() -
                                new Date(
                                  chatroom.lastMessage.timestamp
                                ).getTime()
                            )}
                            {chatroom.lastMessage.message}
                            <div className="lastmessage-time">
                              {chatroom.lastMessage.time}
                            </div>
                          </div>
                        ) : (
                          <div className="last-message">
                            {chatroom.lastMessage.message}
                            <div className="lastmessage-time">
                              {chatroom.lastMessage.time}
                            </div>
                          </div>
                        )
                      ) : new Date(chatroom.userBleave).getTime() <
                        new Date(chatroom.lastMessage.timestamp).getTime() ? (
                        <div className="last-message-dark">
                          {console.log(
                            new Date(chatroom.userAleave).getTime() -
                              new Date(chatroom.lastMessage.timestamp).getTime()
                          )}
                          {chatroom.lastMessage.message}
                          <div className="lastmessage-time">
                            {chatroom.lastMessage.time}
                          </div>
                        </div>
                      ) : (
                        <div className="last-message">
                          {chatroom.lastMessage.message}
                          <div className="lastmessage-time">
                            {chatroom.lastMessage.time}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ) : null;
            })
          : null}
      </div>
    </div>
  );
};

export default withRouter(Dashboard);
