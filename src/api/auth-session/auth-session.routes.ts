import { Application, Router } from 'express'
import { Connection } from 'mongoose'
import passport from 'passport'

import { AuthSession } from '../../common'
import { initPassport } from './init-passport'
import { signIn, signUp, signOut } from './auth-session.dal'

export const initRoutes = (expressApp: Application, mainRouter: Router, dbConnection: Connection) => {
  initPassport(expressApp, dbConnection)

  const route = Router()
  route.post('/signup', signUp)
  route.post('/signin', passport.authenticate(AuthSession.STRATEGY_NAME), signIn)
  route.post('/signout', AuthSession.isAuth, signOut)

  mainRouter.use('/auth-session', route)
}
