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
        roomId: params.id,
      })
      .then((response) => {
        console.log(response.data.chats);
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
    setNewMessage("");
  };

  const handleToggleEmojis = () => {
    setShowEmojis((prevShowEmojis) => !prevShowEmojis);
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <div className="flex items-center justify-between mb-4">
        <button className="p-2 text-gray-600 hover:text-gray-900">
          {/* <ChevronLeft size={24} /> */}
        </button>
        <h2 className="text-lg font-bold">Chat with John Doe</h2>
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
              message.type === "user" ? "justify-end" : "justify-start"
            } mb-4`}
          >
            <div className="mr-2">
              <img
                src={`https://picsum.photos/200/300?random=${index}`}
                alt="Profile Picture"
                className="w-8 h-8 rounded-full"
              />
            </div>
            <div
              className={`p-2 rounded-lg ${
                message.type === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              <span className="font-bold">
                {message.type === "user" ? "User" : "Other"}
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
        {showEmojis && (
          <div className="absolute bottom-0 left-0 p-2 bg-gray-200 border border-gray-300 rounded-lg">
            🙂 😊 👍 😄 😆
          </div>
        )}
        <button
          onClick={handleSendMessage}
          className="ml-4 p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-500"
        >
          {/* <Send size={18} color="white" /> */}
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;
