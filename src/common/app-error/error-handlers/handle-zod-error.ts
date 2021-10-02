import { StatusCodes } from 'http-status-codes'
import { ZodError } from 'zod'
import { TErrorSources, TGenericErrorResponse } from '../types'

export const handleZodError = (zodError: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSources = zodError.issues.map(({ path, message }) => ({
    path: path[path.length - 1],
    message,
  }))

  return {
    errorSources,
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: 'Validation error',
  }
}
