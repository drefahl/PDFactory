import { JobController } from "@/controllers/job.controller"
import { idSchema } from "@/schemas/common.schema"
import { jobSchema, listJobsByUserIdSchema } from "@/schemas/job.schema"
import { JobService } from "@/services/job.service"
import type { FastifyInstance } from "fastify"

export async function jobRoutes(app: FastifyInstance) {
  const jobService = new JobService()
  const jobController = new JobController(jobService)

  app.get(
    "/:id",
    {
      schema: {
        tags: ["Job"],
        operationId: "getJobById",
        description: "Get a job by id",
        params: idSchema,
        response: {
          200: jobSchema,
        },
      },
    },
    jobController.getJobById.bind(jobController),
  )

  app.get(
    "/",
    {
      schema: {
        tags: ["Job"],
        operationId: "listJobs",
        description: "List all jobs",
        response: {
          200: listJobsByUserIdSchema,
        },
      },
    },
    jobController.listJobs.bind(jobController),
  )

  app.delete(
    "/:id",
    {
      schema: {
        tags: ["Job"],
        operationId: "deleteJob",
        description: "Delete a job by id",
        params: idSchema,
        response: {
          200: jobSchema,
        },
      },
    },
    jobController.deleteJob.bind(jobController),
  )
}
