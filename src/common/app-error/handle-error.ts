import { Response } from 'express'

import { Logger } from '../logger'
import { AppError } from './app-error'

export const handleError = ({
  res,
  error,
  customMsg = 'App error',
}: {
  res: Response,
  error: AppError | Error,
  customMsg: string
}): void => {
  Logger.error(error)

  const message = error instanceof AppError
    ? (error as AppError).message
    : customMsg
  const status = error instanceof AppError ? (error as AppError).status : 400

  res
    .status(status)
    .json({ message })
}
