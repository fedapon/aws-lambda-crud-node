const AWS = require('aws-sdk');

class SQSService {
  async sendMessage(cmd, payload, QueueUrl) {
    if (!cmd || !payload || !QueueUrl) {
      throw new Error('bad request');
    }
    const params = {
      MessageBody: JSON.stringify({
        cmd,
        payload,
      }),
      QueueUrl,
    };
    const sqs = new AWS.SQS();
    try {
      const data = await sqs.sendMessage(params).promise();
      return { message: 'succeed', messageId: data.MessageId };
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  }
}

module.exports = SQSService;
