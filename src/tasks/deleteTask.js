const AWS = require('aws-sdk');

const deleteTask = async (event) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const { id } = event.pathParameters;

  await dynamoDb
    .delete({
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
    body: JSON.stringify({ message: 'Task deleted successfully' }),
  };
};

module.exports = { deleteTask };
