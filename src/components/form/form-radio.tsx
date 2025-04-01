import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type * as React from "react"
import { useFormContext } from "react-hook-form"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"

interface FormRadioProps {
  name: string
  label: string
  options: { label: string; value: string }[]
  description?: string
}

export const FormRadio: React.FC<FormRadioProps> = ({ name, label, description, options, ...props }) => {
  const { control } = useFormContext()

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <FormControl>
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
              {options.map((option) => (
                <FormItem key={option.value} className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value={option.value} id={option.value} />
                  </FormControl>

                  <Label htmlFor={option.value}>{option.label}</Label>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
