import { readFile } from "node:fs/promises"
import { ValidationError } from "@/errors/ValidationError"
import { getPdfPath } from "@/lib/utils/file.utils"
import { isValidHtml } from "@/lib/utils/html.utils"
import { type Browser, type PDFOptions, launch } from "puppeteer"
import z from "zod"

export class PdfService {
  private browser: Browser | null = null

  async initialize() {
    this.browser = await launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })
  }

  async generatePdfFromHtml(html: string, options?: PDFOptions) {
    if (!this.browser) throw new Error("Browser not initialized")

    const htmlSchema = z.string()
    htmlSchema.parse(html)

    if (!isValidHtml(html)) {
      throw new ValidationError("Invalid HTML content")
    }

    const page = await this.browser.newPage()
    try {
      await page.setContent(html, { waitUntil: "networkidle0" })

      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        ...options,
      })

      return pdf
    } finally {
      await page.close()
    }
  }

  async generatePdfFromUrl(url: string, options?: PDFOptions) {
    if (!this.browser) throw new Error("Browser not initialized")

    const urlSchema = z.string().url({ message: "Invalid URL" })
    urlSchema.parse(url)

    const page = await this.browser.newPage()
    try {
      await page.goto(url, { waitUntil: "networkidle0" })

      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        ...options,
      })

      return pdf
    } finally {
      await page.close()
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close()
    }
  }

  async getPdf(fileName: string, userId: number) {
    const filePath = await getPdfPath(userId, fileName)

    try {
      const pdf = await readFile(filePath)

      return pdf
    } catch (error) {
      return null
    }
  }
}
