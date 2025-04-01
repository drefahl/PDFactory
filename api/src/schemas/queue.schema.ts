import { z } from "zod"

export const addPdfJobSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("html"),
    userId: z.string(),
    payload: z.object({
      html: z.string(),
      options: z.any().optional(),
    }),
  }),
  z.object({
    type: z.literal("url"),
    userId: z.string(),
    payload: z.object({
      url: z.string(),
      options: z.any().optional(),
    }),
  }),
])

export type AddPdfJobInput = z.infer<typeof addPdfJobSchema>
