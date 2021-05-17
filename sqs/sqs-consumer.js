'use strict';

const { Consumer } = require('sqs-consumer');

const myOwnMessageArray = [];
 
// THIS IS FOR THE DRIVER AND SHOULD ONLY BE CONSUMED ONE MESSAGE AT A TIME !!!!
// MAYBE STORE THE MESSAGES AS A BACKUP IN A DB
const app = Consumer.create({
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/795215114173/capsCloudPackages.fifo',
  handleMessage: async (message) => {
    myOwnMessageArray.push(message);
    console.log(message.Body);
  }
});

app.start();


// const payload = {
//   Message: JSON.stringify(data),
//   TopicArn: sns_topic,
//   MessageGroupId:'123',
//   MessageDeduplicationId:faker.datatype.uuid()
// };
