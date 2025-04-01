export type GetJobByIdPathParams = {
  /**
   * @type string
   */
  id: string
}

export const getJobById200StatusEnum = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const

export type GetJobById200StatusEnum = (typeof getJobById200StatusEnum)[keyof typeof getJobById200StatusEnum]

export const getJobById200ModeEnum = {
  SYNC: 'SYNC',
  ASYNC: 'ASYNC',
} as const

export type GetJobById200ModeEnum = (typeof getJobById200ModeEnum)[keyof typeof getJobById200ModeEnum]

/**
 * @description Default Response
 */
export type GetJobById200 = {
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
  status: GetJobById200StatusEnum
  /**
   * @type string
   */
  mode: GetJobById200ModeEnum
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
}

export type GetJobByIdQueryResponse = GetJobById200

export type GetJobByIdQuery = {
  Response: GetJobById200
  PathParams: GetJobByIdPathParams
  Errors: any
}