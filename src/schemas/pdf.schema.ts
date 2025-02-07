import { z } from "zod"

export const GeneratePdfFromUrlSchema = z.object({
  url: z.string().optional(),
  options: z.object({}).optional(),
})

export type GeneratePdfFromUrl = z.infer<typeof GeneratePdfFromUrlSchema>
