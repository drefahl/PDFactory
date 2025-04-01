import { prisma } from "@/lib/prisma"
import type { Job, Prisma } from "@prisma/client"

export class JobRepository {
  async createJob(data: Prisma.JobCreateInput): Promise<Job> {
    return prisma.job.create({ data })
  }

  async getJobById(id: string): Promise<Job | null> {
    return prisma.job.findUnique({ where: { id: id } })
  }

  async getJobByQueueJobId(queueJobId: string): Promise<Job | null> {
    return prisma.job.findUnique({ where: { queueJobId } })
  }

  async listJobsByUserId(userId: string): Promise<Job[]> {
    return prisma.job.findMany({ where: { userId } })
  }

  async updateJob(id: string, data: Prisma.JobUpdateInput): Promise<Job> {
    return prisma.job.update({ where: { id: id }, data })
  }

  async deleteJob(id: string): Promise<Job> {
    return prisma.job.delete({ where: { id: id } })
  }
}
