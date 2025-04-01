"use client"

import { deleteCookieToken } from "@/lib/utils/token.util"
import type { Session } from "@/types"
import { useRouter } from "next/navigation"
import { createContext, useContext } from "react"
import type { ReactNode } from "react"

interface SessionContextType {
  session: Session | null
  signOut: () => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider")
  }

  return context
}

interface SessionProviderProps {
  session: Session | null
  children: ReactNode
}

export const SessionProvider = ({ session, children }: SessionProviderProps) => {
  const router = useRouter()

  async function signOut() {
    await deleteCookieToken()
    router.push("/auth/login")
  }

  return <SessionContext.Provider value={{ session, signOut }}>{children}</SessionContext.Provider>
}
