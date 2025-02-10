import { z } from "zod"

export const RequestBodyAuthSchema = z.object({
  username: z.string({ message: "Username is required" }),
  password: z.string({ message: "Password is required" }),
})

export type RequestBodyAuth = z.infer<typeof RequestBodyAuthSchema>

export const ResponseBodyAuthSchema = {
  200: z.object({ token: z.string() }),
  401: z.object({ message: z.string() }),
}
