const AWS = require("aws-sdk")
const middy = require("@middy/core")
const jsonBodyParser = require("@middy/http-json-body-parser")
const { v4: uuid } = require("uuid")
const Task = require("./task")

const addTask = async (event) => {
    const dynamodb = new AWS.DynamoDB.DocumentClient()
    const task = new Task(dynamodb, "TaskTable")
    const { title, description } = event.body

    const newTask = {
        id: uuid(),
        title,
        description,
        done: false,
        createdAt: new Date(),
    }
    await task.addTask(newTask)

    return {
        statusCode: 201,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
    }
}

const deleteTask = async (event) => {
    const dynamodb = new AWS.DynamoDB.DocumentClient()
    const task = new Task(dynamodb, "TaskTable")
    const { id } = event.pathParameters

    await task.deleteTask(id)

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "Task deleted successfully" }),
    }
}

const getTask = async (event) => {
    const dynamodb = new AWS.DynamoDB.DocumentClient()
    const task = new Task(dynamodb, "TaskTable")
    const { id } = event.pathParameters

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(await task.getTask(id)),
    }
}

const getTasks = async (event) => {
    const dynamodb = new AWS.DynamoDB.DocumentClient()
    const task = new Task(dynamodb, "TaskTable")

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(await task.getTasks()),
    }
}

const updateTask = async (event) => {
    const dynamodb = new AWS.DynamoDB.DocumentClient()
    const task = new Task(dynamodb, "TaskTable")
    const { id } = event.pathParameters
    const { done } = event.body

    await task.updateTask(id, { done })

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: "Task updated successfully",
        }),
    }
}

module.exports = {
    addTask: middy(addTask).use(jsonBodyParser()),
    deleteTask: middy(deleteTask).use(jsonBodyParser()),
    getTask: middy(getTask).use(jsonBodyParser()),
    getTasks: middy(getTasks).use(jsonBodyParser()),
    updateTask: middy(updateTask).use(jsonBodyParser()),
}
