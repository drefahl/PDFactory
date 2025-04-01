import { InvalidCredentialsError } from "@/errors/InvalidCredentialsError"
import { hashPassword } from "@/lib/utils/crypto.utils"
import { createToken } from "@/lib/utils/jwt.utils"
import { JobRepository } from "@/repositories/job.repository"
import { UserRepository } from "@/repositories/user.repository"
import { AuthService } from "@/services/auth.service"
import { JobService } from "@/services/job.service"
import { PdfService } from "@/services/pdf.service"
import { QueueService } from "@/services/queue.service"
import { UserService } from "@/services/user.service"
import { JobMode, JobStatus } from "@prisma/client"
import { vi } from "vitest"

export const mockConstants = {
  user: {
    id: "cm7azrqzy0000esipsla35pkn",
    email: "johnDoe@example.com",
    name: "John Doe",
    password: "password",
  },
  job: {
    id: "cm7azrr7x0002esj8uhhsegu5",
    queueJobId: "cm7azrr7x0002esj8uhhsegu5",
  },
  pdf: {
    htmlContent: "<html><body>Hello</body></html>",
    url: "https://google.com",
  },
} as const

export function createJobRepositoryMock(): JobRepository {
  const repo = new JobRepository()

  vi.spyOn(repo, "createJob").mockImplementation(async (data) => ({
    id: mockConstants.job.id,
    userId: mockConstants.user.id,
    queueJobId: data?.queueJobId ?? null,
    status: JobStatus.PENDING,
    mode: JobMode.SYNC,
    htmlContent: data?.htmlContent ?? null,
    url: data?.url ?? mockConstants.pdf.url,
    pdfPath: data?.pdfPath ?? null,
    finishedAt: data?.finishedAt ? new Date(data.finishedAt) : null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }))

  vi.spyOn(repo, "getJobById").mockImplementation(async (id: string) => {
    if (id !== mockConstants.job.id) return null
    return {
      id: mockConstants.job.id,
      userId: mockConstants.user.id,
      queueJobId: mockConstants.job.queueJobId,
      htmlContent: mockConstants.pdf.htmlContent,
      url: null,
      pdfPath: null,
      status: JobStatus.PENDING,
      mode: JobMode.ASYNC,
      finishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

  vi.spyOn(repo, "getJobByQueueJobId").mockImplementation(async (queueJobId: string) => {
    if (queueJobId !== mockConstants.job.queueJobId) return null
    return {
      id: mockConstants.job.id,
      userId: mockConstants.user.id,
      queueJobId: mockConstants.job.queueJobId,
      htmlContent: mockConstants.pdf.htmlContent,
      url: null,
      pdfPath: null,
      status: JobStatus.PENDING,
      mode: JobMode.ASYNC,
      finishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

  vi.spyOn(repo, "listJobsByUserId").mockImplementation(async () => [
    {
      id: mockConstants.job.id,
      userId: mockConstants.user.id,
      queueJobId: mockConstants.job.queueJobId,
      htmlContent: mockConstants.pdf.htmlContent,
      url: null,
      pdfPath: null,
      status: JobStatus.PENDING,
      mode: JobMode.ASYNC,
      finishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])

  vi.spyOn(repo, "updateJob").mockImplementation(async (id: string, data) => {
    if (id !== mockConstants.job.id) throw new Error("Job not found")

    return {
      id: mockConstants.job.id,
      userId: mockConstants.user.id,
      queueJobId: mockConstants.job.queueJobId,
      htmlContent: typeof data.htmlContent === "string" ? data.htmlContent : mockConstants.pdf.htmlContent,
      url: null,
      pdfPath: null,
      status: (data?.status as JobStatus) ?? JobStatus.PENDING,
      mode: JobMode.ASYNC,
      finishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

  vi.spyOn(repo, "deleteJob").mockImplementation(async (queueJobId: string) => {
    if (queueJobId !== mockConstants.job.id) throw new Error("Job not found")
    return {
      id: mockConstants.job.id,
      userId: mockConstants.user.id,
      queueJobId: mockConstants.job.queueJobId,
      htmlContent: mockConstants.pdf.htmlContent,
      url: null,
      pdfPath: null,
      status: JobStatus.PENDING,
      mode: JobMode.ASYNC,
      finishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

  return repo
}

export function createUserRepositoryMock(): UserRepository {
  const service = new UserRepository()

  vi.spyOn(service, "createUser").mockImplementation(async (data) => {
    return {
      ...data,
      id: mockConstants.user.id,
      email: data?.email ?? mockConstants.user.email,
      name: mockConstants.user.name,
      password: await hashPassword(mockConstants.user.password),
      createdAt: new Date(),
      updatedAt: new Date(),
      jobs: [],
    }
  })

  vi.spyOn(service, "getUserById").mockImplementation(async (id) => {
    if (id !== mockConstants.user.id) return null

    return {
      id: mockConstants.user.id,
      email: mockConstants.user.email,
      name: mockConstants.user.name,
      password: await hashPassword(mockConstants.user.password),
      createdAt: new Date(),
      updatedAt: new Date(),
      jobs: [],
    }
  })

  vi.spyOn(service, "getUserByEmail").mockImplementation(async (email) => {
    if (email !== mockConstants.user.email) return null

    return {
      id: mockConstants.user.id,
      email: mockConstants.user.email,
      name: mockConstants.user.name,
      password: await hashPassword(mockConstants.user.password),
      createdAt: new Date(),
      updatedAt: new Date(),
      jobs: [],
    }
  })

  vi.spyOn(service, "updateUser").mockImplementation(async (id, data) => {
    if (id !== mockConstants.user.id) throw new Error("User not found")

    return {
      ...data,
      id: mockConstants.user.id,
      email: mockConstants.user.email,
      name: data.name || mockConstants.user.name,
      password: data?.password || (await hashPassword(mockConstants.user.password)),
      createdAt: new Date(),
      updatedAt: new Date(),
      jobs: [],
    }
  })

  return service
}

export function createUserServiceMock(userRepository: UserRepository = createUserRepositoryMock()): UserService {
  const service = new UserService(userRepository)

  vi.spyOn(service, "getUserById").mockImplementation(async (id: string) => {
    if (id !== mockConstants.user.id) return null
    return {
      id: mockConstants.user.id,
      email: mockConstants.user.email,
      name: mockConstants.user.name,
      password: mockConstants.user.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

  return service
}

export function createJobServiceMock(
  jobRepository: JobRepository = createJobRepositoryMock(),
  userService: UserService = createUserServiceMock(),
): JobService {
  const service = new JobService(jobRepository, userService)

  vi.spyOn(service, "createJob").mockImplementation(async (data) => ({
    id: mockConstants.job.id,
    userId: mockConstants.user.id,
    queueJobId: data?.queueJobId ?? null,
    status: JobStatus.PENDING,
    mode: JobMode.SYNC,
    htmlContent: data?.htmlContent ?? null,
    url: data?.url ?? mockConstants.pdf.url,
    pdfPath: data?.pdfPath ?? null,
    finishedAt: data?.finishedAt ? new Date(data.finishedAt) : null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }))

  return service
}

export async function createPdfServiceMock(jobService: JobService = createJobServiceMock()): Promise<PdfService> {
  const service = await PdfService.create(jobService)
  return service
}

export function createQueueServiceMock(pdfService: PdfService): QueueService {
  const fakeRedisConnection = {}
  const service = new QueueService(pdfService, undefined, fakeRedisConnection)

  service.pdfWorker = {
    on: vi.fn(),
    emit: vi.fn((event: string, job: any, result: any, queueJobId: string) => {
      if (event === "completed") {
        service.jobService.updateJobStatusByQueueJobId(queueJobId, JobStatus.COMPLETED)
      }
      if (event === "failed") {
        service.jobService.updateJobStatusByQueueJobId(queueJobId, JobStatus.FAILED)
      }
    }),
    close: vi.fn(async () => Promise.resolve()),
  } as any

  vi.spyOn(service.pdfQueue, "add").mockResolvedValue({ id: "fakeJobId" } as any)

  return service
}

export function createAuthServiceMock(userService: UserService = createUserServiceMock()): AuthService {
  const service = new AuthService(userService)

  vi.spyOn(service, "login").mockImplementation(async (email: string, password: string) => {
    if (email !== mockConstants.user.email || password !== mockConstants.user.password) {
      throw new InvalidCredentialsError("Invalid credentials")
    }
    return createToken({ id: mockConstants.user.id, email: mockConstants.user.email })
  })

  return service
}
