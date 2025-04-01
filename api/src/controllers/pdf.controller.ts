import { ValidationError } from "@/errors/ValidationError"
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

  async generatePdfByHTML(request: FastifyRequest<{ Querystring: { options?: PDFOptions } }>, reply: FastifyReply) {
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

      const { options } = request.query
      const { pdf, fileName } = await this.pdfService.generatePdfFromHtml({
        html,
        userId: user.id,
        options,
      })

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
    const { url, options } = request.body as { url: string; options?: PDFOptions }

    const { user } = request

    const { pdf, fileName } = await this.pdfService.generatePdfFromUrl({ url, userId: user.id, options })

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
    request: FastifyRequest<{ Querystring: { options?: PDFOptions } }>,
    reply: FastifyReply,
  ) {
    const data = await request.saveRequestFiles({ limits: { files: 5 } })

    if (!data.length) {
      return reply.code(400).send({ message: "No files provided" })
    }

    const { user } = request
    const { options } = request.query

    const jobIds: string[] = []
    const errors: string[] = []

    for (const file of data) {
      if (file.mimetype !== "text/html") {
        errors.push("Only HTML files are allowed")
        continue
      } //TODO: Implement this

      const html = (await file.toBuffer()).toString()
      if (!html) {
        errors.push("HTML content is required")
        continue
      }

      try {
        const job = await this.queueService.addPdfJob({
          type: "html",
          userId: user.id,
          payload: { html, options },
        })

        if (job?.id) jobIds.push(job.id)
        else errors.push("Job not created")
      } catch (error) {
        if (error instanceof Error) errors.push(`Error processing file: ${error.message}`)
        else errors.push("Error processing file")
      }
    }

    return reply.code(202).send({
      message: "Partial queueing",
      jobIds,
      errors,
    })
  }

  async generatePdfByUrlAsync(request: FastifyRequest<{ Body: GenerateAsyncPdfFromUrl }>, reply: FastifyReply) {
    const { urls, options } = request.body
    const { user } = request

    const jobIds: string[] = []
    const errors: string[] = []

    for (const { url } of urls) {
      try {
        const job = await this.queueService.addPdfJob({
          type: "url",
          userId: user.id,
          payload: { url, options },
        })

        if (job?.id) jobIds.push(job.id)
        else errors.push("Job not created")
      } catch (error) {
        if (error instanceof Error) errors.push(`Error processing URL: ${error.message}`)
        else errors.push("Error processing URL")
      }
    }

    return reply.code(202).send({ message: "Partial queueing", jobIds, errors })
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
