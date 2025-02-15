import type { Prisma } from "@prisma/client"
import { z } from "zod"

export const createUserSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  name: z.string(),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

export const updateUserSchema: z.ZodType<Prisma.UserUpdateInput> = z
  .object({
    name: z.string().optional(),
    email: z.string().email().optional(),
  })
  .strict()

export type UpdateUserInput = z.infer<typeof updateUserSchema>
