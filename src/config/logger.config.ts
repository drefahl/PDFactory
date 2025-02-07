import type { FastifyLoggerOptions, RawServerBase } from "fastify"
import type { PinoLoggerOptions } from "fastify/types/logger"
import type { env } from "./env.config"

export const envToLogger: Record<
  typeof env.NODE_ENV,
  boolean | (FastifyLoggerOptions<RawServerBase> & PinoLoggerOptions)
> = {
  development: {
    level: "info",
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: true,
  test: false,
}
