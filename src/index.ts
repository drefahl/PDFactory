import { createServer } from "./app"
import { env } from "./config/env.config"
import { registerRoutes } from "./routes/index.routes"

const start = async () => {
  try {
    const app = await createServer()
    await registerRoutes(app)
    await app.ready()

    await app.listen({ port: env.PORT, host: env.HOST })

    console.log(`Server running at ${app.server.address()}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()
