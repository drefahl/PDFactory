import { InvalidCredentialsError } from "@/errors/InvalidCredentialsError"
import { verifyToken } from "@/lib/utils/jwt.utils"
import { createAuthServiceMock, mockConstants } from "tests/mocks"
import { beforeEach, describe, expect, it, vi } from "vitest"

const {
  user: { email, password },
} = mockConstants

const authService = createAuthServiceMock()

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should login with valid credentials and return a valid token", async () => {
    const token = await authService.login(email, password)

    expect(token).toBeDefined()

    const decoded = await verifyToken(token)

    expect(decoded).toHaveProperty("id")
    expect(decoded).toHaveProperty("email")
  })

  it("should throw an error with invalid credentials", async () => {
    await expect(authService.login(email, "invalid-password")).rejects.toThrow(InvalidCredentialsError)
  })
})
