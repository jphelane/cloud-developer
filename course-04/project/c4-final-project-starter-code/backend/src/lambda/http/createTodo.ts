import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
// import { getUserId } from '../utils';
// import { createTodo } from '../../businessLogic/todos'
import { createTodo } from '../../helpers/todosAcess'
import { todoBuilder } from '../../helpers/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item

    //Validate request body
    let bodyProperties: Array<String> = Object.keys(newTodo);
    
    if (!bodyProperties.includes("name") || !bodyProperties.includes("dueDate")){
      return {
        statusCode: 400,
        body: JSON.stringify({
          "message": "Invalid request body"
        })
      }
    }
    
    const todo =  todoBuilder(newTodo, event)
    await createTodo(todo)
    
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: todo
      })
    }
  }
)


handler.use(
  cors({
    credentials: true
  })
)
