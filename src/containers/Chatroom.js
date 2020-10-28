import React, { useState } from "react";
import { withRouter } from "react-router-dom";

const Chatroom = ({ match, socket }) => {
  const chatroomId = match.params.id;
  const [messages, setMessages] = React.useState([]);
  const messageRef = React.useRef();
  const [userId, setUserId] = useState(localStorage.getItem("_id"));
  const [typing, setTyping] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [name, setName] = useState(localStorage.getItem("name"));

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

  return (
    <div className="chatroomPage">
      <div className="chatroomSection">
        <div className="cardHeader">Chatroom Name</div>
        <div className="chatroomContent">
          {messages.map((message, i) => (
            <div key={i} className="message">
              <span
                className={
                  message.userId === userId ? "ownMessage" : "otherMessage"
                }
              >
                {message.name}:
              </span>{" "}
              {message.message}
              <div>{message.time}</div>
            </div>
          ))}
          {isTyping ? typing + " is typing." : null}
        </div>
        <div className="chatroomActions">
          <div>
            <input
              type="text"
              name="message"
              placeholder="Say something!"
              ref={messageRef}
              onChange={handleTyping}
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
