'use strict';
const uuid = require('uuid').v4;
const { Producer } = require('sqs-producer');

const producer = Producer.create({
  queueUrl: `https://sqs.us-west-2.amazonaws.com/795215114173/capsCloudPackages.fifo`,
  region: `us-west-2`,
});


let counter = 0;

setInterval(async () => {

  try {
    const message = {
      id: uuid(),
      body: `This is message #${counter++} AGAIN THIS IS WHERE THE MESSAGE WIS GONNA GO`,
    };

    // this produces a new "item" (which is the message above)
    // and sends it to our sqs queue
    const response = await producer.send(message);
    console.log(response);
  } catch (e) {
    console.error(e);
  }
}, Math.floor(Math.random() * 1000));


// const payload = {
//   Message: JSON.stringify(data),
//   TopicArn: sns_topic,
//   MessageGroupId:'123',
//   MessageDeduplicationId:faker.datatype.uuid()
// };

