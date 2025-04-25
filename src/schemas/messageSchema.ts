import { z } from 'zod'

export const messageSchema = z.object({
  content : z
  .string()
  .min(1, {message : "must be of at least 1 character"})
  .max(300, {message : "must be of max 300 character"})
})