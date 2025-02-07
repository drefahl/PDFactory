import { fastifyMultipart } from "@fastify/multipart"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import { fastify } from "fastify"
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod"
import { env } from "./config/env.config"
import { errorHandler } from "./config/errorHandler.config"
import { envToLogger } from "./config/logger.config"

export async function createServer() {
  const app = fastify({
    logger: envToLogger[env.NODE_ENV] ?? true,
  }).withTypeProvider<ZodTypeProvider>()

  // Compilers
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  // Plugins
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
  app.register(fastifyMultipart)

  // Error Handling
  app.setErrorHandler(errorHandler)

  return app
}
