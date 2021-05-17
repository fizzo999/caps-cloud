'use strict';

const uuid = require('uuid').v4;

const { Producer } = require('sqs-producer');
const { Consumer } = require('sqs-consumer');

const app = Consumer.create({
  queueUrl : 'https://sqs.us-west-2.amazonaws.com/795215114173/capsCloudPackages.fifo',
  handleMessage: async (message) => {
    const tempOrder = JSON.parse(message.Body)
    const order = JSON.parse(tempOrder.Message);
    console.log(`Picked up order number: ${order}`);

    setTimeout( async () => {
      const producer = Producer.create({
        queueUrl: order.vendorId,
        region: 'us-west-2'
      });

      await producer.send({
        id: uuid(),
        body: JSON.stringify(order)
      });
      console.log(`Delivered order number: ${order.orderId} to customer: ${order.customer}`);
    }, 3000);
  },
  pollingWaitTimeMs: 5000
});

app.start();