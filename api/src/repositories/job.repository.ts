import { prisma } from "@/lib/prisma"
import type { Job, JobStatus, Prisma } from "@prisma/client"

export class JobRepository {
  async createJob(data: Prisma.JobCreateInput): Promise<Job> {
    return prisma.job.create({ data })
  }

  async getJobById(jobId: string): Promise<Job | null> {
    return prisma.job.findUnique({ where: { id: jobId }, include: { user: true } })
  }

  async listJobs(): Promise<Job[]> {
    return prisma.job.findMany({ include: { user: true } })
  }

  async updateJobStatus(jobId: string, status: JobStatus): Promise<Job> {
    return prisma.job.update({ where: { id: jobId }, data: { status } })
  }

  async deleteJob(jobId: string): Promise<Job> {
    return prisma.job.delete({ where: { id: jobId } })
  }
}
