import { ValidationError } from "@/errors/ValidationError"
import { PdfService } from "@/services/pdf.service"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"
import { ZodError } from "zod"

let pdfService: PdfService

describe("PDF HTML", () => {
  beforeAll(async () => {
    pdfService = new PdfService()

    await pdfService.initialize()
  })

  afterAll(async () => {
    await pdfService.close()
  })

  it("should generate PDF from HTML", async () => {
    const pdf = await pdfService.generatePdfFromHtml("<h1>Hello, World!</h1>")

    expect(pdf).toBeDefined()
    expect(pdf).toBeInstanceOf(Uint8Array)
  })

  it("should generate PDF from HTML with options", async () => {
    const pdf = await pdfService.generatePdfFromHtml("<h1>Hello, World!</h1>", {
      margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
    })

    expect(pdf).toBeDefined()
    expect(pdf).toBeInstanceOf(Uint8Array)
  })

  it("should throw a ZodError when input is not a string", async () => {
    await expect(pdfService.generatePdfFromHtml(123 as unknown as string)).rejects.toThrow(ZodError)
  })

  it("should throw an error when HTML content is invalid", async () => {
    await expect(pdfService.generatePdfFromHtml("invalid-html")).rejects.toThrow(ValidationError)
  })

  it("should throw an error if the browser is not initialized", async () => {
    vi.spyOn(pdfService, "initialize").mockImplementationOnce(async () => {
      pdfService.setBrowser(null)
    })

    await expect(pdfService.generatePdfFromHtml("<html></html>")).rejects.toThrow("Browser not initialized")
  })
})
