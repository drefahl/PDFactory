import { createServer } from "@/app"
import type { CreateJobInput, UpdateStatusJobInput } from "@/schemas/job.schema"
import type { FastifyInstance } from "fastify"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { getAuthToken } from "../utils/get-auth-token.util"

let app: FastifyInstance
let authToken: string
let userId: string
let createdJobId: string

describe("Job API Integration Tests", () => {
  beforeAll(async () => {
    app = await createServer()

    const data = await getAuthToken(app)
    authToken = data.token
    userId = data.userId
  })

  afterAll(async () => {
    await app.close()
  })

  it("should create a job with valid HTML data", async () => {
    const jobData: CreateJobInput = {
      user: { connect: { id: userId } },
      htmlContent: "<html><body><h1>Job Test</h1></body></html>",
    }

    const response = await request(app.server)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${authToken}`)
      .send(jobData)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id")
    expect(response.body.status).toBe("PENDING")

    createdJobId = response.body.id
  })

  it("should create a job with valid URL data", async () => {
    const jobData: CreateJobInput = {
      user: { connect: { id: userId } },
      url: "https://example.com",
    }

    const response = await request(app.server)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${authToken}`)
      .send(jobData)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id")
  })

  it("should get job by id", async () => {
    const response = await request(app.server)
      .get(`/api/jobs/${createdJobId}`)
      .set("Authorization", `Bearer ${authToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("id", createdJobId)
  })

  it("should list jobs", async () => {
    const response = await request(app.server).get("/api/jobs").set("Authorization", `Bearer ${authToken}`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThan(0)
  })

  it("should update job status", async () => {
    const data: UpdateStatusJobInput = { status: "COMPLETED" }

    const response = await request(app.server)
      .patch(`/api/jobs/${createdJobId}/status`)
      .set("Authorization", `Bearer ${authToken}`)
      .send(data)

    expect(response.status).toBe(200)
    expect(response.body.status).toEqual("COMPLETED")
  })

  it("should delete job", async () => {
    const response = await request(app.server)
      .delete(`/api/jobs/${createdJobId}`)
      .set("Authorization", `Bearer ${authToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("id", createdJobId)
  })
})
