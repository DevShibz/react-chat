import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:3000");
const ChatDashboard = () => {
  const [recentChats, setRecentChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchRecentChats();
  }, []);

  useEffect(() => {
    socket.on("friendAdded", (data) => {
      fetchRecentChats();
    });
  }, []);

  const fetchRecentChats = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/getUsers/${decodeJWT().userId}`
      );
      const data = await response.json();
      console.log(data);
      setRecentChats([...data.rooms]);
    } catch (error) {
      console.error("Error fetching recent chats:", error);
    }
  };
  const [timer, setTimer] = useState(null);
  const handleSearch = async (event) => {
    setSearchTerm(event.target.value);
    if (timer) {
      clearTimeout(timer);
    }

    setTimer(
      setTimeout(async () => {
        if (event.target.value.length > 0) {
          try {
            const response = await fetch(
              `http://localhost:3000/api/searchFriend?name=${event.target.value}`
            );
            const data = await response.json();
            setSearchResults(data);
          } catch (error) {
            console.error("Error searching users:", error);
          }
        } else {
          setSearchResults([]);
        }
      }, 1000)
    );
  };

  const addFriend = async (friendId) => {
    const senderId = decodeJWT().userId;

    console.log(senderId);
    console.log(friendId);
    let payload = {
      id: senderId,
      friendId: friendId,
    };
    try {
      const response = await fetch("http://localhost:3000/api/add-friend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const decodeJWT = () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      return null;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));
    return payload;
  };

  return (
    <div className="bg-gray-100 h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/4 bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Search Users</h2>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ul className="mt-4">
          {searchResults?.users?.map((user) => (
            <li
              key={user.username}
              className="py-2 hover:bg-gray-100 px-3 rounded-md"
            >
              {user.username}
              <button
                onClick={() => addFriend(user._id)}
                className="ml-2 bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded-md"
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full md:w-3/4 ml-4 bg-white shadow-md rounded-lg p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Recent Chats</h2>
        <ul>
          {recentChats?.map((chat) => (
            <li
              onClick={() => {
                navigate(`/chat/${chat._id}/${chat.users[0]._id}`);
              }}
              key={chat.username}
              className="flex items-center py-3 border-b border-gray-200"
            >
              {/* <img
                src={chat.profilePicture}
                alt={chat.username}
                className="w-8 h-8 rounded-full mr-3"
              /> */}
              <div>
                <p className="font-medium">{chat.users[0].username}</p>
                <p className="text-sm text-gray-500"></p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatDashboard;
