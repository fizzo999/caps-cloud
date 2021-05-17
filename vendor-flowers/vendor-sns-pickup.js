'use strict';

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
const faker = require('faker');
const flowersPickupArray = [];

const sns = new AWS.SNS();

const topic = 'arn:aws:sns:us-west-2:795215114173:capsCloudPickup.fifo';

const queueUrl = 'https://sqs.us-west-2.amazonaws.com/795215114173/capsCloud-vendor1-flowers';

const data = { 
  orderId: faker.datatype.uuid(), 
  customer: faker.name.findName(), 
  address: faker.address.streetAddress(), 
  vendorId: queueUrl
}

const payload = {
  Message: JSON.stringify(data),
  TopicArn: topic,
  MessageGroupId: '12345',
  MessageDeduplicationId: faker.datatype.uuid()
};

// sns is a instance from the AWS SNS module
// and it gives us the ability to publish a message
// with details from up above (payload)

let howMany = 20;

// setInterval(() => {
  for (let i=0; i < howMany; i++){
    sns.publish(payload).promise()
    .then(data => {
      flowersPickupArray.push(payload);
      console.log(payload);
    })
    .catch(console.error);
  }
  console.log(`YEP we sent the ${howMany} requests <<<<<<========`);
  console.log(`and here is the Array of the ${howMany} orders ${flowersPickupArray} <<<<<<========`);
  return 
// }, 1000 );

// Vendors:
// Vendors will post “pickup” messages containing delivery information into the SNS pickup topic
// { orderId: 1234, customer: "Jane Doe", vendorId: queueArn}
// Note the queueArn – this refers to the AWS ‘arn’ of the vendor’s specific delivered queue
// Pickup requests should be moved into a FIFO queue called packages for the drivers automatically
// (Make the packages queue a subscriber to the pickup topic)

// vendor.js should be an SQS Subscriber
// Connect it to the pickup topic by using it’s URL/ARN
// Set it up to produce a new message to the “pickup” topic every few seconds, simulating an order
// The order id and customer name can be randomized
// Include the ARN to the vendor’s personal delivery queue

