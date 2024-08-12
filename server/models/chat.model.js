const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  type: {
    type: String,
    required: true
  },
  sender:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  receiver:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  message: {
    type: String,
    required: true
  },  
  createdAt: {
    type: Date,
    default: Date.now
  },
  seen: {
    type: Boolean,
    default: false
  },
});

module.exports = mongoose.model('Chat', chatSchema);
