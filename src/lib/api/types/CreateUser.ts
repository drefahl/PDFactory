/**
 * @description Default Response
 */
export type CreateUser200 = any

export type CreateUserMutationRequest = {
  /**
   * @type string, email
   */
  email: string
  /**
   * @type string
   */
  name: string
  /**
   * @minLength 6
   * @type string
   */
  password: string
}

export type CreateUserMutationResponse = CreateUser200

export type CreateUserMutation = {
  Response: CreateUser200
  Request: CreateUserMutationRequest
  Errors: any
}