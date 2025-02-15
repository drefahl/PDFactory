import { writeFileSync } from "node:fs"
import { createServer } from "../src/app"

async function generateSwagger() {
  const app = await createServer()

  const swagger = app.swagger()

  writeFileSync("swagger.json", JSON.stringify(swagger, null, 2))

  console.log("Swagger documentation has been generated!")
  process.exit(0)
}

generateSwagger().catch((err) => {
  console.error("Error generating Swagger documentation:", err)
  process.exit(1)
})
