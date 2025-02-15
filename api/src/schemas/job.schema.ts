import type { JobStatus, Prisma } from "@prisma/client"
import { z } from "zod"

export const createJobSchema: z.ZodType<Prisma.JobCreateInput> = z
  .object({
    user: z.object({
      connect: z.object({
        id: z.string(),
      }),
    }),
    htmlContent: z.string().optional(),
    url: z.string().url({ message: "URL inválida" }).optional(),
    name: z.string().optional(),
  })
  .refine((data) => data.htmlContent || data.url, {
    message: "Deve ser fornecido HTML ou URL",
  })

export type CreateJobInput = z.infer<typeof createJobSchema>

export const updateStatusJobSchema: z.ZodType<{ status: JobStatus }> = z
  .object({ status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED"]) })
  .strict()

export type UpdateStatusJobInput = z.infer<typeof updateStatusJobSchema>
