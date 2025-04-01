"use client"

import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import Link from "next/link"
import { useSession } from "./session-provider"
import { ModeToggle } from "./theme-toggle"

export function Header() {
  const { session, signOut } = useSession()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          PDF Converter
        </Link>

        <nav className="flex items-center space-x-4">
          <Link href={session ? "/dashboard/convert" : "/auth/signin"}>
            <Button variant="ghost" size="sm">
              Convert
            </Button>
          </Link>

          <Link href={session ? "/dashboard/queue" : "/auth/signin"}>
            <Button variant="ghost" size="sm">
              Queue
            </Button>
          </Link>

          <ModeToggle />

          {session ? (
            <>
              <span className="text-sm">{session.name}</span>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                Sign out
              </Button>
            </>
          ) : (
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">
                <User className="mr-2 h-4 w-4" />
                Sign in
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
