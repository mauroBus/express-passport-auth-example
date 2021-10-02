import { IUser } from '../user.interface'
import { UserDocumentType } from '../user.model'

export const sanitizeUser = (userModel: UserDocumentType): Partial<IUser> => {
  const userData = userModel.toJSON()
  return userData
}
