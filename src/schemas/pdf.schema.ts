import { z } from "zod"

export const QueryStringPdfFromHtmlSchema = z.object({ options: z.any().optional(), name: z.string().optional() })

export type QueryStringPdfFromHtml = z.infer<typeof QueryStringPdfFromHtmlSchema>

export const GeneratePdfFromUrlSchema = z.object({
  url: z.string({ message: "URL is required" }).url({ message: "Invalid URL" }),
  options: z.object({}).optional(),
  name: z.string().optional(),
})

export type GeneratePdfFromUrl = z.infer<typeof GeneratePdfFromUrlSchema>

export const GetPdfSchema = z.object({
  fileName: z
    .string()
    .trim()
    .transform((val) => (val.endsWith(".pdf") ? val : `${val}.pdf`)),
})

export type GetPdf = z.infer<typeof GetPdfSchema>
