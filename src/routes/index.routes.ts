import { verifyJwt } from "@/middlewares/auth.middleware"
import type { FastifyInstance } from "fastify"
import { authRoutes } from "./auth.route"
import { pdfRoutes } from "./pdf.routes"

export function registerRoutes(app: FastifyInstance) {
  app.register(
    async (fastifyInstance) => {
      fastifyInstance.register(authRoutes, { prefix: "/auth" })

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

  app.register(
    async (fastifyInstance) => {
      fastifyInstance.addHook("onRequest", verifyJwt)

      fastifyInstance.register(pdfRoutes, { prefix: "/pdf" })
    },
    { prefix: "/api" },
  )
}
