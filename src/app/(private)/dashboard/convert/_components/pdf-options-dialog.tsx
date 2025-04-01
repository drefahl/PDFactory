"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { z } from "zod"

const PageMarginSchema = z
  .object({
    top: z.string().optional(),
    right: z.string().optional(),
    bottom: z.string().optional(),
    left: z.string().optional(),
  })
  .optional()

const PDFOptionsSchema = z
  .object({
    scale: z.number().min(0.1).max(2).optional(),
    displayHeaderFooter: z.boolean().optional(),
    printBackground: z.boolean().optional(),
    landscape: z.boolean().optional(),
    pageRanges: z.string().optional(),
    format: z.enum(["Letter", "Legal", "Tabloid", "Ledger", "A0", "A1", "A2", "A3", "A4", "A5", "A6"]).optional(),
    width: z
      .string()
      .regex(/^\d+(\.\d+)?(mm|cm|in|px)$/)
      .optional(),
    height: z
      .string()
      .regex(/^\d+(\.\d+)?(mm|cm|in|px)$/)
      .optional(),
    margin: PageMarginSchema,
    preferCSSPageSize: z.boolean().optional(),
    omitBackground: z.boolean().optional(),
  })
  .strict()

type PDFOptions = z.infer<typeof PDFOptionsSchema>

interface PDFOptionsDialogProps {
  onOptionsChange: (options: PDFOptions) => void
}

export function PDFOptionsDialog({ onOptionsChange }: PDFOptionsDialogProps) {
  const [options, setOptions] = useState<PDFOptions>({
    scale: 1,
    displayHeaderFooter: false,
    printBackground: true,
    landscape: false,
    format: "A4",
    margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
    preferCSSPageSize: false,
    omitBackground: false,
  })

  const handleOptionChange = (key: keyof PDFOptions, value: any) => {
    const newOptions = { ...options, [key]: value }
    setOptions(newOptions)
    onOptionsChange(newOptions)
  }

  const handleMarginChange = (side: keyof typeof options.margin, value: string) => {
    const newMargin = { ...options.margin, [side]: value }
    handleOptionChange("margin", newMargin)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">PDF Options</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>PDF Generation Options</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="scale" className="text-right">
              Scale
            </Label>
            <Input
              id="scale"
              type="number"
              min="0.1"
              max="2"
              step="0.1"
              value={options.scale}
              onChange={(e) => handleOptionChange("scale", Number.parseFloat(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="format" className="text-right">
              Format
            </Label>
            <Select value={options.format} onValueChange={(value) => handleOptionChange("format", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {["Letter", "Legal", "Tabloid", "Ledger", "A0", "A1", "A2", "A3", "A4", "A5", "A6"].map((format) => (
                  <SelectItem key={format} value={format}>
                    {format}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="landscape" className="text-right">
              Landscape
            </Label>
            <Switch
              id="landscape"
              checked={options.landscape}
              onCheckedChange={(checked) => handleOptionChange("landscape", checked)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="printBackground" className="text-right">
              Print Background
            </Label>
            <Switch
              id="printBackground"
              checked={options.printBackground}
              onCheckedChange={(checked) => handleOptionChange("printBackground", checked)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Margins</Label>
            <div className="col-span-3 grid grid-cols-2 gap-2">
              {["top", "right", "bottom", "left"].map((side) => (
                <Input
                  key={side}
                  placeholder={side}
                  value={options.margin?.[side as keyof typeof options.margin] || ""}
                  onChange={(e) => handleMarginChange(side as keyof typeof options.margin, e.target.value)}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
