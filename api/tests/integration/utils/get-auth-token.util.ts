import { randomUUID } from "node:crypto"
import { JobService } from "@/services/job.service"
import type { Prisma } from "@prisma/client"
import type { FastifyInstance } from "fastify"
import request from "supertest"

import { mockConstants } from "tests/mocks"
const {
  pdf: { htmlContent, url },
} = mockConstants

export async function getAuthToken(app: FastifyInstance) {
  const { id, email, password } = await registerUser(app)

  const loginRes = await request(app.server).post("/api/auth/login").send({
    email,
    password,
  })

  if (loginRes.status !== 200) throw new Error("Error logging in user")

  return { token: loginRes.body.token, userId: id }
}

export async function registerUser(app: FastifyInstance) {
  const email = `testuser${randomUUID()}@example.com`
  const password = "Test@123"

  const registerRes = await request(app.server).post("/api/users").send({
    email,
    password,
    name: "Test User",
  })

  if (registerRes.status !== 201) throw new Error("Error registering user")

  return { id: registerRes.body.id, email, password }
}

export async function createJob(jobData: Prisma.JobCreateInput) {
  const jobService = new JobService()

  return jobService.createJob(jobData)
}
