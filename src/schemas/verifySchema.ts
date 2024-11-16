import { z } from 'zod'

export const verificationCodeSchema = z.object({
    code: z.string()
        .length(6, "verification code must be of 6 digits")
})