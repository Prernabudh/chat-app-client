import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import user from "../../assets/images/user.png";
import Heading from "../../components/Headings/Headings";
import Input from "../../components/Input/Input";
import * as colors from "../../constants/colorConstants";
import Chatroom from "../chatroom/Chatroom";

const Dashboard = ({ socket, mainColor }) => {
  const [chatrooms, setChatrooms] = useState([]);
  const [roomId, setRoomId] = useState("");
  const userId = localStorage.getItem("_id");

  const displayChatroom = (id) => {
    console.log(id);
    setRoomId(id);
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
        setRoomId(temp[0]._id);
        setChatrooms(temp);
      })
      .catch((err) => {});
  };

  const getChatroomsAgain = () => {
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
      socket.emit("notification");
      socket.emit("userOnline", {
        userId: userId,
      });
      socket.on("reloadDashboard", (message) => {
        console.log("I received a message!!!!!!!!!");
        getChatroomsAgain();
        if (message.userId !== userId)
          new Notification("You have a new message!", {
            body: "From: " + message.name,
          });
      });
    }
  }, [socket]);
  return (
    <div className="chatroom-container">
      <div
        className="chats"
        style={{
          backgroundColor: mainColor === colors.black ? "#303841" : "#fcfcfc",
        }}
      >
        <Heading type="heading" color={colors.primary}>
          Chats
        </Heading>
        <Input placeholder="Search for someone..."></Input>
        {chatrooms.length > 0
          ? chatrooms.map((chatroom) => {
              return chatroom.messages.length > 0 ? (
                <div
                  className="chat"
                  key={chatroom._id}
                  style={{
                    backgroundColor:
                      chatroom._id === roomId ? colors.primary : mainColor,
                  }}
                  onClick={() => displayChatroom(chatroom._id)}
                >
                  <img src={user} className="chatroom-user-image"></img>
                  <div
                    style={{
                      width: "100%",
                      color:
                        mainColor === colors.black ? colors.white : "black",
                    }}
                  >
                    {chatroom.userA._id === userId
                      ? chatroom.userB.username
                      : chatroom.userA.username}
                    {chatroom.userA._id === userId ? (
                      new Date(chatroom.userAleave).getTime() <
                      new Date(chatroom.lastMessage.timestamp).getTime() ? (
                        <div
                          className="last-message-dark"
                          style={{
                            color:
                              mainColor === colors.black
                                ? colors.white
                                : "black",
                          }}
                        >
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
                        <div
                          className="last-message"
                          style={{
                            color:
                              mainColor === colors.black
                                ? colors.white
                                : "black",
                          }}
                        >
                          {chatroom.lastMessage.message}
                          <div className="lastmessage-time">
                            {chatroom.lastMessage.time}
                          </div>
                        </div>
                      )
                    ) : new Date(chatroom.userBleave).getTime() <
                      new Date(chatroom.lastMessage.timestamp).getTime() ? (
                      <div
                        className="last-message-dark"
                        style={{
                          color:
                            mainColor === colors.black ? colors.white : "black",
                        }}
                      >
                        {chatroom.lastMessage.message}
                        <div className="lastmessage-time">
                          {chatroom.lastMessage.time}
                        </div>
                      </div>
                    ) : (
                      <div
                        className="last-message"
                        style={{
                          color:
                            mainColor === colors.black ? colors.white : "black",
                        }}
                      >
                        {chatroom.lastMessage.message}
                        <div className="lastmessage-time">
                          {chatroom.lastMessage.time}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : null;
            })
          : null}
      </div>
      <div>
        <Chatroom id={roomId} socket={socket} mainColor={mainColor}></Chatroom>
      </div>
    </div>
  );
};

export default Dashboard;
