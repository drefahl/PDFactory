import { ValidationError } from "@/errors/ValidationError"
import type { PdfService } from "@/services/pdf.service"
import { createPdfServiceMock, mockConstants } from "tests/mocks"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"
import { ZodError } from "zod"

const {
  user: { id: userId },
  pdf: { htmlContent },
} = mockConstants

let pdfService: PdfService

describe("PDF HTML", () => {
  beforeAll(async () => {
    pdfService = await createPdfServiceMock()
    vi.clearAllMocks()
  })

  afterAll(async () => {
    await pdfService.close()
  })

  it("should generate PDF from HTML", async () => {
    const { pdf } = await pdfService.generatePdfFromHtml({ html: htmlContent, userId })

    expect(pdf).toBeDefined()
    expect(pdf).toBeInstanceOf(Uint8Array)
  })

  it("should generate PDF from HTML with options", async () => {
    const { pdf } = await pdfService.generatePdfFromHtml({
      html: htmlContent,
      userId,
      options: {
        margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
      },
    })

    expect(pdf).toBeDefined()
    expect(pdf).toBeInstanceOf(Uint8Array)
  })

  it("should throw a ZodError when input is not a string", async () => {
    await expect(pdfService.generatePdfFromHtml({ html: 123 as unknown as string, userId })).rejects.toThrow(ZodError)
  })

  it("should throw an error when HTML content is invalid", async () => {
    await expect(pdfService.generatePdfFromHtml({ html: "invalid-html", userId })).rejects.toThrow(ValidationError)
  })

  it("should throw an error if the browser is not initialized", async () => {
    pdfService.setBrowser(null)
    await expect(pdfService.generatePdfFromHtml({ html: htmlContent, userId })).rejects.toThrow(
      "Browser not initialized",
    )
  })
})
