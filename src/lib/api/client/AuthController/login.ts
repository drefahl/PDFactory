import client from '@/lib/client-fetch.ts'
import type { LoginMutationRequest, LoginMutationResponse, Login401 } from '../../types/Login.ts'
import type { RequestConfig, ResponseErrorConfig } from '@/lib/client-fetch.ts'

export function getLoginUrl() {
  return "http://localhost:3000/api/auth/login" as const
}

/**
 * {@link /api/auth/login}
 */
export async function login(data: LoginMutationRequest, config: Partial<RequestConfig<LoginMutationRequest>> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<LoginMutationResponse, ResponseErrorConfig<Login401>, LoginMutationRequest>({
    method: 'POST',
    url: getLoginUrl().toString(),
    data,
    ...requestConfig,
  })
  return res
}