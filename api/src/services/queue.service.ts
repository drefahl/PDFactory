import { redisConnection } from "@/config/redis.config"
import { savePdf } from "@/lib/utils/file.utils"
import { type AddPdfJobInput, addPdfJobSchema } from "@/schemas/queue.schema"
import type { PdfService } from "@/services/pdf.service"
import { type Job, Queue, Worker } from "bullmq"
import { JobService } from "./job.service"

export class QueueService {
  public pdfQueue: Queue
  public pdfWorker: Worker | undefined

  constructor(
    private readonly pdfService: PdfService,
    private readonly jobService: JobService = new JobService(),
  ) {
    this.pdfQueue = new Queue("pdfQueue", { connection: redisConnection }) //TODO: Remove connection on Unit Test
  }

  public async startWorker() {
    this.pdfWorker = new Worker(
      "pdfQueue",
      async (job: Job<AddPdfJobInput>) => {
        try {
          if (!job.id) throw new Error("Job ID not found")

          const { type, userId, payload } = job.data
          let pdfBuffer: Uint8Array

          if (type === "html") {
            const { pdf } = await this.pdfService.generatePdfFromHtmlAsync({
              html: payload.html,
              userId,
              options: payload.options,
              queueJobId: job.id,
            })

            pdfBuffer = pdf
          } else if (type === "url") {
            const { pdf } = await this.pdfService.generatePdfFromUrlAsync({
              url: payload.url,
              userId,
              options: payload.options,
              queueJobId: job.id,
            })

            pdfBuffer = pdf
          } else {
            throw new Error("Invalid job type")
          }

          const { fileName } = await savePdf(pdfBuffer, userId)

          return { fileName }
        } catch (error) {
          console.error(`Job ${job.id} failed:`, error)
          throw error
        }
      },
      {
        connection: redisConnection,
        concurrency: 5,
        limiter: { max: 10, duration: 1000 },
        removeOnComplete: { age: 60 * 60 },
      },
    )

    this.pdfWorker.on("completed", async (job, result) => {
      try {
        if (!job.id) throw new Error("Job ID not found")
        await this.jobService.updateJobStatusByQueueJobId(job.id, "COMPLETED")
        console.log(`Job ${job.id} concluído. Arquivo gerado:`, result.fileName)
      } catch (error) {
        console.error("Erro ao atualizar status do job COMPLETED:", error)
      }
    })

    this.pdfWorker.on("failed", async (job, err) => {
      try {
        if (!job?.id) throw new Error("Job ID not found")
        await this.jobService.updateJobStatusByQueueJobId(job.id, "FAILED")
        console.error(`Job ${job.id} falhou:`, err)
      } catch (error) {
        console.error("Erro ao atualizar status do job FAILED:", error)
      }
    })
  }

  public async addPdfJob(jobData: AddPdfJobInput) {
    addPdfJobSchema.parse(jobData)

    return await this.pdfQueue.add("pdfJob", jobData, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
    })
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
