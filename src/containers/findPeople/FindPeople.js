import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FindPeople.css";
import * as colors from "../../constants/colorConstants";
import Heading from "../../components/Headings/Headings";
import Input from "../../components/Input/Input";
import searchIcon from "../../assets/images/searchIcon.png";
import Button from "../../components/Button/Button";
import user from "../../assets/images/user.png";
import Chatroom from "../chatroom/Chatroom";

const FindPeople = ({ mainColor, socket }) => {
  const [username, setUsername] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [roomId, setRoomId] = useState("");
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
        setRoomId(response.data._id);
      })
      .catch((err) => {});
  };
  return (
    <div className="chatroom-container">
      <div
        className="chats"
        style={{
          backgroundColor: mainColor === colors.black ? "#303841" : "#fcfcfc",
        }}
      >
        <Heading type="heading" color={colors.primary}>
          Find people
        </Heading>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Input
            placeholder="Search for someone..."
            value={username}
            onChange={handleInput}
          ></Input>
          <img
            src={searchIcon}
            style={{ height: "22px" }}
            onClick={handleSearch}
          ></img>
        </div>
        {searchResult ? (
          <div
            className="chat"
            style={{ marginTop: "10px" }}
            onClick={() => handleConversation(searchResult._id)}
          >
            <img src={user} className="chatroom-user-image"></img>
            <Heading type="sub-heading">{searchResult.username}</Heading>
            <div style={{ width: "35%", marginLeft: "20px" }}></div>
          </div>
        ) : null}
      </div>
      {roomId !== "" ? (
        <div>
          <Chatroom
            id={roomId}
            socket={socket}
            mainColor={mainColor}
          ></Chatroom>
        </div>
      ) : null}
    </div>
  );
};

export default FindPeople;
