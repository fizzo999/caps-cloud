// From Lab:
// driver.js
// Connect to the packages queue and get only the next package
// Wait a random number of seconds
// Post a message to the Vendor Queue (using the supplied arn) to alert them of the delivery
// Repeat until the queue is empty

//connect to the packages queue

'use strict';

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const queueURL = 'https://sqs.us-west-2.amazonaws.com/795215114173/capsCloudPackages.fifo';

const params = {
  AttributeNames: [
    'SentTimestamp',
  ],
  MaxNumberOfMessages: 1,
  MessageAttributeNames: [
    'All',
  ],
  QueueUrl: queueURL,
  VisibilityTimeout: 20,
  WaitTimeSeconds: 3,
};

setInterval(() => {
  sqs.receiveMessage(params, (err, data) => {
    if (err) {
      console.log('Error Received', err);
    } else if (data.Messages) {
      // console.log('data', data);
      console.log('data.Messages', data.Messages[0]);
      let deleteParams = {
        QueueUrl: queueURL,
        ReceiptHandle: data.Messages[0].ReceiptHandle,
      };
      let someParsedData = JSON.parse(data.Messages[0].Body);
      let fullyParsedData = JSON.parse(someParsedData.Message);
      sqs.deleteMessage(deleteParams, (err, data) => {
        if (err) { console.log(err); }
        else { console.log('Successfully Deleted', data); }
        const order = {
          orderId: fullyParsedData.orderId,
          customer: fullyParsedData.customer,
          status: 'delivered',
        };

        const sendParams = {
          QueueUrl: fullyParsedData.vendorId,
          MessageBody: JSON.stringify(order),
        };

        sqs.sendMessage(sendParams, (err, data) => {
          if (err) {
            console.log('Error', err);
          } else {
            console.log('Succes delivered message successfully added to the SQS queue', data.MessageId);
            console.log('here is the order and the message sent', sendParams);
          }
        });
      });
    }
  });

}, (1000));
