const amqp = require('amqplib/callback_api');
const fs = require('fs');
const path = require('path');

// RabbitMQ connection string
const RABBITMQ_URL = 'amqp://localhost:5672';

amqp.connect(RABBITMQ_URL, (error0, connection) => {
    if (error0) {
        throw error0;
    }

    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }

        const queue = 'chat';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log('Waiting for messages in %s. To exit press CTRL+C', queue);

        channel.consume(queue, (msg) => {
            console.log(msg.content, "msg");
            const imagePath = msg.content.toString();
            console.log(`Processing image: ${imagePath}`);
            channel.ack(msg, () => {
                console.log('Message acknowledged and removed from the queue');
            });

        }, {
            noAck: true
        });
    });
});

