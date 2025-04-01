import { ValidationError } from "@/errors/ValidationError"
import { JobRepository } from "@/repositories/job.repository"
import { createJobSchema, updateJobSchema } from "@/schemas/job.schema"
import { type Job, JobStatus, type Prisma } from "@prisma/client"
import { UserService } from "./user.service"

export class JobService {
  constructor(
    private readonly jobRepository: JobRepository = new JobRepository(),
    private readonly userService: UserService = new UserService(),
  ) {}

  async createJob(data: Prisma.JobCreateInput): Promise<Job> {
    const jobData = createJobSchema.parse(data)

    const userId = jobData.user.connect?.id
    if (!userId) {
      throw new ValidationError("User ID is required")
    }

    const user = await this.userService.getUserById(userId)
    if (!user) {
      throw new ValidationError("User not found")
    }

    return await this.jobRepository.createJob(jobData)
  }

  async getJobById(id: string): Promise<Job | null> {
    return this.jobRepository.getJobById(id)
  }

  async listJobsByUserId(userId: string): Promise<Job[]> {
    return this.jobRepository.listJobsByUserId(userId)
  }

  async updateJob(id: string, data: Prisma.JobUpdateInput): Promise<Job> {
    const jobData = updateJobSchema.parse(data)

    return this.jobRepository.updateJob(id, jobData)
  }

  async updateJobStatusByQueueJobId(queueJobId: string, status: JobStatus): Promise<Job> {
    const job = await this.jobRepository.getJobByQueueJobId(queueJobId)
    if (!job) throw new ValidationError("Job not found")

    return this.jobRepository.updateJob(job.id, { status })
  }

  async deleteJob(queueJobId: string): Promise<Job> {
    const job = await this.jobRepository.getJobById(queueJobId)
    if (!job) {
      throw new ValidationError("Job not found")
    }

    if (job.status === JobStatus.PROCESSING) {
      throw new ValidationError("Cannot delete a job that is processing")
    }

    return this.jobRepository.deleteJob(queueJobId)
  }
}
