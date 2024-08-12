const { connectDB } = require('./config/db.config');
const express = require('express');
const bodyParser = require('body-parser'); // Require body-parser
const cors = require('cors'); // Require cors
const app = express();
const http = require('http');
const routes = require('./routes'); // Assuming your routes are in './routes'
const { getUserById } = require('./controllers/chat.controller');
const socketIo = require('./controllers/socket.controller');
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.use(cors()); // Enable CORS for all origins 
    app.use(bodyParser.json()); // Parse JSON request bodies
    app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies
    app.use('/api', routes); // Mount routes with '/api' prefix

    const server = http.createServer(app);
    const io = socketIo(server);


    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
};

startServer();
