const amqp = require('amqplib');

let channel, connection;

async function connectRabbitMQ() {
  try {
    // Replace with your RabbitMQ server URL
    connection = await amqp.connect('amqp://localhost:8087');
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    process.exit(1);
  }
}

function getChannel() {
  if (!channel) {
    throw new Error('RabbitMQ channel is not initialized');
  }
  return channel;
}

async function closeConnection() {
  if (channel) {
    await channel.close();
  }
  if (connection) {
    await connection.close();
  }
}

module.exports = {
  connectRabbitMQ,
  getChannel,
  closeConnection,
};