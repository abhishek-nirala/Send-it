import { z } from 'zod'

export const singInSchema = z.object({
    email: z.string(),
    password: z.string()
})