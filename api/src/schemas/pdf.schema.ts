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

export const GenerateAsyncPdfFromUrlSchema = z.object({
  urls: z
    .array(
      z.object({
        url: z.string({ message: "URL is required" }).url({ message: "Invalid URL" }),
        options: z.object({}).optional(),
        name: z.string().optional(),
      }),
    )
    .min(1, { message: "At least one URL is required" })
    .max(10, { message: "Maximum of 10 URLs allowed" }),
})

export type GenerateAsyncPdfFromUrl = z.infer<typeof GenerateAsyncPdfFromUrlSchema>
