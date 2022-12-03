const AWS = require('aws-sdk');
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');

const updateTask = async (event) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const { id } = event.pathParameters;
  const { done } = event.body;

  await dynamoDb
    .update({
      TableName: 'TaskTable',
      Key: { id },
      UpdateExpression: 'set done = :done',
      ExpressionAttributeValues: {
        ':done': done,
      },
      ReturnValues: 'ALL_NEW',
    })
    .promise();
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'Task updated successfully',
    }),
  };
};

module.exports = {
  updateTask: middy(updateTask).use(jsonBodyParser()),
};
