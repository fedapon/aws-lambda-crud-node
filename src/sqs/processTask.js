const AWS = require('aws-sdk');
const middy = require('@middy/core');
const sqsJsonBodyParser = require('@middy/sqs-json-body-parser');

const processSqs = async (event) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const tableName = process.env.TASK_TABLE;
  const { Records } = event;

  await Promise.all(
    Records.map(async (record) => {
      console.log({ 'record.messageId': record.messageId, 'record.body.cmd': record.body.cmd });
      try {
        if (record.body.cmd === 'add') {
          await dynamoDb
            .put({
              TableName: tableName,
              Item: record.body.payload,
            })
            .promise();
          console.log('task added to dynamodb');
          return;
        }
        if (record.body.cmd === 'delete') {
          await dynamoDb
            .delete({
              TableName: tableName,
              Key: {
                id: JSON.parse(record.body.payload).id,
              },
            })
            .promise();
          console.log('task deleted from dynamodb');
          return;
        }
      } catch (err) {
        console.log(`Error: ${err}`);
        return;
      }
      return;
    }),
  );
};

module.exports = {
  processSqs: middy(processSqs).use(sqsJsonBodyParser()),
};
