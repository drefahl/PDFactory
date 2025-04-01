import type { FastifyInstance } from "fastify"
import { authRoutes } from "./auth.route"
import { userPublicRoutes } from "./user.route"

export async function publicRoutes(app: FastifyInstance) {
  app.register(authRoutes, { prefix: "/auth" })

  app.register(userPublicRoutes, { prefix: "/users" })

  app.get(
    "/health",
    {
      schema: {
        tags: ["Health"],
        operationId: "healthCheck",
        description: "Health check endpoint",
      },
    },
    (request, reply) => {
      reply.send({
        status: "ok",
        time: new Date().toISOString(),
        uptime: process.uptime(),
      })
    },
  )
}
