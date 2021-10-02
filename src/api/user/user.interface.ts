import { UserRolesType } from '../../common'

export interface IUser {
  id: string
  name: string
  email: string
  salt: string
  hash: string
  role: UserRolesType
  createdAt: Date
  updatedAt: Date
}

