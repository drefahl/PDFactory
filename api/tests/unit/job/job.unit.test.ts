import type { CreateJobInput } from "@/schemas/job.schema"
import { JobService } from "@/services/job.service"
import { JobMode, JobStatus } from "@prisma/client"
import { createJobRepositoryMock, createUserServiceMock, mockConstants } from "tests/mocks"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { ZodError } from "zod"

const {
  user: { id: userId },
  job: { id, queueJobId },
  pdf: { htmlContent },
} = mockConstants

const jobRepository = createJobRepositoryMock()
const userService = createUserServiceMock()
const jobService = new JobService(jobRepository, userService)

describe("Job Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should create a job with valid data", async () => {
    const validJobData: CreateJobInput = {
      user: { connect: { id: userId } },
      htmlContent,
      mode: JobMode.ASYNC,
    }

    const job = await jobService.createJob(validJobData)

    expect(job).toHaveProperty("id")
    expect(job.status).toEqual(JobStatus.PENDING)
    expect(job.htmlContent).toEqual(validJobData.htmlContent)
  })

  it("should update job status by queue job id", async () => {
    const job = await jobService.updateJobStatusByQueueJobId(queueJobId, JobStatus.COMPLETED)

    expect(job).toHaveProperty("id")
    expect(job.status).toEqual(JobStatus.COMPLETED)
  })

  it("should throw validation error when required field is missing", async () => {
    const invalidJobData = {
      user: { connect: { id: userId } },
      mode: undefined as unknown as JobMode,
    }

    await expect(jobService.createJob(invalidJobData)).rejects.toThrow(ZodError)
  })

  it("should throw validation error when both htmlContent and url are missing", async () => {
    const invalidJobData = {
      user: { connect: { id: userId } },
      mode: JobMode.ASYNC,
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

  it("should update job", async () => {
    const updatedJob = await jobService.updateJob(id, { status: JobStatus.PROCESSING })

    expect(updatedJob).toHaveProperty("id")
    expect(updatedJob.status).toEqual(JobStatus.PROCESSING)
  })

  it("should throw error when updating a non-existing job", async () => {
    await expect(jobService.updateJob("invalid_id", { status: JobStatus.PROCESSING })).rejects.toThrow()
  })

  it("should throw error when updating a job with invalid data", async () => {
    await expect(jobService.updateJob(id, { status: "invalid_status" as JobStatus })).rejects.toThrow()
  })

  it("should throw error when deleting a non-existing job", async () => {
    await expect(jobService.deleteJob("invalid_id")).rejects.toThrow()
  })

  it("should list jobs", async () => {
    const jobs = await jobService.listJobsByUserId(userId)

    expect(jobs).toHaveLength(1)
    expect(jobs[0]).toHaveProperty("id")
  })
})
