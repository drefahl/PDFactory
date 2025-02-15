import type { IdInput } from "@/schemas/common.schema"
import type { CreateJobInput, UpdateStatusJobInput } from "@/schemas/job.schema"
import type { JobService } from "@/services/job.service"
import type { FastifyReply, FastifyRequest } from "fastify"

export class JobController {
  constructor(private readonly jobService: JobService) {}

  async createJob(request: FastifyRequest<{ Body: CreateJobInput }>, reply: FastifyReply) {
    const job = await this.jobService.createJob(request.body)

    return reply.code(201).send(job)
  }

  async getJobById(request: FastifyRequest<{ Params: IdInput }>, reply: FastifyReply) {
    const job = await this.jobService.getJobById(request.params.id)
    if (!job) return reply.code(404).send({ message: "Job not found" })

    return reply.send(job)
  }

  async listJobs(request: FastifyRequest, reply: FastifyReply) {
    const jobs = await this.jobService.listJobs()

    return reply.send(jobs)
  }

  async updateJobStatus(request: FastifyRequest<{ Params: IdInput; Body: UpdateStatusJobInput }>, reply: FastifyReply) {
    const { id } = request.params
    const { status } = request.body

    const job = await this.jobService.updateJobStatus(id, status)

    return reply.send(job)
  }

  async deleteJob(request: FastifyRequest<{ Params: IdInput }>, reply: FastifyReply) {
    const job = await this.jobService.deleteJob(request.params.id)

    return reply.send(job)
  }
}
