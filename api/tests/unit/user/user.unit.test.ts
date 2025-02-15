import { UserRepository } from "@/repositories/user.repository"
import type { CreateUserInput } from "@/schemas/user.schema"
import { UserService } from "@/services/user.service"
import { createId } from "@paralleldrive/cuid2"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { ZodError } from "zod"

let userService: UserService
let userRepository: UserRepository

const userId = createId()

describe("User Unit Tests", () => {
  beforeEach(() => {
    userRepository = new UserRepository()
    vi.spyOn(userRepository, "createUser").mockImplementation(async (data) => {
      return { ...data, id: userId, createdAt: new Date(), updatedAt: new Date(), jobs: [] }
    })

    vi.spyOn(userRepository, "getUserById").mockImplementation(async (id) => {
      if (id !== userId) return null

      return {
        id: "user_123",
        email: "test@example.com",
        name: "Test User",
        password: "hashedpassword",
        createdAt: new Date(),
        updatedAt: new Date(),
        jobs: [],
      }
    })

    vi.spyOn(userRepository, "getUserByEmail").mockImplementation(async (email) => {
      if (email !== "test@example.com") return null

      return {
        id: userId,
        email: "test@example.com",
        name: "Test User",
        password: "hashedpassword",
        createdAt: new Date(),
        updatedAt: new Date(),
        jobs: [],
      }
    })

    vi.spyOn(userRepository, "updateUser").mockImplementation(async (id, data) => {
      if (id !== userId) throw new Error("User not found")

      return {
        ...data,
        id: userId,
        email: "test@example.com",
        name: data.name || "Test User",
        password: data.password || "hashedpassword",
        createdAt: new Date(),
        updatedAt: new Date(),
        jobs: [],
      }
    })

    userService = new UserService(userRepository)
  })

  it("should create a user with valid data", async () => {
    const validUserData: CreateUserInput = {
      email: "another@example.com",
      name: "Test User",
      password: "password123",
    }

    const user = await userService.createUser(validUserData)

    expect(user).toHaveProperty("id")
    expect(user.email).toEqual(validUserData.email)
  })

  it("should throw validation error when email is invalid", async () => {
    const invalidUserData = {
      email: "invalid-email",
      name: "Test User",
      password: "password123",
    }

    await expect(userService.createUser(invalidUserData)).rejects.toThrow(ZodError)
  })

  it("should get user by id", async () => {
    const user = await userService.getUserById(userId)

    expect(user).toHaveProperty("id")
    expect(user?.email).toEqual("test@example.com")
  })

  it("should return null when user is not found", async () => {
    const user = await userService.getUserById("invalid_id")

    expect(user).toBeNull()
  })

  it("should update user with valid data", async () => {
    const updatedUserData = {
      email: "test@example.com",
      name: "Updated User",
    }

    const user = await userService.updateUser(userId, updatedUserData)

    expect(user).toHaveProperty("id")
    expect(user.name).toEqual(updatedUserData.name)
  })
})
