const socketIO = require('socket.io');

let io; // Declare a variable to store the 'io' object

module.exports = (server) => {
  io = socketIO(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('message',(data)=>{
      console.log('message received',data);
    })
  });
};

// Export the 'io' object
module.exports.io = io;
