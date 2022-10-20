import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

// const logger = createLogger('TodosAccess')
const todosTable = process.env.TODOS_TABLE
const index = process.env.TODOS_CREATED_AT_INDEX
const docClient: DocumentClient = createDynamoDBClient()

// // TODO: Implement the dataLayer logic
export async function createTodo(todo: TodoItem): Promise<TodoItem> {
    
    await docClient
        .put({
            TableName: todosTable,
            Item: todo
        })
        .promise()

    return todo
}

export async function getAllTodosByUserId(userId: string): Promise<TodoItem[]>{

    const result = await docClient.query({
        TableName: todosTable,
        KeyConditionExpression: 'userId = :userId',
        // ExpressionAttributeNames: {
        //     '#userId': 'userId'
        // },
        ExpressionAttributeValues: {
            ':userId': userId
        }
    }).promise()

    return result.Items as TodoItem[]
}

export async function getTodoById(todoId: string): Promise<TodoItem>{

    const result = await docClient.query({
        TableName: todosTable,
        IndexName: index,
        KeyConditionExpression: 'todoId = :todoId',
        ExpressionAttributeValues: {
            ':todoId': todoId
        }
    }).promise()

    const items = result.Items
    if (items.length !== 0)
        return result.Items[0] as TodoItem

    return null
}

export async function updateAttachment(todo: TodoItem): Promise<TodoItem>{

    const result = await docClient.update({
        TableName: todosTable,
        Key: {
            userId: todo.userId,
            todoId: todo.todoId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
            ':attachmentUrl': todo.attachmentUrl
        }
    }).promise()

    return result.Attributes as TodoItem
}

export async function updateTodo(todo_id: string, user_id: string, todo: UpdateTodoRequest): Promise<TodoItem>{

    const result = await docClient.update({
        TableName: todosTable,
        Key: {
            userId: user_id,
            todoId: todo_id
        },
        UpdateExpression: 'set done = :done, dueDate = :dueDate, #name = :name',
        ExpressionAttributeNames:{
            "#name": "name"
        },
        ExpressionAttributeValues: {
            ':done': todo.done,
            ':dueDate': todo.dueDate,
            ':name': todo.name
        }
    }).promise()

    return result.Attributes as TodoItem
}


export async function deleteTodo(todo_id: string, user_id: string): Promise<TodoItem>{

    const result = await docClient.delete({
        TableName: todosTable,
        Key: {
            userId: user_id,
            todoId: todo_id
        }
    }).promise()

    console.log('Delete result: ', result)

    return null
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
}