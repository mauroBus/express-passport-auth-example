import { model, Schema, Types, HydratedDocument, Document, PaginateModel } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

import { USER_MODEL_NAME } from '../user'
import { sanitizeTodoModel } from './sanitize'
import { ITodo } from './todo.interface'

export const TODO_MODEL_NAME = 'Todo'

interface ITodoDocument extends Document, ITodo {}

const TodoSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    default: 1,
  },
  owner: {
    type: Types.ObjectId,
    required: true,
    default: null,
    ref: USER_MODEL_NAME,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: {
    transform: sanitizeTodoModel,
  },
  toObject: {
    transform: sanitizeTodoModel,
  },
  timestamps: true,
})

TodoSchema.plugin(mongoosePaginate)

export type TodoDocumentType = HydratedDocument<ITodo>

export const TodoModel = model<
  ITodoDocument,
  PaginateModel<ITodo>
>(TODO_MODEL_NAME, TodoSchema)
