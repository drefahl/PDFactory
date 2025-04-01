import client from '@/lib/client-fetch.ts'
import type { GetUserProfileQueryResponse } from '../../types/GetUserProfile.ts'
import type { RequestConfig, ResponseErrorConfig } from '@/lib/client-fetch.ts'

export function getGetUserProfileUrl() {
  return "http://localhost:3000/api/users/me" as const
}

/**
 * @description Get user profile
 * {@link /api/users/me}
 */
export async function getUserProfile(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetUserProfileQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetUserProfileUrl().toString(),
    ...requestConfig,
  })
  return res
}