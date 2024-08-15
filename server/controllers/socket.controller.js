const socketIO = require('socket.io');
const chatController=require('./chat.controller')

 // Declare a variable to store the 'io' object

module.exports = (server) => {
  global.io = socketIO(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  global.io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('message',(data)=>{
      console.log(data,"from socket")
      chatController.sendMessageToRoom(data)
    })
  });
};