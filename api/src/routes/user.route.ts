import { UserController } from "@/controllers/user.controller"
import { createUserSchema, updateUserSchema } from "@/schemas/user.schema"
import { UserService } from "@/services/user.service"
import type { FastifyInstance } from "fastify"

const userService = new UserService()
const userController = new UserController(userService)

export async function userRoutes(app: FastifyInstance) {
  app.get("/me", {}, userController.getUserProfile.bind(userController))

  app.patch(
    "/me",
    {
      schema: {
        body: updateUserSchema,
      },
    },
    userController.updateUserProfile.bind(userController),
  )
}

export async function userPublicRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      schema: {
        body: createUserSchema,
      },
    },
    userController.createUser.bind(userController),
  )
}
