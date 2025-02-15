import { env } from "./env.config"

export const redisConnection = {
  host: env.REDIS_HOST,
  port: Number(env.REDIS_PORT),
}
