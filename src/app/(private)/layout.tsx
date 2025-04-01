import type React from "react"

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="flex flex-col flex-1 overflow-hidden justify-center items-center">{children}</div>
}
