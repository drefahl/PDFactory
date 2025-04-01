export type DeleteJobPathParams = {
  /**
   * @type string
   */
  id: string
}

export const deleteJob200StatusEnum = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const

export type DeleteJob200StatusEnum = (typeof deleteJob200StatusEnum)[keyof typeof deleteJob200StatusEnum]

export const deleteJob200ModeEnum = {
  SYNC: 'SYNC',
  ASYNC: 'ASYNC',
} as const

export type DeleteJob200ModeEnum = (typeof deleteJob200ModeEnum)[keyof typeof deleteJob200ModeEnum]

/**
 * @description Default Response
 */
export type DeleteJob200 = {
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
  status: DeleteJob200StatusEnum
  /**
   * @type string
   */
  mode: DeleteJob200ModeEnum
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

export type DeleteJobMutationResponse = DeleteJob200

export type DeleteJobMutation = {
  Response: DeleteJob200
  PathParams: DeleteJobPathParams
  Errors: any
}