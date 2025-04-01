import { InvalidCredentialsError } from "@/errors/InvalidCredentialsError"
import { createToken } from "@/lib/utils/jwt.utils"
import { comparePassword } from "../lib/utils/crypto.utils"
import { UserService } from "./user.service"

export class AuthService {
  constructor(private readonly userService: UserService = new UserService()) {}

  async login(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email)
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
