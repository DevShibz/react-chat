const { getChannel } = require("../config/ampq");


async function consumeMessages(queue, callback) {
  const channel = getChannel();
  await channel.assertQueue(queue, { durable: false });
  channel.consume(queue, (msg) => {
    console.log(`Received message from queue ${queue}: ${msg.content.toString()}`);
    if (msg !== null) {
      const messageContent = msg.content.toString();
      console.log(`Received message from queue ${queue}: ${messageContent}`);
      callback(messageContent);
      channel.ack(msg); // Acknowledge that the message has been processed
    }
  });
}

module.exports = consumeMessages;