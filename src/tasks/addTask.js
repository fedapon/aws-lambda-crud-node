const { v4: uuid } = require('uuid');
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const SQSService = require('../sqs/sendTaskToSQS');

const addTask = async (event) => {
  const { title, description } = event.body;
  const createdAt = new Date();
  const id = uuid();

  const newTask = {
    id,
    title,
    description,
    done: false,
    createdAt,
  };

  const sqs = new SQSService();
  const resp = await sqs.sendMessage(JSON.stringify(newTask), process.env.QUEUE_URL);
  if (resp.message) {
    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        data: newTask,
        meta: { sqsMessageId: resp.messageId },
      }),
    };
  }
  return {
    statusCode: 500,
    headers: {
      'Content-Type': 'application/json',
    },
    error: resp.error,
  };
};

module.exports = {
  addTask: middy(addTask).use(jsonBodyParser()),
};
