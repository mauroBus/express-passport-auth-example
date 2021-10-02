import crypto from 'crypto'
import { NextFunction, Request, Response } from 'express'

export interface AuthBaseI {
  generatePassword: (password: string) => { salt: string, hash: string }

  isValidPassword: ({ password, hash, salt }: {
    password: string,
    hash: string,
    salt: string
  }) => boolean

  verifyCallback: ((
    jwtPayload: any,
    done: (error: Error | null, user?: Express.User | boolean) => void
  ) => Promise<void>) | ((
    email: string,
    password: string,
    done: (error: Error | null, user?: Express.User | boolean) => void
  ) => Promise<void>)

  isAuth: (req: Request, res: Response, next: NextFunction) => void
}

export abstract class AuthBase {
  static STRATEGY_NAME: string

  static generatePassword(password: string): { salt: string, hash: string } {
    const salt = crypto
      .randomBytes(32)
      .toString('hex')
    const genHash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('hex')
  
    return { salt, hash: genHash }
  }

  static isValidPassword({ password, hash, salt }: {
    password: string,
    hash: string,
    salt: string
  }): boolean {
    const hashVerify = crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('hex')
    return hash === hashVerify
  }

  static verifyCallback: ((
    jwtPayload: any,
    done: (error: Error | null, user?: Express.User | boolean) => void
  ) => Promise<void>) | ((
    email: string,
    password: string,
    done: (error: Error | null, user?: Express.User | boolean) => void
  ) => Promise<void>)

  static isAuth: (req: Request, res: Response, next: NextFunction) => void
}
