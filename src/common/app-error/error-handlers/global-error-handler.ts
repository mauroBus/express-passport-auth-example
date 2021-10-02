import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ZodError } from 'zod'

import { config } from '../../config'
import { AppError } from '../app-error'
import { TErrorSources } from '../types'
import { handleMongoDBCastError } from './handle-mongo-db-cast-error'
import { handleMongoDBDuplicateError } from './handle-mongo-db-duplicate-error'
import { handleMongooseValidationError } from './handle-mongoose-validation-error'
import { handleZodError } from './handle-zod-error'
import { Logger } from '../../logger'

export const globalErrorHandler = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let status: number = StatusCodes.INTERNAL_SERVER_ERROR
  let message = 'Something went wrong!'
  let errorSources: TErrorSources = []

  Logger.error(error)

  if (error instanceof ZodError) {
    const modifiedError = handleZodError(error)
    status = modifiedError.status
    message = modifiedError.message
    errorSources = modifiedError.errorSources
  } else if (error?.name === 'CastError') {
    const modifiedError = handleMongoDBCastError(error)
    status = modifiedError.status
    message = modifiedError.message
    errorSources = modifiedError.errorSources
  } else if (error?.code === 11000) {
    const modifiedError = handleMongoDBDuplicateError(error)
    status = modifiedError.status
    message = modifiedError.message
    errorSources = modifiedError.errorSources
  } else if (error?.name === 'ValidationError') {
    const modifiedError = handleMongooseValidationError(error)
    status = modifiedError.status
    message = modifiedError.message
    errorSources = modifiedError.errorSources
  } else if (error instanceof AppError) {
    status = error.status
    message = error.message
    errorSources = [
      {
        path: '',
        message: error.message,
      },
    ]
  } else if (error instanceof Error) {
    message = error.message
    errorSources = [
      {
        path: '',
        message: error.message,
      },
    ]
  }

  return res
    .status(status)
    .json({
      message,
      errorSources,
      stack: config.env === 'development' ? error.stack : null,
    })
}
