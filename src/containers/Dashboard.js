import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link} from 'react-router-dom';

const Dashboard = () => {
  const [chatrooms, setChatrooms] = useState([]);

  const getChatrooms = () =>{
    axios.get("http://localhost:3001/chatrooms/", {
      withCredentials:true
    }).then((response)=>{
      setChatrooms(response.data)
    }).catch((err=>{
    }))
  }

  useEffect(() => {
    getChatrooms();
  }, [])
  return (
    <div className="card">
      <div className="cardHeader">Chatrooms</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="chatroomName">Chatroom Name</label>
          <input
            type="text"
            name="chatroomName"
            id="chatroomName"
            placeholder="ChatterBox Nepal"
          />
        </div>
      </div>
      <button>Create Chatroom</button>
      <div className="chatrooms">
        {chatrooms.map((chatroom)=>{
          return(
            <div key={chatroom._id} className="chatroom">
              <div>{chatroom.name}</div>
              <Link to={"/chatroom/"+chatroom._id}>
                <div className="join">Join</div>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default Dashboard;
