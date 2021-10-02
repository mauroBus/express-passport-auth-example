import { Types } from 'mongoose'

export interface ITodo {
  description: String
  priority: Number
  owner: Types.ObjectId
  isCompleted: Boolean
  createdAt: Date
  updatedAt: Date
}
