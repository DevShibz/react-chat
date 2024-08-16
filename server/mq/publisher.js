const { getChannel } = require("../config/ampq");


async function publishMessage(queue, message) {
  const channel = getChannel();
  await channel.assertQueue(queue, { durable: false });
  channel.sendToQueue(queue, Buffer.from(message));
  console.log(`Message sent to queue ${queue}: ${message}`);
}

module.exports = publishMessage;