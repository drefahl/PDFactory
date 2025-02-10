import { createServer } from "@/app"
import type { FastifyInstance } from "fastify"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

let app: FastifyInstance

describe("Login API Integration Tests", () => {
  beforeAll(async () => {
    app = await createServer()
  })

  afterAll(async () => {
    await app.close()
  })

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials and return a valid token", async () => {
      const response = await request(app.server).post("/api/auth/login").send({ username: "admin", password: "admin" })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("token")
    })

    it("should throw an error with invalid credentials", async () => {
      const response = await request(app.server)
        .post("/api/auth/login")
        .send({ username: "admin", password: "invalid-password" })

      expect(response.status).toBe(401)
      expect(response.body.message).toBe("Invalid credentials")
    })
  })
})
