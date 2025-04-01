import { readFile } from "node:fs/promises"
import { ValidationError } from "@/errors/ValidationError"
import { getPdfPath, savePdf } from "@/lib/utils/file.utils"
import { isValidHtml } from "@/lib/utils/html.utils"
import { JobStatus } from "@prisma/client"
import { type Browser, type PDFOptions, launch } from "puppeteer"
import z from "zod"
import { JobService } from "./job.service"

export class PdfService {
  private browser: Browser | null = null

  private constructor(private readonly jobService: JobService) {}

  public static async create(jobService: JobService = new JobService()): Promise<PdfService> {
    const service = new PdfService(jobService)
    await service.initialize()

    return service
  }

  async initialize() {
    this.browser = await launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    })
  }

  async generatePdfFromHtml({ html, userId, options }: { html: string; userId: string; options?: PDFOptions }) {
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

      const { fileName } = await savePdf(pdf, userId)

      await this.jobService.createJob({
        user: { connect: { id: userId } },
        htmlContent: html,
        mode: "SYNC",
        status: JobStatus.COMPLETED,
        pdfPath: fileName,
      })

      return { pdf, fileName }
    } finally {
      await page.close()
    }
  }

  async generatePdfFromUrl({ url, userId, options }: { url: string; userId: string; options?: PDFOptions }) {
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

      const { fileName } = await savePdf(pdf, userId)

      await this.jobService.createJob({
        user: { connect: { id: userId } },
        url,
        mode: "SYNC",
        status: JobStatus.COMPLETED,
        pdfPath: fileName,
      })

      return { pdf, fileName }
    } finally {
      await page.close()
    }
  }

  async generatePdfFromHtmlAsync({
    html,
    userId,
    queueJobId,
    options,
  }: { html: string; userId: string; queueJobId: string; options?: PDFOptions }) {
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

      const { fileName } = await savePdf(pdf, userId)

      await this.jobService.createJob({
        user: { connect: { id: userId } },
        queueJobId,
        htmlContent: html,
        mode: "ASYNC",
        status: JobStatus.PENDING,
        pdfPath: fileName,
      })

      return { pdf, fileName }
    } finally {
      await page.close()
    }
  }

  async generatePdfFromUrlAsync({
    url,
    userId,
    queueJobId,
    options,
  }: { url: string; userId: string; queueJobId: string; options?: PDFOptions }) {
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

      const { fileName } = await savePdf(pdf, userId)

      await this.jobService.createJob({
        user: { connect: { id: userId } },
        url,
        queueJobId,
        mode: "ASYNC",
        status: JobStatus.PENDING,
        pdfPath: fileName,
      })

      return { pdf, fileName }
    } finally {
      await page.close()
    }
  }

  async getPdf(fileName: string, userId: string) {
    const filePath = await getPdfPath(userId, fileName)

    try {
      const pdf = await readFile(filePath)

      return pdf
    } catch (error) {
      return null
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close()
    }
  }

  async setBrowser(browser: Browser | null) {
    this.browser = browser
  }
}
