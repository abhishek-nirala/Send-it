import { z } from 'zod'

export const usernameValidation = z
    .string()
    .min(3, "username must be of atleast 3 characters")
    .max(12, "username must be of less than 12 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "username must not contain special characters")


export const signUpSchema = z.object({
    username : usernameValidation,
    email : z.string().email({message : "Please enter valid email address"}),
    password : z.string().min(6,{message : "Password must be of atleast 6 characters"})
})