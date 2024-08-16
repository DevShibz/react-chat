const Chat = require('../models/chat.model');
const User = require('../models/user.model');
const Room = require('../models/room.model');
const { io } = require('./socket.controller');
const publishMessage = require('../mq/publisher');
exports.getRecentChats = async (req, res) => {
  try {

    const chats = await Chat.find({ room: req.body.roomId })
      .populate('sender')
      .populate('receiver')
    const Users = await Room.find({ _id: req.body.roomId }).populate('users', 'username');


    res.status(200).json({
      success: true,
      chats,
      Users
    });
  }
  catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};


exports.getCurrentUser = async (req, res) => {

  try {
    const user = await Room.find({ _id: req.params.id }).populate('users');

    res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
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

    global.io.emit('friendAdded', { id, friendId });


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

exports.sendMessageToQue = async (req, res) => {
  try{
      await publishMessage('chat', JSON.stringify(req.body));
      res.status(200).json({
        success: true,
        message: 'Message sent to queue'
      });
  }
  catch(err){
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

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


exports.sendMessageToRoom = async (data) => {
  try {
    await Chat.create(data);
    console.log(data, "from controller")
    global.io.emit('recieveMessage', data);
    return;
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: err.message
    }
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
