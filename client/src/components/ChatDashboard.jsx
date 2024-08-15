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
  const [showProfile, setShowProfile] = useState(false);
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
    const token = localStorage.getItem("token");
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
    <div className="h-screen bg-gray-100">
      <header className="bg-white py-4 shadow-md">
        <div className="container mx-auto ">
         
          <div className="flex m-auto w-[98%] justify-between gap-2">
            {/* <Search
              size={24}
              color="gray"
              className="mr-4"
            /> */}
            <input
              type="search"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search friends"
              className="py-2 pl-10 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 w-full"
            />
            <div className="flex gap-2">
            <h2 className="text-lg font-bold">{decodeJWT().username}</h2>
            <img
              src="https://picsum.photos/200/300"
             
              className="w-8 h-8 rounded-full ml-4 cursor-pointer"
              onClick={() => setShowProfile(!showProfile)}
            />
            </div>
             
            {showProfile && (
              <div
                className="absolute top-16 right-4 bg-white shadow-md p-4 rounded-lg"
                onClick={() => setShowProfile(false)}
              >
                <h2 className="text-lg font-bold">{decodeJWT().username}</h2>
                <p className="text-sm">Settings</p>
              </div>
            )}
          </div>
        </div>
      </header>
      {searchResults?.users?.length> 0 && <div className="fixed w-full top-18 bg-white h-14 p-2">
      {searchResults?.users?.map((user) => (
            <div
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
            </div>
          ))}
      </div>}
      
      <main className="container mx-auto p-4 mt-4">
        <h2 className="text-xl font-bold mb-4">Recent Chats</h2>
        <ul>
        {recentChats?.map((chat) =>  (
            <li onClick={() => {
              navigate(`/chat/${chat._id}/${chat.users[0]._id}`);
            }}  className="bg-white p-4 shadow-md mb-4 rounded-lg flex items-center">
              {/* <img
                src={friend.profilePicture}
                alt={friend.name}
                className="w-12 h-12 rounded-full mr-4"
              /> */}
              <div className="flex-1">
                <h3 className="text-lg font-bold">{chat.users[0].username}</h3>
               
              </div>
           
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default ChatDashboard;