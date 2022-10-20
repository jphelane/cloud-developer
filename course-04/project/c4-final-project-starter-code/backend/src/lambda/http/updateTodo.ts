import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

// import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../helpers/todosAcess'
import { getUserId } from '../utils'
// import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    const result = await updateTodo(todoId, userId, updatedTodo)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    console.log('Update result: ', result)

    return {
      statusCode: 201,
      body: JSON.stringify({
        updatedTodo
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
