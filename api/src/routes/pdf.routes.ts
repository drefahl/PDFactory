import { PdfController } from "@/controllers/pdf.controller"
import { messageSchema } from "@/schemas/common.schema"
import {
  GenerateAsyncPdfFromUrlSchema,
  GenerateAsyncPdfResponseSchema,
  GeneratePdfFromUrlSchema,
  GetPdfSchema,
  QueryStringPdfFromHtmlSchema,
} from "@/schemas/pdf.schema"
import { PdfService } from "@/services/pdf.service"
import type { FastifyInstance } from "fastify"

export async function pdfRoutes(app: FastifyInstance) {
  const pdfService = await PdfService.create()
  const pdfController = new PdfController(pdfService)

  app.post(
    "/sync/html",
    {
      schema: {
        tags: ["PDF"],
        operationId: "generatePdfByHTML",
        description: "Generate PDF from HTML",
        consumes: ["multipart/form-data"],
        querystring: QueryStringPdfFromHtmlSchema,
      },
    },
    pdfController.generatePdfByHTML.bind(pdfController),
  )

  app.post(
    "/sync/url",
    {
      schema: {
        tags: ["PDF"],
        operationId: "generatePdfByUrl",
        description: "Generate PDF from URL",
        consumes: ["application/json"],
        body: GeneratePdfFromUrlSchema,
      },
    },
    pdfController.generatePdfByUrl.bind(pdfController),
  )

  app.get(
    "/:fileName",
    {
      schema: {
        tags: ["PDF"],
        operationId: "getPdf",
        description: "Get PDF by file name",
        params: GetPdfSchema,
      },
    },
    pdfController.getPdf.bind(pdfController),
  )

  app.post(
    "/async/html",
    {
      schema: {
        tags: ["PDF"],
        operationId: "generatePdfByHTMLAsync",
        description: "Generate PDF from HTML asynchronously",
        consumes: ["multipart/form-data"],
        querystring: QueryStringPdfFromHtmlSchema,
        response: {
          202: GenerateAsyncPdfResponseSchema,
          400: messageSchema,
          500: messageSchema,
        },
      },
    },
    pdfController.generatePdfByHTMLAsync.bind(pdfController),
  )

  app.post(
    "/async/url",
    {
      schema: {
        tags: ["PDF"],
        operationId: "generatePdfByUrlAsync",
        description: "Generate PDF from URL asynchronously",
        consumes: ["application/json"],
        body: GenerateAsyncPdfFromUrlSchema,
        response: {
          202: GenerateAsyncPdfResponseSchema,
          500: messageSchema,
        },
      },
    },
    pdfController.generatePdfByUrlAsync.bind(pdfController),
  )

  app.get(
    "/queue-status",
    {
      schema: {
        tags: ["PDF"],
        operationId: "getQueueStatus",
        description: "Get queue status",
      },
    },
    pdfController.getWorkerStatus.bind(pdfController),
  )
}
