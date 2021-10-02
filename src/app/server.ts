import express from 'express'
import { config, Logger } from '../common'
import { initApp } from './index'

const port = config.port

export const startServer = async () => {
  const expressApp = express()

  await initApp(expressApp)

  expressApp.listen(port, () => {
    Logger.info(`
      ################################################
      🛡️  Server listening on port: ${port} 🛡️
      ################################################
    `)
  })
}
