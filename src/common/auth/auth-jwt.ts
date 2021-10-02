import fs from 'node:fs'
import path from 'node:path'
import { NextFunction, Request, Response } from 'express'
import passport from 'passport'
import { StrategyOptionsWithoutRequest } from 'passport-jwt'
import jsonwebtoken from 'jsonwebtoken'

import { UserDocumentType, UserModel } from '../../api/user'
import { config } from '../config'
import { AuthBase } from './auth-base'

const pathToKey = path.join(__dirname, '../../..', 'id_rsa_priv.pem')
const pathToPubKey = path.join(__dirname, '../../..', 'id_rsa_pub.pem')
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8')
const PUB_KEY = fs.readFileSync(pathToPubKey, 'utf8')

export class AuthJWT extends AuthBase {
  static STRATEGY_NAME = 'jwt'
  static PUB_KEY = PUB_KEY

  static verifyCallback = async (
    // jwtPayload: StrategyOptionsWithoutRequest,
    jwtPayload: any,
    done: (error: Error | null, user?: Express.User | boolean) => void
  ) => {
    try {
      const user = await UserModel.findById(jwtPayload.sub)

      return done(null, user || false)
    } catch(error) {
      done(error as Error, false)
    }
  }

  static issueJWT = (user: UserDocumentType) => {
    const { _id } = user
    const expiresIn = config.jwtAccessExpiresIn || '1d'
    const payload = {
      sub: _id,
      iat: Date.now(),
    }

    const signedToken = jsonwebtoken.sign(
      payload,
      PRIV_KEY,
      { expiresIn, algorithm: 'RS256' }
    )

    return {
      token: 'Bearer ' + signedToken,
      expires: expiresIn,
    }
  }

  // Custom implementation:
  // static isAuth = (req: Request, res: Response, next: NextFunction) => {
  //   const tokenParts = req.headers.authorization?.split(' ') || ''
  //   if (tokenParts[0] === 'Bearer' && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null) {
  //     try {
  //       const verification = jsonwebtoken.verify(tokenParts[1], PUB_KEY, { algorithms: ['RS256'] })
  //       // @ts-ignore
  //       req.jwt = verification
  //       next()
  //     } catch(err) {
  //       res
  //         .status(401)
  //         .json({ msg: 'You are not authorized to visit this route' })
  //     }
  //   } else {
  //     res
  //       .status(401)
  //       .json({ msg: 'You are not authorized to visit this route' })
  //   }
  // }

  static isAuth = passport.authenticate(AuthJWT.STRATEGY_NAME, { session: false })

  // static hasRole = (role: UserRolesType) => (req: Request, res: Response, next: NextFunction) => {
  //   if (req.isAuthenticated() && (req.user as UserDocumentType).role === role) {
  //     next()
  //   } else {
  //     res
  //       .status(401)
  //       .json({
  //         msg: 'You are not authorized to view this resource.'
  //       })
  //   }
  // }
}
