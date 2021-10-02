import { Error as MongooseError } from 'mongoose'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Logger, UserRoles, AuthSession } from '../../common'
import { UserModel } from '../user'

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Logger.debug('Calling Sign-Up endpoint with ""body"": %o', req.body)

  try {
    const { email, name, password } = req.body
    const { salt, hash } = AuthSession.generatePassword(password)

    const newUser = new UserModel({
      name,
      email,
      hash,
      salt,
      role: UserRoles.user,
    })

    await newUser.save()

    res
      .status(StatusCodes.OK)
      .json({
        message: 'User successfully created.',
      })
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({
          message: (error as MongooseError.ValidationError).message,
          errorFields: Object.keys((error as MongooseError.ValidationError).errors || [])
        })
    } else {
      next(error)
    }
  }
}

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Logger.debug('Calling Sign-In endpoint with body: %o', req.body)
  try {
    if (req.isAuthenticated()) {
      res
        .status(StatusCodes.OK)
        .json({ user: req.user })
    }
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Wrong password or email' })
    next(error)
  }
}

export const signOut = (req: Request, res: Response, next: NextFunction) => {
  Logger.debug('Calling Sign-Out endpoint with body: %o', req.body)
  try {
    req.logOut({ keepSessionInfo: false }, (error) => {
      if (error) {
        throw new Error('Not able to logout.')
      }
      req.session.destroy(() => {})
      res.clearCookie('connect.sid')
      res
        .status(StatusCodes.OK)
        .json({ message: 'User signed out.' })
        .end()
    })
  } catch (error) {
    next(error)
  }
}
