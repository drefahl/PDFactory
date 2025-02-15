import { redisConnection } from "@/config/redis.config"
import { savePdf } from "@/lib/utils/file.utils"
import type { PdfService } from "@/services/pdf.service"
import { type Job, Queue, Worker } from "bullmq"

export class QueueService {
  public pdfQueue: Queue
  public pdfWorker: Worker | undefined

  constructor(private pdfService: PdfService) {
    this.pdfQueue = new Queue("pdfQueue", { connection: redisConnection })
  }

  public async startWorker() {
    this.pdfWorker = new Worker(
      "pdfQueue",
      async (job: Job) => {
        await this.pdfService.initialize()

        const { type, payload } = job.data as { type: "html" | "url"; payload: any }
        let pdfBuffer: Uint8Array

        if (type === "html") {
          pdfBuffer = await this.pdfService.generatePdfFromHtml(payload.html, payload.options)
        } else if (type === "url") {
          pdfBuffer = await this.pdfService.generatePdfFromUrl(payload.url, payload.options)
        } else {
          throw new Error("Tipo de job inválido")
        }

        const { fileName } = await savePdf(pdfBuffer, payload.userId, payload.name)

        return { fileName }
      },
      { connection: redisConnection, concurrency: 5 },
    )

    this.pdfWorker.on("completed", async () => {
      await this.pdfWorker?.close()
    })
  }

  public async addPdfJob(jobData: { type: "html" | "url"; payload: any }) {
    return await this.pdfQueue.add("pdfJob", jobData)
  }

  public async getQueueMetrics() {
    return {
      jobs: await this.pdfQueue.getJobCounts(),
      redisInfo: (await this.pdfQueue.client).info(),
    }
  }

  public async close() {
    const promises = [this.pdfQueue.close()]
    if (this.pdfWorker) promises.push(this.pdfWorker.close())
    await Promise.all(promises)
  }
}
