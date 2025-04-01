import { toast } from "sonner"

export const handleError = (msg: string, err: unknown) => {
  toast.error(msg)
  console.error(err)
}
