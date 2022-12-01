const AWS = require("aws-sdk")

const processSqs = async (event) => {
    const dynamoDb = new AWS.DynamoDB.DocumentClient()
    for (const { messageId, body } of event.Records) {
        try {
            await dynamoDb
                .put({
                    TableName: "TaskTable",
                    Item: JSON.parse(body),
                })
                .promise()
            console.log(`messageId: ${messageId} - message sent to dynamodb`)
        } catch (err) {
            console.log(`messageId: ${messageId} - err: ${err}`)
            return
        }
    }
    return
}

module.exports = {
    processSqs,
}
