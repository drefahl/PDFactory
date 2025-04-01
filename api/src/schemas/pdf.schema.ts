import type { PDFOptions } from "puppeteer"
import { z } from "zod"

const PageMarginSchema = z
  .object({
    top: z.string().optional(),
    right: z.string().optional(),
    bottom: z.string().optional(),
    left: z.string().optional(),
  })
  .optional()

export const PDFOptionsSchema: z.ZodType<PDFOptions> = z
  .object({
    path: z.string().optional(),
    scale: z.number().min(0.1).max(2).optional(),
    displayHeaderFooter: z.boolean().optional(),
    headerTemplate: z.string().optional(),
    footerTemplate: z.string().optional(),
    printBackground: z.boolean().optional(),
    landscape: z.boolean().optional(),
    pageRanges: z.string().optional(),
    format: z.enum(["Letter", "Legal", "Tabloid", "Ledger", "A0", "A1", "A2", "A3", "A4", "A5", "A6"]).optional(),
    width: z
      .string()
      .regex(/^\d+(\.\d+)?(mm|cm|in|px)$/)
      .optional(),
    height: z
      .string()
      .regex(/^\d+(\.\d+)?(mm|cm|in|px)$/)
      .optional(),
    margin: PageMarginSchema,
    preferCSSPageSize: z.boolean().optional(),
    omitBackground: z.boolean().optional(),
  })
  .strict()

export const QueryStringPdfFromHtmlSchema = z.object({
  options: PDFOptionsSchema.optional(),
})

export type QueryStringPdfFromHtml = z.infer<typeof QueryStringPdfFromHtmlSchema>

export const GeneratePdfFromUrlSchema = z.object({
  url: z.string({ message: "URL is required" }).url({ message: "Invalid URL" }),
  options: PDFOptionsSchema.optional(),
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
      }),
    )
    .min(1, { message: "At least one URL is required" })
    .max(5, { message: "Maximum of 5 URLs allowed" }),
  options: PDFOptionsSchema.optional(),
})

export type GenerateAsyncPdfFromUrl = z.infer<typeof GenerateAsyncPdfFromUrlSchema>

export const GenerateAsyncPdfResponseSchema = z.object({
  message: z.string(),
  jobIds: z.array(z.string()),
  errors: z.array(z.string()),
})

export type GenerateAsyncPdfFromUrlResponse = z.infer<typeof GenerateAsyncPdfResponseSchema>
