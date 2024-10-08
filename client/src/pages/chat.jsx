import React, { useEffect, useState } from "react";
// import { MessageCircle, Send, Smile, ChevronLeft } from 'lucide-react';
import { io } from "socket.io-client";
import { decodeJWT, fetchApi } from "../utils/utils";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./chat.css";
import User from "../utils/user";
import { FETCH_CHAT } from "../utils/api";
const socket = io.connect("http://localhost:3000");
const ChatScreen = () => {
  const [messages, setMessages] = useState();
  const [newMessage, setNewMessage] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [chatUsers, setChatUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const params = useParams();
  const [sender, setSender] = useState();
  const [receiver, setReceiver] = useState();
  const user = new User();
  useEffect(() => {
    const chatBox = document.getElementById("chat-box");
    setTimeout(() => {
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 500);
  }, [messages]);
  const [showEmojis, setShowEmojis] = useState(false);

  useEffect(() => {
    fetchMessages();
    console.log(user, "user");
  }, []);

  useEffect(() => {
    socket.on("recieveMessage", (message) => {
      console.log("incoming message", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, [socket]);

  const fetchMessages = async () => {
    try {
      const data = await fetchApi(FETCH_CHAT(params.room_id));
      setDetails(data);
    } catch (err) {}
  };

  const setDetails = async (data) => {
    setMessages(data.chats);
    setChatUsers(data.Users[0].users);
    setSender(data.Users[0].users.find((x) => x._id === decodeJWT().userId));
    setReceiver(data.Users[0].users.find((x) => x._id !== decodeJWT().userId));
    setCurrentUser(
      data.Users[0].users.find((x) => x._id !== decodeJWT().userId).username
    );
  };

  const handleSendMessage = async () => {
    let message = {
      room: params.room_id,
      message: newMessage,
      type: "text",
      sender,
      receiver,
      createdAt: new Date(),
    };
    console.log("message", message);
    socket.emit("message", message);
    setNewMessage("");
  };

  const handleToggleEmojis = () => {
    setShowEmojis((prevShowEmojis) => !prevShowEmojis);
  };

  const handleFullScreenImage = (image) => {
    const modal = document.createElement("div");
    modal.className =
      "fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center";
    modal.innerHTML = `
      <div class="relative  rounded-lg shadow-lg overflow-hidden max-w-3xl w-full">
        <!-- Ellipsis Button at the Top-Right -->
        <div class="absolute top-4 right-4">
          <button class="text-white options-button">
            <i class="fas fa-ellipsis-v"></i>
          </button>
          <div class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg options-dropdown hidden">
            <ul class="py-2">
              <li class="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                <a href=${image} download>
                  <i class="fas fa-download mr-2"></i>
                  Download
                </a>
              </li>
              <li class="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                <i class="fas fa-share-alt mr-2"></i>
                Share
              </li>
            </ul>
          </div>
        </div>
        <!-- Image Content -->
        <img src=${image} alt="uploaded" class="w-full h-auto rounded-lg" />
      </div>
    `;

    document.body.appendChild(modal);

    const optionsButton = modal.querySelector(".options-button");
    const optionsDropdown = modal.querySelector(".options-dropdown");
    const modalContent = modal.querySelector(".relative");

    optionsButton.onclick = (e) => {
      e.stopPropagation(); // Prevent modal click event from triggering
      optionsDropdown.classList.toggle("hidden");
    };

    // Close the modal when clicking outside of the modal content
    modal.onclick = (e) => {
      if (!modalContent.contains(e.target)) {
        modal.remove();
      }
    };
  };

  const handleUploadImage = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = () => {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        let message = {
          room: params.room_id,
          message: base64String,
          type: "image",
          sender,
          receiver,
          createdAt: new Date(),
        };

        socket.emit("message", message);
      };
      reader.readAsDataURL(file);
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
              <div className="flex justify-between gap-3">
                <span className="font-bold">
                  {chatUsers.find((x) => x._id === message.sender._id).username}
                </span>

                <span className="text-white-500 text-sm ">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {message.type == "text" && <p>{message.message}</p>}
              {message.type == "image" && (
                <img
                  src={message.message}
                  alt="uploaded"
                  className="w-32 h-32 rounded-lg"
                  onClick={() => handleFullScreenImage(message.message)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
        <textarea
          onKeyPress={(e) => {
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
          <i className="fa fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;
