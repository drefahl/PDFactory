import { env } from "@/config/env.config"
import { SignJWT, decodeJwt, jwtVerify } from "jose"

const secret = new TextEncoder().encode(env.JWT_SECRET)

type TokenPayload = { id: string; email: string }

export async function createToken(payload: TokenPayload) {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(env.NODE_ENV === "development" ? "1h" : "1d")
    .sign(secret)

  return jwt
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret)

  return payload as TokenPayload
}

export function decodeToken(token: string) {
  return decodeJwt(token) as TokenPayload
}
