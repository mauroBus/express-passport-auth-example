import { NextFunction, Request, RequestHandler, Response } from 'express'
import { ZodSchema } from 'zod'
import { catchAsync } from './catch-async'

export const validate = (
  zodSchema: ZodSchema,
  source: 'body' | 'params' | 'query'
) => {
  return catchAsync(
    async (req: Request, _res: Response, next: NextFunction) => {
      await zodSchema.parseAsync(req[source])
      next()
    }
  )
}

export const validateRequestBody = (schema: ZodSchema): RequestHandler => validate(schema, 'body')

export const validateRequestParams = (schema: ZodSchema): RequestHandler => validate(schema, 'params')

export const validateRequestQuery = (schema: ZodSchema): RequestHandler => validate(schema, 'query')
