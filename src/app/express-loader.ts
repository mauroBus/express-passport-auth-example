import express, { Application, Request, Response, NextFunction } from 'express'
import { Connection } from 'mongoose'
import cors from 'cors'
import morgan from 'morgan'

import { config, globalErrorHandler, notFoundError } from '../common'
import { initRoutes } from '../api'

export const loadExpress = (expressApp: Application, dbConnection: Connection) => {
  expressApp.get('/status', (_req: Request, res: Response) => {
    res.status(200).end()
  })

  expressApp.head('/status', (_: Request, res: Response) => {
    res.status(200).end()
  })

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  expressApp.enable('trust proxy')

  // Enable Cross Origin Resource Sharing to all origins by default
  expressApp.use(cors())

  // Middleware that transforms the raw string of req.body into JSON
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({ extended: true }));

  // "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
  expressApp.use(require('method-override')())

  expressApp.use(morgan('dev'));

  // Load API routes
  expressApp.use(config.api.prefix, initRoutes(expressApp, dbConnection))

  // Error handlers
  expressApp.use(notFoundError)
  // @ts-ignore
  expressApp.use(globalErrorHandler)
}
