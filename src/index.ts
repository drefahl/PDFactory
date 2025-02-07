import { createServer } from "./app"
import { registerRoutes } from "./routes/index.routes"

const start = async () => {
  try {
    const app = await createServer()
    await registerRoutes(app)
    await app.ready()

    await app.listen({ port: 3000 })

    console.log(`Server running at ${app.server.address()}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()
