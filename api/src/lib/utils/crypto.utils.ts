import bcrypt from "bcrypt"

export async function hashPassword(password: string | Buffer, rounds: string | number = 10): Promise<string> {
  return bcrypt.hash(password, rounds)
}

export async function comparePassword(password: string | Buffer, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
