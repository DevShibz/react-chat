const Chat = require('../models/chat.model');
const User = require('../models/user.model');
const Room = require('../models/room.model');
const { io } = require('./socket.controller');

exports.getRecentChats = async (req, res) => {
  try{
    const chats = await Chat.find({ room: req.body.roomId })

    res.status(200).json({
      success: true,
      chats
    });
  }
  catch(err){
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

exports.addFriend = async (req, res) => {
  try {
    const { id, friendId } = req.body;

    const room = await Room.findOne({
      users: { $all: [id, friendId] }
    });

    if (room) {
      return res.status(500).json({
        success: true,
        message: 'Friend already added'
      });
    }

    await Room.create({
      name: `${id}-${friendId}`,
      users: [id, friendId]
    });



    res.status(200).json({
      success: true,
      message: 'Friend added successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

exports.searchFriend = async (req, res) => {
  try {
    const { name } = req.query;

    const users = await User.find({
      username: { $regex: name, $options: 'i' }
    });

    res.status(200).json({
      success: true,
      users
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

exports.getAllFriendsByRoomId = async (req, res) => {
  try {
    const rooms = await Room.find({ 'users': req.params.id }).populate('users');

    rooms.forEach(room => {
      room.users = room.users.filter(user => user._id != req.params.id);
    })

    res.status(200).json({
      success: true,
      rooms
    });
  }
  catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}


exports.sendMessageToRoom = async (req, res) => {
  try {
    const { room, message } = req.body;

    const chat = await Chat.create({
      room: room,
      type: 'text',
      message,
      sender: req.body.sender,
      receiver: req.body.receiver
    });
    
    io.emit('message', chat);


    res.status(200).json({
      success: true,
      chat
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};


exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({});

    res.status(200).json({
      success: true,
      rooms
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
