import { type NextRequest, NextResponse } from "next/server"
import { isTokenValid } from "./lib/utils/token.util"

const PUBLIC_ROUTES = [
  { pathname: "/auth/signin", whenAuthenticated: "redirect" },
  { pathname: "/auth/signup", whenAuthenticated: "redirect" },
  { pathname: "/", whenAuthenticated: "next" },
  { pathname: "/pricing", whenAuthenticated: "next" },
] as const

const REDIRECT_WHEN_NOT_AUTHENTICATED = "/auth/signin"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const publicRoute = PUBLIC_ROUTES.find((route) => route.pathname === pathname)
  const authToken = request.cookies.get("authToken")?.value

  if (!authToken && publicRoute) {
    return NextResponse.next()
  }

  if (!authToken && !publicRoute) {
    return NextResponse.redirect(new URL(REDIRECT_WHEN_NOT_AUTHENTICATED, request.url))
  }

  if (authToken && publicRoute && publicRoute.whenAuthenticated === "redirect") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (authToken && !publicRoute) {
    if (!(await isTokenValid(authToken))) {
      return NextResponse.redirect(new URL(REDIRECT_WHEN_NOT_AUTHENTICATED, request.url))
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
