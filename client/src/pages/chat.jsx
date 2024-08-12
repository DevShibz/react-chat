import "./chat.css"; // Add a new CSS file for styling
import React, { useState, useEffect } from "react";
import "./chat.css";
import { io } from "socket.io-client";
import { decodeJWT } from "../utils/utils";
import { useParams } from "react-router-dom";
import axios from "axios";
const dummyData = [
  {
    id: 1,
    message: "Hello, how are you?",
    type: "user",
    timestamp: "10:00 AM",
  },
  {
    id: 2,
    message: "I am good, thanks!",
    type: "other",
    timestamp: "10:01 AM",
  },
  {
    id: 3,
    message: "What about you?",
    type: "user",
    timestamp: "10:02 AM",
  },
  {
    id: 4,
    message: "I am also good!",
    type: "other",
    timestamp: "10:03 AM",
  },
];

const socket = io.connect("http://localhost:3000");
const Chat = () => {
  const [messages, setMessages] = useState();
  const [newMessage, setNewMessage] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);
  const params = useParams();
  useEffect(() => {
    const chatBox = document.getElementById("chat-box");
    chatBox.scrollTop = chatBox.scrollHeight;
  }, [messages]);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    socket.on("recieveMessage", (message) => {
      fetchMessages();
    });
  }, [socket]);

  const fetchMessages = async () => {
    await axios
      .post(`http://localhost:3000/api/recent-chats`, {
        roomId: params.id,
      })
      .then((response) => {
        response.data.chats.forEach((chat) => {
          if (decodeJWT().userId == chat.sender) {
            chat.type = "user";
          } else {
            chat.type = "other";
          }
        });
        setMessages(response.data.chats);
      });
  };

  const handleSendMessage = async () => {
    const message = {
      room: params.id,
      message: newMessage,
      type: "text",
      sender: decodeJWT().userId,
      receiver: params.id,
    };
    socket.emit("message", message);
  };

  return (
    <div
      style={{
        backgroundImage: "url(https://example.com/mindblowing-background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        id="chat-box"
        className="chat-box"
        style={{
          overflowY: "auto",
          height: "100vh",
          borderRadius: "10px",
          background: "linear-gradient(to bottom, #ff99ff, #ffff99)",
        }}
      >
        <div
          className="chat-header"
          style={{
            position: "sticky",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 999,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "linear-gradient(to bottom, #ff99ff, #ffff99)",
          }}
        >
          <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
            Chat
          </h1>
          <div style={{ display: "flex", gap: ".5rem" }}>
            <i
              className="fas fa-cog"
              style={{ fontSize: "24px", cursor: "pointer" }}
            ></i>
            <i
              className="fas fa-ellipsis-v"
              style={{ fontSize: "24px", cursor: "pointer" }}
            ></i>
          </div>
        </div>
        {messages?.map((message) => (
          <div
            key={message.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              borderRadius: "10px",
              backgroundColor: message.type == "user" ? "white" : "red",
            }}
          >
            <div className="profile-badge" style={{ marginRight: "10px" }}>
              {params.id == message.receiver._id ? (
                <i className="fas fa-user"></i>
              ) : (
                <i className="fas fa-user-friends"></i>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                {message.message}{" "}
              </p>
              <small style={{ fontSize: "12px", color: "#666" }}>
                {message.createdAt}
              </small>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          position: "absolute",
          bottom: 0,
          left: 0,
          margin: "0 auto",
          gap: ".5rem",
          backgroundColor: "transparent",
          borderRadius: "10px",
        }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="modern-input"
          style={{
            borderRadius: "10px",
            padding: "10px",
            fontSize: "18px",
            width: "80%",
          }}
        />
        <button
          className="modern-button"
          onClick={handleSendMessage}
          style={{
            borderRadius: "10px",
            padding: "10px",
            fontSize: "18px",
            width: "20%",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
