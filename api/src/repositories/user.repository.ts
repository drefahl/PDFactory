import { prisma } from "@/lib/prisma"
import type { User } from "@prisma/client"

export class UserRepository {
  async createUser(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    return prisma.user.create({ data })
  }

  async getUserById(userId: string): Promise<Omit<User, "password"> | null> {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    })
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } })
  }

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({ where: { id: userId }, data })
  }
}
