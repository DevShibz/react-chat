import React, { useEffect, useState } from "react";
// import { MessageCircle, Send, Smile, ChevronLeft } from 'lucide-react';
import { io } from "socket.io-client";
import { decodeJWT } from "../utils/utils";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./chat.css";
const socket = io.connect("http://localhost:3000");
const ChatScreen = () => {
  const [messages, setMessages] = useState();
  const [newMessage, setNewMessage] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [chatUsers, setChatUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const params = useParams();
  useEffect(() => {
    const chatBox = document.getElementById("chat-box");
    setTimeout(() => {
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 500);

    console.log(messages, "messages");
  }, [messages]);
  const [showEmojis, setShowEmojis] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    socket.on("recieveMessage", (message) => {
      console.log("incoming message", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, [socket]);

  const fetchMessages = async () => {
    await axios
      .post(`http://localhost:3000/api/recent-chats`, {
        roomId: params.room_id,
      })
      .then((response) => {
        setMessages(response.data.chats);
        setChatUsers(response.data.Users[0].users);
        setCurrentUser(
          response.data.Users[0].users.find((x) => x._id !== decodeJWT().userId)
            .username
        );
      });
  };

  const handleSendMessage = async () => {
    const sender = chatUsers.find((x) => x._id === decodeJWT().userId);
    const receiver = chatUsers.find((x) => x._id !== decodeJWT().userId);
    const message = {
      room: params.room_id,
      message: newMessage,
      type: "text",
      sender,
      receiver,
    };
    socket.emit("message", message);
    setNewMessage("");
  };

  const handleToggleEmojis = () => {
    setShowEmojis((prevShowEmojis) => !prevShowEmojis);
  };

  const handleUploadImage = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = () => {
      const file = fileInput.files[0];
      // handle file upload
      console.log("File selected:", file);
    };
    fileInput.click();
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <div className="flex items-center justify-between mb-4">
        <button className="p-2 text-gray-600 hover:text-gray-900">
          {/* <ChevronLeft size={24} /> */}
        </button>
        <h2 className="text-lg font-bold">Chat with {currentUser} </h2>
        {/* <MessageCircle size={24} color="blue" /> */}
      </div>
      <div
        className="flex-1 overflow-y-auto p-4 bg-white rounded-lg shadow-md"
        id="chat-box"
      >
        {messages?.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              decodeJWT().userId == message.sender._id
                ? "justify-end"
                : "justify-start"
            } mb-4`}
          >
            <div className="mr-2">
              {/* <img
                src={`https://picsum.photos/200/300?random=${index}`}
                alt="Profile Picture"
                className="w-8 h-8 rounded-full"
              /> */}
            </div>
            <div
              className={`p-2 rounded-lg ${
                decodeJWT().userId == message.sender._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              <span className="font-bold">
                {chatUsers.find((x) => x._id === message.sender._id).username}
              </span>

              <p>{message.message}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
        <input
          onKeyPress={(e) => {
            console.log(e.key);
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-2 pl-4 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
        />
        <button
          onClick={handleToggleEmojis}
          className="p-2 text-gray-600 hover:text-gray-900"
        >
          {/* <Smile size={24} /> */}
        </button>
        <button
          className="ml-2 bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded-md"
          onClick={handleUploadImage}
        >
          <i className="fa fa-image"></i>
        </button>
        {showEmojis && (
          <div className="absolute bottom-0 left-0 p-2 bg-gray-200 border border-gray-300 rounded-lg">
            🙂 😊 👍 😄 😆
          </div>
        )}
        <button
          onClick={handleSendMessage}
          className="ml-4 p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-500"
        >
          <i className="fas fa-send"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;
