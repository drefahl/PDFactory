import { createServer } from "@/app"
import type { FastifyInstance } from "fastify"
import request from "supertest"
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest"

let app: FastifyInstance
let authToken: string
let createdUserId: string

describe("User Integration Tests", () => {
  beforeAll(async () => {
    app = await createServer()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    const uniqueEmail = `testuser+${Date.now()}@example.com`

    const registerRes = await request(app.server).post("/api/users").send({
      email: uniqueEmail,
      name: "Test User",
      password: "Test@123",
    })

    expect(registerRes.status).toBe(201)

    createdUserId = registerRes.body.id

    const loginRes = await request(app.server)
      .post("/api/auth/login")
      .send({ email: uniqueEmail, password: "Test@123" })

    expect(loginRes.status).toBe(200)
    expect(loginRes.body).toHaveProperty("token")

    authToken = loginRes.body.token
  })

  it("should register a new user", async () => {
    const uniqueEmail = `anotheruser+${Date.now()}@example.com`

    const res = await request(app.server).post("/api/users").send({
      email: uniqueEmail,
      name: "Another User",
      password: "Another@123",
    })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty("id")
  })

  it("should fail to register a user with an invalid email", async () => {
    const res = await request(app.server).post("/api/users").send({
      email: "invalid-email",
      name: "Invalid User",
      password: "pass",
    })

    expect(res.status).toBe(400)
    expect(res.body.message).toContain("Invalid request data")
  })

  it("should login the user", async () => {
    expect(authToken).toBeDefined()
  })

  it("should get the logged user profile", async () => {
    const res = await request(app.server).get("/api/users/me").set("Authorization", `Bearer ${authToken}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty("id", createdUserId)
  })

  it("should update the logged user profile", async () => {
    const newName = "Updated User"
    const res = await request(app.server)
      .patch("/api/users/me")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ name: newName })

    expect(res.status).toBe(200)
    expect(res.body.name).toEqual(newName)
  })
})
