import { getUserProfile } from "@/lib/api"
import { ProfileForm } from "./_components/form"

export default async function Profile() {
  const [err, profile] = await getUserProfile()
  if (err) {
    return <div>{err.message}</div>
  }

  return <ProfileForm profile={profile} />
}
