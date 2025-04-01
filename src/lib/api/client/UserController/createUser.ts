import client from '@/lib/client-fetch.ts'
import type { CreateUserMutationRequest, CreateUserMutationResponse } from '../../types/CreateUser.ts'
import type { RequestConfig, ResponseErrorConfig } from '@/lib/client-fetch.ts'

export function getCreateUserUrl() {
  return "http://localhost:3000/api/users/" as const
}

/**
 * @description Create a new user
 * {@link /api/users/}
 */
export async function createUser(data: CreateUserMutationRequest, config: Partial<RequestConfig<CreateUserMutationRequest>> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<CreateUserMutationResponse, ResponseErrorConfig<Error>, CreateUserMutationRequest>({
    method: 'POST',
    url: getCreateUserUrl().toString(),
    data,
    ...requestConfig,
  })
  return res
}