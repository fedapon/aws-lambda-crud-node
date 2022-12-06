const AWS = require('aws-sdk');
const SQSService = require('../sqs/sendToSQS');

const deleteTask = async (event) => {
  const { id } = event.pathParameters;

  const sqs = new SQSService();
  const resp = await sqs.sendMessage('delete', JSON.stringify({ id }), process.env.QUEUE_URL);
  if (resp.message) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Task deleted successfully',
        sqsMessageId: resp.messageId,
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

module.exports = { deleteTask };
