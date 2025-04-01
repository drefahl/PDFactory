import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type * as React from "react"
import { useFormContext } from "react-hook-form"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  description?: string
}

export const FormInput: React.FC<FormInputProps> = ({ name, label, description, ...props }) => {
  const { control } = useFormContext()

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <FormControl>
            <Input {...field} {...props} />
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
