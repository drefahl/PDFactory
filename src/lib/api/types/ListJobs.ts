export const listJobs200StatusEnum = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const

export type ListJobs200StatusEnum = (typeof listJobs200StatusEnum)[keyof typeof listJobs200StatusEnum]

export const listJobs200ModeEnum = {
  SYNC: 'SYNC',
  ASYNC: 'ASYNC',
} as const

export type ListJobs200ModeEnum = (typeof listJobs200ModeEnum)[keyof typeof listJobs200ModeEnum]

/**
 * @description Default Response
 */
export type ListJobs200 = {
  /**
   * @type string
   */
  id: string
  /**
   * @type string
   */
  userId: string
  /**
   * @type string
   */
  queueJobId: string | null
  /**
   * @type string
   */
  htmlContent: string | null
  /**
   * @type string
   */
  url: string | null
  /**
   * @type string
   */
  pdfPath: string | null
  /**
   * @type string
   */
  status: ListJobs200StatusEnum
  /**
   * @type string
   */
  mode: ListJobs200ModeEnum
  /**
   * @type string, date-time
   */
  finishedAt: string | null
  /**
   * @type string, date-time
   */
  createdAt: string
  /**
   * @type string, date-time
   */
  updatedAt: string
}[]

export type ListJobsQueryResponse = ListJobs200

export type ListJobsQuery = {
  Response: ListJobs200
  Errors: any
}