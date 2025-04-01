import { comparePassword } from "@/lib/utils/crypto.utils"
import type { CreateUserInput } from "@/schemas/user.schema"
import { createUserServiceMock, mockConstants } from "tests/mocks"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { ZodError } from "zod"

const {
  user: { id: userId, email, password },
} = mockConstants

const userService = createUserServiceMock()

describe("User Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should create a user with valid data", async () => {
    const validUserData: CreateUserInput = {
      email: "another@example.com",
      name: "Test User",
      password,
    }

    const user = await userService.createUser(validUserData)

    expect(user).toHaveProperty("id")
    expect(user.email).toEqual(validUserData.email)
  })

  it("should throw validation error when email is invalid", async () => {
    const invalidUserData = {
      email: "invalid-email",
      name: "Test User",
      password,
    }

    await expect(userService.createUser(invalidUserData)).rejects.toThrow(ZodError)
  })

  it("should get user by id", async () => {
    const user = await userService.getUserById(userId)

    expect(user).toHaveProperty("id")
    expect(user?.email).toEqual(email)
  })

  it("should return null when user is not found", async () => {
    const user = await userService.getUserById("invalid_id")

    expect(user).toBeNull()
  })

  it("should update user with valid data", async () => {
    const updatedUserData = {
      email,
      name: "Updated User",
    }

    const user = await userService.updateUser(userId, updatedUserData)

    expect(user).toHaveProperty("id")
    expect(user.name).toEqual(updatedUserData.name)
  })

  it("should change user password when new password is provided", async () => {
    const updatedUserData = { email, password: "new-password" }

    const user = await userService.updateUser(userId, updatedUserData)

    expect(await comparePassword(updatedUserData.password, user.password)).toBe(true)
    expect(user).toHaveProperty("id")
  })

  it("should not change user password when password is not provided", async () => {
    const updatedUserData = {
      email,
      name: "Updated User",
    }

    const user = await userService.updateUser(userId, updatedUserData)

    expect(user).toHaveProperty("id")
    expect(user.password).not.toEqual(password)
  })
})
