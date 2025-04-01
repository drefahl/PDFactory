"use client"

import { FormInput } from "@/components/form/form-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { createUser } from "@/lib/api/client"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
})

type CreateUserInput = z.infer<typeof createUserSchema>

export default function SignUp() {
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(createUserSchema),
  })

  const onSubmit = async ({ email, name, password }: CreateUserInput) => {
    const [err] = await createUser({ name, email, password })

    if (err) {
      toast.error(err.message)
      console.error(err)
      return
    }

    toast.success("Successfully signed up")
    router.push("/auth/signin")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormInput name="name" label="Name" />
              <FormInput name="email" label="Email" />
              <FormInput name="password" label="Password" type="password" />

              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
          </Form>

          <p className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
