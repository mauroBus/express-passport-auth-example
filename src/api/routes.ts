import { Application, Router } from 'express'
import { Connection } from 'mongoose'

// import { initAuthSessionRoutes } from './auth-session'
import { initAuthJWTRoutes } from './auth-jwt'
import { initUserRoutes } from './user'
import { initTodoRoutes } from './todo'

const mainRouter = Router()

export const initRoutes = (expressApp: Application, dbConnection: Connection): Router => {
  // initAuthSessionRoutes(expressApp, mainRouter, dbConnection)
  initAuthJWTRoutes(expressApp, mainRouter)
  initUserRoutes(mainRouter)
  initTodoRoutes(mainRouter)
  return mainRouter
}
