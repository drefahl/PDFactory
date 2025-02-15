import { PdfService } from "@/services/pdf.service"
import { QueueService } from "@/services/queue.service"
import { beforeEach, describe, expect, it, vi } from "vitest"

let queueService: QueueService
let pdfService: PdfService

describe("QueueService", () => {
  beforeEach(() => {
    pdfService = new PdfService()

    vi.spyOn(pdfService, "initialize").mockResolvedValue()

    queueService = new QueueService(pdfService)
    vi.spyOn(queueService, "startWorker").mockImplementation(async () => {})
  })

  it("should add a PDF job and return job info", async () => {
    const pdfQueueAddSpy = vi.spyOn(queueService.pdfQueue, "add").mockResolvedValue({ id: "fakeJobId" } as any)

    const jobData = { type: "html", payload: { html: "<p>Hello</p>", userId: 123 } } as const
    const result = await queueService.addPdfJob(jobData)

    expect(pdfQueueAddSpy).toHaveBeenCalledWith("pdfJob", jobData)
    expect(result).toEqual({ id: "fakeJobId" })
  })
})
