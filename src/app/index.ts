import { Application } from 'express'
import { Logger } from '../common'
import { loadExpress } from './express-loader'
import { loadDataBase } from './mongoose-loader'

export const initApp = async (expressApp: Application) => {
  const dbConnection = await loadDataBase()
  Logger.info('✌️ DB loaded and connected!')

  loadExpress(expressApp, dbConnection)
  Logger.info('✌️ Express loaded')
}
