const express = require('express');
const amqp = require('amqplib');

const app = express();
const port = 3000;
const amqpUrl = 'amqp://localhost:5672';
const queue = 'message_queue';

app.use(express.json());

app.post('/send', async (req, res) => {
  const message = req.body.message;

  if (!message) {
    return res.status(400).send('Message is required');
  }

  try {
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: false });

    /* 
    Buffer.from(message) : used to convert a string message into a binary buffer before sending it to the RabbitMQ queue. 
    RabbitMQ expects messages to be in binary format, which is why this conversion is necessary
    */
    channel.sendToQueue(queue, Buffer.from(message));
    console.log(`Sent message: ${message}`);

    await channel.close();
    await connection.close();

    res.send('Message sent successfully');
  } catch (error) {
    console.error('Error sending message', error);
    res.status(500).send('Error sending message');
  }
});

app.listen(port, () => {
  console.log(`Producer service listening at http://localhost:${port}`);
});
