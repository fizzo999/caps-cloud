'use strict';

const { Consumer } = require('sqs-consumer');

const flowersMessageArray = [];
 
const app = Consumer.create({
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/795215114173/capsCloud-vendor1-flowers',
  handleMessage: async (message) => {
    flowersMessageArray.push(message.Body);
    console.log(message.Body);
  }
});

app.on('error', err => console.log(err.message));
// app.on('processing_error', err => console.log(err.message));
// app.on('error' || 'processing_error', err => console.log(err.message));

app.start();


// Vendors:

// Vendors should separately subscribe to their personal SQS queue and periodically poll the queue to see delivery notifications

// Connect it to their own vendor queue by using it’s URL/ARN
// As drivers deliver, this app will continually poll the queue, retrieve them, and log details out to the console
// You should be able to disconnect this app, and see deliveries that happened while the app was not running

// ?????? so how does this work if I use the SQS-consumer module - it is like a server that once it is started HANGS like a server listening to more messages - therefore cannot send - YES IT IS !!!