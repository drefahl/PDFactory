import type { PdfService } from "@/services/pdf.services"
import type { FastifyReply, FastifyRequest } from "fastify"
import type { PDFOptions } from "puppeteer"

export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  async generatePdfByHTML(
    request: FastifyRequest<{ Querystring: { options: PDFOptions | undefined } }>,
    reply: FastifyReply,
  ) {
    try {
      const data = await request.file()
      const html = await data?.toBuffer()

      const options = request.query.options

      if (!html) {
        return reply.code(400).send({
          success: false,
          message: "HTML content or URL is required",
        })
      }

      const pdf = await this.pdfService.generatePdfFromHtml(html.toString(), options)

      return reply
        .header("Content-Type", "application/pdf")
        .header("Content-Disposition", "attachment; filename=document.pdf")
        .send(pdf)
    } catch (error) {
      return reply.code(500).send({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
      })
    }
  }

  async generatePdfByUrl(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { url, options } = request.body as { url: string; options?: Record<string, unknown> }

      const pdf = await this.pdfService.generatePdfFromUrl(url, options)

      return reply
        .header("Content-Type", "application/pdf")
        .header("Content-Disposition", "attachment; filename=document.pdf")
        .send(pdf)
    } catch (error) {
      return reply.code(500).send({
        message: error instanceof Error ? error.message : "Unknown error occurred",
      })
    }
  }
}
