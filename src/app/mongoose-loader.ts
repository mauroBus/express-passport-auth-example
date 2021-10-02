import mongoose, { Connection } from 'mongoose'
import { config, Logger } from '../common'
import { seedSuperUser } from './db-seed'

const reconnectTimeout = 3000

export const loadDataBase = async (): Promise<Connection> => {
  const db = mongoose.connection

  db.on('connecting', () => {
    Logger.info('Connecting to MongoDB...')
  })

  db.on('error', (err) => {
    Logger.error(`MongoDB connection error: ${err}`)
    mongoose.disconnect()
  })

  db.on('connected', () => {
    Logger.info('Connected to MongoDB!')
  })

  db.once('open', () => {
    Logger.info('MongoDB connection opened!')
  })

  db.on('reconnected', () => {
    Logger.info('MongoDB reconnected!')
  })

  db.on('disconnected', () => {
    Logger.error(`MongoDB disconnected! Reconnecting in ${reconnectTimeout / 1000}s...`)
    setTimeout(() => mongoose.connect(config.databaseURL, {
      autoIndex: true,
    }), reconnectTimeout)
  })

  const instance = await mongoose.connect(config.databaseURL, {
    autoIndex: true,
  })

  await seedSuperUser()

  return instance.connection
}
