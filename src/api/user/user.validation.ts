import { z } from 'zod'

export const userValSchema = z.object({
  description: z.string().max(60),
  priority: z.number().optional(),
  isCompleted: z.boolean(),
})

export const queryUserValSchema = z.object({
  size: z.preprocess(
    (stringSize) => parseInt(stringSize as string, 10),
    z.number().gt(-1)
  ),
  page: z.preprocess(
    (stringSize) => parseInt(stringSize as string, 10),
    z.number().gt(-1)
  ),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  sortField: z.enum(['name', 'email']).optional(),
})
