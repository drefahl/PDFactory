import type { UpdateUserInput } from "@/schemas/user.schema"
import type { UserService } from "@/services/user.service"
import type { FastifyReply, FastifyRequest } from "fastify"

export class UserController {
  constructor(private readonly userService: UserService) {}

  async createUser(request: FastifyRequest<{ Body: UpdateUserInput }>, reply: FastifyReply) {
    const user = await this.userService.createUser(request.body)

    return reply.code(201).send(user)
  }

  async getUserProfile(request: FastifyRequest, reply: FastifyReply) {
    const user = await this.userService.getUserById(request.user.id)
    if (!user) return reply.code(404).send({ message: "User not found" })

    return reply.send(user)
  }

  async updateUserProfile(request: FastifyRequest<{ Body: UpdateUserInput }>, reply: FastifyReply) {
    const user = await this.userService.updateUser(request.user.id, request.body)

    return reply.send(user)
  }
}
