import { ITodo } from './todo.interface'
import { TodoDocumentType } from './todo.model'

export const sanitizeTodoModel = (_doc: TodoDocumentType, objectModel: any): ITodo => {
  const sanitizedModel = { ...objectModel }
  sanitizedModel.id = objectModel._id
  delete sanitizedModel._id
  delete sanitizedModel.__v
  delete sanitizedModel.completed
  return sanitizedModel
}
