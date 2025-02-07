import type { FastifyInstance } from "fastify"
import { pdfRoutes } from "./pdf.routes"

export async function registerRoutes(app: FastifyInstance) {
  app.register(
    async (fastifyInstance) => {
      fastifyInstance.register(pdfRoutes, { prefix: "/pdf" })

      fastifyInstance.get("/health", (request, reply) => {
        reply.send({
          status: "ok",
          time: new Date().toISOString(),
          uptime: process.uptime(),
        })
      })
    },
    { prefix: "/api" },
  )
}
