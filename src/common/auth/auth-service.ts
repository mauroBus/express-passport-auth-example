import { AuthBaseI } from './auth-base'
import { AuthJWT } from './auth-jwt'
import { AuthSession } from './auth-session'

class AuthService {
  private AuthInstance: AuthBaseI

  constructor(instance: AuthBaseI) {
    this.AuthInstance = instance
  }

  setAuthInstance(instance: AuthBaseI) {
    this.AuthInstance = instance
  }

  getAuthInstance(): AuthBaseI {
    return this.AuthInstance
  }
} 

export const authService = new AuthService(AuthSession)
