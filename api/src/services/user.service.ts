import { hashPassword } from "@/lib/utils/crypto.utils"
import { UserRepository } from "@/repositories/user.repository"
import { createUserSchema, updateUserSchema } from "@/schemas/user.schema"
import type { Prisma, User } from "@prisma/client"

export class UserService {
  constructor(private readonly userRepository: UserRepository = new UserRepository()) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const userData = createUserSchema.parse(data)

    const emailExists = await this.userRepository.getUserByEmail(userData.email)
    if (emailExists) {
      throw new Error("Email already exists")
    }

    const hashedPassword = await hashPassword(userData.password)
    userData.password = hashedPassword

    return this.userRepository.createUser(userData)
  }

  async getUserById(userId: string): Promise<Omit<User, "password"> | null> {
    return this.userRepository.getUserById(userId)
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.getUserByEmail(email)
  }

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    const userData = updateUserSchema.parse(data)

    if (userData.password) {
      userData.password = await hashPassword(userData.password.toString())
    }

    return this.userRepository.updateUser(userId, userData)
  }
}
