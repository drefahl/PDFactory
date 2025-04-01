/**
 * @description Default Response
 */
export type GetUserProfile200 = {
  /**
   * @type string
   */
  id: string
  /**
   * @type string
   */
  email: string
  /**
   * @type string
   */
  name: string
  /**
   * @type string, date-time
   */
  createdAt: string
  /**
   * @type string, date-time
   */
  updatedAt: string
}

export type GetUserProfileQueryResponse = GetUserProfile200

export type GetUserProfileQuery = {
  Response: GetUserProfile200
  Errors: any
}