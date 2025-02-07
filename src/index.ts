import { createServer } from "./app"
import { env } from "./config/env.config"

const start = async () => {
  try {
    const app = await createServer()

    await app.listen({ port: env.PORT, host: env.HOST })

    console.log(`Server running at ${app.server.address()}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()
