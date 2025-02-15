import { JobController } from "@/controllers/job.controller"
import { idSchema } from "@/schemas/common.schema"
import { createJobSchema, updateStatusJobSchema } from "@/schemas/job.schema"
import { JobService } from "@/services/job.service"
import type { FastifyInstance } from "fastify"

export async function jobRoutes(app: FastifyInstance) {
  const jobService = new JobService()
  const jobController = new JobController(jobService)

  app.post(
    "/",
    {
      schema: {
        body: createJobSchema,
      },
    },
    jobController.createJob.bind(jobController),
  )

  app.get(
    "/:id",
    {
      schema: {
        params: idSchema,
      },
    },
    jobController.getJobById.bind(jobController),
  )

  app.get(
    "/",
    {
      schema: {},
    },
    jobController.listJobs.bind(jobController),
  )

  app.patch(
    "/:id/status",
    {
      schema: {
        params: idSchema,
        body: updateStatusJobSchema,
      },
    },
    jobController.updateJobStatus.bind(jobController),
  )

  app.delete(
    "/:id",
    {
      schema: {
        params: idSchema,
      },
    },
    jobController.deleteJob.bind(jobController),
  )
}
