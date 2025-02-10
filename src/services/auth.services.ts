import { InvalidCredentialsError } from "@/errors/InvalidCredentialsError"
import { createToken } from "@/lib/utils/jwt.utils"

export class AuthService {
  async login(username: string, password: string) {
    const user = mockUsers.find((user) => user.username === username && user.password === password)

    if (!user) {
      throw new InvalidCredentialsError("Invalid credentials")
    }

    const token = await createToken({ id: user.id, username: user.username })

    return token
  }
}

const mockUsers = [
  {
    id: 1,
    username: "admin",
    password: "admin",
  },
  {
    id: 2,
    username: "user",
    password: "user",
  },
] as const
