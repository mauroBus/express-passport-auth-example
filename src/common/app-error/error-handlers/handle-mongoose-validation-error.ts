import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import { TErrorSources, TGenericErrorResponse } from '../types'

export const handleMongooseValidationError = (
  error: mongoose.Error.ValidationError
): TGenericErrorResponse => {
  const errorSources: TErrorSources = Object.values(error.errors).map((err) => ({
    path: err?.path,
    message: err?.message,
  }))

  return {
    status: StatusCodes.BAD_REQUEST,
    errorSources,
    message: 'Validation error!',
  }
}
