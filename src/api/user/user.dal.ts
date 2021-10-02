import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { AppError, UserRoles } from '../../common'
import { UserModel } from './user.model'
import { sanitizeUser } from './utils'

export const findMyself = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User is not defined.', StatusCodes.INTERNAL_SERVER_ERROR)
    }
    res
      .status(StatusCodes.OK)
      .json({ user: req.user })
  } catch (error) {
    next(error)
  }
}

export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId } = req.params
    if (!userId) throw new Error()

    const user = await getUserById(userId)

    res
      .status(StatusCodes.OK)
      .json({ user })
  } catch (error) {
    next(error)
  }
}

export const getUserById = async (userId: string) => {
  if (!userId) throw new Error('Please provide user id')

  const user = await UserModel.findById({ _id: userId })

  if (!user) {
    throw new Error('Not found')
  }
  return sanitizeUser(user)
}

export const query = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      size = 10,
      page = 0,
      sortOrder = 'asc',
      sortField = 'name'
    } = req.query

    const usersRes = await UserModel
      .paginate({}, {
        limit: +(size || 0),
        page: +(page || 0) + 1,
        sort: sortField ? {
          [sortField as string]: sortOrder,
        } : undefined,
      })

    res
      .status(StatusCodes.OK)
      .json({
        results: usersRes.docs,
        totalPages: usersRes.totalPages,
        page: (usersRes.page || 1) - 1,
        totalDocs: usersRes.totalDocs,
        size: usersRes.limit,
      })
  } catch (error) {
    next(error)
  }
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body
    const user = new UserModel({
      name,
      email,
      password,
      role: UserRoles.user,
    })

    const userDoc = await user.save()

    res
      .status(StatusCodes.OK)
      .json({ user: userDoc })
  } catch (error) {
    next(error)
  }
}
