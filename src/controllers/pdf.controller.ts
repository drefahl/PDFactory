import { ValidationError } from "@/errors/ValidationError"
import { savePdf } from "@/lib/utils/file.utils"
import type { PdfService } from "@/services/pdf.services"
import type { FastifyReply, FastifyRequest } from "fastify"
import type { PDFOptions } from "puppeteer"
import { ZodError } from "zod"

export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  async generatePdfByHTML(
    request: FastifyRequest<{ Querystring: { options?: PDFOptions; name?: string } }>,
    reply: FastifyReply,
  ) {
    try {
      const data = await request.file()
      if (!data) {
        return reply.code(400).send({ message: "File is required" })
      }

      if (data.mimetype !== "text/html") {
        return reply.code(400).send({ message: "Only HTML files are allowed" })
      }

      const html = (await data.toBuffer()).toString()
      if (!html) {
        return reply.code(400).send({ message: "HTML content is required" })
      }

      const { options, name } = request.query
      const pdf = await this.pdfService.generatePdfFromHtml(html, options)
      const { fileName } = await savePdf(pdf, name)

      return reply
        .header("Content-Type", "application/pdf")
        .header("Content-Disposition", `attachment; filename=${fileName}`)
        .send(pdf)
    } catch (error) {
      if (error instanceof ValidationError) {
        return reply.code(400).send({ message: error.message })
      }

      if (error instanceof ZodError) {
        return reply.code(400).send({ message: error.errors.map((err) => err.message).join(", ") })
      }

      return reply.code(500).send({
        message: error instanceof Error ? error.message : "Unknown error occurred",
      })
    }
  }

  async generatePdfByUrl(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { url, options, name } = request.body as { url: string; options?: PDFOptions; name?: string }

      const pdf = await this.pdfService.generatePdfFromUrl(url, options)
      const { fileName } = await savePdf(pdf, name)

      return reply
        .header("Content-Type", "application/pdf")
        .header("Content-Disposition", `attachment; filename=${fileName}`)
        .send(pdf)
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({ message: error.errors.map((err) => err.message).join(", ") })
      }

      return reply.code(500).send({
        message: error instanceof Error ? error.message : "Unknown error occurred",
      })
    }
  }
}
