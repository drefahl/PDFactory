import type { Prisma, User } from "@prisma/client"
import { z } from "zod"

export const createUserSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  name: z.string(),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

export const updateUserSchema: z.ZodType<Partial<User>> = z
  .object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
  })
  .strict()

export type UpdateUserInput = z.infer<typeof updateUserSchema>

export const ResponseGetUserSchema: z.ZodType<Omit<User, "password"> | null> = z
  .object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .nullable()

export type ResponseGetUserOutput = z.infer<typeof ResponseGetUserSchema>
