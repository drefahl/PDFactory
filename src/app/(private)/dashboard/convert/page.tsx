"use client"

import { FormFileInput } from "@/components/form/form-file-input"
import { FormInput } from "@/components/form/form-input"
import { FormRadio } from "@/components/form/form-radio"
import { FormSubmitButton } from "@/components/form/form-submit-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { generatePdfByHTML, generatePdfByHTMLAsync, generatePdfByUrl, generatePdfByUrlAsync } from "@/lib/api"
import { handleError } from "@/lib/utils/error.util"
import { openBlob } from "@/lib/utils/file.util"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { PDFOptionsDialog } from "./_components/pdf-options-dialog"
import { type ConversionFormData, conversionSchema } from "./schema"

const MAX_ITEMS = 5

export default function Convert() {
  const [pdfOptions, setPdfOptions] = useState({})

  const router = useRouter()

  const form = useForm<ConversionFormData>({
    resolver: zodResolver(conversionSchema),
    defaultValues: {
      conversionType: "html",
      files: [{ file: null }],
      conversionMode: "sync",
    },
    mode: "onChange",
  })

  const {
    fields: urlFields,
    append: appendUrl,
    remove: removeUrl,
    replace: replaceUrls,
  } = useFieldArray({
    control: form.control,
    name: "urls",
  })

  const {
    fields: fileFields,
    append: appendFile,
    remove: removeFile,
    replace: replaceFiles,
  } = useFieldArray({
    control: form.control,
    name: "files",
  })

  const conversionType = form.watch("conversionType")
  const conversionMode = form.watch("conversionMode")

  useEffect(() => {
    if (conversionMode === "sync") {
      if (conversionType === "html") {
        replaceFiles([{ file: null }])
      } else {
        replaceUrls([{ url: "" }])
      }
    }
  }, [conversionMode, conversionType, replaceFiles, replaceUrls])

  const onSubmit = async (data: ConversionFormData) => {
    const { conversionType, conversionMode } = data

    if (conversionMode === "sync") {
      if (conversionType === "html") {
        const file = data.files[0].file
        if (!file) {
          console.error("No file selected")
          return
        }

        const formData = new FormData()
        formData.append("file", file)
        formData.append("name", file.name)

        const [err, blob] = await generatePdfByHTML({ options: pdfOptions }, { data: formData, responseType: "blob" })
        if (err || !blob) {
          handleError("Failed to convert HTML to PDF", err)
          return
        }

        return openBlob(blob)
      }

      if (conversionType === "url") {
        const urlToConvert = data.urls[0].url
        const [err, blob] = await generatePdfByUrl({ url: urlToConvert, options: pdfOptions }, { responseType: "blob" })

        if (err || !blob) {
          handleError("Failed to convert URL to PDF", err)
          return
        }

        return openBlob(blob)
      }
    }

    if (conversionType === "html") {
      const file = data.files[0].file
      if (!file) {
        console.error("No file selected")
        return
      }

      const formData = new FormData()
      formData.append("file", file)
      formData.append("options", JSON.stringify(pdfOptions))

      const [err] = await generatePdfByHTMLAsync({}, { data: formData, responseType: "blob" })
      if (err) {
        handleError("Failed to convert HTML to PDF", err)
        return
      }

      toast.success("Conversion started successfully")
      router.push("/dasboard/queue")
    } else if (conversionType === "url") {
      const [err] = await generatePdfByUrlAsync({ urls: data.urls, options: pdfOptions })
      if (err) {
        handleError("Failed to convert URL to PDF", err)
        return
      }

      router.push("/dasboard/queue")
      toast.success("Conversion started successfully")
    }
  }

  const addItem = () => {
    if (conversionType === "html") {
      appendFile({ file: null })
    } else {
      appendUrl({ url: "" })
    }
  }

  const isFormValid = form.formState.isValid
  const isSubmitting = form.formState.isSubmitting

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Convert to PDF</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormRadio
                name="conversionType"
                label="Conversion Type"
                options={[
                  { value: "html", label: "HTML" },
                  { value: "url", label: "URL" },
                ]}
              />

              <FormRadio
                name="conversionMode"
                label="Conversion Mode"
                options={[
                  { value: "sync", label: "Synchronous" },
                  { value: "async", label: "Asynchronous" },
                ]}
              />
            </div>

            <div className="space-y-4">
              {conversionType === "html"
                ? fileFields.map((field, index) => (
                    <div key={field.id} className="flex items-start space-x-2">
                      <div className="flex-grow">
                        <FormFileInput
                          name={`files.${index}.file`}
                          label={`HTML File ${index + 1}`}
                          accept=".html,.htm"
                        />
                      </div>

                      {conversionMode === "async" && fileFields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="mt-8"
                          onClick={() => removeFile(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))
                : urlFields.map((field, index) => (
                    <div key={field.id} className="flex items-start space-x-2">
                      <div className="flex-grow">
                        <FormInput
                          name={`urls.${index}.url`}
                          label={`URL ${index + 1}`}
                          type="url"
                          placeholder="https://example.com"
                        />
                      </div>

                      {conversionMode === "async" && urlFields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="mt-8"
                          onClick={() => removeUrl(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
            </div>

            {conversionMode === "async" && (
              <Button
                type="button"
                onClick={addItem}
                disabled={(conversionType === "html" ? fileFields.length : urlFields.length) >= MAX_ITEMS}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {conversionType === "html" ? "File" : "URL"}
              </Button>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-stretch gap-4 mt-8">
              <PDFOptionsDialog onOptionsChange={setPdfOptions} />
              <FormSubmitButton disabled={isSubmitting || !isFormValid} className="w-full sm:w-1/2">
                {isSubmitting ? "Converting..." : "Convert"}
              </FormSubmitButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
