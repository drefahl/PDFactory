import { ValidationError } from "@/errors/ValidationError"
import { savePdf } from "@/lib/utils/file.utils"
import type { GenerateAsyncPdfFromUrl, GetPdf } from "@/schemas/pdf.schema"
import type { PdfService } from "@/services/pdf.service"
import { QueueService } from "@/services/queue.service"
import type { FastifyReply, FastifyRequest } from "fastify"
import type { PDFOptions } from "puppeteer"

export class PdfController {
  private queueService: QueueService

  constructor(private readonly pdfService: PdfService) {
    this.queueService = new QueueService(pdfService)
    this.queueService.startWorker()
  }

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

      const { user } = request

      const { options, name } = request.query
      const pdf = await this.pdfService.generatePdfFromHtml(html, options)
      const { fileName } = await savePdf(pdf, user.id, name)

      return reply
        .header("Content-Type", "application/pdf")
        .header("Content-Disposition", `attachment; filename=${fileName}`)
        .send(pdf)
    } catch (error) {
      if (error instanceof ValidationError) {
        return reply.code(400).send({ message: error.message })
      }

      throw error
    }
  }

  async generatePdfByUrl(request: FastifyRequest, reply: FastifyReply) {
    const { url, options, name } = request.body as { url: string; options?: PDFOptions; name?: string }

    const { user } = request

    const pdf = await this.pdfService.generatePdfFromUrl(url, options)
    const { fileName } = await savePdf(pdf, user.id, name)

    return reply
      .header("Content-Type", "application/pdf")
      .header("Content-Disposition", `attachment; filename=${fileName}`)
      .send(pdf)
  }

  async getPdf(request: FastifyRequest<{ Params: GetPdf }>, reply: FastifyReply) {
    const { fileName } = request.params
    const { user } = request

    const pdf = await this.pdfService.getPdf(fileName, user.id)
    if (!pdf) {
      return reply.code(404).send({ message: "PDF not found" })
    }

    return reply
      .header("Content-Type", "application/pdf")
      .header("Content-Disposition", `attachment; filename=${fileName}`)
      .send(pdf)
  }

  async generatePdfByHTMLAsync(
    request: FastifyRequest<{ Querystring: { options?: PDFOptions; name?: string } }>,
    reply: FastifyReply,
  ) {
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

    const { user } = request
    const { options, name } = request.query

    const job = await this.queueService.addPdfJob({
      type: "html",
      payload: { html, options, userId: user.id, name },
    })

    return reply.code(202).send({ message: "Job enfileirado", jobId: job.id })
  }

  async generatePdfByUrlAsync(request: FastifyRequest<{ Body: GenerateAsyncPdfFromUrl }>, reply: FastifyReply) {
    const { urls } = request.body
    const { user } = request

    const jons = await Promise.all(
      urls.map(async ({ url, options, name }) => {
        return await this.queueService.addPdfJob({
          type: "url",
          payload: { url, options, userId: user.id, name },
        })
      }),
    )

    return reply.code(202).send({ message: "Job enfileirado", jobIds: jons.map((job) => job.id) })
  }

  async getWorkerStatus(request: FastifyRequest, reply: FastifyReply) {
    const metrics = await this.queueService.getQueueMetrics()
    return reply.code(200).send({
      queueStatus: metrics.jobs,
      redis: {
        memory: (await metrics.redisInfo).match(/used_memory_human:(\w+)/)?.[1],
        connected_clients: (await metrics.redisInfo).match(/connected_clients:(\d+)/)?.[1],
      },
    })
  }
}
