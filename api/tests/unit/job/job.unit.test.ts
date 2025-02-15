import { JobRepository } from "@/repositories/job.repository"
import type { CreateJobInput } from "@/schemas/job.schema"
import { JobService } from "@/services/job.service"
import { UserService } from "@/services/user.service"
import { createId } from "@paralleldrive/cuid2"
import { JobStatus } from "@prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { ZodError } from "zod"

const id = createId()
const userId = createId()

describe("CRUD Job", () => {
  let jobService: JobService
  let userService: UserService
  let jobRepository: JobRepository

  beforeEach(() => {
    jobRepository = new JobRepository()
    userService = new UserService()

    vi.spyOn(userService, "getUserById").mockImplementation(async (id: string) => {
      if (id !== userId) return null

      return {
        id,
        email: "teste@example.com",
        name: "John Doe",
        password: "password",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })

    vi.spyOn(jobRepository, "createJob").mockImplementation(async (data) => {
      return {
        id,
        userId,
        status: JobStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
        htmlContent: data.htmlContent || null,
        url: data.url || null,
        pdfPath: data.pdfPath || null,
      }
    })

    vi.spyOn(jobRepository, "getJobById").mockImplementation(async (jobId: string) => {
      if (jobId !== id) return null

      return {
        id,
        userId,
        htmlContent: "<html><body>Hello</body></html>",
        url: null,
        pdfPath: null,
        status: JobStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })

    vi.spyOn(jobRepository, "listJobs").mockImplementation(async () => {
      return [
        {
          id,
          userId,
          htmlContent: "<html><body>Hello</body></html>",
          url: null,
          pdfPath: null,
          status: JobStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
    })

    vi.spyOn(jobRepository, "updateJobStatus").mockImplementation(async (jobId: string, status: JobStatus) => {
      if (jobId !== id) throw new Error("Job not found")

      return {
        id,
        userId,
        htmlContent: "<html><body>Hello</body></html>",
        url: null,
        pdfPath: null,
        status,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })

    vi.spyOn(jobRepository, "deleteJob").mockImplementation(async (jobId: string) => {
      if (id !== jobId) throw new Error("Job not found")

      return {
        id,
        userId,
        htmlContent: "<html><body>Hello</body></html>",
        url: null,
        pdfPath: null,
        status: JobStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })

    jobService = new JobService(jobRepository, userService)
  })

  it("should create a job with valid data", async () => {
    const validJobData: CreateJobInput = {
      user: { connect: { id: userId } },
      htmlContent: "<html><body>Hello</body></html>",
    }

    const job = await jobService.createJob(validJobData)

    expect(job).toHaveProperty("id")
    expect(job.status).toEqual(JobStatus.PENDING)
    expect(job.htmlContent).toEqual(validJobData.htmlContent)
  })

  it("should throw validation error when required field is missing", async () => {
    const invalidJobData = {
      user: { connect: { id: userId } },
    }

    await expect(jobService.createJob(invalidJobData)).rejects.toThrow(ZodError)
  })

  it("should get job by id", async () => {
    const job = await jobService.getJobById(id)

    expect(job).toHaveProperty("id")
  })

  it("should return null when job is not found", async () => {
    const job = await jobService.getJobById("invalid_id")

    expect(job).toBeNull()
  })

  it("should update job status with valid data", async () => {
    const updatedJob = await jobService.updateJobStatus(id, JobStatus.COMPLETED)

    expect(updatedJob).toHaveProperty("id")
    expect(updatedJob.status).toEqual(JobStatus.COMPLETED)
  })

  it("should throw error when updating a job that does not exist", async () => {
    await expect(jobService.updateJobStatus("invalid_id", JobStatus.PROCESSING)).rejects.toThrow()
  })

  it("should delete job", async () => {
    const deletedJob = await jobService.deleteJob(id)

    expect(deletedJob).toHaveProperty("id")
  })

  it("should throw error when deleting a non-existing job", async () => {
    await expect(jobService.deleteJob("invalid_id")).rejects.toThrow()
  })

  it("should list jobs", async () => {
    const jobs = await jobService.listJobs()

    expect(jobs).toHaveLength(1)
    expect(jobs[0]).toHaveProperty("id")
  })

  it("should throw error when listing jobs fails", async () => {
    vi.spyOn(jobRepository, "listJobs").mockRejectedValue(new Error("Database error"))
    await expect(jobService.listJobs()).rejects.toThrow()
  })
})
