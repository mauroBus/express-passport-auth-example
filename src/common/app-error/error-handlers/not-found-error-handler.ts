import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../app-error'

export const notFoundError = (_req: Request, _res: Response, next: NextFunction) => {
  return next(new AppError('Route not found!', StatusCodes.NOT_FOUND))
}
