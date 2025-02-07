import type { FastifyError, FastifyReply, FastifyRequest } from "fastify"
import { hasZodFastifySchemaValidationErrors, isResponseSerializationError } from "fastify-type-provider-zod"

export function errorHandler(err: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  if (hasZodFastifySchemaValidationErrors(err)) {
    return reply.code(400).send({
      error: "Validation Error",
      message: "Invalid request data",
      statusCode: 400,
      details: {
        issues: err.validation,
        method: request.method,
        path: request.url,
      },
    })
  }

  if (isResponseSerializationError(err)) {
    return reply.code(500).send({
      error: "Serialization Error",
      message: "Invalid response format",
      statusCode: 500,
      details: {
        issues: err.cause.issues,
        method: request.method,
        path: request.url,
      },
    })
  }

  request.log.error(err)

  return reply.status(500).send({
    error: "Internal Server Error",
    message: "Something went wrong",
    statusCode: 500,
  })
}
