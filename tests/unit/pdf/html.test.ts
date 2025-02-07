import { PdfService } from "@/services/pdf.services"
import { beforeAll, describe, expect, it } from "vitest"
import { ZodError } from "zod"

let pdfService: PdfService

describe("PDF HTML", () => {
  beforeAll(async () => {
    pdfService = new PdfService()

    await pdfService.initialize()
  })

  it("should generate PDF from HTML", async () => {
    const pdf = await pdfService.generatePdfFromHtml("<h1>Hello, World!</h1>")

    expect(pdf).toBeDefined()
    expect(pdf).toBeInstanceOf(Uint8Array)
  })

  it("should generate PDF from HTML with options", async () => {
    const pdf = await pdfService.generatePdfFromHtml("<h1>Hello, World!</h1>", {
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

  it("should throw an error when HTML is invalid", async () => {
    try {
      await pdfService.generatePdfFromHtml(123 as unknown as string)
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError)
      const zodError = error as ZodError
      expect(zodError.errors.length).toBe(1)
    }
  })
})
