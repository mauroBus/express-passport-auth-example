import { Schema, model, HydratedDocument, PaginateModel } from 'mongoose'
import paginate from 'mongoose-paginate-v2'
import isEmail from 'validator/lib/isEmail'

import { UserRoles } from '../../common'
import { sanitizeUserModel } from './sanitize'
import { IUser } from './user.interface'

export const USER_MODEL_NAME = 'User'

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please enter a name'],
      index: true,
    },

    email: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
      required: true,
      validate: [isEmail, 'Invalid email'],
    },

    salt: {
      type: String,
      required: true,
    },

    hash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: UserRoles,
      default: 'user',
      required: true,
    },
  },
  {
    toJSON: {
      transform: sanitizeUserModel,
    },
    toObject: {
      transform: sanitizeUserModel,
    },
    timestamps: true,
  }
)

UserSchema.plugin(paginate)

export type UserDocumentType = HydratedDocument<IUser>

export const UserModel = model<
  IUser,
  PaginateModel<IUser>
>(USER_MODEL_NAME, UserSchema)
