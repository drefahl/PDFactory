import { fastifySwagger } from "@fastify/swagger"
import { fastifySwaggerUi } from "@fastify/swagger-ui"
import type { FastifyInstance } from "fastify"
import { jsonSchemaTransform } from "fastify-type-provider-zod"
import { env } from "./env.config"

export function swaggerConfig(app: FastifyInstance) {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "API documentation",
        version: "1.0.0",
      },
      servers: [
        {
          url: `http${env.NODE_ENV === "production" ? "s" : ""}://${env.HOST}:${env.PORT}`,
        },
      ],
    },
    transform: jsonSchemaTransform,
  })

  app.register(fastifySwaggerUi, { routePrefix: "/api/docs" })
}
