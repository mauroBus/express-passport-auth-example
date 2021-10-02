import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Logger, AuthJWT } from '../../common'
import { UserModel } from '../user'

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, name, password } = req.body
  Logger.debug('Calling Sign-Up endpoint with ""body"": %o', req.body)

  try {
    const { salt, hash } = AuthJWT.generatePassword(password)

    const newUser = new UserModel({
      email,
      name,
      hash,
      salt,
    })

    const userData = await newUser.save()
    res
      .status(StatusCodes.OK)
      .json({ user: userData })
  } catch (error) {
    next(error)
  }
}

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Logger.debug('Calling Sign-In endpoint with body: %o', req.body)
  try {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email })

    if (!user) {
      throw new Error('')
    }

    const isValid = AuthJWT.isValidPassword({
      password,
      hash: user.hash,
      salt: user.salt
    })

    if (isValid) {
      const tokenObject = AuthJWT.issueJWT(user)
      res
        .status(StatusCodes.OK)
        .json({
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
        })
    } else {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({
          message: 'Wrong email or password.'
        })
    }
  } catch (error) {
    next(error)
  }
}

export const signOut = (req: Request, res: Response, next: NextFunction) => {
  Logger.debug('Calling Sign-Out endpoint.')
  try {
    // Just a placeholder for now. In the future there could be things to do here.
    res
      .status(StatusCodes.OK)
      .json({ message: 'User signed out.' })
  } catch (error) {
    next(error)
  }
}
