import fs from "node:fs"
import path from "node:path"
import { createServer } from "@/app"
import type { FastifyInstance } from "fastify"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

let app: FastifyInstance

describe("PDF URL Integration Tests", () => {
  beforeAll(async () => {
    app = await createServer()
  })

  afterAll(async () => {
    await app.close()
    const tempDir = path.join(process.cwd(), "tmp")
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir)
      for (const file of files) {
        fs.unlinkSync(path.join(tempDir, file))
      }
    }
  })

  it("should generate PDF from a valid URL", async () => {
    const response = await request(app.server)
      .post("/api/pdf/url")
      .send({ url: "https://www.google.com/", name: "example" })
      .set("Content-Type", "application/json")

    expect(response.status).toBe(200)
    expect(response.headers["content-type"]).toBe("application/pdf")

    const filePath = path.join(process.cwd(), "tmp", "example.pdf")

    expect(fs.existsSync(filePath)).toBe(true)
  })

  it("should return 400 when URL is missing", async () => {
    const response = await request(app.server)
      .post("/api/pdf/url")
      .send({ name: "example" })
      .set("Content-Type", "application/json")

    expect(response.status).toBe(400)
    expect(response.body.details.issues[0].message).toBe("URL is required")
  })

  it("should return 400 when URL is invalid", async () => {
    const response = await request(app.server)
      .post("/api/pdf/url")
      .send({ url: "invalid-url", name: "example" })
      .set("Content-Type", "application/json")

    expect(response.status).toBe(400)
    expect(response.body.details.issues[0].message).toContain("Invalid URL")
  })
})
