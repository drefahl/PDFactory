import { verifyJwt } from "@/middlewares/auth.middleware"
import type { FastifyInstance } from "fastify"
import { jobRoutes } from "./job.routes"
import { pdfRoutes } from "./pdf.routes"
import { publicRoutes } from "./public.routes"
import { userRoutes } from "./user.route"

export function registerRoutes(app: FastifyInstance) {
  app.register(
    async (fastifyInstance) => {
      fastifyInstance.register(publicRoutes)
    },
    { prefix: "/api" },
  )

  app.register(
    async (fastifyInstance) => {
      fastifyInstance.addHook("onRequest", verifyJwt)

      fastifyInstance.register(jobRoutes, { prefix: "/jobs" })
      fastifyInstance.register(pdfRoutes, { prefix: "/pdf" })
      fastifyInstance.register(userRoutes, { prefix: "/users" })
    },
    { prefix: "/api" },
  )
}
