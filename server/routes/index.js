const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login.controller');
const chatController = require('../controllers/chat.controller');

router.post('/login', loginController.loginUser);
router.post('/register', loginController.registerUser);
router.post('/change', loginController.changePassword);
router.post('/reset', loginController.resetPassword);


router.post('/recent-chats', chatController.getRecentChats);
router.get('/getUsers/:id', chatController.getAllFriendsByRoomId);
router.post('/sendMessageToRoom', chatController.sendMessageToRoom);
router.post('/add-friend', chatController.addFriend);
router.get('/searchFriend', chatController.searchFriend);
router.post('/getCurrentUsers/:id', chatController.getCurrentUser);
router.post('/sendMessage', chatController.sendMessageToQue);
module.exports = router;
