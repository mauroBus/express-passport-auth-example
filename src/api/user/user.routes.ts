import { Router } from 'express'

import { authService, validateRequestQuery } from '../../common'
import { query, findById, findMyself } from './user.dal'
import { queryUserValSchema } from './user.validation'

export const initRoutes = (mainRouter: Router) => {
  const route = Router()
  const authInstance = authService.getAuthInstance()

  route.get('/', validateRequestQuery(queryUserValSchema), query)
  route.get('/me', findMyself)
  route.get('/:id', findById)

  // route.post('/', AuthSession.hasRole(UserRoles.admin), create)

  mainRouter.use('/users', authInstance.isAuth, route)
}
