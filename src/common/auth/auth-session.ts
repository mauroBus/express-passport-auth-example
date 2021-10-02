import { NextFunction, Request, Response } from 'express'

import { UserDocumentType, UserModel } from '../../api/user'
import { UserRolesType } from '../user'
import { AuthBase } from './auth-base'


export class AuthSession extends AuthBase {
  static STRATEGY_NAME = 'local'

  static verifyCallback = async (
    email: string,
    password: string,
    done: (error: Error | null, user?: Express.User | boolean) => void
  ) => {
    try {
      const user = await UserModel.findOne({ email })
  
      if (!user || !user.salt || !user.hash) {
        return done(null, false)
      }
      const isValid = AuthSession.isValidPassword({
        password,
        hash: user.hash,
        salt: user.salt
      })
      if (isValid) {
        return done(null, user)
      } else {
        return done(null, false)
      }
    } catch(error) {
      done(error as Error)
    }
  }

  static hasRole = (role: UserRolesType) => (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated() && (req.user as UserDocumentType).role === role) {
      next()
    } else {
      res
        .status(401)
        .json({
          msg: 'You are not authorized to view this resource.'
        })
    }
  }

  static isAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      next()
    } else {
      res
        .status(401)
        .json({
          msg: 'You are not authenticated to view this resource'
        })
    }
  }

  static serializeUser = (
    user: Express.User,
    done: (error: Error | null, id?: Express.User) => void
  ) => {
    done(null, (user as UserDocumentType)._id)
  }

  static deserializeUser = async (
    userId: string,
    done: (error: Error | null, user?: Express.User) => void
  ) => {
    try {
      const user = await UserModel.findById(userId)
      if (!user) {
        done(null)
      } else {
        done(null, user)
      }
    } catch(error) {
      done(error as Error)
    }
  }
}
