import fs from "node:fs"
import path from "node:path"
import { createServer } from "@/app"
import type { FastifyInstance } from "fastify"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { getAuthToken } from "../utils/get-auth-token.util"

let app: FastifyInstance
let authToken: string
let userId: string

describe("PDF URL Integration Tests", () => {
  beforeAll(async () => {
    app = await createServer()

    const data = await getAuthToken(app)
    authToken = data.token
    userId = data.userId
  })

  afterAll(async () => {
    await app.close()
    const tempDir = path.join(process.cwd(), "tmp", userId)

    try {
      fs.promises.rm(tempDir, { recursive: true, force: true })
    } catch (error) {
      console.error("Error removing tmp directory:", error)
    }
  })

  it("should generate PDF from a valid URL", { timeout: 10000 }, async () => {
    const response = await request(app.server)
      .post("/api/pdf/sync/url")
      .set("Authorization", `Bearer ${authToken}`)
      .set("Content-Type", "application/json")
      .send({ url: "https://www.google.com/" })

    expect(response.status).toBe(200)
    expect(response.headers["content-type"]).toBe("application/pdf")
    expect(response.headers["content-disposition"]).toContain("attachment")

    const fileName = response.headers["content-disposition"].split("filename=")[1]

    const filePath = path.join(process.cwd(), "tmp", userId, fileName)

    expect(fs.existsSync(filePath)).toBe(true)
  })

  it("should return 400 when URL is missing", async () => {
    const response = await request(app.server)
      .post("/api/pdf/sync/url")
      .set("Authorization", `Bearer ${authToken}`)
      .set("Content-Type", "application/json")
      .send({})

    expect(response.status).toBe(400)
    expect(response.body.details.issues[0].message).toBe("URL is required")
  })

  it("should return 400 when URL is invalid", async () => {
    const response = await request(app.server)
      .post("/api/pdf/sync/url")
      .set("Authorization", `Bearer ${authToken}`)
      .set("Content-Type", "application/json")
      .send({ url: "invalid-url" })

    expect(response.status).toBe(400)
    expect(response.body.details.issues[0].message).toContain("Invalid URL")
  })

  it("should return 401 when not authenticated", async () => {
    const response = await request(app.server)
      .post("/api/pdf/sync/url")
      .set("Content-Type", "application/json")
      .send({ url: "https://www.google.com/" })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe("Unauthorized")
  })
})
