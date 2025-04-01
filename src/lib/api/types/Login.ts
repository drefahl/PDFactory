/**
 * @description Default Response
 */
export type Login200 = {
  /**
   * @type string
   */
  token: string
}

/**
 * @description Default Response
 */
export type Login401 = {
  /**
   * @type string
   */
  message: string
}

export type LoginMutationRequest = {
  /**
   * @type string, email
   */
  email: string
  /**
   * @type string
   */
  password: string
}

export type LoginMutationResponse = Login200

export type LoginMutation = {
  Response: Login200
  Request: LoginMutationRequest
  Errors: Login401
}