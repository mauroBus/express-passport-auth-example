import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { AppError } from '../../common'
import { TodoModel } from './todo.model'

export const find = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: todoId } = req.params
    if (!todoId) {
      throw new AppError('The "id" param must be provided.', StatusCodes.BAD_REQUEST)
    }

    const todo = await TodoModel
      .findById({ _id: todoId })
      .populate({
        path: 'owner',
        select: ['id', 'name', 'email'],
      })
    res
      .status(StatusCodes.OK)
      .json({ todo })
  } catch (error) {
    next(error)
  }
}

export const query = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      size = 10,
      page = 0,
      sortOrder = 'asc',
      sortField = 'description'
    } = req.query

    const todosRes = await TodoModel
      .paginate({}, {
        limit: +(size || 0),
        page: +(page || 0) + 1,
        populate: { path: 'owner', select: ['id', 'name', 'email'] },
        sort: sortField ? {
          [sortField as string]: sortOrder,
        } : undefined,
      })

    res
      .status(StatusCodes.OK)
      .json({
        results: todosRes.docs,
        totalPages: todosRes.totalPages,
        page: (todosRes.page || 1) - 1,
        totalDocs: todosRes.totalDocs,
        size: todosRes.limit,
      })
  } catch (error) {
    next(error)
  }
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      description,
      priority,
      isCompleted,
    } = req.body

    const todo = new TodoModel({
      description,
      priority,
      isCompleted,
      owner: req.user,
    })
    await todo.save()

    res
      .status(StatusCodes.CREATED)
      .json({ todo })
  } catch (error) {
    next(error)
  }
}

export const save = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { description, isCompleted, priority } = req.body

    const updatedTodo = await TodoModel.findByIdAndUpdate(id, {
      $set: {
        description,
        isCompleted,
        priority,
      }
    })
    if (!updatedTodo) {
      throw new AppError('Todo not found', StatusCodes.NOT_FOUND)
    }

    updatedTodo
      .populate({ path: 'owner', select: ['id', 'name', 'email']  })

    res
      .status(StatusCodes.OK)
      .json({ todo: updatedTodo })
  } catch (error) {
    next(error)
  }
}

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const todo = await TodoModel.findByIdAndDelete(id)

    if (!todo) {
      throw new AppError('Todo not found', StatusCodes.NOT_FOUND)
    }

    res
      .status(StatusCodes.NO_CONTENT)
      .json({ message: `Todo ${id} removed` })
  } catch (error) {
    next(error)
  }
}
