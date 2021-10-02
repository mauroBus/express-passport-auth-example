import { Router } from 'express'

import { authService, validateRequestBody } from '../../common'
import { create, find, query, save, remove } from './todo.dal'
import { todoValSchema, queryTodoValSchema } from './todo.validation'

export const initRoutes = (mainRouter: Router) => {
  const route = Router()
  const authInstance = authService.getAuthInstance()

  route
    .get('/', validateRequestBody(queryTodoValSchema), query)
    .post('/', validateRequestBody(todoValSchema), create)

    .get('/:id', find)
    .patch('/:id', validateRequestBody(todoValSchema), save)
    .delete('/:id', remove)

  mainRouter.use('/todos', authInstance.isAuth, route)
}
