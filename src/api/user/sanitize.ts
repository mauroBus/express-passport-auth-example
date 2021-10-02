import { IUser } from './user.interface'
import { UserDocumentType } from './user.model'

export const sanitizeUserModel = (_doc: UserDocumentType, objectModel: any): IUser => {
  const sanitizedModel = { ...objectModel }
  sanitizedModel.id = objectModel._id
  delete sanitizedModel._id
  delete sanitizedModel.hash
  delete sanitizedModel.salt
  delete sanitizedModel.__v
  delete sanitizedModel.createdAt
  delete sanitizedModel.updatedAt
  return sanitizedModel
}
