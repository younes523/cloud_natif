const express = require('express');
const amqp = require('amqplib');

const app = express();
const port = 4000;
const amqpUrl = 'amqp://localhost:5672';
const queue = 'message_queue';

async function consumeMessages() {
  try {
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();
    /* 
    -assertQueue() : declare a queue on the RabbitMQ server. If the queue does not already exist, it will be created. If it exists, the method ensures that it matches the specified configuration.
    -durable: false: The queue will not survive a broker restart. If RabbitMQ restarts, the queue and any messages in it will be lost (ex : queue that holds temporary or non-critical messages)
    */
    await channel.assertQueue(queue, { durable: false });

    console.log('Waiting for messages in queue...');

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        console.log(`Received message: ${msg.content.toString()}`);

        /*ack() : used to acknowledge that a message has been successfully received and processed by the consumer. When a message is 
        //sent to a consumer from a queue, RabbitMQ expects an acknowledgment that the message has been handled. Until 
        the message is acknowledged, RabbitMQ will not remove it from the queue.*/
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Error consuming messages', error);
  }
}

consumeMessages();



app.listen(port, () => {
  console.log(`Consumer service listening at http://localhost:${port}`);
});

