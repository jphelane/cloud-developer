import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils'
import { deleteTodo } from '../../helpers/todosAcess'

// import { deleteTodo } from '../../businessLogic/todos'
// import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event);
    
    await deleteTodo(todoId, userId)
    // TODO: Remove a TODO item by id
    
    return {
      statusCode: 201,
      body: JSON.stringify({
        
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
