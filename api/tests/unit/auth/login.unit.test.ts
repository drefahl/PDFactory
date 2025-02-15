import { InvalidCredentialsError } from "@/errors/InvalidCredentialsError"
import { hashPassword } from "@/lib/utils/crypto.utils"
import { verifyToken } from "@/lib/utils/jwt.utils"
import { UserRepository } from "@/repositories/user.repository"
import { AuthService } from "@/services/auth.service"
import { beforeEach, describe, expect, it, vi } from "vitest"

let authService: AuthService
let userRepository: UserRepository

describe("Login", () => {
  beforeEach(() => {
    userRepository = new UserRepository()
    vi.spyOn(userRepository, "getUserByEmail").mockImplementation(async (email) => {
      if (email !== "teste@example.com") return null

      return {
        id: "user_123",
        name: "Test User",
        email: "teste@example.com",
        password: await hashPassword("admin"),
        createdAt: new Date(),
        updatedAt: new Date(),
        jobs: [],
      }
    })

    authService = new AuthService(userRepository)
  })

  it("should login with valid credentials and return a valid token", async () => {
    const token = await authService.login("teste@example.com", "admin")

    expect(token).toBeDefined()

    const decoded = await verifyToken(token)

    expect(decoded).toHaveProperty("id")
    expect(decoded).toHaveProperty("email")
  })

  it("should throw an error with invalid credentials", async () => {
    await expect(authService.login("admin", "invalid-password")).rejects.toThrow(InvalidCredentialsError)
  })
})
