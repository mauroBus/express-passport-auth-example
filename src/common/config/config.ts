import { config as dotenvConfig } from 'dotenv'
import path from 'path'

const wasEnvFound = dotenvConfig({
  path: path.join(process.cwd(), '.env')
})

if (!wasEnvFound) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️")
}

export const config = {
  env: process.env.NODE_ENV as 'production' | 'development',
  port: process.env.PORT as string,

  databaseURL: process.env.DATABASE_URL as string,

  bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS as string,

  superAdminPass: process.env.SUPER_ADMIN_PASSWORD as string,

  // Auth Session
  authSessionSecret: process.env.AUTH_SESSION_SECRET as string,

  /**
   * JWT
   */
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET as string,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN as string,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN as string,

  /**
   * API configs
   */
  api: {
    prefix: '/api/',
  },

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
}
