import { Application } from 'express'
import { Connection } from 'mongoose'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import MongoStore from 'connect-mongo'
import session from 'express-session'

import { config, AuthSession } from '../../common'

const ONE_DAY = 1000 * 60 * 60 * 24 // (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)

export const initPassport = (expressApp: Application, dbConnection: Connection) => {
  const sessionStore = MongoStore.create({
    clientPromise: new Promise(resolve => resolve(dbConnection.getClient())),
  })

  const strategy  = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, AuthSession.verifyCallback)

  expressApp.use(session({
    secret: config.authSessionSecret,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: ONE_DAY,
    }
  }))

  expressApp.use(passport.initialize())
  expressApp.use(passport.session())

  passport.use(AuthSession.STRATEGY_NAME, strategy)
  passport.serializeUser(AuthSession.serializeUser)
  passport.deserializeUser(AuthSession.deserializeUser)
}
