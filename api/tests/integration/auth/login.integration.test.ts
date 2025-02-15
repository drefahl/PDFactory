import { createServer } from "@/app"
import type { FastifyInstance } from "fastify"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { registerUser } from "../utils/get-auth-token.util"

let app: FastifyInstance
let email: string
let password: string

describe("Login API Integration Tests", () => {
  beforeAll(async () => {
    app = await createServer()

    const data = await registerUser(app)
    email = data.email
    password = data.password
  })

  afterAll(async () => {
    await app.close()
  })

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials and return a valid token", async () => {
      const response = await request(app.server).post("/api/auth/login").send({ email, password })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("token")
    })

    it("should throw an error with invalid credentials", async () => {
      const response = await request(app.server).post("/api/auth/login").send({ email, password: "invalid-password" })

      expect(response.status).toBe(401)
      expect(response.body.message).toBe("Invalid credentials")
    })
  })
})
