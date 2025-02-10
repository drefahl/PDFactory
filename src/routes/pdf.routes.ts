import { PdfController } from "@/controllers/pdf.controller"
import { GeneratePdfFromUrlSchema, QueryStringPdfFromHtmlSchema } from "@/schemas/pdf.schema"
import { PdfService } from "@/services/pdf.services"
import type { FastifyInstance } from "fastify"

export async function pdfRoutes(app: FastifyInstance) {
  const pdfService = new PdfService()
  const pdfController = new PdfController(pdfService)

  await pdfService.initialize()

  app.post(
    "/html",
    {
      schema: {
        consumes: ["multipart/form-data"],
        querystring: QueryStringPdfFromHtmlSchema,
      },
    },
    pdfController.generatePdfByHTML.bind(pdfController),
  )

  app.post(
    "/url",
    {
      schema: {
        consumes: ["application/json"],
        body: GeneratePdfFromUrlSchema,
      },
    },
    pdfController.generatePdfByUrl.bind(pdfController),
  )

  app.addHook("onClose", async () => {
    await pdfService.close()
  })
}
