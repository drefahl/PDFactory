import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type * as React from "react"
import { useFormContext } from "react-hook-form"

interface FormFileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  description?: string
}

export const FormFileInput: React.FC<FormFileInputProps> = ({ name, label, description, ...props }) => {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange, ...fieldProps } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <FormControl>
            <Input
              accept="image/*, application/pdf"
              {...fieldProps}
              {...props}
              onChange={(event) => onChange(event.target.files?.[0])}
              type="file"
            />
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
