import { InvalidCredentialsError } from "@/errors/InvalidCredentialsError"
import { verifyToken } from "@/lib/utils/jwt.utils"
import { AuthService } from "@/services/auth.services"
import { beforeAll, describe, expect, it } from "vitest"

let authService: AuthService

describe("Login", () => {
  beforeAll(async () => {
    authService = new AuthService()
  })

  it("should login with valid credentials and return a valid token", async () => {
    const token = await authService.login("admin", "admin")

    expect(token).toBeDefined()

    const decoded = await verifyToken(token)

    expect(decoded).toHaveProperty("id")
    expect(decoded).toHaveProperty("username")
  })

  it("should throw an error with invalid credentials", async () => {
    await expect(authService.login("admin", "invalid-password")).rejects.toThrow(InvalidCredentialsError)
  })
})
