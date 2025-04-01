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

describe("PDF API Integration Tests", () => {
  beforeAll(async () => {
    app = await createServer()

    const data = await getAuthToken(app)
    authToken = data.token
    userId = data.userId
  })

  afterAll(async () => {
    await app.close()
    const projectRoot = process.cwd()
    const tempDir = path.join(projectRoot, "tmp", userId)

    try {
      fs.promises.rm(tempDir, { recursive: true, force: true })
    } catch (error) {
      console.error("Error removing tmp directory:", error)
    }
  })

  describe("POST /api/pdf/sync/html", () => {
    it("should generate PDF from valid HTML file when authenticated", async () => {
      const htmlContent = "<html><body><h1>Hello, PDF!</h1></body></html>"
      const htmlBuffer = Buffer.from(htmlContent, "utf-8")

      const response = await request(app.server)
        .post("/api/pdf/sync/html")
        .set("Authorization", `Bearer ${authToken}`)
        .attach("file", htmlBuffer, { filename: "test.html", contentType: "text/html" })

      expect(response.status).toBe(200)
      expect(response.headers["content-type"]).toBe("application/pdf")
      expect(response.headers["content-disposition"]).toContain("attachment")

      const fileName = response.headers["content-disposition"].split("filename=")[1]

      const projectRoot = process.cwd()
      const tempFilePath = path.join(projectRoot, "tmp", userId, fileName)

      expect(fs.existsSync(tempFilePath)).toBe(true)
    })

    it("should return 400 when file is missing", async () => {
      const response = await request(app.server).post("/api/pdf/sync/html").set("Authorization", `Bearer ${authToken}`)

      expect(response.status).toBe(500)
      expect(response.body.message).toContain("Something went wrong")
    })

    it("should return 400 when HTML content is empty", async () => {
      const response = await request(app.server)
        .post("/api/pdf/sync/html")
        .set("Authorization", `Bearer ${authToken}`)
        .attach("file", Buffer.from("", "utf-8"), { filename: "test.html", contentType: "text/html" })

      expect(response.status).toBe(400)
      expect(response.body.message).toBe("HTML content is required")
    })

    it("should return 400 when HTML content is invalid", async () => {
      const response = await request(app.server)
        .post("/api/pdf/sync/html")
        .set("Authorization", `Bearer ${authToken}`)
        .attach("file", Buffer.from("invalid-html", "utf-8"), { filename: "test.html", contentType: "text/html" })

      expect(response.status).toBe(400)
      expect(response.body.message).toBe("Invalid HTML content")
    })

    it("should return 400 when file mimetype is not text/html", async () => {
      const htmlContent = "<html><body><p>Test</p></body></html>"
      const response = await request(app.server)
        .post("/api/pdf/sync/html")
        .set("Authorization", `Bearer ${authToken}`)
        .attach("file", Buffer.from(htmlContent, "utf-8"), { filename: "test.txt", contentType: "text/plain" })

      expect(response.status).toBe(400)
      expect(response.body.message).toBe("Only HTML files are allowed")
    })

    it("should return 401 when not authenticated", async () => {
      const htmlContent = "<html><body><h1>Hello, PDF!</h1></body></html>"
      const htmlBuffer = Buffer.from(htmlContent, "utf-8")

      const response = await request(app.server)
        .post("/api/pdf/sync/html")
        .attach("file", htmlBuffer, { filename: "test.html", contentType: "text/html" })

      expect(response.status).toBe(401)
    })
  })
})
