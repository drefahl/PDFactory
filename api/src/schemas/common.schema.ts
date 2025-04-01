import z from "zod"

export const idSchema = z.object({ id: z.string() }).strict()
export type IdInput = z.infer<typeof idSchema>

export const messageSchema = z.object({ message: z.string() }).strict()
export type MessageInput = z.infer<typeof messageSchema>
