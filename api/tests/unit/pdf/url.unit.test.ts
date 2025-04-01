import type { PdfService } from "@/services/pdf.service"
import { createPdfServiceMock } from "tests/mocks"
import { mockConstants } from "tests/mocks"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"
import { ZodError } from "zod"

const {
  user: { id: userId },
  pdf: { url },
} = mockConstants

let pdfService: PdfService

describe("PDF URL", () => {
  beforeAll(async () => {
    vi.clearAllMocks()
    pdfService = await createPdfServiceMock()
  })

  afterAll(async () => {
    await pdfService.close()
  })

  it("should generate PDF from URL", { timeout: 10000 }, async () => {
    const { pdf } = await pdfService.generatePdfFromUrl({ url, userId })

    expect(pdf).toBeDefined()
    expect(pdf).toBeInstanceOf(Uint8Array)
  })

  it("should generate PDF from URL with options", { timeout: 10000 }, async () => {
    const { pdf } = await pdfService.generatePdfFromUrl({
      url,
      userId,
      options: { margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" } },
    })

    expect(pdf).toBeDefined()
    expect(pdf).toBeInstanceOf(Uint8Array)
  })

  it("should throw an error when URL is invalid", async () => {
    await expect(pdfService.generatePdfFromUrl({ url: "invalid-url", userId })).rejects.toThrow(ZodError)
  })

  it("should throw an error if the browser is not initialized", async () => {
    pdfService.setBrowser(null)
    await expect(pdfService.generatePdfFromUrl({ url, userId })).rejects.toThrow("Browser not initialized")
  })
})
