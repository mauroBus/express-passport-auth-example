import { Application, Router } from 'express'

import { AuthJWT } from '../../common'
import { initPassport } from './init-passport'
import { signIn, signUp, signOut } from './auth-jwt.dal'

export const initRoutes = (expressApp: Application, mainRouter: Router) => {
  initPassport(expressApp)

  const route = Router()
  route.post('/signup', signUp)
  route.post('/signin', signIn)
  route.post('/signout', AuthJWT.isAuth, signOut)

  mainRouter.use('/auth-jwt', route)
}
