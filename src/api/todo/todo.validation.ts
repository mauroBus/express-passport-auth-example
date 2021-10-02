import { z } from 'zod'

export const todoValSchema = z.object({
  description: z.string().max(60),
  priority: z.number().optional(),
  isCompleted: z.boolean(),
})

export const queryTodoValSchema = z.object({
  size: z.number(),
  page: z.number(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  sortField: z.enum(['description', 'priority']).optional(),
})
