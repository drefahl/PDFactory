import type { Job, Prisma } from "@prisma/client"
import { z } from "zod"

export const createJobSchema: z.ZodType<Prisma.JobCreateInput> = z
  .object({
    user: z.object({
      connect: z.object({
        id: z.string(),
      }),
    }),
    mode: z.enum(["SYNC", "ASYNC"]),
    htmlContent: z.string().optional(),
    url: z.string().url({ message: "URL inválida" }).optional(),
    pdfPath: z.string().optional(),
    queueJobId: z.string().optional(),
    status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED"]).default("PENDING"),
  })
  .refine((data) => data.htmlContent || data.url, {
    message: "Deve ser fornecido HTML ou URL",
  })

export type CreateJobInput = z.infer<typeof createJobSchema>

export const updateJobSchema: z.ZodType<Prisma.JobUpdateInput> = z.object({
  htmlContent: z.string().optional(),
  url: z.string().url({ message: "URL inválida" }).optional(),
  mode: z.enum(["SYNC", "ASYNC"]).optional(),
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED"]).optional(),
  finishedAt: z.date().optional(),
})

export type UpdateJobInput = z.infer<typeof updateJobSchema>

export const jobSchema: z.ZodType<Job> = z.object({
  id: z.string(),
  userId: z.string(),
  queueJobId: z.string().nullable(),
  htmlContent: z.string().nullable(),
  url: z.string().nullable(),
  pdfPath: z.string().nullable(),
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED"]),
  mode: z.enum(["SYNC", "ASYNC"]),
  finishedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type JobOutput = z.infer<typeof jobSchema>

export const listJobsByUserIdSchema: z.ZodType<Job[]> = z.array(jobSchema)

export type ListJobsByUserIdOutput = z.infer<typeof listJobsByUserIdSchema>
