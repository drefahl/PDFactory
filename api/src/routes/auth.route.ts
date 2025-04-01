import { AuthController } from "@/controllers/auth.controller"
import { RequestBodyAuthSchema, ResponseBodyAuthSchema } from "@/schemas/auth.schema"
import { AuthService } from "@/services/auth.service"
import type { FastifyInstance } from "fastify"

export async function authRoutes(app: FastifyInstance) {
  const authService = new AuthService()
  const authController = new AuthController(authService)

  app.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        operationId: "login",
        body: RequestBodyAuthSchema,
        response: ResponseBodyAuthSchema,
      },
    },
    authController.login.bind(authController),
  )
}
