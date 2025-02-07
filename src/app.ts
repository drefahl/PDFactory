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
import { errorHandler } from "./config/errorHandler.config"

export async function createServer() {
  const app = fastify({
    logger: true,
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
          url: "http://localhost:3000",
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
