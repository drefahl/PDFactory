import { z } from "zod"

const MAX_ITEMS = 5

const htmlSchema = z.object({
  conversionType: z.literal("html"),
  files: z
    .array(z.object({ file: z.instanceof(File).nullable() }))
    .min(1)
    .max(MAX_ITEMS)
    .refine((files) => files.some((file) => file.file !== null), {
      message: "At least one HTML file must be selected",
    }),
  conversionMode: z.enum(["sync", "async"]),
})

const urlSchema = z.object({
  conversionType: z.literal("url"),
  urls: z
    .array(z.object({ url: z.string().url("Invalid URL") }))
    .min(1)
    .max(MAX_ITEMS)
    .refine((urls) => urls.some((url) => url.url !== ""), {
      message: "At least one valid URL must be provided",
    }),
  conversionMode: z.enum(["sync", "async"]),
})

export const conversionSchema = z.discriminatedUnion("conversionType", [htmlSchema, urlSchema]).refine(
  (data) => {
    if (data.conversionMode === "sync") {
      if (data.conversionType === "html") {
        return data.files.length === 1 && data.files[0].file !== null
      }
      return data.urls.length === 1 && data.urls[0].url !== ""
    }
    return true
  },
  {
    message: "Only one non-empty file or URL is allowed in synchronous mode",
  },
)

export type ConversionFormData = z.infer<typeof conversionSchema>
