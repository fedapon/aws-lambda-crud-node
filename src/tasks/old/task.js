class Task {
  constructor(db, tableName) {
    this.db = db;
    this.tableName = tableName;
  }

  async addTask(newTask) {
    await this.db
      .put({
        TableName: this.tableName,
        Item: newTask,
      })
      .promise();
    return newTask;
  }
  async deleteTask(id) {
    await this.db
      .delete({
        TableName: this.tableName,
        Key: {
          id,
        },
      })
      .promise();
    return true;
  }
  async getTask(id) {
    const result = await this.db
      .get({
        TableName: this.tableName,
        Key: {
          id,
        },
      })
      .promise();
    return result.Item;
  }
  async getTasks() {
    const result = await this.db
      .scan({
        TableName: this.tableName,
      })
      .promise();
    return result.Items;
  }
  async updateTask(id, data) {
    await this.db
      .update({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: 'set done = :done',
        ExpressionAttributeValues: {
          ':done': data.done,
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise();
    return true;
  }
}

module.exports = Task;
