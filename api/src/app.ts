import { fastifyCors } from "@fastify/cors"
import fastifyJwt from "@fastify/jwt"
import { fastifyMultipart } from "@fastify/multipart"
import { fastify } from "fastify"
import { type ZodTypeProvider, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"
import { env } from "./config/env.config"
import { errorHandler } from "./config/errorHandler.config"
import { envToLogger } from "./config/logger.config"
import { swaggerConfig } from "./config/swagger.config"
import { registerRoutes } from "./routes/index.routes"

export async function createServer() {
  const app = fastify({
    logger: envToLogger[env.NODE_ENV] ?? true,
  }).withTypeProvider<ZodTypeProvider>()

  // Compilers
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  // Plugins
  swaggerConfig(app)
  app.register(fastifyMultipart)
  app.register(fastifyJwt, { secret: env.JWT_SECRET, sign: { algorithm: "HS256" } })
  app.register(fastifyCors, { origin: "*" })

  // Error Handling
  app.setErrorHandler(errorHandler)

  // Routes
  registerRoutes(app)

  await app.ready()

  return app
}
