import type { IdInput } from "@/schemas/common.schema"
import type { JobService } from "@/services/job.service"
import type { FastifyReply, FastifyRequest } from "fastify"

export class JobController {
  constructor(private readonly jobService: JobService) {}

  async getJobById(request: FastifyRequest<{ Params: IdInput }>, reply: FastifyReply) {
    const job = await this.jobService.getJobById(request.params.id)
    if (!job) return reply.code(404).send({ message: "Job not found" })

    return reply.send(job)
  }

  async listJobs(request: FastifyRequest, reply: FastifyReply) {
    const jobs = await this.jobService.listJobsByUserId(request.user.id)

    return reply.send(jobs)
  }

  async deleteJob(request: FastifyRequest<{ Params: IdInput }>, reply: FastifyReply) {
    const job = await this.jobService.deleteJob(request.params.id)

    return reply.send(job)
  }
}
