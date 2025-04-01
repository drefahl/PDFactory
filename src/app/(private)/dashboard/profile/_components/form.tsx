"use client"

import { FormInput } from "@/components/form/form-input"
import { FormSubmitButton } from "@/components/form/form-submit-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { updateUserProfile } from "@/lib/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

interface ProfileFormProps {
  profile: ProfileFormData
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile,
  })

  const onSubmit = async (data: ProfileFormData) => {
    const [err, profile] = await updateUserProfile(data)
    if (err) {
      toast.error(err.message)
      return
    }

    //TDOO: Refresh token?
    toast.success("Profile updated successfully")
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormInput name="name" label="Name" />
            <FormInput name="email" label="Email" />
            <FormInput
              name="password"
              label="New Password"
              type="password"
              placeholder="Leave blank to keep current password"
            />

            <FormSubmitButton type="submit" className="w-full">
              Update Profile
            </FormSubmitButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

const profileSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string().min(6).max(255).optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>
