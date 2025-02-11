import fs from "node:fs/promises"
import path from "node:path"
import { createServer } from "@/app"
import { decodeToken } from "@/lib/utils/jwt.utils"
import type { FastifyInstance } from "fastify"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

let app: FastifyInstance
let authToken: string
let session: { id: number }
let tmpDir: string
const testFileName = "test-custom.pdf"
let testFilePath: string

describe("PDF API Integration Tests", () => {
  beforeAll(async () => {
    app = await createServer()

    const loginResponse = await request(app.server)
      .post("/api/auth/login")
      .send({ username: "admin", password: "admin" })

    authToken = loginResponse.body.token
    session = decodeToken(authToken)

    tmpDir = path.join(process.cwd(), "tmp")
    testFilePath = path.join(tmpDir, session.id.toString(), testFileName)

    await fs.mkdir(tmpDir, { recursive: true })
    await fs.writeFile(testFilePath, "Fake PDF content")
  })

  afterAll(async () => {
    await app.close()
    try {
      await fs.unlink(testFilePath)
    } catch (error) {}
  })

  it("should download the PDF file if it exists", async () => {
    const response = await request(app.server)
      .get(`/api/pdf/${testFileName}`)
      .set("Authorization", `Bearer ${authToken}`)

    expect(response.status).toBe(200)
    expect(response.headers["content-type"]).toBe("application/pdf")
    expect(response.headers["content-disposition"]).toContain(`filename=${testFileName}`)

    expect(response.body).toBeInstanceOf(Buffer)
    expect(response.body.length).toBeGreaterThan(0)
  })

  it("should return 404 when the PDF file is not found", async () => {
    const response = await request(app.server)
      .get("/api/pdf/nonexistent.pdf")
      .set("Authorization", `Bearer ${authToken}`)

    expect(response.status).toBe(404)
    expect(response.body.message).toBe("PDF not found")
  })
})
