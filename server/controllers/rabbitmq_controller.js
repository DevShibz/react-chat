const amqp = require('amqplib');

class RabbitMQController {
  constructor(queueName) {
    this.queueName = queueName;
    this.connection = null;
    this.channel = null;
  }

  async init() {
    this.connection = await amqp.connect('amqp://localhost');
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queueName, { durable: true });
  }

  async sendMessage(message) {
    await this.channel.sendToQueue(this.queueName, Buffer.from(message));
  }

  async receiveMessage() {
    const msg = await this.channel.get(this.queueName, { noAck: true });
    if (msg) {
      return msg.content.toString();
    } else {
      return null;
    }
  }
}

module.exports = RabbitMQController;
