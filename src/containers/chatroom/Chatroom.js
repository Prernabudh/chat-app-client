import React, { useState } from "react";
import "./Chatroom.css";
import axios from "axios";
import user from "../../assets/images/user.png";
import Button from "../../components/Button/Button";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import send from "../../assets/images/send.png";
import Input from "../../components/Input/Input";
import * as colors from "../../constants/colorConstants";
import smiling from "../../assets/images/smiling.png";

const Chatroom = ({ id, socket, mainColor }) => {
  const chatroomId = id;
  const [messages, setMessages] = React.useState([]);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(localStorage.getItem("_id"));
  const [typing, setTyping] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [name, setName] = useState(localStorage.getItem("name"));
  const [otherUser, setOtherUser] = useState("");
  const [date, setDate] = useState("today");
  const [online, setOnline] = useState("Offline");
  const messagesEndRef = React.useRef(null);
  const [end, setEnd] = useState(0);
  const [emojiBox, setEmojiBox] = useState(false);

  const handleLastscene = (lastSceneTime) => {
    const now = new Date();
    const date = new Date(new Date(lastSceneTime));
    const timeReceived =
      (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
      ":" +
      (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
    if (lastSceneTime === "Online") return "Online";
    else {
      if (now.getMonth() !== date.getMonth())
        return (
          "Last scene " + (now.getMonth() - date.getMonth()) + " months ago"
        );
      else if (now.getDate() !== date.getDate()) {
        if (now.getDate() - date.getDate() === 1)
          return "Last scene yesterday at " + timeReceived;
        else
          return (
            "Last scene " +
            (now.getDate() - date.getDate()) +
            " days ago at " +
            timeReceived
          );
      } else return "Last scene today at " + timeReceived;
    }
  };
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", { userId: userId, chatroomId: chatroomId });
  };

  const addEmoji = (emoji, event) => {
    setMessage(message + emoji.native);
  };

  const showEmoji = () => {
    setEmojiBox(!emojiBox);
  };

  const sendMessage = () => {
    if (socket) {
      socket.emit("chatroomMessage", {
        chatroomId,
        message: message,
      });

      setMessage("");
    }
  };

  React.useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message) => {
        const newMessages = [...messages, message];
        setMessages(newMessages);
        if (message.userId !== userId) {
          setTyping(null);
          setIsTyping(false);
          new Notification("You have a new message!", {
            body: "From: " + message.name,
          });
        }
      });
      socket.on("typing", (user) => {
        console.log("typing");
        if (user.userId !== userId) {
          setTyping(user.name);
          setIsTyping(true);
        }
        setTimeout(() => {
          setTyping(null);
          setIsTyping(false);
        }, 3000);
      });
      socket.on("userOnline", (user) => {
        if (user.userId !== userId) setOnline("Online");
      });
      socket.on("userOffline", (user) => {
        if (user.userId !== userId) setOnline(handleLastscene(user.time));
      });
    }
  }, [messages]);

  React.useEffect(() => {
    axios
      .post(
        "http://localhost:3001/chatrooms/getMessages",
        { chatroomId },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        setMessages(response.data.messages);
        setOtherUser(
          response.data.userA._id === userId
            ? response.data.userB.username
            : response.data.userA.username
        );
        console.log("just logging what i got = " + response.data.end);
        setEnd(response.data.end);
        scrollToBottom();
        axios
          .post(
            "http://localhost:3001/users/getUser",
            {
              _id:
                response.data.userA._id === userId
                  ? response.data.userB._id
                  : response.data.userA._id,
            },
            { withCredentials: true }
          )
          .then((response) => {
            console.log(response.data);
            setOnline(handleLastscene(response.data.lastscene));
          })
          .catch((err) => {});
      })
      .catch((err) => {});
    if (socket) {
      socket.emit("joinRoom", {
        chatroomId,
      });
      socket.emit("userOnline", {
        userId: userId,
      });
    }
    return () => {
      //Component Unmount
      if (socket) {
        socket.emit("leaveRoom", {
          chatroomId,
        });
      }
    };
  }, [id]);

  const handlePreviousMessages = () => {
    let from;
    let to;
    console.log("end======> " + end);
    if (end - 21 < 0) {
      from = 0;
      setEnd(0);
    } else {
      from = end - 21;
      setEnd(end - 21);
    }
    to = end;
    axios
      .post(
        "http://localhost:3001/chatrooms/getMessagesInSlots",
        { chatroomId, from, to },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        setMessages([...response.data.messages, ...messages]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="chatroomPage">
      {emojiBox ? (
        <Picker
          onSelect={addEmoji}
          style={{
            position: "absolute",
            left: "30.3%",
            top: "42%",
            zIndex: "200",
            width: "69.7%",
            height: "50px",
          }}
        />
      ) : null}
      <div
        className="chatroomSection"
        style={{ height: emojiBox ? "42%" : "100%" }}
      >
        <div className="otheruser-container">
          <img src={user} className="otheruser-image"></img>
          <div>
            <div className="otheruser-name">{otherUser}</div>
            {isTyping ? (
              <div className="otheruser-typing">{typing + " is typing."}</div>
            ) : (
              <div className="otheruser-typing">{online}</div>
            )}
          </div>
        </div>
        <div className="chatroomContent">
          {end !== 0 ? (
            <Button
              title="Fetch previous messages"
              onClick={handlePreviousMessages}
            ></Button>
          ) : null}

          {messages.map((message, i) => (
            <div key={i} className="message">
              {i === 0 || message.date !== messages[i - 1].date ? (
                <center
                  className="message-date"
                  style={{
                    color: mainColor === colors.black ? "white" : "black",
                  }}
                >
                  {message.date}
                </center>
              ) : null}
              <div
                className={
                  message.userId === userId ? "ownMessage" : "otherMessage"
                }
              >
                {message.message}
                <div className="message-time">{message.time}</div>
              </div>
            </div>
          ))}
          <div
            ref={messagesEndRef}
            style={{
              backgroundColor: "transparent",
              width: "100%",
              height: "2px",
              padding: "2px",
            }}
          />
        </div>
        <div className="chatroomActions" style={{ backgroundColor: mainColor }}>
          <div onClick={showEmoji} style={{ cursor: "pointer" }}>
            <img src={smiling}></img>
          </div>
          <div>
            <Input
              placeholder="Say something..."
              value={message}
              onChange={handleTyping}
              className="chatroom-input"
            />
          </div>
          <div onClick={sendMessage} style={{ cursor: "pointer" }}>
            <img src={send}></img>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatroom;
