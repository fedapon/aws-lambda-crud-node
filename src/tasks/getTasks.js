const AWS = require("aws-sdk")

const getTasks = async (event) => {
    const dynamoDb = new AWS.DynamoDB.DocumentClient()

    const result = await dynamoDb
        .scan({
            TableName: "TaskTable",
        })
        .promise()
    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(result.Items),
    }
}

module.exports = { getTasks }
