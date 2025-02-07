import { PdfService } from "@/services/pdf.services"
import { beforeAll, describe, expect, it } from "vitest"
import { ZodError } from "zod"

let pdfService: PdfService

describe("PDF URL", () => {
  beforeAll(async () => {
    pdfService = new PdfService()

    await pdfService.initialize()
  })

  it("should generate PDF from URL", async () => {
    const pdf = await pdfService.generatePdfFromUrl("https://google.com")

    expect(pdf).toBeDefined()
    expect(pdf).toBeInstanceOf(Uint8Array)
  })

  it("should generate PDF from URL with options", async () => {
    const pdf = await pdfService.generatePdfFromUrl("https://google.com", {
      margin: {
        top: "1cm",
        right: "1cm",
        bottom: "1cm",
        left: "1cm",
      },
    })

    expect(pdf).toBeDefined()
    expect(pdf).toBeInstanceOf(Uint8Array)
  })

  it("should throw an error when URL is invalid", async () => {
    try {
      await pdfService.generatePdfFromUrl("invalid-url")
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError)
      const zodError = error as ZodError
      expect(zodError.errors.length).toBe(1)
    }
  })
})
