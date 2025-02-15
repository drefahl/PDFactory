import { InvalidCredentialsError } from "@/errors/InvalidCredentialsError"
import { createToken } from "@/lib/utils/jwt.utils"
import { UserRepository } from "@/repositories/user.repository"
import { comparePassword } from "../lib/utils/crypto.utils"

export class AuthService {
  constructor(private readonly userRepository: UserRepository = new UserRepository()) {}

  async login(email: string, password: string) {
    const user = await this.userRepository.getUserByEmail(email)
    if (!user) {
      throw new InvalidCredentialsError("Invalid credentials")
    }

    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      throw new InvalidCredentialsError("Invalid credentials")
    }

    const token = await createToken({ id: user.id, email: user.email })

    return token
  }
}
