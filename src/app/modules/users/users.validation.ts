/* eslint-disable prettier/prettier */
import { z } from 'zod'
import { role } from './users.constant'

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'name is required',
    }),
    email: z.string({
      required_error: 'email is required',
    }),
    role: z.enum([...role] as [string, ...string[]], {
      required_error: 'Please Provide Your role',
    }),
    password: z.string({
      required_error: 'password is required',
    }),
    passwordConfirm: z.string({
      required_error: 'Please confirm your password',
    }),
  }),
})

export const UsersValidation = {
  createUserZodSchema,
}
