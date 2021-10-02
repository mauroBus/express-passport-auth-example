import { Application } from 'express'
import passport from 'passport'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'

import { AuthJWT, authService } from '../../common'

export const initPassport = (expressApp: Application) => {
  const strategy  = new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: AuthJWT.PUB_KEY,
    algorithms: ['RS256']
  }, AuthJWT.verifyCallback)

  expressApp.use(passport.initialize())

  passport.use(AuthJWT.STRATEGY_NAME, strategy)

  authService.setAuthInstance(AuthJWT)
}
