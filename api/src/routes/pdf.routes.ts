import { PdfController } from "@/controllers/pdf.controller"
import {
  GenerateAsyncPdfFromUrlSchema,
  GeneratePdfFromUrlSchema,
  GetPdfSchema,
  QueryStringPdfFromHtmlSchema,
} from "@/schemas/pdf.schema"
import { PdfService } from "@/services/pdf.service"
import type { FastifyInstance } from "fastify"

export async function pdfRoutes(app: FastifyInstance) {
  const pdfService = new PdfService()
  const pdfController = new PdfController(pdfService)

  app.post(
    "/sync/html",
    {
      schema: {
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
        params: GetPdfSchema,
      },
    },
    pdfController.getPdf.bind(pdfController),
  )

  app.post(
    "/async/html",
    {
      schema: {
        consumes: ["multipart/form-data"],
        querystring: QueryStringPdfFromHtmlSchema,
      },
    },
    pdfController.generatePdfByHTMLAsync.bind(pdfController),
  )

  app.post(
    "/async/url",
    {
      schema: {
        consumes: ["application/json"],
        body: GenerateAsyncPdfFromUrlSchema,
      },
    },
    pdfController.generatePdfByUrlAsync.bind(pdfController),
  )

  app.get(
    "/queue-status",
    {
      schema: {},
    },
    pdfController.getWorkerStatus.bind(pdfController),
  )
}
