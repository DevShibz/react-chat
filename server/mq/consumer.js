const { getChannel } = require("../config/ampq");


async function consumeMessages(queue, callback) {
  const channel = getChannel();
  await channel.assertQueue(queue, { durable: false });
  let waiting = false;
  channel.consume(queue, (msg) => {
    if (waiting) {
      return;
    }
    waiting = true;
    console.log(`Received message from queue ${queue}: ${msg.content.toString()}`);
    if (msg !== null) {
      const messageContent = msg.content.toString();
      console.log(`Received message from queue ${queue}: ${messageContent}`);
      callback(messageContent);
      channel.ack(msg); // Acknowledge that the message has been processed
      waiting = false;
    }
  });
}

module.exports = consumeMessages;
