import fs from "node:fs"
import path from "node:path"
import { createServer } from "@/app"
import type { FastifyInstance } from "fastify"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

let app: FastifyInstance
let authToken: string

describe("PDF API Integration Tests", () => {
  beforeAll(async () => {
    app = await createServer()

    const loginResponse = await request(app.server)
      .post("/api/auth/login")
      .send({ username: "admin", password: "admin" })

    authToken = loginResponse.body.token
  })

  afterAll(async () => {
    await app.close()
    const projectRoot = process.cwd()
    const tempDir = path.join(projectRoot, "tmp")
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir)
      for (const file of files) {
        fs.unlinkSync(path.join(tempDir, file))
      }
    }
  })

  describe("POST /api/pdf/html", () => {
    it("should generate PDF from valid HTML file when authenticated", async () => {
      const customName = "test-custom"
      const htmlContent = "<html><body><h1>Hello, PDF!</h1></body></html>"
      const htmlBuffer = Buffer.from(htmlContent, "utf-8")

      const response = await request(app.server)
        .post("/api/pdf/html")
        .set("Authorization", `Bearer ${authToken}`)
        .query({ name: customName })
        .attach("file", htmlBuffer, { filename: "test.html", contentType: "text/html" })

      expect(response.status).toBe(200)
      expect(response.headers["content-type"]).toBe("application/pdf")

      const projectRoot = process.cwd()
      const tempFilePath = path.join(projectRoot, "tmp", `${customName}.pdf`)

      expect(fs.existsSync(tempFilePath)).toBe(true)
    })

    it("should return 400 when file is missing", async () => {
      const response = await request(app.server).post("/api/pdf/html").set("Authorization", `Bearer ${authToken}`)
      expect(response.status).toBe(500)
      expect(response.body.message).toContain("multipart")
    })

    it("should return 400 when HTML content is empty", async () => {
      const response = await request(app.server)
        .post("/api/pdf/html")
        .set("Authorization", `Bearer ${authToken}`)
        .attach("file", Buffer.from("", "utf-8"), { filename: "test.html", contentType: "text/html" })

      expect(response.status).toBe(400)
      expect(response.body.message).toBe("HTML content is required")
    })

    it("should return 400 when HTML content is invalid", async () => {
      const response = await request(app.server)
        .post("/api/pdf/html")
        .set("Authorization", `Bearer ${authToken}`)
        .attach("file", Buffer.from("invalid-html", "utf-8"), { filename: "test.html", contentType: "text/html" })

      expect(response.status).toBe(400)
      expect(response.body.message).toBe("Invalid HTML content")
    })

    it("should return 400 when file mimetype is not text/html", async () => {
      const htmlContent = "<html><body><p>Test</p></body></html>"
      const response = await request(app.server)
        .post("/api/pdf/html")
        .set("Authorization", `Bearer ${authToken}`)
        .attach("file", Buffer.from(htmlContent, "utf-8"), { filename: "test.txt", contentType: "text/plain" })

      expect(response.status).toBe(400)
      expect(response.body.message).toBe("Only HTML files are allowed")
    })

    it("should return 401 when not authenticated", async () => {
      const customName = "test-no-auth"
      const htmlContent = "<html><body><h1>Hello, PDF!</h1></body></html>"
      const htmlBuffer = Buffer.from(htmlContent, "utf-8")

      const response = await request(app.server)
        .post("/api/pdf/html")
        .query({ name: customName })
        .attach("file", htmlBuffer, { filename: "test.html", contentType: "text/html" })

      expect(response.status).toBe(401)
    })
  })
})
