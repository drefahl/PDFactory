import type { QueueService } from "@/services/queue.service"
import { createPdfServiceMock, createQueueServiceMock, mockConstants } from "tests/mocks"
import { beforeEach, describe, expect, it, vi } from "vitest"

const {
  user: { id: userId },
  pdf: { htmlContent },
} = mockConstants

let queueService: QueueService

describe("QueueService", () => {
  beforeEach(async () => {
    const pdfService = await createPdfServiceMock()
    queueService = createQueueServiceMock(pdfService)
    vi.clearAllMocks()
  })

  it("should add a PDF job and return job info", async () => {
    const pdfQueueAddSpy = vi.spyOn(queueService.pdfQueue, "add").mockResolvedValue({ id: "fakeJobId" } as any)
    const jobData = { type: "html", userId, payload: { html: htmlContent } } as const
    const result = await queueService.addPdfJob(jobData)

    expect(pdfQueueAddSpy).toHaveBeenCalledWith(
      "pdfJob",
      jobData,
      expect.objectContaining({
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
      }),
    )
    expect(result).toEqual({ id: "fakeJobId" })
  })

  it("should throw an error when PDF job addition fails", async () => {
    const error = new Error("PDF queue add failed")
    vi.spyOn(queueService.pdfQueue, "add").mockRejectedValue(error)
    const jobData = { type: "html", userId, payload: { html: htmlContent } } as const

    await expect(queueService.addPdfJob(jobData)).rejects.toThrow("PDF queue add failed")
  })

  it("should call jobService.updateJobStatusByQueueJobId with COMPLETED on success", async () => {
    const updateSpy = vi.spyOn(queueService.jobService, "updateJobStatusByQueueJobId")

    const job = { id: "fakeJobId" } as any
    const result = { fileName: "fakeFileName" }

    queueService.pdfWorker?.emit("completed", job, result, "fakeJobId")

    expect(updateSpy).toHaveBeenCalledWith("fakeJobId", "COMPLETED")
  })

  it("should call jobService.updateJobStatusByQueueJobId with FAILED on error", async () => {
    const updateSpy = vi.spyOn(queueService.jobService, "updateJobStatusByQueueJobId")

    const job = { id: "fakeJobId" } as any
    const error = new Error("Simulated PDF error")

    queueService.pdfWorker?.emit("failed", job, error, "fakeJobId")

    expect(updateSpy).toHaveBeenCalledWith("fakeJobId", "FAILED")
  })
})
