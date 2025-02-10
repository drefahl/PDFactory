import { InvalidCredentialsError } from "@/errors/InvalidCredentialsError"
import type { RequestBodyAuth } from "@/schemas/auth.schema"
import type { AuthService } from "@/services/auth.services"
import type { FastifyReply, FastifyRequest } from "fastify"

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(req: FastifyRequest<{ Body: RequestBodyAuth }>, reply: FastifyReply) {
    try {
      const { username, password } = req.body

      const token = await this.authService.login(username, password)

      reply.send({ token })
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        reply.code(401).send({ message: error.message })
        return
      }

      reply.code(500).send({ message: "Internal Server Error" })
    }
  }
}
