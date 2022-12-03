const AWS = require('aws-sdk');

const getTask = async (event) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const { id } = event.pathParameters;

  const result = await dynamoDb
    .get({
      TableName: 'TaskTable',
      Key: {
        id,
      },
    })
    .promise();
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(result.Item),
  };
};

module.exports = { getTask };
