import { MongoClient } from 'mongodb'
import { config, UserRoles } from '../../common'
import { UserModel } from '../../api/user'
import { users } from './users'

const isTestEnv = process.env.NODE_ENV === 'test'

const log = (...args: any[]) => {
  if (isTestEnv) return
  console.log(...args)
}

export const runSeed = async () => {
  const client = new MongoClient(config.databaseURL)
  try {
    await client.connect()

    log(`Db connected successfully to ${'todos-monorepo'}!`)

    const db = client.db('todos-monorepo')
    const collection = db.collection('users')

    await collection.deleteMany({})
    await Promise.all(users.map(user => collection.insertOne(user)))

    log(await collection.find().toArray())
  } catch (err) {
    log((err as Error).stack || '')
  } finally {
    await client.close()
  }
}

const superUserData = {
  name: 'john',
  email: 'john@doe.com',
  password: 'letmein',
  role: 'admin',
}

export const seedSuperUser = async () => {
  const superUser = await UserModel.findOne({ role: UserRoles.admin })

  if (!superUser) {
    await UserModel.create(superUserData)
  }
}
