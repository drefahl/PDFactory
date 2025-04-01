"use client"

import { FormInput } from "@/components/form/form-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { login } from "@/lib/api"
import { setCookieToken } from "@/lib/utils/token.util"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type SignIn = z.infer<typeof signInSchema>

export default function SignIn() {
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async ({ email, password }: SignIn) => {
    const [err, response] = await login({ email, password })

    if (err) {
      toast.error(err.message)
      console.error(err)
      return
    }

    const { token } = response
    await setCookieToken(token)
    toast.success("Successfully signed in")

    router.push("/dashboard/convert")
  }

  return (
    <div className="flex-grow flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormInput name="email" label="Email" />
              <FormInput name="password" label="Password" type="password" />

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </Form>

          <p className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
