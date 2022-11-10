const AWS = require("aws-sdk")
const { v4: uuid } = require("uuid")
const middy = require("@middy/core")
const jsonBodyParser = require("@middy/http-json-body-parser")

const addTask = async (event) => {
    const dynamoDb = new AWS.DynamoDB.DocumentClient()

    const { title, description } = event.body
    const createdAt = new Date()
    const id = uuid()

    const newTask = {
        id,
        title,
        description,
        done: false,
        createdAt,
    }

    await dynamoDb
        .put({
            TableName: "TaskTable",
            Item: newTask,
        })
        .promise()
    return {
        statusCode: 201,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
    }
}

module.exports = {
    addTask: middy(addTask).use(jsonBodyParser()),
}
