import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/utils/token.util"
import Link from "next/link"

export default async function Home() {
  const session = await getSession()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to <span className="text-blue-600">PDF Converter</span>
        </h1>
        <p className="mt-3 text-2xl">Convert HTML and URLs to PDF with ease</p>
        <div className="flex mt-6">
          <Link href={session ? "/dashboard/convert" : "/auth/signin"} passHref>
            <Button>Start Converting</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
