import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import "./Chatroom.css";
import axios from "axios";
import user from "../../assets/images/user.png";

const Chatroom = ({ match, socket }) => {
  const chatroomId = match.params.id;
  const [messages, setMessages] = React.useState([]);
  const messageRef = React.useRef();
  const [userId, setUserId] = useState(localStorage.getItem("_id"));
  const [typing, setTyping] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [name, setName] = useState(localStorage.getItem("name"));
  const [otherUser, setOtherUser] = useState("");
  const [date, setDate] = useState("today");

  const handleTyping = () => {
    socket.emit("typing", { userId: userId, chatroomId: chatroomId });
  };

  const sendMessage = () => {
    if (socket) {
      socket.emit("chatroomMessage", {
        chatroomId,
        message: messageRef.current.value,
      });

      messageRef.current.value = "";
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
          var notify = new Notification("You have a new message!", {
            body: "From: " + message.name,
          });
        }
      });
      socket.on("typing", (user) => {
        if (user.userId !== userId) {
          setTyping(user.name);
          setIsTyping(true);
        }
        setTimeout(() => {
          setTyping(null);
          setIsTyping(false);
        }, 3000);
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
      })
      .catch((err) => {});
    if (socket) {
      socket.emit("joinRoom", {
        chatroomId,
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
  }, []);

  const HandleDate = (props) => {
    console.log(date);
    setDate(props.date);
    return <div>{date}</div>;
  };

  return (
    <div className="chatroomPage">
      <div className="chatroomSection">
        <div className="otheruser-container">
          <img src={user} className="otheruser-image"></img>
          <div>
            <div className="otheruser-name">{otherUser}</div>
            {isTyping ? (
              <div className="otheruser-typing">{typing + " is typing."}</div>
            ) : null}
          </div>
        </div>
        <div className="chatroomContent">
          {messages.map((message, i) => (
            <div key={i} className="message">
              {console.log(message.userId)}
              {i === 0 || message.date !== messages[i - 1].date ? (
                <center className="message-date">{message.date}</center>
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
        </div>
        <div className="chatroomActions">
          <div>
            <input
              type="text"
              name="message"
              placeholder="Say something!"
              ref={messageRef}
              onChange={handleTyping}
              className="chatroom-input"
            />
          </div>
          <div>
            <button className="join" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Chatroom);
