import { PdfService } from "@/services/pdf.service"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"
import { ZodError } from "zod"

let pdfService: PdfService

describe("PDF URL", () => {
  beforeAll(async () => {
    pdfService = new PdfService()

    await pdfService.initialize()
  })

  afterAll(async () => {
    await pdfService.close()
  })

  it(
    "should generate PDF from URL",
    async () => {
      const pdf = await pdfService.generatePdfFromUrl("https://google.com")
      expect(pdf).toBeDefined()
      expect(pdf).toBeInstanceOf(Uint8Array)
    },
    { timeout: 10000 },
  )

  it(
    "should generate PDF from URL with options",
    async () => {
      const pdf = await pdfService.generatePdfFromUrl("https://google.com", {
        margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
      })

      expect(pdf).toBeDefined()
      expect(pdf).toBeInstanceOf(Uint8Array)
    },
    { timeout: 10000 },
  )

  it("should throw an error when URL is invalid", async () => {
    await expect(pdfService.generatePdfFromUrl("invalid-url")).rejects.toThrow(ZodError)
  })

  it("should throw an error if the browser is not initialized", async () => {
    vi.spyOn(pdfService, "initialize").mockImplementationOnce(async () => {
      pdfService.setBrowser(null)
    })

    await expect(pdfService.generatePdfFromHtml("<html></html>")).rejects.toThrow("Browser not initialized")
  })
})
