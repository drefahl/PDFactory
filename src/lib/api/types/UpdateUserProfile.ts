/**
 * @description Default Response
 */
export type UpdateUserProfile200 = {
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

export type UpdateUserProfileMutationRequest = {
  /**
   * @type string | undefined
   */
  name?: string
  /**
   * @type string | undefined, email
   */
  email?: string
}

export type UpdateUserProfileMutationResponse = UpdateUserProfile200

export type UpdateUserProfileMutation = {
  Response: UpdateUserProfile200
  Request: UpdateUserProfileMutationRequest
  Errors: any
}