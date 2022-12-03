const AWS = require('aws-sdk');

class SQSService {
  async sendMessage(MessageBody, QueueUrl) {
    const params = {
      MessageBody,
      QueueUrl,
    };
    const sqs = new AWS.SQS();
    try {
      const data = await sqs.sendMessage(params).promise();
      return { message: 'succeed', messageId: data.MessageId };
    } catch (err) {
      return { error: err };
    }
  }
}

module.exports = SQSService;
