import { Loader2 } from "lucide-react"
import type * as React from "react"
import { useFormContext } from "react-hook-form"
import { Button } from "../ui/button"

interface FormSubmitButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode
}

export const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({ children, ...props }) => {
  const {
    formState: { isSubmitting },
  } = useFormContext()

  return (
    <Button type="submit" disabled={isSubmitting} className="w-full" {...props}>
      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : children}
    </Button>
  )
}
