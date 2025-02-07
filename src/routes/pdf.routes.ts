import { PdfController } from "@/controllers/pdf.controller"
import { GeneratePdfFromUrlSchema } from "@/schemas/pdf.schema"
import { PdfService } from "@/services/pdf.services"
import type { FastifyInstance } from "fastify"
import { z } from "zod"

export async function pdfRoutes(app: FastifyInstance) {
  const pdfService = new PdfService()
  const pdfController = new PdfController(pdfService)

  await pdfService.initialize()

  app.post(
    "/html",
    {
      schema: {
        consumes: ["multipart/form-data"],
        querystring: z.object({ options: z.any().optional() }),
      },
    },
    pdfController.generatePdfByHTML,
  )

  app.post(
    "/url",
    {
      schema: {
        consumes: ["application/json"],
        body: GeneratePdfFromUrlSchema,
      },
    },
    pdfController.generatePdfByUrl,
  )

  app.addHook("onClose", async () => {
    await pdfService.close()
  })
}
